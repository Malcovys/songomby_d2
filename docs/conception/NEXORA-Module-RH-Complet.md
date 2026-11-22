# NEXORA — Spécification fonctionnelle du module RH

**Statut** · Document de travail. Les fonctions et les neuf pages suivent le périmètre retenu. Les champs, libellés et règles signalés comme proposés servent de base à la conception.

## 1. Objectif et navigation

Le module RH rassemble les dossiers des collaborateurs, les contrats, les congés et absences, les postes, le recrutement et le suivi des effectifs. Les gestionnaires RH interviennent selon leur périmètre. Le responsable traite les demandes qu’il est habilité à approuver. Le collaborateur consulte son solde et soumet ses demandes depuis **Mes congés** dans son espace personnel.

| Entrée du menu | Pages | Route proposée |
| - | - | - |
| Accueil RH | Tableau de bord | `/hr` |
| Collaborateurs | Annuaire et fiche collaborateur | `/hr/employees`, `/hr/employees/:id` |
| Contrats de travail | Liste, échéances et détail en panneau | `/hr/contracts` |
| Congés et absences | Demandes, calendrier et soldes | `/hr/leaves` |
| Postes et organigramme | Référentiel des postes et vue hiérarchique | `/hr/organization` |
| Recrutement | Liste des recrutements et suivi des candidatures | `/hr/recruitment`, `/hr/recruitment/:id` |
| Rapports RH | Indicateurs et exports | `/hr/reports` |

**Lien avec Admin** · Admin gère les comptes de connexion, les permissions, les départements et les équipes. RH utilise cette structure pour rattacher les collaborateurs, définir les postes et tenir à jour les liens hiérarchiques. Une fiche collaborateur peut exister sans compte et être liée à un compte existant.

## 2. Contenus et actions par page

### 2.1 Accueil RH

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Titre, périmètre affiché et date de mise à jour | Filtrer par département si plusieurs sont accessibles. Ouvrir **Créer un dossier** |
| Effectifs | Nombre de collaborateurs en activité et répartition par département | Ouvrir l’annuaire avec les filtres correspondants |
| Congés à traiter | Collaborateur visible, type autorisé, dates, nombre de jours et date de soumission | Ouvrir le détail d’une demande ou la liste **À traiter** |
| Absences à venir | Période, dates et nom visible selon les droits. Vue courte des prochains jours | Ouvrir le calendrier à la bonne période |
| Échéances | Contrats et documents arrivant à expiration, date et urgence. Chaque catégorie est visible selon les droits | Ouvrir le contrat ou l’onglet **Documents** de la fiche concernée |

**Modales** · Les raccourcis réutilisent les panneaux ou pages concernés. Si un bloc échoue, conserver les autres blocs et proposer une relance locale.

### 2.2 Collaborateurs

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Nombre de résultats, bouton **Créer un dossier** si autorisé | Ouvrir le formulaire |
| Recherche et filtres | Nom, matricule, département, équipe, poste et statut | Combiner et réinitialiser les filtres |
| Annuaire | Nom, matricule, poste, département, équipe, responsable et statut | Trier, paginer et ouvrir la fiche. Exporter l’annuaire filtré si autorisé |

**Panneau « Créer un dossier »** · Prénom, nom, matricule unique, e-mail professionnel si disponible, date d’entrée, poste, département, équipe, responsable et lien facultatif vers un compte existant. Les listes de postes et d’équipes dépendent du département. En cas de matricule déjà utilisé, afficher l’erreur au champ correspondant. Après création, ouvrir la fiche du collaborateur.

**États spécifiques** · Afficher « Aucun collaborateur dans ce périmètre » pour une liste vide et « Aucun résultat » après une recherche infructueuse. Un rattachement absent apparaît comme **Non renseigné**.

