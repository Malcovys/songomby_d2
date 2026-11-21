# NEXORA — Spécification fonctionnelle du module Admin

**Statut du document** · Proposition de référence pour la conception et le développement. Les sept sections et les huit pages reprennent le périmètre retenu. Les champs, statuts et interactions proposés ci-dessous servent de base de validation.

## 1. Objectif et navigation

Le module Admin permet d’administrer les comptes de l’entreprise, sa structure et les accès aux modules RH, Comptabilité, Stock et Support. Il donne aussi accès à l’audit, à la configuration IA et à l’état du système.

| Entrée du menu | Pages | Route proposée |
| - | - | - |
| Accueil Admin | Accueil | `/admin` |
| Utilisateurs | Liste et fiche utilisateur | `/admin/users`, `/admin/users/:id` |
| Départements et équipes | Une page avec deux onglets | `/admin/structure` |
| Permissions | Une page avec deux onglets | `/admin/permissions` |
| Audit et historique | Journal avec panneau de détail | `/admin/audit` |
| Configuration de l’IA | Fournisseur, usages et tests | `/admin/ai` |
| État du système | Services et sauvegardes | `/admin/system` |

Les écrans de création et d’édition s’ouvrent dans un **panneau latéral** quand le formulaire comporte plusieurs champs. Les **modales** servent aux confirmations courtes qui ont un effet sur un compte, des droits ou une configuration partagée. Les détails consultés depuis un tableau s’ouvrent dans un panneau, en conservant les filtres et la pagination.

## 2. Contenu et comportements par page

### 2.1 Accueil Admin

| Partie | Contenu affiché | Interaction |
| - | - | - |
| En-tête | Titre, date de dernière mise à jour et raccourcis selon les droits | **Créer un compte**, **Gérer les permissions**, **Consulter l’audit** |
| Comptes | Nombre de comptes actifs, désactivés et en attente de première connexion | Ouvrir la liste avec le filtre correspondant |
| Situations à examiner | Événements récents de sécurité, service dégradé ou indisponible, sauvegarde échouée si l’état remonte. Chaque ligne affiche le sujet, le niveau, l’heure et la source | Ouvrir l’événement dans **Audit** ou le service dans **État du système** |
| Changements d’accès récents | Date, auteur, utilisateur ou groupe concerné, changement résumé | Ouvrir le détail dans le journal |
| État des services | État de l’API, de la base, des traitements en arrière-plan, du stockage et de l’IA | Ouvrir **État du système** |

**Modales** · La création d’un compte réutilise le panneau d’Utilisateurs. Les autres interactions ouvrent la page ou le détail correspondant.

**États** · Disponibilité à reprendre depuis le service source. Afficher « Aucun événement à examiner » lorsque la liste est vide. En cas d’échec d’un seul bloc, afficher son erreur localement et laisser les autres blocs disponibles. Une information inaccessible par permission reste masquée.

### 2.2 Utilisateurs

| Partie | Contenu affiché | Interaction |
| - | - | - |
| En-tête | Titre, nombre de comptes correspondant aux filtres, bouton **Créer un compte** | Ouvrir le panneau de création |
| Recherche et filtres | Nom ou e-mail, statut, département, équipe | Rechercher, combiner les filtres, effacer les filtres |
| Tableau | Nom, e-mail professionnel, département, équipe, statut, dernière connexion | Trier, paginer, ouvrir la fiche d’un compte |
| Menu de ligne | Actions disponibles selon le statut et les permissions | Ouvrir la fiche, désactiver ou réactiver le compte |

**Panneau « Créer un compte »** · Prénom, nom, e-mail professionnel, identifiant de connexion si distinct de l’e-mail, département, équipe et modalités de première connexion. Le lien vers une fiche RH est facultatif lorsqu’une fiche existe. L’équipe proposée doit appartenir au département sélectionné. L’identifiant de connexion doit être unique. Les rattachements proposés sont limités au périmètre de l’administrateur. Après création, afficher le statut du compte et un lien vers sa fiche.

**Modales** · **Désactiver le compte** et **Réactiver le compte**, partagées avec la fiche utilisateur. Une création réussie peut ouvrir le panneau court **Identifiants de première connexion** si le système génère un mot de passe provisoire. Il contient le mot de passe affiché une seule fois, une action de copie et le bouton **Terminer**.

