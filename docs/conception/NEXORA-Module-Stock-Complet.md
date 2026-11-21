Ce module couvre le catalogue, les quantités par emplacement, les mouvements, les inventaires, les transferts, les alertes, le réapprovisionnement, la traçabilité, les retours, la valorisation et les rapports. Il comporte **10 entrées de menu et 13 pages**. Les routes, champs et libellés ci-dessous constituent une proposition de conception.

# Navigation et contenu par page

## 1. Accueil Stock · /stock

- **Indicateurs** : références en rupture, produits sous le seuil, inventaires en cours, propositions à valider. Afficher la date de mise à jour et le périmètre entrepôt.

- **Priorités** : alertes avec produit, emplacement, quantité disponible, seuil et degré d’urgence. Ajouter les mouvements récents avec leur type, quantité, date et auteur.

- **Actions** : ouvrir une liste préfiltrée, ouvrir la fiche d’un produit ou lancer une saisie de mouvement. Si un indicateur est indisponible, afficher son état séparément.

## 2. Catalogue · /stock/products

- **Onglet Produits** : référence unique, nom, catégorie, unité, quantité disponible, seuil et état. Recherche par nom, référence ou code-barres. Filtres par catégorie, entrepôt, disponibilité et état.

- **Onglet Catégories** : arborescence, nom, parent et nombre de produits visibles. Créer, renommer et déplacer une catégorie. Bloquer un déplacement qui créerait une boucle.

- **Formulaire produit** : nom, référence, catégorie, unité, code-barres facultatif, conditionnement, seuil et mode de traçabilité applicable. Gérer les erreurs de référence en doublon au niveau du champ.

## 3. Fiche produit · /stock/products/\:id

- **Synthèse** : photo si disponible, nom, référence, code-barres, unité, conditionnement et état. Actions **Modifier**, **Nouveau mouvement** et **Archiver** selon les droits.

- **Quantités** : quantités par entrepôt et emplacement, seuil, état et accès aux mouvements filtrés. Distinguer les quantités en transit, isolées et disponibles.

- **Historique** : entrées, sorties, ajustements et documents associés. Sur les articles suivis, ouvrir le lot ou le numéro de série.

- **Fournisseurs** : fournisseur, référence d’achat, conditionnement, prix et devise, délai et date de mise à jour. Associer ou modifier un fournisseur existant. La propriété du référentiel fournisseurs commun à Stock et Comptabilité reste à confirmer.

- **Prévision** : couverture estimée, consommation observée, délai retenu et date de calcul. Ouvrir l’alerte ou la proposition liée.

## 4. Entrepôts et emplacements · /stock/warehouses

- **Liste** : nom, code, responsable, nombre d’emplacements et état. Rechercher et filtrer par état ou responsable.

- **Panneau de détail** : zones et emplacements, code, type, état, stock par produit et mouvements récents. Créer ou modifier les entrepôts et emplacements selon ses droits.

- **Formulaires** : nom, code, responsable et site pour l’entrepôt. Code, libellé, zone et type pour l’emplacement. Règle proposée. Un emplacement contenant du stock doit être vidé avant archivage.

## 5. Mouvements · /stock/movements

- **Journal** : référence, date, type, produit, quantité, unité, emplacement, lot ou série si applicable, motif, document source et auteur. Filtres par période, entrepôt, produit et type.

- **Nouveau mouvement** : type, produit, emplacement, quantité positive, date, motif et référence source. Exiger les informations de lot ou de série si le produit est suivi. Afficher la quantité disponible avant une sortie.

- **Actions** : enregistrer selon les droits, ouvrir le détail ou corriger un mouvement validé par une opération inverse liée à l’original. En cas de saisie hors ligne, afficher **En attente de synchronisation** jusqu’à la confirmation du serveur.

## 6. Inventaires · /stock/inventories

- **Liste des campagnes** : nom, entrepôt, périmètre, dates, responsable, progression, nombre d’écarts et état. Filtrer par période, entrepôt et état.

- **Formulaire** : nom, entrepôt, zones ou produits à compter, date de référence et responsable. Lancer la campagne et ouvrir son détail.

## 7. Détail d’un inventaire · /stock/inventories/\:id

- **Suivi** : progression, lignes à compter, lignes avec écart et historique des validations.