### 2.3 Fiche collaborateur

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Nom, matricule, poste, département, statut et présence éventuelle d’un compte lié | Modifier les informations professionnelles, revenir à l’annuaire |
| **Synthèse** | Date d’entrée, e-mail professionnel, poste, département, équipe, responsable | Modifier les champs autorisés et mettre à jour le rattachement |
| **Dossier personnel** | Coordonnées privées, adresse et contact d’urgence. Pour ce contact, afficher nom, lien et téléphone | Modifier les informations lorsque le droit distinct du dossier personnel est accordé |
| **Documents** | Nom, catégorie, date d’ajout, date d’expiration si applicable, état et auteur de l’ajout | Ajouter, prévisualiser, télécharger ou retirer un document selon les droits |
| **Contrats** | Contrat courant, historique, type, dates, statut et accès aux avenants | Ouvrir le détail du contrat. Utiliser le même formulaire que sur la page Contrats |
| **Congés** | Soldes par type, demandes récentes, dates et statuts | Consulter une demande ou ouvrir le module Congés avec ce collaborateur sélectionné |

**Panneaux** · **Modifier les informations professionnelles**, **Modifier le dossier personnel** et **Ajouter un document**. Pour un document, prévoir le fichier, son nom, sa catégorie et l’échéance si nécessaire. Afficher les formats et tailles acceptés par le serveur avant l’envoi.

**Modale « Retirer le document »** · Afficher le nom, le dossier concerné et l’effet du retrait. La disponibilité de l’action dépend des droits et des règles de conservation.

### 2.4 Contrats de travail

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Synthèse | Contrats actifs, échéances à venir et périodes d’essai proches du terme | Appliquer le filtre correspondant |
| Filtres | Collaborateur, département, type, statut et période d’échéance | Rechercher, filtrer et réinitialiser |
| Liste | Collaborateur, référence, type, date de début, date de fin, période d’essai et statut | Ouvrir un contrat ou lancer une création |
| Détail | Collaborateur, référence, période, statut, période d’essai, avenants, pièces liées et historique des actions | Créer un avenant, renouveler ou clôturer selon les droits |

**Panneaux** · **Créer un contrat** avec collaborateur, référence, type, dates, fin de période d’essai et document associé si disponible. **Ajouter un avenant** avec date d’effet, objet et document. **Renouveler** reprend le contrat concerné et permet de vérifier les nouvelles dates avant confirmation.

**Modales** · **Confirmer le renouvellement** et **Clôturer le contrat**. La modale de clôture demande le motif et la date d’effet. Le serveur valide la chronologie des dates et applique la règle d’un seul contrat actif par collaborateur. Un renouvellement conserve l’historique du contrat précédent.

### 2.5 Congés et absences

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Onglet **Demandes** | Collaborateur, type, dates, jours calculés, statut, date de soumission et approbateur si disponible | Filtrer par période, équipe, statut ou collaborateur. Ouvrir le détail, approuver ou refuser |
| Détail d’une demande | Dates, durée calculée, solde disponible pour le type concerné, chevauchements détectés, motif et justificatif si la lecture est autorisée, historique des décisions | **Résumer la demande**, **Approuver**, **Refuser** ou **Annuler** selon ses droits et le statut |
| Onglet **Calendrier** | Absences validées sur la période, personnes et équipes accessibles | Changer de période, filtrer et ouvrir le détail autorisé |
| Onglet **Soldes** | Collaborateur, période, type de congé, jours acquis, jours pris et solde disponible lorsqu’il est calculé | Filtrer et consulter les demandes associées |

**Parcours lié « Mes congés »** · Le collaborateur sélectionne un type de congé, renseigne ses dates, ajoute le motif ou le justificatif si la politique applicable le demande, puis vérifie le nombre de jours calculé avant d’envoyer. Il peut suivre la décision depuis son espace personnel.

**Modales** · **Approuver la demande** récapitule les dates et l’impact sur le solde. **Refuser la demande** exige un motif visible par le demandeur. **Annuler la demande** indique si le solde sera recrédité et si l’absence sera retirée du calendrier.

**Règles** · Le serveur vérifie les dates, le solde lorsque le type de congé en consomme et les chevauchements. Il revérifie au moment de l’approbation. Le demandeur ne peut pas approuver sa propre demande. Une approbation valide met à jour le calendrier et le solde applicable une seule fois. Le collaborateur peut annuler sa demande en attente. Si elle a déjà été approuvée, il peut l’annuler avant son début selon la règle v2, ce qui rétablit le solde applicable. Les vues d’équipe affichent les motifs et justificatifs uniquement aux personnes habilitées.

