Le module Support centralise les demandes internes, les réclamations clients et les incidents fournisseurs. Il comprend **7 entrées de menu et 9 pages internes**, ainsi que **3 pages dans le portail client**. Les routes, champs et transitions ci-dessous constituent une proposition de conception.

# Espace Support interne

## 1. Accueil Support · /support

- **Indicateurs** · Tickets urgents, non assignés, proches de l’échéance, en retard ou en attente de réponse. Afficher le périmètre actif et la date de mise à jour.

- **À traiter** · Liste courte avec sujet, priorité, équipe, responsable et prochaine échéance. Chaque indicateur ouvre la liste au bon filtre.

- **Actions** · Créer un ticket, ouvrir sa file d’attente ou reprendre un ticket récent. Un bloc indisponible affiche son erreur et une action de relance.

## 2. Tickets · /support/tickets

- **Vues** · Mes tickets, Mon équipe et À assigner. Ajouter une vue Tous les tickets autorisés si le périmètre de l’agent le justifie.

- **Tableau** · Référence, sujet, demandeur, type, catégorie, priorité, statut, équipe, responsable, dernière activité et prochaine échéance.

- **Filtres et actions** · Recherche par référence ou sujet, filtres par statut, priorité, équipe, type et délai. Trier, paginer, ouvrir un détail ou assigner un ticket.

- **Panneau Nouveau ticket** · Origine de la demande, sujet, description, demandeur, type, catégorie, priorité, ressource liée facultative et pièces jointes. Pour une saisie au nom d’un client ou fournisseur, préciser le contact et le canal d’origine. Si la catégorie n’est pas connue, laisser le ticket à qualifier.

## 3. Détail d’un ticket · /support/tickets/\:id

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Référence, sujet, demandeur, origine, statut, priorité, équipe, agent et échéances | Modifier la priorité, changer d’équipe ou assigner |
| Conversation | Messages partagés avec le demandeur, pièces accessibles, auteur et date | Rédiger une réponse, insérer une réponse type, joindre un fichier, envoyer |
| Notes internes | Notes réservées aux agents habilités, pièces internes et auteurs | Ajouter une note et des pièces via un champ identifié **Note interne** |
| Qualification | Type, catégorie, résumé IA, catégorie suggérée et justification courte | Relancer l’analyse, accepter ou modifier la catégorie suggérée |
| Règlement du ticket | Résolution, motif d’escalade éventuel et historique des décisions | Escalader, résoudre, fermer, rouvrir ou annuler selon le statut et les droits |
| Ressources liées | Client, produit, retour Stock, facture Comptabilité ou demande RH autorisée | Associer une ressource existante, la consulter ou retirer le lien |
| Historique | Changements de statut, d’affectation et de délais, horodatage et auteur | Filtrer et consulter les événements autorisés |

**Panneaux** · **Assigner ou transférer** affiche les équipes et agents habilités. **Lier une ressource** présente un sélecteur par module et une recherche filtrée par droits. **Insérer une réponse type** affiche un aperçu et les variables encore à compléter.

**Visibilité** · Le mode de rédaction indique clairement **Réponse au demandeur** ou **Note interne**, y compris pour les pièces. Avant l’envoi d’une réponse, afficher le destinataire ou le canal. Avec un canal externe non configuré, proposer un brouillon et signaler que le message n’a pas été envoyé.

## 4. Files d’attente · /support/queues

- **Charge par équipe** · Tickets en cours, non assignés, urgents et en retard. Afficher les agents visibles, leur charge et les capacités disponibles si renseignées.

- **Actions** · Filtrer par équipe et délai, ouvrir un ticket, assigner un agent ou transférer vers une équipe existante dans Admin.

- **Règles** · Avant un transfert, afficher l’équipe actuelle et la destination ainsi que l’effet sur le responsable. Si aucun agent n’est éligible dans l’équipe cible, le ticket reste dans sa file sans responsable.

## 5. Clients et contacts · /support/customers

- **Liste** · Nom ou raison sociale, contact principal, e-mail, téléphone si renseigné, nombre de tickets ouverts et dernière activité.

- **Recherche et filtres** · Nom, e-mail, statut de la fiche et présence de tickets ouverts.

