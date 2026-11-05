/* Hôtel Arena Le Refuge — moteur de réservation Beds24
   Chargé par Beds24 (Custom head top) via jsDelivr :
   https://cdn.jsdelivr.net/gh/julesbuschi-ship-it/arenaos-releases@<commit>/web/beds24.js
   Après chaque modification : commit, puis remplacer <commit> dans Beds24 (jsDelivr met l'ancienne URL en cache).
   Le CSS est dans WordPress (Footer 88, post-88.css) — voir le board A→Z. */
(function () {
  'use strict';
  var d = document;

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

  /* 2. Petits-déjeuners : plafonner la quantité à adultes × nuits (enfants × nuits), masquer la ligne enfant sans enfant */
  function capBreakfasts() {
    var n = +(d.querySelector('[name=numnight]') || {}).value || 1;
    function sum(p) {
      var t = 0;
      d.querySelectorAll('input[id^=' + p + '1-]').forEach(function (e) { t += +e.value || 0; });
      return t * n;
    }
    var A = sum('na'), C = sum('nc');
    d.querySelectorAll('select[id^=optextra]').forEach(function (e) {
      var r = e.closest('.row'), m = /enfant|child/i.test(r.textContent) ? C : A;
      if (!m) { r.style.display = 'none'; return; }
      [].slice.call(e.options).forEach(function (o) { if (+o.value > m) o.remove(); });
    });
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
    function n(s) { return parseFloat(s.replace(/[^\d,]/g, '').replace(',', '.')) || 0; }
    function g(v) { return v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
    [].slice.call(t.rows, 1).forEach(function (r) {
      var c = [].map.call(r.cells, function (x) { return x.textContent.replace(/\s+/g, ' ').trim(); }), m, k;
      if (!c[0]) return;
      if (/^Total/.test(c[0])) { T = n(c[3]); return; }
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

  ready(function () {
    try { titleSelect(); } catch (e) {}
    try { capBreakfasts(); } catch (e) {}
    try { formErrors(); } catch (e) {}
    try { guaranteeSummary(); } catch (e) {}
  });
})();
