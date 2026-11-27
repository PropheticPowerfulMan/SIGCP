"""Generate a factual pilot review PDF. No production-security certification is implied.

Run with the bundled Python runtime (reportlab + pypdf). Optional real screenshots
add one page each. The E2E result and publication state must be supplied from actual
execution evidence, never inferred from the existence of test or workflow files.
"""
from __future__ import annotations

import argparse
from hashlib import sha256
from html import escape
from pathlib import Path
import shutil
import subprocess

from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'docs' / 'IMPERIUM_RDC_Dossier_Revue_Pilote.pdf'
PREVIEW = ROOT / 'docs' / 'report-preview'
EMBLEM = ROOT / 'public' / 'brand' / 'emblem-presidence.jpg'
EMBLEM_SHA256 = '1d40d86235ff4169450c1beb9fd47ca4fec485f3f26fb580a1b874db6aec3261'
W, H = 595.276, 841.89
M, CW = 46, W - 92
NAVY, BLUE, GOLD = map(HexColor, ['#081D35', '#173C5B', '#B69A4E'])
INK, MUTED, LINE, PALE = map(HexColor, ['#23364C', '#65768A', '#DDE5ED', '#F3F6FA'])


def register_fonts():
    regular, bold = Path('C:/Windows/Fonts/arial.ttf'), Path('C:/Windows/Fonts/arialbd.ttf')
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont('Body', str(regular)))
        pdfmetrics.registerFont(TTFont('BodyBold', str(bold)))
    else:
        raise RuntimeError('Arial TrueType fonts are required for reliable French text rendering.')
    from reportlab.pdfbase.pdfmetrics import registerFontFamily
    registerFontFamily('Body', normal='Body', bold='BodyBold', italic='Body', boldItalic='BodyBold')


def paragraph(c, text, x, y, width=CW, size=10.2, leading=15, color=INK, bold=False):
    style = ParagraphStyle('body', fontName='BodyBold' if bold else 'Body', fontSize=size,
                           leading=leading, textColor=color, alignment=TA_LEFT,
                           spaceAfter=0, allowWidows=0, allowOrphans=0)
    flow = Paragraph(text, style)
    _, height = flow.wrap(width, H)
    flow.drawOn(c, x, y - height)
    return y - height


def title(c, number, kicker, heading, description):
    c.setFillColor(NAVY)
    c.rect(0, H - 10, W, 10, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont('BodyBold', 8)
    c.drawString(M, H - 43, f'IMPERIUM RDC  /  SIGCP  /  {kicker.upper()}')
    y = paragraph(c, heading, M, H - 70, size=24, leading=29, color=NAVY, bold=True)
    return paragraph(c, description, M, y - 13, size=10, leading=15, color=MUTED) - 23


def section(c, text, y):
    y = paragraph(c, text, M, y, size=12, leading=17, color=NAVY, bold=True)
    return y - 11


def table(c, headers, rows, widths, y, size=9.0):
    def cell(text, heading=False):
        return Paragraph(str(text), ParagraphStyle('cell', fontName='BodyBold' if heading else 'Body',
            fontSize=size, leading=size + 4, textColor=white if heading else INK))
    data = [[cell(h, True) for h in headers]] + [[cell(v) for v in row] for row in rows]
    flow = Table(data, colWidths=widths, hAlign='LEFT')
    flow.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, PALE]),
        ('LINEBELOW', (0, 0), (-1, 0), 1, GOLD),
        ('LINEBELOW', (0, 1), (-1, -1), .35, LINE),
    ]))
    _, height = flow.wrap(CW, H)
    if y - height < 60:
        raise RuntimeError(f'Table would overflow the page: bottom={y-height:.1f}')
    flow.drawOn(c, M, y - height)
    return y - height - 17