- **Panneau Créer ou modifier un client** · Type de client, nom ou raison sociale, coordonnées et identifiant externe facultatif. Signaler les doublons potentiels et proposer d’ouvrir une fiche existante si elle est accessible.

## 6. Fiche client · /support/customers/\:id

- **Synthèse** · Identité, coordonnées, statut, interlocuteurs et indicateurs de demandes en cours.

- **Contacts** · Nom, fonction, e-mail, téléphone, contact principal et statut d’accès au portail si disponible. Actions pour ajouter ou modifier un contact.

- **Historique des demandes** · Sujet, référence, statut, date et responsable. Ouvrir une demande ou créer un ticket prérempli pour ce client.

- Les coordonnées de contact et l’accès au portail sont deux informations distinctes. Modifier une fiche contact ne doit pas activer automatiquement un accès.

## 7. Paramètres Support · /support/settings

| Onglet | Contenu | Actions |
| - | - | - |
| Catégories et affectation | Types de demande, catégories, équipe cible, priorité par défaut et état de la règle | Créer, modifier ou désactiver une catégorie ou sa règle |
| Délais de service | Délais de première réponse et de résolution, critères par priorité ou catégorie, horaires de service, seuils d’alerte | Configurer la règle et afficher les critères avant activation |
| Réponses types | Nom, catégorie, contenu, variables et état | Créer, modifier, prévisualiser ou désactiver un modèle |

En cas de règles d’affectation concurrentes, afficher la règle applicable et la priorité utilisée. Si aucune règle ne convient, le ticket reste visible dans **À assigner**. Pour les délais, préciser si les changements s’appliquent aux nouveaux tickets ou aux tickets déjà ouverts. **Proposition** · Appliquer les nouveaux paramètres aux nouveaux tickets et conserver la règle initiale sur les tickets ouverts.

## 8. Enquêtes de satisfaction · /support/surveys

- **Liste** · Nom, état, déclencheur, nombre d’envois et taux de réponse.

- **Éditeur** · Titre, questions, choix ou échelle, commentaire facultatif et règles d’envoi après résolution. Prévisualiser le formulaire client.

- **Résultats** · Nombre de réponses, score de satisfaction, répartition des notes et commentaires autorisés. Afficher la période et le nombre de réponses pris en compte.

- **Actions** · Créer un brouillon, publier, désactiver et consulter les résultats. Pour un même ticket et une même enquête, empêcher les envois et réponses en double si les règles prévoient une seule participation.

## 9. Rapports Support · /support/reports

- **Filtres** · Période, équipe, catégorie, priorité et origine.

- **Indicateurs** · Tickets créés et résolus, délai de première réponse, délai de résolution, proportion de délais respectés et taux de réouverture. Pour chaque mesure, afficher la période et la base de calcul.

- **Actions** · Comparer les périodes ou les équipes, ouvrir les listes correspondant aux résultats et exporter le périmètre autorisé. Afficher une valeur indisponible quand les données ne permettent aucun calcul.

# Portail client

## 1. Mes demandes · /portal/tickets

Liste des demandes autorisées avec référence, sujet, état, dernière réponse et date de mise à jour. Recherche par référence ou sujet, filtre par état, action **Nouvelle demande**. Les files internes, notes, règles d’affectation et indicateurs internes sont réservés à l’espace Support.

## 2. Nouvelle demande · /portal/tickets/new

Formulaire avec sujet, type proposé au client, description et pièces jointes. Afficher les formats et tailles acceptés. Après validation, afficher la référence et ouvrir le détail. Si l’envoi échoue, conserver le brouillon. Le système déduit l’identité du demandeur à partir de sa session.

## 3. Détail de ma demande · /portal/tickets/\:id

Référence, sujet, état, messages et documents partagés, interlocuteur Support si prévu et dates de mise à jour. Répondre, ajouter un fichier ou remplir l’enquête disponible. Si le ticket résolu accepte encore des réponses, afficher la règle de réouverture. Les messages et pièces internes sont filtrés avant l’envoi au portail.

# Modales et formulaires

