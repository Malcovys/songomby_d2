# NEXORA — Spécification fonctionnelle du module Comptabilité

**Statut** · Document de travail. Les dix pages reprennent le périmètre retenu. Les routes, champs, statuts et règles précisés ci-dessous constituent une proposition de conception. L’import des factures clients et le plan comptable préconfiguré sont les hypothèses de départ.

## 1. Objectif et navigation

L’espace Comptabilité permet de contrôler les factures, de préparer et valider les écritures, de suivre les règlements, puis de piloter les soldes, les dépenses, les budgets et les prévisions.

| Entrée du menu | Pages | Route proposée |
| - | - | - |
| Accueil Comptabilité | Tableau de bord | `/finance` |
| Factures | Liste et détail | `/finance/invoices`, `/finance/invoices/:id` |
| Journal comptable | Liste et détail des écritures | `/finance/accounting/journal`, `/finance/accounting/journal/:id` |
| Paiements et encaissements | Liste et détail en panneau | `/finance/payments` |
| Trésorerie | Soldes, recettes et dépenses, prévisions | `/finance/treasury` |
| Demandes de dépense | Liste et détail en panneau | `/finance/expenses` |
| Budgets | Liste et détail en panneau | `/finance/budgets` |
| Rapports | Résultat, flux et budget comparé au réalisé | `/finance/reports` |

**Parcours principal** · Importer une facture fournisseur → vérifier les données et les alertes → valider la facture → créer une échéance et une écriture brouillon → valider l’écriture → suivre le règlement.

## 2. Contenus et actions par page

### 2.1 Accueil Comptabilité

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Périmètre autorisé, période des indicateurs et date de mise à jour | Choisir la période. Ouvrir **Importer une facture** |
| Trésorerie | Solde enregistré, date de référence et répartition par compte autorisé | Ouvrir **Trésorerie → Soldes** |
| Factures et échéances | Nombre de factures à contrôler, montants fournisseur à payer et client à encaisser, échéances proches et retards | Ouvrir l’onglet Factures et le filtre correspondant |
| Approbations | Paiements et demandes de dépense en attente de décision | Ouvrir la liste **À approuver** |
| Journal et budgets | Écritures brouillon à valider, budgets proches du plafond ou dépassés | Ouvrir la file d’écritures ou le budget concerné |

**États** · Zéro indique un résultat calculé. **Donnée indisponible** indique une source manquante. Si un bloc échoue, proposer de le recharger et laisser les autres utilisables. Les raccourcis réutilisent les formulaires et détails du module.

### 2.2 Factures

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Onglets | **Fournisseurs** et **Clients**, chacun avec ses compteurs | Basculer et ouvrir l’import correspondant |
| Filtres | Date, tiers, référence, état de traitement, règlement, échéance et alertes | Rechercher, trier, paginer, effacer les filtres |
| Tableau | Tiers, numéro, date, échéance, montant, devise, reste à régler, état de traitement et de règlement | Ouvrir le détail. Filtrer les factures échues ou à contrôler |
| Import récent | Nom du fichier, résultat de l’import et date | Ouvrir la facture, relancer l’extraction fournisseur si une erreur récupérable survient |

**Panneau « Importer une facture »** · Type fournisseur ou client, fichier d’origine, tiers existant s’il est connu. Afficher les formats de fichier pris en charge par le serveur, ainsi que la limite de taille. Pour un fournisseur, créer une facture à contrôler et lancer l’extraction. Pour un client, l’hypothèse retenue est l’import d’un document existant, suivi d’une saisie ou d’une vérification des champs requis.

**États** · Prévoir rejet du fichier, extraction en cours, échec récupérable et doublon potentiel. En cas de doublon, donner accès à la facture existante si elle est visible. Un échec d’extraction permet la saisie manuelle sans réimport.

### 2.3 Détail d’une facture

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Référence, tiers, type, états de traitement et de règlement, montant, devise et échéance | Revenir à la liste filtrée. Valider ou rejeter selon les droits |
| Document | Visionneuse du fichier original, pagination et zoom selon le format | Consulter ou télécharger si autorisé |
| Champs et contrôle | Tiers, numéro, dates, échéance, lignes, montants hors taxe, taxes et total selon le document. Indiquer les valeurs proposées par l’IA et les champs manquants | Corriger, enregistrer ou relancer l’extraction si la facture est modifiable |
| Alertes | Incohérence des totaux, doublon, tiers inconnu et écart de coordonnées bancaires quand un référentiel existe. Pour chaque alerte, afficher le champ concerné, la gravité et la résolution attendue | Examiner, corriger ou rejeter. Résoudre une alerte selon la règle métier et l’habilitation |
| Suivi | Reste à régler, règlements liés, écriture liée et historique | Ouvrir l’écriture ou le règlement et lancer l’enregistrement d’un règlement |

