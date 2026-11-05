# -*- coding: utf-8 -*-
"""Génère le bloc <div class="arena-mail"> de l'e-mail de confirmation Beds24 (FR + EN).
Rendu « one fits all » : tables, polices système (Georgia + Helvetica/Arial), couleurs et espacements
en ligne ; Tenor Sans / Inter chargées en plus là où les polices web passent (Apple Mail, iOS)."""
import json, sys

CDN = "https://cdn.jsdelivr.net/gh/julesbuschi-ship-it/arenaos-releases@4a25c38/web/mail/"
HDR = "https://cdn.jsdelivr.net/gh/julesbuschi-ship-it/arenaos-releases@05b0d04/web/mail/entete-marbre-logo.jpg"
FOOT = CDN + "pied-marbre.jpg"
SITE = "https://www.hotel-arenalerefuge.com/"
CGV = SITE + "conditions-generales-de-vente-cgv/"
VISITS = SITE + "que-faire-corte-restonica/"
MAPS = "https://maps.google.com/?cid=3308981832077220730"

SERIF = "'Tenor Sans',Georgia,'Times New Roman',serif"
SANS = "Inter,'Helvetica Neue',Helvetica,Arial,sans-serif"
C_INK = "#14201C"; C_TEXT = "#2F4A46"; C_MUTED = "#6F8A86"; C_GREEN = "#189979"; C_GOLD = "#C9B37A"
C_LINE = "#E3E9DF"; C_CARD = "#F4F6F0"; C_BG = "#EEF1EA"