**États** · Afficher « Jamais connecté » si aucune connexion réussie n’existe. Prévoir « Aucun compte dans ce périmètre » et « Aucun résultat pour ces filtres ». Les statuts de compte sont définis en section 4.

### 2.3 Fiche utilisateur

| Partie | Contenu affiché | Interaction |
| - | - | - |
| En-tête | Nom complet, e-mail, statut, département et équipe, dernière connexion | **Modifier le profil**, **Réinitialiser le mot de passe**, **Désactiver** ou **Réactiver** selon le statut |
| Profil et rattachement | Identité, identifiant de connexion, département, équipe, responsable si renseigné et lien vers la fiche RH si autorisé | Modifier les champs autorisés dans un panneau |
| Accès | Groupes et permissions effectives. Pour chaque droit, afficher le module, la ressource, l’action, le périmètre et la source | **Gérer les accès** ouvre Permissions avec l’utilisateur présélectionné |
| Historique | Création du compte, modifications, désactivations, réactivations et changements de droits visibles | Ouvrir le détail d’un événement ou le journal filtré sur ce compte |

**Modales** · **Réinitialiser le mot de passe**, **Désactiver le compte**, **Réactiver le compte**. Le mot de passe provisoire d’une réinitialisation suit le même traitement que celui de la création.

**Règles** · La désactivation révoque les sessions et conserve l’historique. La réactivation restaure l’accès au compte sous réserve des droits et des conditions de connexion en vigueur. L’interface présente la confirmation de l’action après la réponse du serveur. Le dernier Super Administrateur actif doit rester actif.

### 2.4 Départements et équipes

| Partie | Contenu affiché | Interaction |
| - | - | - |
| Onglet **Départements** | Arborescence, code, nom, département parent, responsable, statut, nombre d’équipes et de membres | Rechercher, créer, ouvrir, modifier, déplacer ou archiver |
| Détail d’un département | Nom, code, description, parent, responsable, sous-départements, équipes et membres | Modifier, ouvrir une équipe ou un membre. Afficher les dépendances avant un déplacement ou un archivage |
| Onglet **Équipes** | Nom, département, responsable, effectif et statut | Filtrer par département ou statut, créer ou ouvrir une équipe |
| Détail d’une équipe | Description, département, responsable et liste des membres | Modifier l’équipe, ajouter ou retirer des membres, archiver |

**Panneaux** · **Créer ou modifier un département** avec nom, code, description, parent et responsable. **Créer ou modifier une équipe** avec nom, département, description et responsable. **Gérer les membres** avec recherche des utilisateurs et liste des membres sélectionnés.

**Modales** · **Déplacer un département** affiche l’ancien et le nouveau parent ainsi que les éléments concernés. **Archiver un département ou une équipe** affiche les dépendances qui bloquent éventuellement l’action. Le serveur refuse les hiérarchies circulaires. La règle proposée exige la réaffectation des membres, des équipes et des sous-départements actifs avant d’archiver la structure qui les contient.

### 2.5 Permissions

| Partie | Contenu affiché | Interaction |
| - | - | - |
| Onglet **Groupes** | Nom, description, nombre de membres, modules couverts. Le détail affiche les membres et chaque droit associé | Créer ou modifier un groupe, ajouter ou retirer un membre, retirer un groupe après vérification de ses dépendances |
| Onglet **Accès individuels** | Sélecteur d’utilisateur, modules accessibles, ressources, actions, périmètres et dates de validité éventuelles | Filtrer par module, ressource ou décision. Accorder, retirer ou interdire un droit individuel selon habilitation |
| Détail d’une décision | Utilisateur, ressource ou objet, action, périmètre, résultat, source et règle déterminante | **Expliquer cet accès** affiche une reformulation IA du résultat calculé par le moteur |

**Panneaux** · **Créer ou modifier un groupe** avec nom, description et droits. **Modifier une permission** avec personne ou groupe, ressource, action, portée, effet et date de fin si applicable. Choisir un objet précis lorsqu’une décision dépend de cet objet. L’affichage d’un droit dans une matrice doit rendre visibles ses conditions.

**Modales** · **Appliquer un changement d’accès** récapitule la cible, le droit, le périmètre, l’effet et les conséquences connues. **Supprimer un groupe** présente ses membres et les accès associés. La règle proposée bloque la suppression d’un groupe qui contient encore des membres.