**Modales** · **Valider la facture** récapitule tiers, référence, total et échéance. Pour un fournisseur, elle annonce la création d’une écriture brouillon. **Rejeter la facture** demande un motif. Les alertes bloquantes doivent être résolues avant validation. La date d’échéance et le statut **En retard** restent visibles indépendamment de l’état du règlement.

### 2.4 Journal comptable

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête et filtres | Période, journal, compte, origine et statut | Filtrer, rechercher une référence et ouvrir **Nouvelle écriture** |
| Tableau | Date comptable, numéro, journal, libellé, totaux débit et crédit, source et statut | Trier, ouvrir une écriture, accéder à la pièce source selon les droits |
| Totaux de la vue | Débit et crédit pour les écritures filtrées, avec statut et période pris en compte | Vérifier le périmètre des totaux |

**Panneau « Nouvelle écriture »** · Date, journal, libellé, pièce source facultative ou obligatoire selon le journal, puis lignes avec compte, libellé, débit ou crédit et rattachement analytique si configuré. Préremplir les champs issus d’une facture quand l’utilisateur arrive depuis cette facture. L’enregistrement en brouillon laisse la validation pour le détail.

### 2.5 Détail d’une écriture

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Référence, date comptable, journal, statut et source | Modifier le brouillon ou ouvrir la pièce source |
| Lignes | Comptes, libellés, débits, crédits, totaux et écart éventuel | Modifier les lignes en brouillon, lancer la validation |
| Historique | Créateur, validateur, dates et liens avec les écritures de correction | Consulter le détail d’une écriture liée |

**Modales** · **Valider l’écriture** présente les totaux et la date comptable. **Préparer une contre-passation** demande le motif et la date proposée puis crée un brouillon lié qui inverse les lignes de l’écriture initiale. Ce brouillon suit la même validation que toute écriture.

**Règles** · La validation exige une écriture équilibrée, des comptes actifs et une date admissible. Après validation, les lignes sont conservées. Si une contre-passation est déjà validée, empêcher qu’un second brouillon produise la même correction. Le plan comptable et les périodes autorisées sont fournis par la configuration de départ.

### 2.6 Paiements et encaissements

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Onglets et filtres | **Paiements fournisseurs** et **Encaissements clients**. Date, tiers, compte, statut et facture | Filtrer, rechercher et ouvrir **Enregistrer un règlement** |
| Liste | Référence, montant, devise, moyen, date prévue ou effective, tiers, factures associées et statut | Ouvrir le détail ou traiter un règlement en attente |
| Détail | Montant, compte, justificatif, affectations par facture, montant restant à affecter et historique | Affecter, soumettre à approbation, approuver ou refuser un paiement, confirmer l’exécution ou enregistrer la réception selon ses droits |

**Panneau « Enregistrer un règlement »** · Sens du mouvement, tiers, montant, devise, compte, moyen de règlement, référence, date prévue ou effective, justificatif et affectations aux factures. Afficher le reste à régler par facture et le total affecté. Autoriser un paiement partiel sur une facture validée. Vérifier les montants, la compatibilité de devise et les affectations déjà enregistrées lors de la confirmation.

**Modales** · **Approuver un paiement**, **Refuser un paiement** avec motif et **Confirmer un règlement effectif** avec date et référence. Le préparateur ne peut pas approuver son propre paiement. L’approbation autorise le paiement. Le mouvement de trésorerie naît de sa confirmation effective, y compris quand le paiement est exécuté hors de NEXORA.

### 2.7 Trésorerie

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Onglet **Soldes** | Solde enregistré par compte, devise, date de référence, solde d’ouverture et mouvements confirmés selon le détail disponible | Filtrer par compte et date, ouvrir les mouvements, ajouter ou modifier un compte si autorisé |
| Onglet **Recettes et dépenses** | Date, sens, catégorie, montant, compte, référence, pièce et origine du mouvement | Rechercher, filtrer par période et saisir un mouvement hors parcours facture et règlement |
| Onglet **Prévisions** | Solde de départ daté, hypothèses, entrées et sorties prévues, soldes estimés et scénarios | Créer ou comparer des scénarios, consulter la provenance d’un flux prévisionnel |

**Panneaux** · **Gérer un compte** avec libellé, devise, statut, solde d’ouverture daté et identifiant bancaire si requis. **Saisir un mouvement** avec sens, date, catégorie, compte, montant, devise, libellé et pièce. **Créer une prévision** avec horizon, compte ou périmètre, hypothèses et ajustements d’entrées ou de sorties.