def note(c, text, y, danger=False):
    style = ParagraphStyle('note', fontName='Body', fontSize=9.2, leading=13.5,
                           textColor=HexColor('#6B572B') if not danger else INK)
    p = Paragraph(text, style)
    _, height = p.wrap(CW - 26, H)
    c.setFillColor(HexColor('#F6F1E3'))
    c.roundRect(M, y - height - 22, CW, height + 22, 5, fill=1, stroke=0)
    p.drawOn(c, M + 13, y - height - 11)
    return y - height - 37


def footer(c, page, total):
    c.setStrokeColor(LINE)
    c.line(M, 43, W - M, 43)
    c.setFont('Body', 7.2)
    c.setFillColor(MUTED)
    c.drawString(M, 28, 'PILOTE NON HOMOLOGUÉ  |  Données fictives  |  Présentation du 27 novembre 2026')
    c.drawRightString(W - M, 28, f'{page:02d} / {total:02d}')


def box(c, x, y, width, height, heading, body, fill=PALE):
    c.setFillColor(fill)
    c.setStrokeColor(LINE)
    c.roundRect(x, y - height, width, height, 5, fill=1, stroke=1)
    bottom = paragraph(c, heading, x + 13, y - 13, width - 26, size=10.3, leading=14, color=NAVY, bold=True)
    paragraph(c, body, x + 13, bottom - 7, width - 26, size=9.1, leading=13.1, color=MUTED)