**Règles** · Le moteur ReBAC calcule la décision. Pour un compte ordinaire, une interdiction applicable prime sur une autorisation et l’absence d’autorisation applicable donne un refus. Retirer une autorisation retire cette source précise. Une autre source peut encore autoriser l’accès. Ajouter une interdiction applique une restriction explicite. Après enregistrement, recharger les droits effectifs et tracer le changement.

### 2.6 Audit et historique

| Partie | Contenu affiché | Interaction |
| - | - | - |
| Catégories | Activité administrative, connexions, sécurité, permissions, actions IA | Afficher les catégories que l’utilisateur peut consulter |
| Recherche et filtres | Période, catégorie, acteur, module ou ressource, résultat | Combiner les filtres, réinitialiser et conserver le contexte en ouvrant un événement |
| Tableau du journal | Horodatage, acteur, action, objet concerné et résultat | Trier du plus récent au plus ancien, paginer et ouvrir un événement |
| Détail d’un événement | Identifiant, heure, acteur, objet, résultat, motif éventuel et différences avant/après lorsqu’elles sont disponibles. Champs sensibles masqués | Fermer le panneau et retrouver le même tableau filtré |
| Export | Période, filtres et aperçu du périmètre exporté | Exporter seulement avec la permission requise et la vérification renforcée prévue par le socle de sécurité |

**Modale « Exporter le journal »** · Affiche la catégorie, la période, les filtres et le format disponible. Boutons **Annuler** et **Exporter**. L’archivage relève de la politique du socle d’audit. Son interface opérationnelle reste à valider.

**Règles** · Les événements sont en lecture seule. Aucun mot de passe, jeton, clé IA ou contenu brut de requête IA ne doit apparaître dans les détails et les exports.

### 2.7 Configuration de l’IA

| Partie | Contenu affiché | Interaction |
| - | - | - |
| Fournisseur | Fournisseur actif, nom de l’environnement ou URL de connexion si affichable, statut de configuration et date du dernier test. Pour un fournisseur externe, indiquer si un secret est configuré | Modifier la configuration et tester la connexion |
| Modèles par usage | Usage, module concerné, modèle associé et état de configuration. Les usages possibles incluent l’explication des accès, l’analyse de facture, le résumé de ticket et l’explication du risque de rupture | Choisir un modèle disponible pour un usage. Afficher les usages réellement pris en charge |
| Résultat du test | Fournisseur, modèle testé, date, résultat et message d’erreur exploitable | Relancer un test |
| Paramètres complémentaires | Quotas ou limites lorsqu’un mécanisme existe | Consulter ou modifier ces limites selon les droits |

**Panneau « Modifier la configuration IA »** · Fournisseur, paramètres de connexion, remplacement éventuel du secret et modèles par usage. Une valeur secrète déjà configurée reste masquée. Le bouton de test affiche clairement s’il teste la configuration active ou les valeurs en cours d’édition.

**Modale « Appliquer la configuration IA »** · Récapitule les changements et les usages concernés, notamment en cas de changement de fournisseur. Les actions **Tester la connexion** et **Appliquer** sont distinctes. Une erreur de sauvegarde laisse la configuration active en place.

### 2.8 État du système

| Partie | Contenu affiché | Interaction |
| - | - | - |
| Vue d’ensemble | État global, nombre de services contrôlés et heure du dernier relevé | Actualiser, filtrer les services selon leur état |
| Services | API, PostgreSQL, traitements en arrière-plan, Redis lorsqu’il est supervisé, stockage et fournisseur IA. Pour chaque service, afficher le nom, l’état, le dernier contrôle et le dernier succès si disponible | Ouvrir le détail d’un service |
| Détail d’un service | État, dernier contrôle, motif lisible, dernière réussite et référence d’incident si disponible | Consulter le détail et actualiser |
| Sauvegardes | Dernière tentative, dernière sauvegarde réussie, résultat et message d’erreur si disponible | Consulter le résultat ou son détail |

**Modales** · Aucune. Les détails s’ouvrent dans un panneau. La page est consultative, y compris lorsqu’un service est indisponible.

**Règles** · Distinguer un service indisponible d’un service dont la mesure est absente ou trop ancienne. Si une source ne transmet pas d’état de sauvegarde, afficher « Non supervisé ». Les diagnostics visibles doivent rester lisibles et masquer les secrets.