### 2.6 Postes et organigramme

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Onglet **Postes** | Intitulé, département, description, nombre de titulaires et statut | Rechercher, créer, modifier ou archiver un poste |
| Détail d’un poste | Intitulé, rôle dans l’entreprise, département et titulaires visibles | Modifier le poste et ouvrir les fiches des titulaires autorisés |
| Onglet **Organigramme** | Collaborateur, poste et liens hiérarchiques visibles dans le périmètre | Rechercher, déplier une branche, ouvrir une fiche |

**Panneau « Créer ou modifier un poste »** · Intitulé, département existant et description. Le responsable hiérarchique d’un collaborateur se modifie depuis sa fiche. Le serveur refuse une relation hiérarchique circulaire.

**Modale « Archiver un poste »** · Afficher les titulaires et recrutements ouverts associés. La règle proposée exige de réaffecter les titulaires et de traiter les recrutements ouverts avant l’archivage. Les références historiques restent consultables.

### 2.7 Recrutement

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Nombre de recrutements ouverts et bouton **Ouvrir un recrutement** | Ouvrir le formulaire de création |
| Filtres | Poste, département, recruteur et statut | Rechercher, filtrer et réinitialiser |
| Liste | Poste, département, recruteur, nombre de candidats visibles, date d’ouverture et statut | Ouvrir le suivi des candidatures, modifier le recrutement ou le clôturer |

**Panneau « Ouvrir un recrutement »** · Poste, département, recruteur responsable, description, date d’ouverture et date cible facultative. Utiliser les postes et départements déjà disponibles.

**Modale « Clôturer un recrutement »** · Afficher le poste, le motif proposé et le nombre de candidatures encore en cours. La règle proposée exige de traiter les candidatures encore ouvertes avant la clôture. La clôture conserve l’historique des candidatures.

### 2.8 Suivi des candidatures

| Partie | Contenu à afficher | Actions |
| - | - | - |
| En-tête | Poste, département, recruteur, statut et nombre de candidatures visibles | Revenir à la liste et ajouter une candidature |
| Suivi par étape | Colonnes par étape. Carte avec nom, dernière activité et prochain entretien si planifié | Changer d’étape par menu accessible, ouvrir une candidature |
| Panneau candidat | Identité, coordonnées, CV, historique des étapes, entretiens, notes autorisées et décision | Modifier la candidature, planifier un entretien, ajouter une note, confirmer une décision |

**Panneaux** · **Ajouter une candidature** avec nom, coordonnées, CV, date de réception et source facultative. **Planifier un entretien** avec date, heure, participants et lieu ou lien. L’enregistrement affiche le rendez-vous à l’étape concernée.

**Modales** · **Refuser une candidature** et **Valider une embauche**. Le refus permet de consigner un motif interne. L’embauche validée met à jour la candidature et propose de créer un dossier collaborateur prérempli. La création de ce dossier exige un droit RH distinct. Un changement interne de statut ne déclenche aucun message au candidat par défaut.

### 2.9 Rapports RH

| Partie | Contenu à afficher | Actions |
| - | - | - |
| Périmètre | Période, département, équipe si disponible et date de calcul | Appliquer ou réinitialiser les filtres |
| Effectifs | Effectif en activité en fin de période, entrées et sorties enregistrées | Consulter la ventilation autorisée par département |
| Absences | Nombre d’absences validées et de jours d’absence sur la période | Comparer les périodes ou filtrer la population autorisée |
| Contrats | Nombre de contrats arrivant à échéance sur la période | Ouvrir la liste filtrée si la lecture des contrats est accordée |
| Recrutement | Recrutements ouverts et candidatures réparties par étape | Consulter la ventilation autorisée et ouvrir un recrutement visible |