**Règles** · Un règlement confirmé produit un seul mouvement de trésorerie. La saisie manuelle sert aux opérations qui ne suivent pas déjà ce parcours. Les prévisions séparent les flux attendus issus des échéances ou règlements planifiés des ajustements saisis. Quand une échéance et un paiement planifié décrivent le même flux, compter uniquement leur montant résiduel ou répartir les montants par date sans doublon. Les valeurs prévisionnelles portent le libellé **Estimé** et indiquent leurs hypothèses. Un solde enregistré affiche sa date de référence et sa source.

### 2.8 Demandes de dépense

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Onglets et filtres | **Mes demandes** et **À traiter** selon les droits. Département, demandeur, période et statut | Rechercher, filtrer, ouvrir **Nouvelle demande** |
| Liste | Référence, demandeur, département, catégorie, montant, date, approbateur et statut | Ouvrir le détail et reprendre un brouillon |
| Détail | Motif, montant, justificatifs, historique, décision et budget associé si applicable | Soumettre, approuver, refuser ou annuler selon le statut |

**Panneau « Nouvelle demande »** · Département, catégorie, objet, motif, montant, devise, date souhaitée et justificatif selon la règle applicable. Le système indique l’approbateur désigné ou signale un problème d’affectation.

**Modales** · **Approuver la demande**, **Refuser la demande** avec motif et **Annuler la demande**. Une demande approuvée autorise la dépense. Le flux de paiement et son mouvement restent suivis dans leurs sections respectives.

### 2.9 Budgets

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête et filtres | Département, catégorie, période et statut | Rechercher, filtrer et lancer une création |
| Tableau | Enveloppe approuvée, consommé, disponible et taux de consommation | Ouvrir le détail ou filtrer les dépassements |
| Détail | Lignes du budget, source du réalisé, révisions, historique, seuils et alertes éventuelles | Créer une révision, soumettre ou approuver selon les droits |

**Panneau « Créer ou réviser un budget »** · Département, période, lignes par catégorie, devise, montants et motif si révision. **Modale « Approuver le budget »** avec montant total, période et différence avec la dernière version approuvée. Jusqu’à l’approbation d’une révision, la dernière enveloppe approuvée sert au suivi.

**Hypothèse de calcul** · Le consommé correspond aux écritures validées rattachées à la période, au département et à la catégorie selon les règles de correspondance configurées. Le disponible correspond à l’enveloppe approuvée diminuée du consommé. Une demande approuvée peut apparaître séparément si le suivi des engagements est retenu.

### 2.10 Rapports comptables et financiers

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Périmètre | Période, département ou compte selon le rapport, devise et date de calcul | Appliquer ou réinitialiser les filtres |
| Résultat | Produits, charges et résultat calculés à partir des écritures validées selon le paramétrage des comptes | Ouvrir le détail autorisé |
| Flux de trésorerie | Recettes, dépenses et flux net calculés sur les mouvements confirmés | Comparer les périodes et ouvrir les mouvements |
| Budget et réalisé | Budget approuvé, réalisé et écart par département ou catégorie | Consulter le détail autorisé |
| Export | Rapport, filtres, devise, période et format disponible | Exporter avec la permission correspondante |

**Modale « Exporter le rapport »** · Récapituler le rapport, la période, le périmètre et le format. Préciser la base du calcul dans chaque rapport. Les comparaisons n’agrègent pas des montants de devises différentes sans règle de conversion définie.

## 3. Récapitulatif des modales

| Modale | Contenu à confirmer |
| - | - |
| Valider ou rejeter une facture | Référence, montants, alertes et conséquence de la validation. Motif obligatoire en cas de rejet |
| Valider une écriture | Date, journal, équilibre et pièce source |
| Préparer une contre-passation | Écriture d’origine, date proposée, motif et génération d’un brouillon |
| Approuver ou refuser un paiement | Tiers, montant, affectations, compte et motif en cas de refus |
| Confirmer un règlement effectif | Date, référence, montant et factures affectées |
| Approuver, refuser ou annuler une demande de dépense | Demande, montant, conséquence et motif en cas de refus |
| Approuver un budget | Période, enveloppe, changement de montant et version concernée |
| Exporter un rapport | Période, périmètre, format et rapport sélectionné |

Chaque action affiche son propre libellé de confirmation et conserve les données de saisie en cas d’erreur. Pendant l’envoi, empêcher une deuxième soumission. Les changements de statut s’affichent après confirmation du serveur. Les modales et panneaux sont utilisables au clavier et restituent le focus à leur fermeture.