## 3. Inventaire des modales

| Modale | Contenu minimum | Effet attendu après confirmation |
| - | - | - |
| Désactiver un compte | Identité, conséquence sur l’accès, révocation des sessions | Statut **Désactivé**, sessions révoquées et audit enregistré |
| Réactiver un compte | Identité, statut actuel, conditions de connexion éventuelles | Compte réactivé, libellé ajusté selon l’état de première connexion |
| Réinitialiser le mot de passe | Identité, effet sur les sessions et changement obligatoire à la prochaine connexion | Mot de passe provisoire transmis selon le mécanisme établi, audit sans secret |
| Déplacer un département | Nom, parent actuel, nouveau parent, éléments concernés | Arborescence actualisée après validation serveur |
| Archiver une structure | Nom, type, éléments liés, blocage éventuel | Structure **Archivée** ou message expliquant le blocage |
| Appliquer un changement d’accès | Cible, droit actuel et futur, ressource, action et périmètre | Droits recalculés et changement visible dans l’audit |
| Supprimer un groupe | Nom, droits et présence de membres | Groupe supprimé si les règles le permettent |
| Exporter le journal | Catégorie, période, filtres et format | Export des événements autorisés |
| Appliquer la configuration IA | Fournisseur et usages touchés, résultat du dernier test lorsqu’il existe | Nouvelle configuration active et changement audité |

Toutes les modales affichent **Annuler** et un bouton libellé avec l’action réelle. Garder le focus dans la modale, rendre les erreurs accessibles au clavier et empêcher une soumission en double. Sur erreur, conserver la saisie et indiquer quoi corriger. Confirmer la réussite après réponse du serveur.

## 4. Statuts et états d’interface

| Objet | Libellés proposés | Règle d’affichage ou transition |
| - | - | - |
| Compte | **En attente de première connexion**, **Actif**, **Verrouillé temporairement**, **Désactivé** | La création place le compte en attente du premier accès. Le verrouillage temporaire résulte de la politique de connexion. Le statut **Désactivé** prime sur les autres états affichés. |
| Sécurité du compte | **Mot de passe à changer**, **Vérification renforcée non configurée** | Indicateurs complémentaires au statut du compte, à afficher lorsque les données et droits de lecture sont disponibles. |
| Département ou équipe | **Actif**, **Archivé** | La création donne l’état **Actif**. L’archivage retire la structure des sélecteurs courants et conserve les références historiques. |
| Décision d’accès | **Autorisé**, **Refusé**, **Condition requise** | Résultat calculé selon le périmètre et le contexte. La source du droit et la raison du résultat accompagnent le libellé. |
| Validité d’un droit | **À venir**, **En vigueur**, **Expiré** | Calculée à partir des dates de validité serveur. Une interdiction est un effet de règle, distinct de sa validité. |
| Événement d’audit | **Réussi**, **Refusé**, **Échoué**, **Enregistré** | Un refus métier et une erreur technique ont des libellés différents. **Enregistré** s’applique aux événements sans résultat d’exécution. |
| Configuration IA | **Non configurée**, **Configurée** | Un test échoué reste visible séparément. Il ne supprime pas une configuration existante. |
| Test IA | **Non testé**, **Test en cours**, **Réussi**, **Échoué** | Indiquer quel fournisseur ou modèle a été testé et à quelle date. |
| Service | **Opérationnel**, **Dégradé**, **Indisponible**, **État inconnu** | Calculé depuis les contrôles disponibles. Une mesure manquante ou trop ancienne donne **État inconnu**. |
| Sauvegarde | **Réussie**, **Échouée**, **En cours** si remonté, **Non supervisée** | Afficher le dernier résultat et la dernière réussite séparément. |

**États communs** · Chargement avec structure stable, liste vide, aucun résultat de recherche, accès refusé, erreur avec **Réessayer**, changement concurrent avec **Recharger**. Si une donnée ancienne reste affichée après un échec, conserver l’horodatage de la dernière mise à jour connue. Chaque statut combine texte et état visuel. Les tableaux, onglets, modales et panneaux restent utilisables au clavier.

## 5. Règles transversales, IA et automatisation

### Contrôle d’accès