| Modale | Informations à confirmer | Résultat |
| - | - | - |
| Assigner ou transférer | Ticket, équipe, agent et conséquence sur l’affectation | Affectation mise à jour et historique enregistré |
| Escalader | Motif, urgence et équipe ou responsable concerné | Escalade enregistrée et notification selon règle |
| Résoudre | Résumé de la résolution, message partagé éventuel et enquête prévue | Ticket marqué Résolu, échéance arrêtée et enquête planifiée si applicable |
| Fermer ou rouvrir | Statut courant, motif et effet sur les délais | Transition enregistrée et visible selon les droits |
| Annuler un ticket | Motif et conséquence sur le suivi | Ticket marqué Annulé et historique conservé |
| Publier ou désactiver une enquête | Version, déclencheur et destinataires concernés | État de publication mis à jour |
| Exporter un rapport | Période, filtres et format | Export du périmètre autorisé |

Les formulaires longs s’ouvrent dans des panneaux. Les modales de confirmation conservent la saisie en cas d’erreur et empêchent les soumissions répétées. Les commandes sont utilisables au clavier. L’état d’erreur indique quoi corriger ou réessayer.

# Statuts et états d’interface

| Objet | États proposés | Règle |
| - | - | - |
| Ticket interne | Nouveau, En cours, En attente du demandeur, En attente d’une équipe, Résolu, Fermé, Annulé | Une réouverture remet le ticket En cours et crée un événement. L’affectation et l’escalade apparaissent séparément. |
| Ticket côté client | Reçu, En cours, En attente de votre réponse, Résolu, Fermé, Annulé | Le libellé client résume le suivi sans exposer les états propres aux équipes. |
| Affectation | À assigner, Assigné | Une équipe peut être définie avant l’affectation à un agent. |
| Délai | Dans les temps, Échéance proche, Dépassé, Suspendu, Terminé | Suivre séparément la première réponse et la résolution. Une note interne ne compte pas comme réponse au demandeur. |
| Analyse IA | En cours, Suggestion disponible, Indisponible | L’agent peut qualifier le ticket manuellement à tout moment. |
| Enquête | Brouillon, Publiée, Désactivée | La désactivation bloque les futurs envois selon la règle retenue. Les résultats restent consultables selon les droits. |

Prévoir le chargement, les listes vides, l’absence de résultat, les erreurs et les accès refusés. Afficher états et priorités en texte. Les filtres sont restaurés au retour d’une fiche. La première réponse correspond à un message effectivement partagé. La règle v2 suspend le délai pendant l’attente d’une réponse du client. Le calcul de reprise et la fenêtre de réouverture restent à valider.

# IA, automatisation et accès

1. Un nouveau ticket est enregistré. L’IA propose un résumé et une catégorie à partir des éléments que l’utilisateur est autorisé à utiliser. Le texte d’un ticket et ses pièces constituent des données à analyser.

2. Un agent confirme la catégorie. Le système évalue la règle d’affectation et choisit une équipe ou laisse le ticket à assigner. Une modification de l’affectation reste traçable.

3. Le système surveille les délais, notifie l’équipe à l’approche de l’échéance et escalade selon la politique. Les notifications ne sont pas dupliquées lors d’une relance du traitement.

4. Un agent partage une réponse puis résout le ticket. Si une enquête est configurée, le système met le formulaire à disposition du client et envoie une notification par un canal configuré.

5. Le portail vérifie la session et la portée de la demande à chaque lecture et écriture, pièces jointes comprises. Les vues internes vérifient distinctement les droits de lire le ticket, lire les notes, répondre, affecter et modifier les paramètres. Un lien vers une facture, un retour ou une demande RH ne confère aucun droit sur la ressource liée.

# Critères d’acceptation

- Un ticket créé depuis le portail apparaît dans **Mes demandes** et dans la file interne autorisée.

- Une catégorie IA peut être corrigée. La règle utilise la catégorie confirmée. Si aucun routage ne s’applique, le ticket reste **À assigner**.

- Une note ou une pièce interne est inaccessible depuis le portail, y compris via un accès direct à sa ressource. Un client ne peut consulter aucun ticket hors de son périmètre.

- Une note interne ne déclenche pas le calcul de première réponse. Un message partagé le déclenche une seule fois.

- L’agent peut résoudre un ticket et le client voit la résolution. Une enquête activée devient disponible sans envoi dupliqué.

- Une affectation, une escalade et une réouverture laissent une trace. Les tableaux, rapports et exports respectent le périmètre utilisateur.

# Points à valider

- Mode d’activation des accès au portail et portée de lecture d’un contact au sein d’un même client.