## 4. Statuts et états d’interface

| Objet | Libellés proposés | Transition ou calcul |
| - | - | - |
| Traitement d’une facture | **Extraction en cours**, **Échec d’extraction**, **À contrôler**, **Validée**, **Rejetée** | L’extraction fournisseur mène à **À contrôler** ou à un échec récupérable. La décision humaine valide ou rejette. |
| Règlement d’une facture validée | **À régler**, **Partiellement réglée**, **Réglée** | Calcul à partir des affectations de règlements confirmés. **En retard** est un indicateur supplémentaire pour une facture avec reste à régler et échéance dépassée. |
| Écriture | **Brouillon**, **Validée**, **Contre-passée** | L’écriture d’origine devient **Contre-passée** après validation de son écriture inverse. Les deux restent visibles. |
| Paiement fournisseur | **Brouillon**, **À approuver**, **Approuvé**, **Refusé**, **Effectué** | La confirmation d’exécution intervient après l’approbation. |
| Encaissement | **Brouillon**, **Reçu** | Le solde et les factures liées sont mis à jour à la confirmation de la réception. |
| Demande de dépense | **Brouillon**, **À traiter**, **Approuvée**, **Refusée**, **Annulée** | L’action visible dépend du statut et du droit de décider. |
| Budget ou révision | **Brouillon**, **À approuver**, **Approuvé** | La version approuvée sert de référence jusqu’à la prochaine approbation. **Proche du plafond** et **Dépassé** sont des alertes calculées. |
| Prévision | **Estimé** | Afficher l’horizon, le solde de départ, la date de calcul et les hypothèses. |

**États communs** · Chargement, liste vide, aucun résultat, accès refusé, erreur récupérable et modification concurrente. Un statut est lisible en texte. Préserver les filtres lors du retour depuis un détail. Afficher chaque montant avec sa devise.

## 5. Permissions, IA et automatisation

- Vérifier côté serveur les droits de lecture, de création, de validation, d’approbation et d’export. Le périmètre s’applique aux listes, pièces, compteurs et rapports. La v2 fournit notamment `FIN.ACCOUNTING`, `FIN.PAYMENTS`, `FIN.TREASURY`, `FIN.TRANSACTIONS`, `FIN.EXPENSES`, `FIN.BUDGETS`, `FIN.FORECASTS` et `FIN.REPORTS`. Le rattachement des permissions de facture s’adapte au déplacement fonctionnel depuis Ventes sur la base du référentiel existant.

- L’IA extrait les champs de la facture fournisseur. Le système exécute les contrôles de cohérence à partir des données disponibles. Le comptable vérifie les valeurs à la source et décide. Une saisie manuelle reste disponible si l’extraction échoue.

- Valider une facture fournisseur déclenche la création de son échéance et de son écriture brouillon. Une relance conserve une seule échéance et un seul brouillon pour cette validation. Si la préparation échoue, afficher l’erreur et permettre la reprise autorisée.

- Confirmer un règlement met à jour ses affectations, les restes à régler et le mouvement associé. Traiter ces effets ensemble et empêcher qu’une relance ou une confirmation concurrente double le mouvement.

- Journaliser les validations, refus, contre-passations, changements de budget et confirmations de règlement avec l’auteur, la date et les références. Restreindre l’accès aux données bancaires et aux justificatifs.

## 6. Critères d’acceptation

| Parcours | Résultat attendu |
| - | - |
| Accueil | Les compteurs respectent le périmètre utilisateur et ouvrent les listes avec les bons filtres. |
| Factures | Une extraction réussie affiche la pièce et les champs proposés. En cas d’échec, la saisie manuelle permet de poursuivre. Une alerte bloquante empêche la validation tant qu’elle est ouverte. |
| Facture vers journal | Deux tentatives de validation de la même facture créent au plus un brouillon et une échéance. |
| Journal | Une écriture déséquilibrée reste en brouillon. Une contre-passation validée conserve le lien avec l’original. |
| Paiements et encaissements | Le préparateur ne peut s’auto-approuver. Un règlement partiel réduit correctement le reste à régler après confirmation effective. |
| Trésorerie et prévisions | La confirmation d’un règlement n’ajoute qu’un mouvement. Un même flux attendu n’est compté qu’une fois dans un scénario. |
| Demandes de dépense | La décision est tracée. Le refus conserve son motif. L’approbation seule ne modifie pas le solde de trésorerie. |
| Budgets | Une révision non approuvée ne remplace pas l’enveloppe active. Le réalisé se calcule avec la règle convenue. |
| Rapports | Les rapports et exports utilisent les mêmes filtres, sources et permissions. |