T = {
 "FR": dict(
  ref="Réservation n° [BOOKID]",
  hello="[GUESTTITLE] [GUESTNAME],",
  intro="Nous vous remercions d'avoir choisi l'Hôtel Arena Le Refuge et avons le plaisir de vous confirmer votre réservation.",
  dates="Nous vous attendons le <strong>[IF=:[FIRSTNIGHT:{%d}]:01:[FIRSTNIGHT:{%A}] 1er [FIRSTNIGHT:{%B %Y}]|[FIRSTNIGHT:{%A %e %B %Y}]]</strong>, à partir de 14h30. Les chambres sont à libérer le jour du départ, <strong>[IF=:[LEAVINGDAY:{%d}]:01:[LEAVINGDAY:{%A}] 1er [LEAVINGDAY:{%B %Y}]|[LEAVINGDAY:{%A %e %B %Y}]]</strong>, avant 11h00.",
  stay="Votre séjour", k_nights="Séjour", v_nights="[NUMNIGHT] nuit[IF&gt;:[NUMNIGHT]:1:s|]",
  k_rooms="Chambre[IF&gt;:[NUMROOMS]:1:s|]", v_rooms="[IF=:[NUMROOMS]:1:[ROOMNAME1]|[ROOMNAMES]]",
  k_guests="Voyageurs", v_guests="[NUMADULT] adulte[IF&gt;:[NUMADULT]:1:s|][IF=:[NUMCHILD]:1: et 1 enfant|][IF&gt;:[NUMCHILD]:1: et [NUMCHILD] enfants|]",
  k_arrival="Arrivée prévue", v_arrival="[GUESTARRIVALTIME]",
  amount="Montant du séjour", invoice="[INVOICE:GRP_QTY_TOT_GRT_CUA€]",
  pay_l="Paiement", pay="Le règlement s'effectue sur place. Aucun montant n'a été prélevé à ce jour : les coordonnées de votre carte bancaire ont été enregistrées à titre de garantie.",
  cancel_l="Annulation", cancel="Vous pouvez annuler ou modifier votre réservation sans frais jusqu'à sept jours avant la date d'arrivée, en répondant simplement à ce message ou en nous appelant. Au-delà de ce délai, l'intégralité du séjour reste due. Les conditions générales de vente sont consultables <a href=\"%s\" style=\"color:%s;\">ici</a>." % (CGV, C_GREEN),
  prep="Pour préparer votre venue",
  addr_name="Hôtel Arena Le Refuge", addr="1425 route de la Restonica, 20250 Corte", route="Itinéraire",
  tel="04 95 46 09 13", mail="contact@hotel-arenalerefuge.com",
  items=[("Parking","L'hôtel dispose d'un parking privé gratuit, directement devant l'établissement."),
         ("Petit-déjeuner","Servi de 7h30 à 10h30 (15 € par adulte, 10 € par enfant). Les petits-déjeuners éventuellement indiqués dans votre réservation sont donnés à titre indicatif : nous les confirmons avec vous à votre arrivée."),
         ("Arrivée tardive","Si vous pensez arriver après 21h00, merci de nous en avertir afin que nous puissions organiser votre accueil."),
         ("Animaux","Vos compagnons à quatre pattes sont les bienvenus, moyennant un supplément de 10 € par animal et par nuit, à indiquer lors de la réservation ou à nous signaler avant votre arrivée.")],
  around_l="Autour de l'hôtel",
  around="Entre les piscines naturelles de la Restonica, les lacs de Melo et de Capitello, la citadelle de Corte et les villages du Niolu, la vallée se prête aussi bien à la randonnée qu'à la flânerie. Nos idées de balades et de visites, en ville comme dans la vallée, sont sur <a href=\"%s\" style=\"color:%s;\">cette page</a>." % (VISITS, C_GREEN),
  resto="Pour les restaurants, nous vous conseillons sur place et réservons pour vous avec plaisir.",
  close1="Nous restons à votre disposition pour toute demande particulière et vous souhaitons, d'ici là, une excellente journée.",
  close2="Au plaisir de vous accueillir dans la vallée de la Restonica,", sign="L'équipe de l'Hôtel Arena Le Refuge",
  foot_cgv="Conditions générales de vente",
 ),
 "EN": dict(
  ref="Booking no. [BOOKID]",
  hello="[GUESTTITLE] [GUESTNAME],",
  intro="Thank you for choosing Hôtel Arena Le Refuge. We are pleased to confirm your booking.",
  dates="We look forward to welcoming you on <strong>[FIRSTNIGHT:{%A %e %B %Y}]</strong> from 2:30 pm. Rooms are to be vacated on the day of departure, <strong>[LEAVINGDAY:{%A %e %B %Y}]</strong>, before 11:00 am.",
  stay="Your stay", k_nights="Stay", v_nights="[NUMNIGHT] night[IF&gt;:[NUMNIGHT]:1:s|]",
  k_rooms="Room[IF&gt;:[NUMROOMS]:1:s|]", v_rooms="[IF=:[NUMROOMS]:1:[ROOMNAME1]|[ROOMNAMES]]",
  k_guests="Guests", v_guests="[NUMADULT] adult[IF&gt;:[NUMADULT]:1:s|][IF=:[NUMCHILD]:1: and 1 child|][IF&gt;:[NUMCHILD]:1: and [NUMCHILD] children|]",
  k_arrival="Expected arrival", v_arrival="[GUESTARRIVALTIME]",
  amount="Your stay in detail", invoice="[INVOICE:GRP_QTY_TOT_GRT_CUA€_LANEN]",
  pay_l="Payment", pay="Payment is made at the hotel. Nothing has been charged to date: your card details have been stored as a guarantee only.",
  cancel_l="Cancellation", cancel="You may cancel or change your booking free of charge up to seven days before the arrival date, simply by replying to this message or calling us. After that, the full stay remains due. Our terms and conditions are available <a href=\"%s\" style=\"color:%s;\">here</a>." % (CGV, C_GREEN),
  prep="Preparing your visit",
  addr_name="Hôtel Arena Le Refuge", addr="1425 route de la Restonica, 20250 Corte", route="Directions",
  tel="+33 4 95 46 09 13", mail="contact@hotel-arenalerefuge.com",
  items=[("Parking","The hotel has a free private car park right in front of the building."),
         ("Breakfast","Served from 7:30 to 10:30 am (€15 per adult, €10 per child). Any breakfasts indicated in your booking are for guidance only: we will confirm them with you on arrival."),
         ("Late arrival","If you expect to arrive after 9:00 pm, please let us know so that we can arrange your welcome."),
         ("Pets","Pets are welcome for a supplement of €10 per pet per night, to be indicated when booking or notified to us before your arrival.")],
  around_l="Around the hotel",
  around="From the natural pools of the Restonica and the Melo and Capitello lakes to the citadel of Corte and the villages of the Niolu, the valley is made for hiking as much as for wandering. Our ideas for walks and visits, in town and in the valley, are on <a href=\"%s\" style=\"color:%s;\">this page</a>." % (VISITS, C_GREEN),
  resto="For restaurants, we are happy to advise you on site and book for you.",
  close1="We remain at your disposal for any special request and wish you, until then, a very pleasant day.",
  close2="We look forward to welcoming you to the Restonica valley,", sign="The team at Hôtel Arena Le Refuge",
  foot_cgv="Terms and conditions",
 ),
}