- Canaux réellement disponibles pour répondre aux demandes enregistrées par un agent et pour notifier les clients.

- Calendrier de service, suspension et reprise des délais, fenêtre de réouverture et politique de clôture automatique.

- Critères de priorité, résolution des conflits de routage et règles de publication des enquêtes.

Sources internes dans docs.zip · 13-module-crm-support.md et 08-pages.md.

# Complément de conception — demandes, permissions et IA

Le module Support couvre tickets et portail client. Les permissions effectives déterminent les ressources et actions accessibles à chaque personne, dans le périmètre accordé. Le poste affiché sur la fiche collaborateur décrit sa fonction dans l’entreprise.

# Navigation et écrans métier

| Écran | Contenu et interactions à maquetter |
| - | - |
| Accueil Support | Priorités, tickets urgents, échéances et demandes non assignées. |
| Tickets | Mes tickets, équipe et file à assigner. Recherche, filtres et ouverture du détail. |
| Détail ticket | Conversation publique, notes internes, ressources liées, délai, historique et décision. |
| Files d’attente | Charge, affectation et transfert vers une équipe habilitée. |
| Clients et contacts | Coordonnées, interlocuteurs et tickets ouverts. |
| Fiche client | Contacts, historique et création pour un demandeur autorisé. |
| Paramètres Support | Routage, délais et réponses types. Les types soumis par les utilisateurs sont configurés dans Types de demande. |
| Enquêtes | Création, publication et résultats de satisfaction. |
| Rapports | Volumes, délais, réouvertures et export. |
| Portail — Mes demandes | Uniquement les demandes visibles pour le contact connecté. |
| Portail — Nouvelle demande | Même formulaire simple, types publiés pour ce public. |
| Portail — Détail | Messages et fichiers explicitement partagés, état et enquête. |

Ajouter **Demandes** à la navigation de Support. Un utilisateur dont le seul droit est de soumettre un type de demande arrive directement dans **Mes demandes**. Les raccourcis de l’accueil et des fiches ouvrent la même demande et conservent sa référence.

# Demandes dans le module

Types proposés à configurer : **Assistance, incident, intervention, réclamation**. Exemple de titre : **Imprimante indisponible en salle de formation**.

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

L’IA résume et propose une catégorie. Pour l’agent, elle recherche les tickets similaires autorisés et présente les solutions précédentes avec leurs liens sources. Afficher « Aucun cas pertinent » si nécessaire. L’agent choisit la réponse et confirme sa visibilité.

La soumission crée un seul ticket portant la référence de la demande. Le routage recherche une équipe habilitée. Résoudre ou fermer le ticket alimente le suivi de la demande. L’enquête est déclenchée selon configuration.

L’interface distingue les données calculées, les suggestions IA et les valeurs confirmées. Présenter l’action Accepter ou Modifier avant utilisation. Si l’IA est indisponible, conserver le traitement manuel. Toute décision et tout effet métier disposent d’un historique et d’une protection contre les doubles exécutions.

# Parcours entre modules

Depuis un incident matériel, lier ou créer un retour Stock. Depuis une réclamation sur une facture, demander l’examen en Comptabilité. Seule la conclusion partageable est exposée au demandeur.

# Vérification du prototype

- Soumettre « Imprimante indisponible en salle de formation » en utilisant les quatre champs prévus. Le demandeur retrouve la référence et le statut dans Mes demandes.

- Ouvrir avec des permissions différentes : vérifier la visibilité des vues, pièces et actions, y compris l’accès direct au détail.

- Demander une précision, répondre puis traiter la demande sur la même référence. Vérifier le motif de refus et la confirmation de succès.

- Tester l’indisponibilité de l’IA, une double soumission et un effet métier échoué. La reprise conserve la décision et évite les doublons.

- Un client ne reçoit jamais les notes ni les pièces internes. Créer une demande depuis le portail et la retrouver en file agent donne le même dossier.

## Appel à l’API LLM

Le serveur vérifie la permission sur la ressource avant de préparer l’appel. Il transmet les champs nécessaires à la suggestion affichée. Les pièces jointes nécessitent une sélection explicite. La réponse structurée est contrôlée puis présentée comme brouillon modifiable. L’utilisateur confirme l’action métier avec ses propres permissions. En cas de délai dépassé ou de réponse invalide, la saisie manuelle reste disponible.