## 7. Points à valider

- Origine et procédure d’import des factures clients, ainsi que propriétaire du référentiel clients et fournisseurs.

- Comptes et journaux préconfigurés, règles d’imputation des factures, dates admissibles et règles de correction.

- Seuils de contrôle, justificatifs et personnes habilitées à traiter les alertes.

- Origine des soldes d’ouverture, devises prises en charge, politique éventuelle de conversion et horizon de prévision.

- Règles de rattachement du réalisé et des engagements aux budgets, formats d’export et définitions des indicateurs.

- Sources internes de `docs.zip` · `05-matrice-permissions.md`, `08-pages.md`, `12-module-finance.md`, `14-ia-trust-layer.md`, `15-workflows.md` et `20-flows-utilisateurs.md`. L’organisation des écrans suit le périmètre de la refonte.

# Complément de conception — demandes, permissions et IA

Le module Comptabilité couvre factures, règlements et budgets. Les permissions effectives déterminent les ressources et actions accessibles à chaque personne, dans le périmètre accordé. Le poste affiché sur la fiche collaborateur décrit sa fonction dans l’entreprise.

# Navigation et écrans métier

| Écran | Contenu et interactions à maquetter |
| - | - |
| Accueil Comptabilité | Soldes, factures à contrôler, paiements et écritures à valider. |
| Factures | Onglets clients et fournisseurs, import, échéances et reste à régler. |
| Détail facture | Original, données extraites, anomalies, règlements et écritures liés. |
| Journal comptable | Liste par période, compte, source et statut. |
| Détail écriture | Lignes, équilibre, validation et contre-passation tracée. |
| Paiements et encaissements | Tiers, affectations, approbation et confirmation du mouvement effectif. |
| Trésorerie | Soldes, recettes, dépenses et scénarios de prévision. |
| Demandes de dépense | Vue filtrée de la rubrique Demandes. Une référence et un historique pour les deux accès. |
| Budgets | Enveloppes, réalisé, disponible et révisions. |
| Rapports | Résultat, flux et budget comparé au réalisé, avec filtres et export. |

Ajouter **Demandes** à la navigation de Comptabilité. Un utilisateur dont le seul droit est de soumettre un type de demande arrive directement dans **Mes demandes**. Les raccourcis de l’accueil et des fiches ouvrent la même demande et conservent sa référence.

# Demandes dans le module

Types proposés à configurer : **Dépense, remboursement, avance de frais**. Exemple de titre : **Remboursement du trajet chez le fournisseur**.

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

L’IA lit le justificatif et prépare titre et motif. Dans le détail de traitement, afficher montant, devise, date et tiers proposés avec leur source. Le comptable corrige les valeurs. Le système vérifie doublons et budget autorisé. Conserver aussi l’extraction sur les factures.

Une approbation autorise une dépense. Le règlement est préparé puis approuvé selon les droits. Seule sa confirmation effective crée le mouvement de trésorerie.

L’interface distingue les données calculées, les suggestions IA et les valeurs confirmées. Présenter l’action Accepter ou Modifier avant utilisation. Si l’IA est indisponible, conserver le traitement manuel. Toute décision et tout effet métier disposent d’un historique et d’une protection contre les doubles exécutions.

# Parcours entre modules

Un ticket Support peut référencer une facture. Deux liaisons proposées restent à arbitrer : comparer une réception Stock à la facture et ouvrir une demande de dépense depuis un besoin de matériel.

# Vérification du prototype

- Soumettre « Remboursement du trajet chez le fournisseur » en utilisant les quatre champs prévus. Le demandeur retrouve la référence et le statut dans Mes demandes.

- Ouvrir avec des permissions différentes : vérifier la visibilité des vues, pièces et actions, y compris l’accès direct au détail.

- Demander une précision, répondre puis traiter la demande sur la même référence. Vérifier le motif de refus et la confirmation de succès.

- Tester l’indisponibilité de l’IA, une double soumission et un effet métier échoué. La reprise conserve la décision et évite les doublons.

Un justificatif illisible laisse la saisie manuelle disponible. Une dépense approuvée conserve le même solde de trésorerie jusqu’au règlement effectif.

## Appel à l’API LLM

Le serveur vérifie la permission sur la ressource avant de préparer l’appel. Il transmet les champs nécessaires à la suggestion affichée. Les pièces jointes nécessitent une sélection explicite. La réponse structurée est contrôlée puis présentée comme brouillon modifiable. L’utilisateur confirme l’action métier avec ses propres permissions. En cas de délai dépassé ou de réponse invalide, la saisie manuelle reste disponible.