| Section | Ressources de référence | Distinction à préserver |
| - | - | - |
| Utilisateurs | `IAM.USERS` | Consulter, créer, modifier, réinitialiser et désactiver sont des actions distinctes. La lecture des accès et de l’historique dépend aussi de leurs ressources. |
| Structure | `ORG.DEPARTMENTS`, `ORG.TEAMS` | Limiter la lecture et les modifications au périmètre autorisé. |
| Permissions | `IAM.GROUPS`, `IAM.PERMISSIONS` | Distinguer lecture, attribution de groupes et gestion des droits. |
| Audit | `AUDIT.LOGS`, `AUDIT.AUTHENTICATION`, `AUDIT.SECURITY`, `AUDIT.PERMISSIONS`, `AUDIT.AI_ACTIONS` | Lire et exporter sont des actions distinctes. |
| IA | `AI.SETTINGS` | L’utilisateur qui modifie la configuration doit avoir le droit de la gérer. |
| État du système | `SYSTEM.SETTINGS:read` selon la v2 | Vérifier également les droits avant de retourner les diagnostics. |

Le serveur vérifie les permissions à chaque lecture ou mutation. L’accueil et les recherches utilisent le même périmètre que les pages liées. Après une modification de compte, de structure ou de droit, recalculer les informations affectées et journaliser les changements sensibles avec leur auteur et leur résultat.

### Innovation IA · Expliquer un accès

L’administrateur sélectionne un utilisateur, une ressource et une action. Il choisit un objet précis quand le contexte l’exige. Le moteur produit la décision et les sources applicables. L’IA reçoit les éléments autorisés nécessaires à une reformulation et affiche une explication courte. Exemple. « Léa peut consulter les fiches RH de son département grâce au groupe RH. » Si l’IA est indisponible, la décision et les sources calculées restent visibles. L’explication est consultative.

### Automatisations

| Déclencheur | Traitement | Effet visible |
| - | - | - |
| Création d’un compte local | Appliquer le parcours de première connexion prévu | Statut initial et étape de changement de mot de passe si nécessaire |
| Désactivation d’un compte | Révoquer les sessions et journaliser l’action | Statut **Désactivé** et événement d’audit |
| Fin de validité d’un droit temporaire | Exclure le droit des décisions à partir de l’échéance | Droit **Expiré** et résultat d’accès recalculé |
| Modification de compte, de structure, d’accès ou de configuration IA | Journaliser l’action sensible avec les détails autorisés | Événement consultable depuis **Audit et historique** |
| Contrôle d’un service | Mettre à jour le résultat et l’heure du contrôle | État actualisé sur **État du système** et sur l’accueil selon les droits |

## 6. Critères d’acceptation

| Parcours | Résultat attendu |
| - | - |
| Accueil et navigation | Les sept entrées s’affichent selon les droits. Un raccourci ouvre le bon écran avec le filtre approprié. Les compteurs n’incluent pas de données hors périmètre. |
| Créer et administrer un compte | Un compte valide apparaît en liste et sa fiche est ouvrable. Un identifiant en doublon est refusé. Une désactivation révoque les sessions et conserve l’historique. |
| Gérer la structure | Un utilisateur habilité crée une équipe rattachée à un département. Un déplacement circulaire ou un archivage avec dépendances bloquantes est refusé et expliqué. |
| Gérer un accès | Une modification confirmée apparaît dans les droits effectifs et dans l’audit. Une ouverture directe de la page ou de l’action hors périmètre est refusée par le serveur. |
| Expliquer un droit | L’explication reprend le résultat du moteur et ses sources autorisées. Si le modèle ne répond pas, le résultat calculé reste consultable. |
| Consulter le journal | Les filtres sont conservés après fermeture du détail. L’export respecte le même périmètre et masque les champs sensibles. |
| Configurer l’IA | Un test affiche son contexte et son résultat. Une configuration enregistrée ne révèle aucun secret. Un échec de sauvegarde conserve la configuration active. |
| Consulter l’état du système | Une mesure périmée affiche **État inconnu**. Une panne d’un seul service laisse les autres états consultables. |

## 7. Propositions à valider et sources

- Les intitulés, routes, regroupements en onglets, champs et statuts constituent des choix de conception proposés.

- Les seuils de fraîcheur et de dégradation, la fréquence des contrôles et la remontée de l’état des sauvegardes dépendent de la supervision retenue.