- **Comptage** : produit, emplacement, lot ou série si applicable, quantité attendue, quantité comptée, écart, commentaire et dernière saisie. Filtrer les lignes non comptées ou en écart.

- **Actions** : saisir et reprendre le comptage, envoyer les lignes pour vérification et valider les ajustements. Si des mouvements sont intervenus depuis le relevé de référence, signaler les lignes à revoir avant validation. Un ajustement validé met le stock à jour une seule fois.

## 8. Transferts · /stock/transfers

- **Liste** : référence, entrepôts de départ et d’arrivée, date, nombre de lignes, responsable et état. Vues **À expédier** et **À réceptionner**.

- **Formulaire** : départ, destination distincte, produits, quantités, emplacements si connus, lots ou séries et date prévue. Enregistrer un brouillon puis ouvrir le détail.

## 9. Détail d’un transfert · /stock/transfers/\:id

- **En-tête** : référence, départ, destination, état, dates prévues et effectives.

- **Lignes et historique** : quantités prévues, expédiées, reçues et restant en transit. Afficher les écarts, motifs et auteurs.

- **Actions** : confirmer l’expédition, saisir une réception et justifier les écarts. L’expédition retire les quantités du stock disponible du départ. La réception rend les quantités effectivement reçues disponibles à destination. Une réception partielle conserve le solde en transit jusqu’à sa réception ou au traitement d’un écart.

## 10. Alertes et réapprovisionnement · /stock/alerts

- **Onglet Alertes** : produit, entrepôt, disponibilité, seuil, couverture estimée, date de détection et état. Filtrer par rupture, seuil franchi ou risque estimé. Ouvrir le détail et ses données de calcul.

- **Onglet Propositions** : produit, fournisseur envisagé, quantité suggérée, quantité ajustée, délai et état. Afficher la consommation de référence, l’horizon et les hypothèses.

- **Actions** : ajuster la quantité avec un motif, approuver ou refuser, puis enregistrer une réception totale ou partielle contre la proposition approuvée. Préparer un formulaire de réception avec référence de livraison, emplacement, quantités et lots si requis.

- **Périmètre proposé** : Stock conserve la proposition et la réception. Comptabilité traite la facture et le règlement. La création d’une commande fournisseur officielle dans NEXORA reste à décider.

## 11. Traçabilité · /stock/traceability

- **Recherche** : produit, référence, lot, série, entrepôt et période.

- **Détail** : lot ou série, dates de réception et de péremption applicables, emplacement courant, quantités et chronologie des mouvements. Chaque mouvement affiche sa référence, son type et sa pièce source si l’accès est autorisé.

- **Actions** : ouvrir un mouvement, remonter vers la fiche produit ou consulter les autres unités du même lot.

## 12. Retours et produits défectueux · /stock/returns

- **Liste et détail** : référence, produit, quantité, origine, motif, état, lot ou série, emplacement d’isolement et ticket Support lié. Afficher l’historique de la décision.

- **Formulaire** : produit, quantité, motif, origine, état constaté, lot ou série selon le suivi et ticket facultatif.

- **Actions** : enregistrer un retour, isoler un produit, rattacher un ticket, remettre en stock ou confirmer une sortie définitive selon les droits. Les quantités isolées restent identifiables et exclues du disponible.

## 13. Valorisation et rapports · /stock/reports

- **Onglet Valorisation** : quantité, coût unitaire calculé, valeur par produit, entrepôt ou catégorie, devise et date d’arrêté. La v2 propose le coût moyen unitaire pondéré. Afficher **Coût indisponible** si le calcul manque de données.

- **Onglet Indicateurs** : ruptures observées, produits peu mouvementés, rotation et volumes d’entrées et de sorties. Afficher la période et la définition de chaque indicateur.

- **Actions** : filtrer, consulter le détail autorisé et exporter le périmètre affiché selon ses droits.

# Modales de confirmation

| Modale | Informations à confirmer | Résultat |
| - | - | - |
| Archiver un produit ou un emplacement | Identité, quantités restantes et opérations liées | Archivage ou blocage expliqué |
| Corriger un mouvement | Référence, opération inverse, quantité et motif | Nouveau mouvement lié à l’original |
| Valider un inventaire | Périmètre, écarts à appliquer et lignes à revoir | Ajustements enregistrés une seule fois |
| Expédier un transfert | Départ, destination et quantités expédiées | Quantités transférées en transit |
| Réceptionner un transfert | Quantités reçues, emplacement, écarts et reliquat | Stock destination augmenté des quantités reçues |
| Approuver ou refuser une proposition | Produit, quantité, fournisseur et motif en cas de refus | Décision inscrite dans l’historique |
| Confirmer un retour ou sa disposition | Article, quantité, emplacement et décision | Mouvement correspondant au traitement |
| Exporter un rapport | Onglet, période, entrepôt et format | Export du périmètre autorisé |

