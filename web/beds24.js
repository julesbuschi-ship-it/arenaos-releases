/* Hôtel Arena Le Refuge — moteur de réservation Beds24
   Chargé par Beds24 (Custom head top) via jsDelivr :
   https://cdn.jsdelivr.net/gh/julesbuschi-ship-it/arenaos-releases@<commit>/web/beds24.js
   Après chaque modification : commit, puis remplacer <commit> dans Beds24 (jsDelivr met l'ancienne URL en cache).
   Le CSS est dans WordPress (Footer 88, post-88.css) — voir le board A→Z. */
(function () {
  'use strict';
  var d = document, w = window;

  function ready(fn) {
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', fn); else fn();
  }

  function lang() { return /colorbody-fr/.test(d.body.className) ? 'fr' : 'en'; }

  /* 1. Champ Titre → liste (Ne pas répondre / M. / Mme) */
  function titleSelect() {
    var i = d.getElementById('guesttitle');
    if (!i || i.tagName === 'SELECT') return;
    var fr = lang() === 'fr', s = d.createElement('select'), v = i.value;
    s.id = s.name = 'guesttitle';
    s.className = 'form-control';
    (fr ? ['|Ne pas répondre', 'M.', 'Mme'] : ['|Prefer not to say', 'Mr', 'Mrs', 'Ms']).forEach(function (t) {
      var p = t.split('|'), o = new Option(p[1] || p[0], p[0]);
      o.selected = v == p[0];
      s.add(o);
    });
    i.replaceWith(s);
  }

  /* 2. Options : plafonner la quantité (petits-déjeuners : adultes × nuits / enfants × nuits ; animaux : 2), masquer la ligne enfant sans enfant */
  function capBreakfasts() {
    var n = +(d.querySelector('[name=numnight]') || {}).value || 1;
    function sum(p) {
      var t = 0;
      d.querySelectorAll('input[id^=' + p + '1-]').forEach(function (e) { t += +e.value || 0; });
      return t * n;
    }
    var A = sum('na'), C = sum('nc');
    d.querySelectorAll('select[id^=optextra]').forEach(function (e) {
      var r = e.closest('.row'), x = r.textContent,
          m = /animal|pet\b/i.test(x) ? 2 : /enfant|child/i.test(x) ? C : A;
      if (!m) { r.style.display = 'none'; return; }
      [].slice.call(e.options).forEach(function (o) { if (+o.value > m) o.remove(); });
    });
  }

  /* 2b. Ligne CGV : retirer l'espace insécable qui décale la première ligne du texte */
  function cgvText() {
    var cb = d.querySelector('.b24-guestdetails .questionrow input[type=checkbox]');
    if (!cb) return;
    var row = cb.closest('.questionrow');
    [].forEach.call(row.children, function (c) {
      if (c.contains(cb)) return;
      var done = false;
      [].forEach.call(c.childNodes, function (n) {
        if (done || n.nodeType !== 3 || !/\S/.test(n.textContent.replace(/\u00a0/g, ' '))) return;
        n.textContent = n.textContent.replace(/^[\s\u00a0]+/, '');
        done = true;
      });
    });
  }

  /* 2c. Mention RGPD sous la case CGV du formulaire Coordonnées (lien vers /donnees-personnelles/) */
  function privacyNote() {
    var cb = d.querySelector('.b24-guestdetails .questionrow input[type=checkbox]');
    if (!cb || d.querySelector('.arena-privacy')) return;
    var row = cb.closest('.questionrow'), p = d.createElement('div'), fr = lang() === 'fr';
    p.className = 'questionrow arena-privacy';
    p.innerHTML = fr
      ? 'Vos donn\u00e9es sont trait\u00e9es par la SARL Le Refuge pour g\u00e9rer votre r\u00e9servation et votre s\u00e9jour. En savoir plus : <a href="https://www.hotel-arenalerefuge.com/donnees-personnelles/" target="_blank" rel="noopener">Politique de confidentialit\u00e9</a>.'
      : 'Your data is processed by SARL Le Refuge to manage your booking and stay. Learn more: <a href="https://www.hotel-arenalerefuge.com/donnees-personnelles/" target="_blank" rel="noopener">Privacy Policy</a>.';
    row.parentNode.insertBefore(p, row.nextSibling);
  }

  /* 3. Formulaire client : message d'erreur clair et champs en rouge au lieu de la validation silencieuse */
  function formErrors() {
    var f = d.forms.formbook, b = f ? f.querySelector('[name=bookbook]') : null;
    if (!b) return;
    var en = lang() === 'en';
    f.addEventListener('input', function (e) {
      var r = e.target.closest('.arena-ko');
      if (r) r.classList.remove('arena-ko');
    });
    b.addEventListener('click', function (e) {
      var k = 0;
      f.querySelectorAll('.requiredfield').forEach(function (s) {
        var r = s.closest('.row'), i = r.querySelector('input:not([type=hidden]),select,textarea');
        if (!i) return;
        var v = i.type == 'checkbox' ? i.checked : i.value.trim();
        if (v == '0') v = '';
        if (i.name == 'guestemail' && !/^\S+@\S+\.\S+$/.test(v)) v = '';
        r.classList.toggle('arena-ko', !v);
        if (!v) k++;
      });
      var m = f.querySelector('.arena-msg') || b.parentNode.insertBefore(d.createElement('p'), b);
      m.className = 'arena-msg';
      m.textContent = k ? (en ? 'Please complete the fields marked *' : 'Merci de compléter les champs marqués *') : '';
      if (k) {
        e.preventDefault();
        var w = d.getElementById('pleasewaitimg');
        if (w) w.classList.add('hidden');
        f.querySelector('.arena-ko').scrollIntoView({ block: 'center' });
      }
    });
  }

  /* 4. Écran Garantie : récapitulatif lisible à la place du tableau Beds24 */
  function guaranteeSummary() {
    var t = d.querySelector('.confirmationtable');
    if (!t || d.querySelector('.arena-sum')) return;
    var en = lang() === 'en', K = [], M = {}, T = 0;
    function n(s) {
      s = (s || '').replace(/[^\d.,]/g, '');
      var i = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'));
      if (i >= 0 && s.length - i - 1 <= 2) s = s.slice(0, i).replace(/[.,]/g, '') + '.' + s.slice(i + 1);
      else s = s.replace(/[.,]/g, '');
      return parseFloat(s) || 0;
    }
    function g(v) { return v.toLocaleString(en ? 'en-GB' : 'fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
    [].slice.call(t.rows, 1).forEach(function (r) {
      var c = [].map.call(r.cells, function (x) { return x.textContent.replace(/\s+/g, ' ').trim(); }), m, k;
      if (!c[0]) return;
      if (/^(Grand )?Total/i.test(c[0])) { T = n(c[c.length - 1]); return; }
      m = c[0].match(/^(.+?) \S+, /);
      k = m ? m[1] : c[0].replace(/\s+\d.*$/, '');
      if (!M[k]) { M[k] = { q: 0, v: 0, r: !!m }; K.push(k); }
      M[k].q += n(c[1]);
      M[k].v += n(c[3]);
    });
    var h = '<p class="arena-sum-e">' + (en ? 'Your stay' : 'Montant du séjour') + '</p>';
    K.sort(function (a, z) { return M[z].r - M[a].r; }).forEach(function (k) {
      var o = M[k];
      h += '<div class="arena-sum-r' + (o.r ? '' : ' arena-sum-x') + '"><span>' + (o.r ? (o.q > 1 ? o.q + ' × ' : '') + k : k + ' × ' + o.q) + '</span><b>' + g(o.v) + '</b></div>';
    });
    var x = d.createElement('div');
    x.className = 'arena-sum';
    x.innerHTML = h + '<div class="arena-sum-r arena-sum-t"><span>Total</span><b>' + g(T) + '</b></div>';
    t.parentNode.insertBefore(x, t);
    t.style.display = 'none';
  }

  /* 5. Barre d'etapes : revenir aux ecrans precedents */
  function stepLinks() {
    var bar = d.getElementById('arena-top');
    if (!bar) return;
    var m = d.body.className.match(/arena-s(\d)/), cur = m ? +m[1] : 0, fr = lang() === 'fr';
    if (!cur) return;
    [].forEach.call(bar.querySelectorAll('b'), function (b, i) {
      var n = i + 1;
      if (n >= cur) return;
      b.classList.add('arena-step-link');
      b.title = fr ? 'Revenir \u00e0 cette \u00e9tape' : 'Go back to this step';
      b.addEventListener('click', function () {
        if (cur === 2) { w.scrollTo({ top: 0, behavior: 'smooth' }); var ci = d.getElementById('checkin'); if (ci) ci.focus(); return; }
        if (cur === 3) { var back = d.querySelector('.book_bookingbackright a'); if (back) back.click(); else w.history.back(); return; }
        if (cur === 4) {
          var f = d.querySelector('.ppcancelbutton form');
          var ok = w.confirm(fr ? 'Revenir en arri\u00e8re annule la r\u00e9servation en cours (aucune carte n\u2019est enregistr\u00e9e). Continuer ?' : 'Going back cancels the current booking (no card is stored). Continue?');
          if (ok) { if (f) f.submit(); else w.history.back(); }
        }
      });
    });
  }

  ready(function () {
    try { titleSelect(); } catch (e) {}
    try { capBreakfasts(); } catch (e) {}
    try { cgvText(); } catch (e) {}
    try { privacyNote(); } catch (e) {}
    try { formErrors(); } catch (e) {}
    try { guaranteeSummary(); } catch (e) {}
    try { stepLinks(); } catch (e) {}
  });
})();