**Modale « Exporter le rapport »** · Récapituler la période, le périmètre, les indicateurs et le format disponible. Appliquer les droits d’export du rapport et le même périmètre que l’affichage. Afficher **Données non disponibles** lorsqu’un indicateur ne peut pas être calculé. Utiliser zéro seulement lorsqu’une mesure fiable donne zéro.

## 3. Récapitulatif des modales

| Modale | Confirmer | Résultat attendu |
| - | - | - |
| Retirer un document | Document et dossier, effet du retrait | La fiche se met à jour après validation |
| Confirmer le renouvellement | Contrat, nouvelles dates, effet sur l’ancien contrat | Renouvellement enregistré et historique accessible |
| Clôturer un contrat | Contrat, date d’effet et motif | Le statut reflète la date d’effet |
| Approuver un congé | Demande, dates, durée et solde applicable | Demande approuvée, calendrier et solde actualisés |
| Refuser un congé | Demande et motif obligatoire | Demande refusée et motif transmis au collaborateur |
| Annuler un congé | Demande, effet sur le calendrier et le solde | Demande annulée, recrédit si applicable |
| Archiver un poste | Poste, titulaires et recrutements liés | Poste archivé ou blocage expliqué |
| Clôturer un recrutement | Poste, motif proposé et candidatures ouvertes | Recrutement clôturé ou blocage expliqué |
| Refuser une candidature | Candidate ou candidat, motif interne | Décision conservée dans son historique |
| Valider une embauche | Poste, candidature et résumé de la décision | Candidature marquée **Retenue**, accès à la création de dossier si autorisé |
| Exporter un rapport | Période, périmètre et format | Export limité aux données autorisées |

Les modales de confirmation affichent **Annuler** et un bouton nommé selon l’action. Pendant l’envoi, désactiver les nouvelles soumissions. En cas d’échec, conserver le contexte et la saisie. Les panneaux et modales gèrent le focus au clavier et restituent le focus à leur fermeture.

## 4. Statuts et états d’interface

| Objet | Libellés proposés | Règle ou transition |
| - | - | - |
| Collaborateur | **En activité**, **Inactif** | Le statut décrit la relation RH. L’état du compte de connexion est géré dans Admin. |
| Document | **Sans échéance**, **Valide**, **À renouveler**, **Expiré** | Libellé calculé selon la date d’expiration et le seuil retenu. |
| Contrat | **À venir**, **Actif**, **Terminé** | Calcul à partir des dates d’effet et de clôture. **Échéance proche** est un indicateur complémentaire. |
| Congé | **À traiter**, **Approuvé**, **Refusé**, **Annulé** | Une demande soumise passe à **À traiter**. La personne habilitée décide. L’annulation respecte la date de début et la politique applicable. |
| Poste | **Actif**, **Archivé** | Un poste archivé reste visible dans l’historique et disparaît des nouveaux rattachements. |
| Recrutement | **Ouvert**, **Clôturé** | L’ouverture permet d’ajouter des candidats. La clôture conserve les décisions antérieures. |
| Candidature | **Reçue**, **En présélection**, **En entretien**, **Retenue**, **Refusée** | Proposition de parcours. La décision **Retenue** passe par une validation humaine. |
| Entretien | **Planifié**, **Réalisé**, **Annulé** | Un entretien planifié figure sur la carte candidat tant qu’il reste à venir. |

**États communs** · Chargement, liste vide, aucun résultat, erreur avec nouvelle tentative, accès refusé, modification concurrente et données temporairement indisponibles. Afficher les statuts en texte, y compris dans le calendrier. Préserver les filtres en fermant un détail. Le tableau de recrutement reste utilisable au clavier, y compris pour changer d’étape.

## 5. Droits, IA et automatisation

### Accès aux données RH