Les formulaires multi-champs s’ouvrent dans des panneaux. La modale affiche les effets de l’action avant confirmation. Pendant l’envoi, bloquer les soumissions répétées. En cas d’échec, conserver la saisie et afficher l’erreur.

# Statuts et états d’interface

| Objet | Statuts proposés | Règle |
| - | - | - |
| Produit, entrepôt ou emplacement | Actif, Archivé | Les références archivées restent consultables dans l’historique. |
| Disponibilité | Disponible, Sous le seuil, En rupture | Rupture à quantité disponible nulle. Le risque estimé est un indicateur distinct. |
| Mouvement | Validé, En attente de synchronisation, Conflit de synchronisation | Seuls les mouvements confirmés par le serveur modifient le stock officiel. En cas de conflit, afficher le motif et permettre une nouvelle vérification. |
| Inventaire | Brouillon, En comptage, À valider, Validé | La validation applique les écarts retenus après vérification. |
| Transfert | Brouillon, En transit, Partiellement reçu, Reçu | Chaque confirmation met à jour les quantités réellement traitées. |
| Alerte | Ouverte, Résolue | Une alerte de seuil se résout quand le niveau disponible repasse au-dessus du seuil selon la règle retenue. |
| Proposition | À valider, Approuvée, Refusée, Partiellement reçue, Réceptionnée | Le statut de réception suit les quantités confirmées. |
| Retour | Enregistré, Isolé, Remis en stock, Sorti | La remise en stock exige une décision habilitée. |

Prévoir le chargement, l’état vide, l’absence de résultat, les erreurs récupérables, l’accès refusé et les conflits d’édition. Afficher les états en texte. Garder les filtres au retour d’un détail. Une quantité indisponible s’affiche comme telle. Les actions de comptage et de réception doivent rester accessibles au clavier et sur mobile.

# IA, automatisations et règles métier

1. Une sortie est validée et le système recalcule le stock à partir des mouvements confirmés. Une sortie concurrente est vérifiée côté serveur avant d’être acceptée.

2. Au franchissement du seuil, le système ouvre une alerte. Tant qu’une alerte active couvre la même situation, les nouvelles sorties actualisent cette alerte.

3. Le calcul présente l’historique des sorties, le délai fournisseur, la couverture et la quantité suggérée. L’IA explique le résultat établi par le calcul métier. Si l’historique est insuffisant, l’interface conserve l’alerte et permet une proposition manuelle.

4. Une personne habilitée ajuste, approuve ou refuse la proposition. La décision conserve l’auteur, la date et les quantités.

5. La réception augmente le stock des unités effectivement acceptées. Une relance de la même confirmation ne génère aucun mouvement supplémentaire. Les réceptions partielles, transferts et ajustements conservent des références vers leur opération source.

Les permissions délimitent les entrepôts et les actions accessibles. Le serveur applique le même périmètre aux listes, détails, compteurs, exports et données transmises à l’IA. Les corrections, validations d’inventaire, transferts, réceptions et décisions de réapprovisionnement sont journalisés.

# Critères d’acceptation

- La recherche retrouve un produit par SKU et le serveur refuse un doublon.

- Un mouvement validé modifie une seule fois le stock. Sa correction conserve le mouvement d’origine.

- Un inventaire affiche les écarts, bloque ou signale un comptage devenu obsolète et n’applique ses ajustements qu’une fois.

- Un transfert de 10 unités avec réception de 6 affiche 6 unités reçues et 4 en transit.

- Une alerte ouvre la bonne fiche produit. Si la prévision est indisponible, l’alerte et la saisie manuelle restent accessibles.

- L’approbation d’un réapprovisionnement laisse les quantités inchangées. Une réception confirmée augmente uniquement la quantité réellement reçue.

- Un produit isolé reste traçable et est exclu des quantités disponibles.