def label(txt):
    return ('<p style="margin:0 0 6px;font-family:%s;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:%s;">%s</p>' % (SANS, C_GREEN, txt))

def para(txt, mb=16, size=15):
    return '<p style="margin:0 0 %dpx;font-family:%s;font-size:%dpx;line-height:1.75;color:%s;">%s</p>' % (mb, SANS, size, C_TEXT, txt)

def h2(txt):
    return '<p style="margin:0 0 14px;font-family:%s;font-size:21px;line-height:1.3;letter-spacing:.02em;color:%s;">%s</p>' % (SERIF, C_INK, txt)

def row(k, v, last=False):
    border = "" if last else "border-bottom:1px solid %s;" % C_LINE
    return ('<tr><td style="padding:11px 0;%sfont-family:%s;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:%s;width:38%%;vertical-align:top;">%s</td>'
            '<td style="padding:11px 0;%sfont-family:%s;font-size:15px;line-height:1.5;color:%s;vertical-align:top;">%s</td></tr>') % (border, SANS, C_MUTED, k, border, SANS, C_INK, v)

def build(L):
    t = T[L]
    style = ("<style class=\"arena-mq\">"
             "@import url('https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Inter:wght@400;500;600&display=swap');"
             ".arena-mail *{-webkit-font-smoothing:antialiased}"
             ".arena-inv table{width:100%!important;border-collapse:collapse}"
             ".arena-inv tr:first-child td,.arena-inv tr:last-child td{display:none}"
             ".arena-inv td{font-family:" + SANS + "!important;font-size:14px!important;line-height:1.5!important;padding:10px 0!important;vertical-align:top;color:" + C_TEXT + "!important;border-top:1px solid " + C_LINE + "}"
             ".arena-inv tr:nth-child(2) td{border-top:0}"
             ".arena-inv td:nth-child(2){text-align:center;white-space:nowrap;padding:10px 10px!important;color:" + C_MUTED + "!important}"
             ".arena-inv td:last-child{white-space:nowrap;text-align:right;padding-left:14px!important;color:" + C_INK + "!important}"
             ".arena-inv tr:nth-last-child(2) td{border-top:1px solid " + C_GOLD + ";font-weight:600;padding-top:14px!important;font-size:16px!important}"
             ".arena-inv a,[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}"
             "@media only screen and (max-width:620px){.arena-pad{padding-left:22px!important;padding-right:22px!important}.arena-mail .arena-hello{font-size:24px!important}}"
             "</style>")
    items = "".join('<p style="margin:0 0 14px;font-family:%s;font-size:15px;line-height:1.75;color:%s;"><span style="display:block;font-family:%s;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:%s;margin:0 0 3px;">%s</span>%s</p>' % (SANS, C_TEXT, SANS, C_GREEN, k, v) for k, v in t["items"])
    html = (
     # Beds24 envoie <html><body> sans <head> : sans viewport, iPhone Mail met en page sur 980 px puis réduit tout.
     # WebKit honore la balise viewport même dans le body ; sur l'écran de confirmation Beds24 elle est identique à celle de la page.
     '<div class="arena-mail"><meta name="viewport" content="width=device-width, initial-scale=1">' + style +
     '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C_BG + ';"><tbody><tr><td align="center" style="padding:28px 12px;">'
     '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border-radius:18px;overflow:hidden;"><tbody>'
     # en-tête
     '<tr><td style="padding:0;background:' + C_INK + ';line-height:0;" bgcolor="' + C_INK + '"><img src="' + HDR + '" width="600" alt="Hôtel Arena Le Refuge" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>'
     '<tr><td align="center" bgcolor="' + C_INK + '" style="background:' + C_INK + ';padding:0 24px 26px;"><p style="margin:0;font-family:' + SERIF + ';font-size:11px;letter-spacing:3px;text-transform:uppercase;color:' + C_GOLD + ';">' + t["ref"] + '</p></td></tr>'
     # corps
     '<tr><td class="arena-pad" style="padding:40px 44px 8px;">'
     '<p class="arena-hello" style="margin:0 0 18px;font-family:' + SERIF + ';font-size:27px;line-height:1.25;letter-spacing:.02em;color:' + C_INK + ';">' + t["hello"] + '</p>'
     + para(t["intro"]) + para(t["dates"], 26) +
     '</td></tr>'
     # carte séjour
     '<tr><td class="arena-pad" style="padding:0 44px 22px;">'
     '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C_CARD + ';border-radius:14px;"><tbody>'
     '<tr><td style="padding:22px 24px 8px;">' + label(t["stay"]) +
     '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tbody>' + row(t["k_nights"], t["v_nights"]) + row(t["k_rooms"], t["v_rooms"]) + row(t["k_guests"], t["v_guests"]) +
     row(t["k_arrival"], t["v_arrival"], True) +
     '</tbody></table></td></tr>'
     '<tr><td style="padding:14px 24px 0;border-top:1px solid ' + C_LINE + ';">' + label(t["amount"]) + '</td></tr>'
     '<tr><td class="arena-inv" style="padding:0 24px 18px;">' + t["invoice"] + '</td></tr>'
     '</tbody></table></td></tr>'
     # paiement / annulation
     '<tr><td class="arena-pad" style="padding:6px 44px 0;">' + label(t["pay_l"]) + para(t["pay"], 20) + label(t["cancel_l"]) + para(t["cancel"], 30) + '</td></tr>'
     # préparer
     '<tr><td class="arena-pad" style="padding:0 44px 0;border-top:1px solid ' + C_LINE + ';"><div style="height:30px;line-height:30px;font-size:0;">&nbsp;</div>' + h2(t["prep"]) + '</td></tr>'
     '<tr><td class="arena-pad" style="padding:4px 44px 22px;">'
     '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C_CARD + ';border-radius:14px;"><tbody><tr><td style="padding:18px 22px;font-family:' + SANS + ';font-size:14px;line-height:1.7;color:' + C_TEXT + ';">'
     '<span style="font-family:' + SERIF + ';font-size:17px;color:' + C_INK + ';">' + t["addr_name"] + '</span><br>' + t["addr"] + ' &nbsp;·&nbsp; <a href="' + MAPS + '" style="color:' + C_GREEN + ';">' + t["route"] + '</a><br>'
     '<a href="tel:+33495460913" style="color:' + C_INK + ';text-decoration:none;">' + t["tel"] + '</a> &nbsp;·&nbsp; <a href="mailto:contact@hotel-arenalerefuge.com" style="color:' + C_GREEN + ';">' + t["mail"] + '</a>'
     '</td></tr></tbody></table></td></tr>'
     '<tr><td class="arena-pad" style="padding:0 44px 6px;">' + items +
     '<p style="margin:14px 0 14px;font-family:' + SANS + ';font-size:15px;line-height:1.75;color:' + C_TEXT + ';"><span style="display:block;font-family:' + SANS + ';font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:' + C_GREEN + ';margin:0 0 3px;">' + t["around_l"] + '</span>' + t["around"] + '</p>'
     + para(t["resto"], 28) + '</td></tr>'
     # clôture
     '<tr><td class="arena-pad" style="padding:0 44px 38px;border-top:1px solid ' + C_LINE + ';"><div style="height:26px;line-height:26px;font-size:0;">&nbsp;</div>'
     + para(t["close1"], 14) +
     '<p style="margin:0;font-family:' + SANS + ';font-size:15px;line-height:1.75;color:' + C_TEXT + ';">' + t["close2"] + '<br><em style="font-family:' + SERIF + ';font-style:normal;color:' + C_INK + ';">' + t["sign"] + '</em></p></td></tr>'
     # liens + pied
     '<tr><td align="center" style="padding:0 24px 20px;font-family:' + SANS + ';font-size:11px;line-height:1.8;color:#8FA39B;">SARL Le Refuge &nbsp;·&nbsp; <a href="' + SITE + '" style="color:#436161;text-decoration:none;">hotel-arenalerefuge.com</a> &nbsp;·&nbsp; <a href="' + CGV + '" style="color:#436161;text-decoration:none;">' + t["foot_cgv"] + '</a></td></tr>'
     '<tr><td style="padding:0;background:' + C_INK + ';line-height:0;" bgcolor="' + C_INK + '"><img src="' + FOOT + '" width="600" alt="Hôtel Arena Le Refuge – 1425 route de la Restonica, 20250 Corte" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>'
     '</tbody></table></td></tr></tbody></table></div>')
    return html

if __name__ == "__main__":
    out = {L: build(L) for L in ("FR", "EN")}
    json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False)
    for L in out: print(L, len(out[L]))