def generate(args):
    register_fonts()
    if not EMBLEM.is_file() or sha256(EMBLEM.read_bytes()).hexdigest() != EMBLEM_SHA256:
        raise RuntimeError('Le fichier original autorisé de l’emblème est absent ou son empreinte diffère.')
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    screenshots = [Path(path) for path in args.screenshot]
    for path in screenshots:
        if not path.is_file():
            raise FileNotFoundError(f'Real screenshot is missing: {path}')
    total = 6 + len(screenshots)
    c = canvas.Canvas(str(OUTPUT), pagesize=(W, H), pageCompression=1)
    c.setTitle('IMPERIUM RDC - Dossier de revue du pilote v0.4.0')
    c.setAuthor('LOKALA LOMBOTO Jonathan - conception du projet')
    c.setSubject('Revue fonctionnelle du pilote frontend SIGCP, limites et trajectoire institutionnelle')

    # 1. Cover. The typography is the product identity, not an invented official seal.
    c.setFillColor(NAVY)
    c.rect(0, 365, W, H - 365, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(M, H - 52, 32, 3, fill=1, stroke=0)
    paragraph(c, 'IMPERIUM RDC', M, H - 72, 300, size=13, leading=18, color=white, bold=True)
    paragraph(c, 'SYSTÈME INTÉGRÉ DE GESTION<br/>DES COURRIERS PRÉSIDENTIELS', M, H - 104, 330,
              size=8.5, leading=13, color=HexColor('#B7C9DA'))
    # Original JPEG supplied and authorized by the concepteur; no redraw or crop.
    c.drawImage(ImageReader(str(EMBLEM)), W - M - 112, H - 174, width=112, height=112, preserveAspectRatio=True)
    paragraph(c, 'Emblème fourni par le concepteur', W - M - 118, H - 182, 124, size=6.5, leading=9, color=HexColor('#D7C58F'))
    paragraph(c, 'Dossier de revue<br/>du pilote', M, 650, size=37, leading=44, color=white, bold=True)
    paragraph(c, 'Du registre documentaire<br/>à une vision nationale des échanges.', M, 535,
              size=16.5, leading=24, color=HexColor('#D7C58F'))
    paragraph(c, 'VERSION 0.4.0  /  PRÉSENTATION DU 27 NOVEMBRE 2026', M, 426, size=8.5, leading=12, color=white, bold=True)
    paragraph(c, 'Proposition technique non homologuée.<br/>Revue d’une démonstration frontend, sans serveur métier.', M, 399,
              size=9.2, leading=14, color=HexColor('#B7C9DA'))
    y = paragraph(c, 'Un pilote pour éprouver les usages avant l’infrastructure définitive.', M, 335,
                  size=14.5, leading=21, color=NAVY, bold=True)
    y = paragraph(c, 'Ce dossier distingue les fonctions réellement disponibles dans le navigateur, les preuves de vérification et les prérequis d’une plateforme institutionnelle exploitable.',
                  M, y - 12, size=10.5, leading=16, color=MUTED)
    col = (CW - 20) / 3
    for index, (head, body) in enumerate([('42', 'courriers synthétiques'), ('Version 0.4.0', 'revue de présentation'), ('0 donnée réelle', 'dans le périmètre autorisé')]):
        box(c, M + index * (col + 10), 235, col, 69, head, body)
    y = paragraph(c, '<b>Initiateur et concepteur : LOKALA LOMBOTO Jonathan.</b>', M, 135, size=10, leading=15)
    paragraph(c, 'Propriétaire intellectuel revendiqué : LOKALA LOMBOTO Jonathan, sous réserve des dispositions institutionnelles, contractuelles et légales applicables.',
              M, y - 8, size=8, leading=12, color=MUTED)
    footer(c, 1, total)
    c.showPage()

    # 2. Scope and traceability.
    y = title(c, 2, 'Vision et périmètre', 'Une démonstration utile, un périmètre précis',
              'Les deux cahiers d’exigences visent à moderniser le courrier présidentiel puis à préparer le réseau national NSEN. La v0.4.0 ajoute une recherche globale, clarifie les institutions et avertit des doublons, dans un mode clair adouci.')
    y = table(c, ['Fonctions disponibles localement', 'Limites à conserver visibles'], [
        ['Profils cohérents, cartes courrier mobiles et chronologie.', 'Références DEMO, stockage navigateur ; aucune numérotation administrative transactionnelle.'],
        ['Affectation, instruction, validation, retour motivé et archivage simulés.', 'Aucun visa, signature officielle, habilitation ou contrôle serveur.'],
        ['Recherche globale Ctrl K, filtres, CSV et statistiques calculées.', 'Jeu initial de 42 dossiers ; pas de recherche ni de rapports serveur.'],
        ['Source et destinataire distincts, annuaire et échanges fictifs.', 'Transmission, réception, accusé et relance simulés ; aucun courrier réel transmis.'],
        ['Avertissement de doublon et fiches documentaires fictives.', 'Pas de fichier original, téléversement privé, quarantaine ou analyse antivirus.'],
    ], [CW * .49, CW * .51], y)
    y = section(c, 'Traçabilité des 40 sections des exigences', y - 4)
    y = table(c, ['Ensemble', 'Sections', 'État de couverture'], [
        ['Fondation, identité et architecture', '1 à 6', 'Pilote visuel partiel ; identité serveur et RBAC/ABAC absents.'],
        ['Courriers, référentiels et documents', '7 à 15', 'Parcours locaux partiels ; GED, messagerie et API à construire.'],
        ['Sécurité, migration et exploitation', '16 à 24', 'PWA statique ; identité serveur, charge et migration à construire.'],
        ['Structure, documentation et livraison', '25 à 30', 'Sources et suivi disponibles ; livraison complète non atteinte.'],
        ['Vision et échanges nationaux', '31 à 40', 'Simulation ISE ; isolation, PKI, protocole et gouvernance à établir.'],
    ], [CW * .35, CW * .13, CW * .52], y, size=8.3)
    paragraph(c, 'Référence détaillée : docs/REQUIREMENTS_MATRIX.md. Les douze PDF du master prompt ne sont pas présentés comme produits par ce dossier de revue unique.', M, y,
              size=8.5, leading=12.5, color=MUTED)
    footer(c, 2, total)
    c.showPage()

    # 3. Architecture and trust boundaries.
    y = title(c, 3, 'Architecture', 'Du navigateur au système souverain',
              'GitHub Pages héberge des fichiers statiques. Le pilote valide les parcours ; l’infrastructure cible devra apporter les services métier et les frontières de confiance.')
    y = section(c, 'Architecture actuelle - démonstration frontend', y)
    box(c, M, y, CW, 100, 'React + TypeScript strict + Vite',
        'Profils fictifs cohérents, recherche globale, cartes mobiles et rail tablette. Avertissement de doublon avant confirmation. Coque PWA statique ; règles locales dans domain.ts/exchange.ts et données fictives dans le navigateur.')
    y -= 116
    y = note(c, '<b>Frontière actuelle :</b> le navigateur appartient à l’utilisateur. Les identifiants, agents, statuts et contenus locaux peuvent être modifiés. Le pilote ne prouve ni l’autorisation, ni l’isolement des institutions, ni l’intégrité d’une preuve officielle.', y)
    y = section(c, 'Architecture cible - composants à implémenter', y)
    widths = (CW - 20) / 3
    for index, (head, body) in enumerate([
        ('Identité et accès', 'BFF OIDC, MFA, cookies HttpOnly/Secure, contexte institutionnel authentifié, RBAC/ABAC.'),
        ('Monolithe modulaire', 'Java 25 / Spring Boot, domaines séparés, API OpenAPI, validation, transactions et outbox.'),
        ('Données et documents', 'PostgreSQL / Flyway, S3 privé, quarantaine, antivirus, conservation et audit protégé.'),
    ]):
        box(c, M + index * (widths + 10), y, widths, 149, head, body)
    y -= 168
    y = table(c, ['Décision', 'Condition avant production'], [
        ['Isolation institutionnelle', 'Contexte établi côté serveur ; choix bases/schémas/instances fondé sur les classifications et risques.'],
        ['Messagerie et ISE', 'Connecteurs de test puis profil standard TLS/mTLS, PKI, signatures et règles de partage approuvées.'],
        ['Exploitation', 'Environnements séparés, secrets gérés, supervision, sauvegarde/restauration et reprise testées.'],
    ], [CW * .3, CW * .7], y, size=8.8)
    paragraph(c, 'Aucune cryptographie propriétaire n’est proposée. Le choix des versions maintenues, licences, standards et infrastructures doit être vérifié avant leur intégration.', M, y,
              size=9, leading=13, color=MUTED)
    footer(c, 3, total)
    c.showPage()

    # 4. Evidence and a practical review guide.
    y = title(c, 4, 'Preuves et recette', 'Vérifier les usages, conserver les preuves',
              'Contrôles du pilote frontend, sans service institutionnel. Mesures limitées aux fonds calculables ; gradients revus visuellement. Aucune certification WCAG ni homologation.')
    y = table(c, ['Vérification', 'Résultat attesté dans cette revue'], [
        ['Tests unitaires', escape(args.unit_result)],
        ['Typage et dépendances', escape(args.quality_result)],
        ['Construction de production', escape(args.build_result)],
        ['Parcours navigateur Playwright', escape(args.e2e_result)],
        ['Lecture et formats', escape(args.visual_result)],
        ['Publication GitHub Pages', escape(args.pages_status)],
        ['Sécurité et performance serveur', 'Non exécutées : aucun backend institutionnel n’est livré.'],
    ], [CW * .39, CW * .61], y)
    y = section(c, 'Guide de revue - quatre parcours concrets', y)
    steps = [
        ('1. Ouvrir le pilote', 'Choisir un profil fictif, ouvrir la démonstration puis utiliser Ctrl K ou le bouton de recherche globale pour retrouver un dossier.'),
        ('2. Créer un dossier fictif', 'Distinguer propriétaire et destinataire ; remplir le courrier. En cas de doublon possible, comparer les références et confirmer explicitement le nouveau dossier.'),
        ('3. Suivre un circuit', 'Consulter la fiche et son historique, affecter, instruire, demander une correction motivée si nécessaire, valider et archiver. Recharger la page pour contrôler la persistance locale.'),
        ('4. Examiner les échanges', 'Sélectionner un courrier sortant éligible et un partenaire fictif. Distinguer transmission technique, réception administrative et accusé. Tester la reprise d’échec et l’absence de doublon.'),
    ]
    for head, text in steps:
        y = paragraph(c, head, M, y, size=10.1, leading=14, color=NAVY, bold=True)
        y = paragraph(c, text, M, y - 4, size=9.1, leading=12.5, color=MUTED) - 10
    y = paragraph(c, 'Les captures ajoutées à la fin du dossier proviennent d’exécutions réelles. Les preuves publiées de la v0.3.1 restent historiques et ne constituent pas une recette de la v0.4.0.', M, y, size=8.5, leading=12.5, color=MUTED) - 12
    source = ('Source CI : <link href="' + escape(args.ci_run, quote=True) + '">GitHub Actions - exécution vérifiée</link>. ' if args.ci_run else 'Sources : tests/domain.test.mjs, tests/exchange.test.mjs et tests/e2e.spec.ts. ')
    paragraph(c, source + 'Révision / état : ' + escape(args.revision) + '. Les succès frontend ne constituent pas un audit de sécurité serveur.', M, y,
              size=8.2, leading=12, color=MUTED)
    footer(c, 4, total)
    c.showPage()

    # 5. Roadmap, decisions and deployment prerequisite.
    y = title(c, 5, 'Pilotage et déploiement', 'Avancer par étapes validées',
              'Les corrections sont d’abord revues dans la démonstration, puis migrées vers une infrastructure approuvée. Aucune donnée institutionnelle réelle ne doit être placée sur le pilote statique.')
    y = table(c, ['Étape', 'Résultat attendu avant extension'], [
        ['Pilote interne', 'Recette des usages, charte et règles métier ; revue des limites ; activation de la démonstration Pages.'],
        ['Services présidentiels autorisés', 'Backend, identité, habilitations, GED privée, tests de sécurité et reprise ; homologation du périmètre.'],
        ['Partenaire autorisé', 'Expérimentation entre institutions isolées, contrats d’échange, identité mutuelle et preuves vérifiables.'],
        ['Institutions centrales', 'Admission contrôlée, gouvernance du réseau et capacité d’exploitation démontrée.'],
        ['Extension provinciale et diplomatique', 'Contraintes locales, connectivité, classification et support validés.'],
        ['Réseau national NSEN', 'Interopérabilité, supervision et gouvernance nationales approuvées.'],
    ], [CW * .34, CW * .66], y, size=8.6)
    y = section(c, 'GitHub Pages - publication vérifiée' if args.pages_status.startswith('Publié') else 'GitHub Pages - prérequis de publication', y)
    y = paragraph(c, '1. Ouvrir le dépôt SIGCP, puis <b>Settings &gt; Pages</b>.<br/>2. Vérifier la source <b>GitHub Actions</b> et la visibilité du dépôt approuvée par le propriétaire.<br/>3. Exécuter le workflow de validation/déploiement et lire son résultat.<br/>4. Vérifier l’URL après réussite : <b>https://propheticpowerfulman.github.io/SIGCP/</b>.', M, y,
                  size=9.6, leading=16) - 15
    publication_note = ('Publication de la version indiquée vérifiée par les résultats fournis : accès HTTPS et ressources attendues. La coque PWA reste statique, sans identité institutionnelle ni données réelles.' if args.pages_status.startswith('Publié') else 'Vérifier la réussite du workflow et la version servie avant la présentation. La publication historique de la v0.3.1 ne constitue pas une preuve de déploiement ou de recette de la v0.4.0.')
    y = note(c, publication_note, y)
    y = section(c, 'Décisions indispensables du concepteur et de l’institution', y)
    y = paragraph(c, 'Charte institutionnelle ; organigramme, numérotation et classifications ; matrice des habilitations ; autorités de validation et signature ; hébergement souverain et IAM/PKI ; conservation et reprise ; mandat de découverte du système historique.', M, y,
                  size=9.6, leading=15, color=MUTED) - 14
    paragraph(c, '<b>Le pilote est prêt à être examiné. L’architecture de production et le réseau national restent à construire, tester et approuver.</b>', M, y,
              size=10.2, leading=15, color=NAVY)
    footer(c, 5, total)
    c.showPage()

    # 6. Installation and the short presentation route.
    y = title(c, 6, 'Application et présentation', 'Retrouver le pilote sur son appareil',
              'Pour la séance du 27 novembre 2026 : accès au premier plan sur téléphone, cartes courrier et navigation rapide ; rail compact sur tablette. Préparer chaque appareil en ligne.')
    y = table(c, ['Appareil', 'Accès à l’installation'], [
        ['Chrome / Edge sur ordinateur', 'Bouton Installer lorsque la proposition native existe ; sinon icône ou menu d’installation du navigateur.'],
        ['Android', 'Dans Chrome, utiliser la commande Installer ou Ajouter à l’écran d’accueil ; confirmer ce qui est proposé par l’appareil.'],
        ['iPhone / iPad', 'Dans Safari : Partager, puis Ajouter à l’écran d’accueil. L’option d’ouverture comme app peut être proposée.'],
        ['Mac avec Safari', 'Sur macOS Sonoma ou ultérieur : Fichier, puis Ajouter au Dock. Sinon conserver l’accès web ou un navigateur compatible.'],
    ], [CW * .34, CW * .66], y, size=9)
    y = note(c, 'L’installation native dépend du navigateur et du système. Sans proposition disponible, le bouton ouvre un guide adapté. Une ouverture du guide ne prouve pas une installation ; un favori n’est pas une garantie de fenêtre autonome.', y)
    y = section(c, 'Hors connexion : une coque statique, pas un serveur', y)
    y = paragraph(c, 'Ouvrir d’abord la production en ligne et attendre sa préparation. Le précache se limite aux ressources autorisées : HTML, manifeste, bundles, polices et icônes. Les futures réponses API, jetons, documents, exports et requêtes autorisées ne doivent pas être mis en cache. Les dossiers fictifs restent locaux au navigateur, sans synchronisation institutionnelle.', M, y, size=9.7, leading=15, color=MUTED) - 17
    y = section(c, 'Un parcours de présentation en cinq minutes', y)
    y = paragraph(c, '<b>Entrée et profil</b> → <b>recherche globale</b> → <b>nouveau courrier</b> → <b>traitement et validation</b> → <b>échange simulé</b> → <b>installation et essai hors connexion</b>.<br/><br/>Sur téléphone : cartes et navigation basse. Sur tablette : rétracter le rail. Faire défiler les fenêtres longues ; les barres assorties dépendent du navigateur. Terminer la saisie avant une mise à jour et revenir en ligne après l’essai.', M, y, size=9.7, leading=15) - 18
    y = paragraph(c, 'Guides détaillés : docs/PRESENTATION_GUIDE.md et docs/PWA_INSTALLATION.md.', M, y, size=8.8, leading=13, color=MUTED) - 12
    paragraph(c, 'Références navigateur : <link href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing">MDN - installation des applications web</link> ; <link href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable">MDN - conditions et prise en charge</link>. Les contrôles exécutés sur le pilote sont consignés séparément.', M, y, size=8.4, leading=12.5, color=MUTED)
    footer(c, 6, total)
    c.showPage()

    capture_titles = {
        'login': ('Accéder au pilote', 'Page d’entrée de la version présentée : profil fictif, identité visuelle et accès à l’installation. Aucun mot de passe institutionnel n’est demandé.'),
        'dashboard': ('Piloter l’activité en un regard', 'Vue d’ensemble réelle du pilote : indicateurs, priorités et dernières correspondances calculés depuis le jeu de données synthétiques.'),
        'dashboard-tablet': ('Une vue adaptée à la tablette', 'Capture réelle du pilote au format tablette dans le navigateur : rail compact, indicateurs et commandes. Cette recette visuelle ne prouve pas les habilitations serveur.'),
        'registre-mobile': ('Lire les courriers sur téléphone', 'Capture réelle du registre mobile : cartes de correspondance, filtre et navigation rapide. Les dossiers et institutions restent fictifs.'),
    }
    for index, path in enumerate(screenshots, start=7):
        heading, description = capture_titles.get(path.stem.removeprefix('v04-'), ('Le pilote en situation de revue', 'Capture de l’application exécutée avec des données synthétiques. Elle ne démontre pas les protections de l’infrastructure cible.'))
        y = title(c, index, 'Capture réelle', heading, description)
        reader = ImageReader(str(path))
        iw, ih = reader.getSize()
        ratio = min(CW / iw, (y - 120) / ih)
        draw_w, draw_h = iw * ratio, ih * ratio
        x = M + (CW - draw_w) / 2
        c.setStrokeColor(LINE)
        c.rect(x - 1, y - draw_h - 1, draw_w + 2, draw_h + 2, fill=0, stroke=1)
        c.drawImage(reader, x, y - draw_h, width=draw_w, height=draw_h)
        paragraph(c, escape(path.name) + f' - capture navigateur {iw} x {ih} px, données fictives exclusivement.', M, y - draw_h - 16,
                  size=8.6, leading=13, color=MUTED)
        footer(c, index, total)
        c.showPage()
    c.save()
    reader = PdfReader(str(OUTPUT))
    if len(reader.pages) != total:
        raise RuntimeError(f'Unexpected page count: {len(reader.pages)} instead of {total}')
    for index, page in enumerate(reader.pages, 1):
        text = page.extract_text() or ''
        if len(text.strip()) < 80:
            raise RuntimeError(f'Insufficient extracted text on page {index}')
    print(f'GENERATED {OUTPUT} ({len(reader.pages)} pages, {OUTPUT.stat().st_size} bytes)')
    if args.render:
        PREVIEW.mkdir(parents=True, exist_ok=True)
        poppler = shutil.which('pdftoppm')
        if not poppler:
            dep = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies'
            candidates = [dep / 'bin/override/pdftoppm.exe', dep / 'bin/fallback/pdftoppm.exe']
            poppler = next((str(path) for path in candidates if path.exists()), None)
        if not poppler:
            raise RuntimeError('pdftoppm unavailable: install Poppler or supply its directory on PATH before visual QA.')
        subprocess.run([poppler, '-r', '110', '-png', str(OUTPUT), str(PREVIEW / 'page')], check=True)
        print(f'RENDERED {PREVIEW}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--unit-result', default='47 tests Node réussis localement ; bilan CI final 0.4.0 à confirmer.')
    parser.add_argument('--quality-result', default='Typage strict local réussi ; audit final 0.4.0 à confirmer.')
    parser.add_argument('--build-result', default='Construction finale de la v0.4.0 à confirmer.')
    parser.add_argument('--e2e-result', default='En cours au moment de la préparation du dossier ; aucun résultat final revendiqué.')
    parser.add_argument('--visual-result', default='Revue finale des formats et de la lecture à documenter ; aucune certification revendiquée.')
    parser.add_argument('--pages-status', default='Publication de la v0.4.0 à vérifier ; v0.3.1 historiquement publiée.')
    parser.add_argument('--revision', default='Voir le commit de livraison et PROJECT_STATUS.md.')
    parser.add_argument('--ci-run', default='', help='Verified GitHub Actions run URL used as evidence.')
    parser.add_argument('--screenshot', action='append', default=[], help='Path of an existing, real application screenshot.')
    parser.add_argument('--render', action='store_true', help='Render every page to docs/report-preview/ with Poppler.')
    generate(parser.parse_args())