- Un utilisateur limité à un entrepôt ne reçoit aucune donnée d’un entrepôt hors de son périmètre dans un détail, une recherche ou un export.

# Points à valider

- Propriétaire du référentiel fournisseurs et éventuelle création d’une commande officielle dans NEXORA.

- Portée des seuils par produit et entrepôt, historique minimum et règle proposée pour la quantité de réapprovisionnement.

- Gestion des écarts définitifs de transfert, contrôles à la réception et règles d’archivage.

- Données nécessaires à la valorisation, définition des indicateurs et formats d’export.

Sources internes : 10-module-stock.md, 08-pages.md et 14-ia-trust-layer.md dans docs.zip.

# Complément de conception — demandes, permissions et IA

Le module Stock couvre quantités et mouvements. Les permissions effectives déterminent les ressources et actions accessibles à chaque personne, dans le périmètre accordé. Le poste affiché sur la fiche collaborateur décrit sa fonction dans l’entreprise.

# Navigation et écrans métier

| Écran | Contenu et interactions à maquetter |
| - | - |
| Accueil Stock | Ruptures, seuils, inventaires et propositions. |
| Catalogue | Produits et catégories, références, unités et archivage. |
| Fiche produit | Quantités, fournisseurs, seuils, conditionnement et mouvements. |
| Entrepôts et emplacements | Zones, responsables, quantités et gestion des emplacements. |
| Mouvements | Entrées, sorties, ajustements, motifs et corrections inverses. |
| Inventaires | Campagnes, dates, progression et écarts. |
| Détail inventaire | Comptage par emplacement, vérification et ajustements. |
| Transferts | Départ, destination, lignes et état. |
| Détail transfert | Expédition, réception partielle et reliquat en transit. |
| Alertes et réapprovisionnement | Seuils, couverture, recommandations et réceptions. |
| Traçabilité | Lots, séries, péremptions et mouvements. |
| Retours et produits défectueux | Origine, motif, isolement, remise en stock et ticket lié. |
| Valorisation et rapports | Coûts, valeur, rotation, ruptures et export. |

Ajouter **Demandes** à la navigation de Stock. Un utilisateur dont le seul droit est de soumettre un type de demande arrive directement dans **Mes demandes**. Les raccourcis de l’accueil et des fiches ouvrent la même demande et conservent sa référence.

# Demandes dans le module

Types proposés à configurer : **Matériel, consommables, réapprovisionnement**. Exemple de titre : **Dix claviers pour la salle de formation**.

| Vue | Contenu | Actions visibles selon les permissions |
| - | - | - |
| Mes demandes | Référence, type, titre, date, statut et dernière activité. Filtres par type et état. | Créer, ouvrir, compléter, suivre ou retirer avant décision selon le type. |
| À traiter | Demandes du périmètre autorisé, affectation, ancienneté et état. | Ouvrir, prendre en charge, demander un complément, décider ou transmettre. |
| Types de demande | Nom, description, état, périmètre, pièces requises et circuit associé. | Créer, préparer, activer, modifier ou désactiver selon les droits accordés sur ce module. |

# Formulaire de nouvelle demande

| Champ visible | Comportement |
| - | - |
| Type de demande | Obligatoire. Sélection parmi les types actifs autorisés dans cet espace. |
| Titre | Obligatoire. Résumé court et modifiable. |
| Description ou motif | Obligatoire. Une aide adaptée au type indique quelles précisions écrire. |
| Pièces jointes | Zéro, un ou plusieurs fichiers. Si le type exige un justificatif, afficher cette exigence avant envoi. Afficher noms, progression, erreurs et action Retirer. |

Le formulaire se termine par **Enregistrer le brouillon** et **Soumettre**. Le système renseigne le demandeur, le module, la référence et les dates. Les informations précises nécessaires à l’exécution sont extraites du motif ou du justificatif et confirmées dans le dossier de traitement. Si elles manquent, le demandeur reçoit une demande de complément sur le même dossier.

# Détail, traitement et configuration

Le détail affiche le titre, le type, le statut, le motif, les pièces autorisées et une chronologie. Le demandeur voit les décisions et compléments qui lui sont destinés. Le traitant voit les contrôles métier et les actions pour lesquelles il est habilité. Le bloc **Dossiers liés** montre la référence et l’état partageable. Le lien vers une fiche vérifie le droit de lecture sur cette ressource.