| Partie | Ressources de référence | Règle |
| - | - | - |
| Annuaire et synthèse | `HR.EMPLOYEES` | Limiter fiche, liste, compteurs et export aux collaborateurs situés dans le périmètre autorisé. |
| Dossier privé, documents et contrats | `HR.PERSONAL_FILES`, `HR.DOCUMENTS`, `HR.CONTRACTS` | Vérifier séparément les droits de chaque onglet et de chaque pièce. |
| Congés | `HR.LEAVES` | Distinguer ses propres demandes, la consultation d’équipe et le droit de décider. |
| Postes et organigramme | `HR.POSITIONS`, `HR.ORG_CHART` | Vérifier les droits sur les postes et limiter la vue hiérarchique aux personnes visibles. |
| Recrutement et candidatures | `HR.RECRUITMENT`, `HR.CANDIDATES` | Vérifier le périmètre d’affectation et les droits de lecture des notes et fichiers. |
| Rapports | `HR.REPORTS` | Distinguer consultation et export. Restreindre l’accès aux listes détaillées selon les droits métier. |

Le serveur vérifie les permissions à chaque lecture et à chaque action. Les intitulés des onglets, les compteurs, les aperçus et les résultats d’export respectent le même périmètre. Les changements sensibles, décisions et exports sont journalisés. Le journal général masque le contenu privé, les justificatifs et les CV.

### IA · Résumer une demande de congé

Dans le détail, **Résumer la demande** reformule les dates, le type autorisé, la durée calculée et les points à vérifier remontés par le système. Le solde et les chevauchements viennent des contrôles métier. Le responsable prend la décision à partir des informations disponibles. En cas d’indisponibilité de l’IA, le dossier, les données calculées et les actions de traitement restent accessibles.

### Automatisations

| Déclencheur | Traitement | Résultat visible |
| - | - | - |
| Demande de congé soumise | Vérifier les règles métier et transmettre au responsable habilité | Demande **À traiter** et notification. S’il manque un approbateur éligible, signaler le problème d’affectation aux RH habilités. |
| Congé approuvé, refusé ou annulé | Notifier le demandeur et mettre à jour le solde et le calendrier lorsque le statut l’exige | Décision et historique consultables |
| Échéance de contrat ou de document détectée | Créer une alerte selon les seuils retenus | Échéance visible sur l’accueil et la liste concernée |
| Rattachement hiérarchique modifié | Mettre à jour les relations utilisées par le moteur de permissions | Organigramme et accès affectés recalculés |
| Embauche validée | Préparer les données réutilisables dans le dossier collaborateur | Action **Créer le dossier collaborateur** si l’utilisateur est habilité |

## 6. Critères d’acceptation

| Parcours | Résultat attendu |
| - | - |
| Accueil RH | Chaque raccourci ouvre le bon périmètre. Les compteurs et alertes reflètent les droits de consultation. |
| Collaborateur | Un nouveau matricule valide donne accès à la fiche. Un doublon est refusé sur le champ concerné. |
| Dossier personnel et documents | Un utilisateur qui peut ouvrir la synthèse sans droit sur les pièces ne reçoit aucune donnée des onglets restreints, même via un accès direct. |
| Contrat | Les dates invalides sont expliquées. Un renouvellement garde l’historique et respecte la règle d’un contrat actif. |
| Congé | Une demande valide est transmise. Le demandeur ne peut approuver sa propre demande. Une approbation répétée ne débite pas deux fois le solde. |
| Poste et organigramme | L’arborescence reflète les rattachements autorisés. Une boucle hiérarchique est refusée. |
| Recrutement | Une candidature progresse par étapes. Une embauche validée peut préparer un dossier RH. La création effective vérifie les droits. |
| Rapports | Une période sans données traitables est signalée. Les indicateurs et l’export utilisent le même périmètre autorisé. |
| IA | Un résumé reprend les données autorisées de la demande. Le traitement manuel reste possible si l’IA échoue. |

## 7. Points à valider et sources

- Seuils d’alerte des contrats et documents. La v2 suggère des rappels contractuels à 60, 30 et 7 jours.

- Champs obligatoires par type de contrat et de congé, règles de durée et destinataire de secours lorsqu’aucun approbateur n’est disponible.

- Formats acceptés, limites d’envoi des documents, droits de retrait et règles de conservation.

- Étapes finales du recrutement, traitement des candidatures encore ouvertes à la clôture et notifications externes éventuelles.