- Les quotas IA, les formats d’export et l’archivage depuis l’interface dépendent des capacités du socle.

- La méthode de transmission du mot de passe provisoire et les rattachements obligatoires à la création doivent être fixés avant l’implémentation.

- Sources internes dans `docs.zip` · `04-rebac.md`, `05-matrice-permissions.md`, `06-authentification.md`, `07-espaces-de-travail.md`, `08-pages.md`, `14-ia-trust-layer.md` et `17-audit.md`. Le périmètre d’écrans suit les choix retenus pendant la refonte du module Admin.

# Complément de conception — demandes, permissions et IA

Le module Admin couvre comptes et permissions. Les permissions effectives déterminent les ressources et actions accessibles à chaque personne, dans le périmètre accordé. Le poste affiché sur la fiche collaborateur décrit sa fonction dans l’entreprise.

# Navigation et écrans métier

| Écran | Contenu et interactions à maquetter |
| - | - |
| Accueil Admin | Comptes actifs, accès à examiner, incidents et raccourcis filtrés par droits. |
| Utilisateurs | Liste, recherche, état, création, activation et désactivation. |
| Fiche utilisateur | Identité, rattachements, groupes, permissions effectives et historique. Réinitialiser un accès selon habilitation. |
| Départements et équipes | Arbre des unités, responsables et membres. Créer, déplacer ou archiver. |
| Permissions | Groupes, droits individuels, actions et périmètres. Examiner les sources, simuler et confirmer le changement. |
| Audit et historique | Acteur, ressource, date, changement et résultat. Rechercher et exporter selon ses droits. |
| Configuration IA | Fournisseur, modèles, test et configuration active. |
| État du système | Services, contrôles, sauvegardes et heure du dernier résultat. |

Ajouter **Demandes** à la navigation de Admin. Un utilisateur dont le seul droit est de soumettre un type de demande arrive directement dans **Mes demandes**. Les raccourcis de l’accueil et des fiches ouvrent la même demande et conservent sa référence.

# Demandes dans le module

Types proposés à configurer : **Accès à une ressource, modification d’un droit, création d’un compte**. Exemple de titre : **Accès temporaire aux factures du département Logistique**.

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

Le gestionnaire précise la ressource, l’action, le périmètre et la durée dans le panneau de traitement. Le moteur simule les droits effectifs avant et après. L’IA explique les différences et signale les droits supplémentaires apportés par un groupe. Afficher les règles sources et permettre de réviser la proposition.

L’approbation inscrit la décision. Une personne habilitée à accorder ce droit applique le changement. Afficher « Accès appliqué » après confirmation du moteur.

L’interface distingue les données calculées, les suggestions IA et les valeurs confirmées. Présenter l’action Accepter ou Modifier avant utilisation. Si l’IA est indisponible, conserver le traitement manuel. Toute décision et tout effet métier disposent d’un historique et d’une protection contre les doubles exécutions.

# Parcours entre modules

Depuis une embauche RH, préparer une demande de compte liée à la fiche collaborateur. Un changement d’équipe ouvre une revue des droits concernés. Dans Audit, exposer uniquement les métadonnées RH autorisées.

# Vérification du prototype

- Soumettre « Accès temporaire aux factures du département Logistique » en utilisant les quatre champs prévus. Le demandeur retrouve la référence et le statut dans Mes demandes.

- Ouvrir avec des permissions différentes : vérifier la visibilité des vues, pièces et actions, y compris l’accès direct au détail.

- Demander une précision, répondre puis traiter la demande sur la même référence. Vérifier le motif de refus et la confirmation de succès.

- Tester l’indisponibilité de l’IA, une double soumission et un effet métier échoué. La reprise conserve la décision et évite les doublons.

- Un agent peut demander un accès sans pouvoir l’accorder. Un droit de lecture accordé sur Logistique ne permet pas de valider une facture.

## Appel à l’API LLM

Le serveur vérifie la permission sur la ressource avant de préparer l’appel. Il transmet les champs nécessaires à la suggestion affichée. Les pièces jointes nécessitent une sélection explicite. La réponse structurée est contrôlée puis présentée comme brouillon modifiable. L’utilisateur confirme l’action métier avec ses propres permissions. En cas de délai dépassé ou de réponse invalide, la saisie manuelle reste disponible.