Dans **Types de demande**, le configurateur choisit le libellé, l’aide de saisie, la règle des pièces, les permissions de soumission et de traitement, le circuit et l’effet métier parmi ceux disponibles. Prévisualiser le formulaire avant activation. Désactiver un type le retire des nouvelles demandes. Conserver le type et le circuit utilisés par les demandes déjà soumises.

# Permissions et variantes de maquette

| Variante | Interface à représenter |
| - | - |
| Demandeur uniquement | Mes demandes et Nouvelle demande, filtrées à son périmètre personnel. |
| Traitement autorisé | File À traiter limitée aux demandes accessibles. Les actions Consulter, Décider et Exécuter correspondent à des permissions distinctes. |
| Configuration autorisée | Types de demande pour ce module. La publication d’un type ne donne aucun droit sur les opérations métier. |
| Accès retiré ou ressource restreinte | Le serveur revérifie à l’ouverture, à la soumission, à la décision et à l’exécution. Les compteurs, pièces, suggestions IA et liens suivent le même périmètre. |

# Statuts, modales et retours

**Parcours avec approbation** · Brouillon → Soumise → En traitement → Approuvée ou Refusée. **Complément demandé** ramène le dossier en traitement après réponse. **Annulée** conserve le motif et l’historique. Après approbation, montrer séparément l’état d’exécution lorsque pertinent : À exécuter, En cours, Exécutée ou Échec à reprendre. Les types de service suivent leur circuit de résolution, sans étape d’approbation artificielle.

**Modales** · Demander un complément précise la question et son destinataire. Refuser indique un motif visible au demandeur. Approuver récapitule la décision et son effet. Annuler indique les conséquences. Activer ou désactiver un type récapitule le périmètre. Chaque confirmation affiche le résultat serveur et protège contre une double soumission.

**États à dessiner** · Chargement, aucun type disponible, liste vide, aucun résultat, pièce refusée, accès refusé, saisie conservée après erreur et conflit de mise à jour. En l’absence de traitant habilité, afficher À affecter aux gestionnaires autorisés. Utiliser des libellés de statut lisibles au clavier et indépendants de la couleur.

# IA et automatisation

Dans le traitement, confirmer produit, quantité et lieu souhaité. Le moteur calcule les disponibilités autorisées. L’IA explique les options réalisables et leurs hypothèses : remise locale, partielle, transfert ou réapprovisionnement. Afficher quantité et emplacement pour chaque option permise, et laisser le gestionnaire choisir.

L’approbation permet de préparer la remise. Une sortie confirmée diminue le stock. Une réception confirmée l’augmente. Une remise partielle laisse le reliquat visible.

L’interface distingue les données calculées, les suggestions IA et les valeurs confirmées. Présenter l’action Accepter ou Modifier avant utilisation. Si l’IA est indisponible, conserver le traitement manuel. Toute décision et tout effet métier disposent d’un historique et d’une protection contre les doubles exécutions.

# Parcours entre modules

Un ticket Support peut déclencher un retour lié et le demandeur suit le statut partageable. L’ouverture d’une dépense d’achat et le rapprochement réception–facture sont des liaisons proposées.

# Vérification du prototype

- Soumettre « Dix claviers pour la salle de formation » en utilisant les quatre champs prévus. Le demandeur retrouve la référence et le statut dans Mes demandes.

- Ouvrir avec des permissions différentes : vérifier la visibilité des vues, pièces et actions, y compris l’accès direct au détail.

- Demander une précision, répondre puis traiter la demande sur la même référence. Vérifier le motif de refus et la confirmation de succès.

- Tester l’indisponibilité de l’IA, une double soumission et un effet métier échoué. La reprise conserve la décision et évite les doublons.

- Pour dix claviers demandés et six disponibles localement, le gestionnaire voit six unités disponibles. Les quatre restantes ne sont promises qu’après vérification d’une autre source.

## Appel à l’API LLM

Le serveur vérifie la permission sur la ressource avant de préparer l’appel. Il transmet les champs nécessaires à la suggestion affichée. Les pièces jointes nécessitent une sélection explicite. La réponse structurée est contrôlée puis présentée comme brouillon modifiable. L’utilisateur confirme l’action métier avec ses propres permissions. En cas de délai dépassé ou de réponse invalide, la saisie manuelle reste disponible.