- Définitions des indicateurs RH, format d’export et date de référence des effectifs.

- Sources internes de `docs.zip` · `05-matrice-permissions.md`, `07-espaces-de-travail.md`, `08-pages.md`, `09-module-rh.md`, `14-ia-trust-layer.md`, `15-workflows.md`, `19-modele-donnees.md` et `20-flows-utilisateurs.md`.

# Complément de conception — demandes, permissions et IA

Le module RH couvre collaborateurs et congés. Les permissions effectives déterminent les ressources et actions accessibles à chaque personne, dans le périmètre accordé. Le poste affiché sur la fiche collaborateur décrit sa fonction dans l’entreprise.

# Navigation et écrans métier

| Écran | Contenu et interactions à maquetter |
| - | - |
| Accueil RH | Effectifs, demandes à traiter, absences et échéances. |
| Collaborateurs | Annuaire, matricule, poste et rattachements. Rechercher ou créer une fiche. |
| Fiche collaborateur | Synthèse, dossier personnel, documents, contrats et congés. Contrôler chaque onglet séparément. |
| Contrats | Dates, avenants, échéances et justificatifs. Renouveler ou clôturer. |
| Congés et absences | Calendrier, soldes et décisions. Le détail renvoie à la demande d’origine. |
| Postes et organigramme | Postes, titulaires et liens hiérarchiques visibles. |
| Recrutement | Postes ouverts, recruteurs et progression. |
| Suivi des candidatures | CV, étapes, notes, entretiens et décision d’embauche. |
| Rapports RH | Effectifs, mouvements, absences et recrutement par période. |

Ajouter **Demandes** à la navigation de RH. Un utilisateur dont le seul droit est de soumettre un type de demande arrive directement dans **Mes demandes**. Les raccourcis de l’accueil et des fiches ouvrent la même demande et conservent sa référence.

# Demandes dans le module

Types proposés à configurer : **Congé, absence, autorisation de sortie**. Exemple de titre : **Absence vendredi après-midi**.

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

Le demandeur peut décrire son besoin en langage naturel. L’IA propose un brouillon avec un type autorisé, un titre et un motif. Une date ambiguë déclenche une question. Le demandeur relit les valeurs proposées. Dans le traitement, confirmer dates, demi-journée, solde et chevauchement avant la décision.

Une fois les dates confirmées, le service RH applique la décision au calendrier et au solde concerné une seule fois. Une absence sans consommation de congés conserve le solde.

L’interface distingue les données calculées, les suggestions IA et les valeurs confirmées. Présenter l’action Accepter ou Modifier avant utilisation. Si l’IA est indisponible, conserver le traitement manuel. Toute décision et tout effet métier disposent d’un historique et d’une protection contre les doubles exécutions.

# Parcours entre modules

Depuis une embauche validée, ouvrir une demande de compte Admin préremplie. Le changement d’équipe signale au moteur de permissions les rattachements modifiés.

# Vérification du prototype

- Soumettre « Absence vendredi après-midi » en utilisant les quatre champs prévus. Le demandeur retrouve la référence et le statut dans Mes demandes.

- Ouvrir avec des permissions différentes : vérifier la visibilité des vues, pièces et actions, y compris l’accès direct au détail.

- Demander une précision, répondre puis traiter la demande sur la même référence. Vérifier le motif de refus et la confirmation de succès.

- Tester l’indisponibilité de l’IA, une double soumission et un effet métier échoué. La reprise conserve la décision et évite les doublons.

- Un agent d’entretien habilité soumet son congé depuis RH, suit son propre dossier et ne voit ni les demandes des collègues ni leurs justificatifs.

## Appel à l’API LLM

Le serveur vérifie la permission sur la ressource avant de préparer l’appel. Il transmet les champs nécessaires à la suggestion affichée. Les pièces jointes nécessitent une sélection explicite. La réponse structurée est contrôlée puis présentée comme brouillon modifiable. L’utilisateur confirme l’action métier avec ses propres permissions. En cas de délai dépassé ou de réponse invalide, la saisie manuelle reste disponible.
