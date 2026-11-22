# NEXORA — Présentation du projet et guide des interfaces

NEXORA est un ERP modulaire destiné à une entreprise. Il réunit cinq espaces de travail pour gérer les personnes, les accès, les finances, le matériel et les demandes d’assistance. Un collaborateur y exprime un besoin et suit sa demande. La personne habilitée la traite dans son espace métier, avec les informations et les actions correspondant à ses permissions.

## Contexte et objectif

NEXORA répond au défi « The ERP of tomorrow » du DevFest Antananarivo 2026. Le problème de départ est concret : lorsqu’une demande passe d’un service à l’autre, les équipes doivent souvent ressaisir les mêmes informations et le demandeur perd de vue la décision. Le projet propose une référence de suivi, des dossiers liés et un historique des décisions. L’IA aide à comprendre ou à préparer une action. Une personne habilitée en confirme les conséquences.

Les cinq spécifications décrivent le produit à concevoir. Le prototype de hackathon peut en démontrer un parcours complet. Elles servent de référence fonctionnelle pour les maquettes et ne constituent pas un inventaire des fonctionnalités déjà développées.

## Les cinq fichiers à utiliser

| Spécification complète | Ce que l’espace permet de faire | Intervention de l’IA à représenter |
| --- | --- | --- |
| [Admin](NEXORA-Module-Admin-Complet.md) | Administrer les comptes, départements, équipes et permissions. Consulter l’audit, configurer l’IA et suivre la santé du système. | Expliquer les changements d’accès à partir d’une simulation des permissions. |
| [RH](NEXORA-Module-RH-Complet.md) | Gérer les collaborateurs, dossiers et documents, contrats, congés et absences, postes, organigramme, recrutement et rapports. | Préparer une demande de congé à partir d’une phrase et demander une précision si une date est ambiguë. |
| [Comptabilité](NEXORA-Module-Comptabilite-Complet.md) | Contrôler factures et écritures, suivre paiements, encaissements, trésorerie, dépenses, budgets et rapports. | Extraire les données d’un justificatif et permettre leur comparaison avec la pièce originale. |
| [Stock](NEXORA-Module-Stock-Complet.md) | Suivre les articles et quantités par emplacement, préparer les mouvements, traiter les inventaires et le réapprovisionnement. | Expliquer les options calculées pour satisfaire une demande de matériel. |
| [Support](NEXORA-Module-Support-Complet.md) | Traiter les tickets, réclamations et interventions, suivre les délais et distinguer les notes internes des réponses au demandeur. | Résumer le ticket et proposer des résolutions issues de dossiers similaires accessibles. |

Chaque fichier rassemble la description métier d’origine et le complément de conception sur les demandes, permissions et usages de l’IA. Pour dessiner une page, consulter les actions, modales, statuts et critères d’acceptation du module concerné. Lorsqu’un ancien exemple nomme un poste, vérifier l’action à partir de la permission effective sur la ressource.

## Organisation des interfaces

Chaque module possède son accueil. Une personne qui traite des dossiers y retrouve sa file de travail et les alertes autorisées. Une personne qui peut seulement déposer une demande accède directement à **Mes demandes**. Les compteurs, résultats de recherche, pièces jointes et liens entre dossiers respectent le même périmètre que les pages de détail.

Un agent d’entretien autorisé à demander un congé ouvre RH, sélectionne le type **Congé**, dépose sa demande et suit son état. La consultation des contrats, la validation des absences et la création de types de demande dépendent chacune d’une permission distincte.

## Le parcours commun des demandes

1. **Créer.** Le formulaire présente le type de demande, le titre, la description ou le motif et les pièces jointes. Les trois premiers champs sont obligatoires. Le type sélectionné indique si un justificatif est nécessaire. Le demandeur peut enregistrer un brouillon ou soumettre.
2. **Suivre.** La plateforme attribue une référence. La fiche affiche le statut, les pièces accessibles et la chronologie. Un complément demandé reçoit une réponse sur la même fiche.
3. **Traiter.** Une personne habilitée ouvre la file du module. Elle confirme les informations métier utiles, par exemple la période du congé ou la quantité de matériel, puis prend la décision prévue pour ce type.
4. **Exécuter.** L’historique distingue la décision de son effet réel. Une dépense approuvée attend son règlement. Le stock diminue à la confirmation de la sortie physique. La fiche indique la suite attendue.
5. **Configurer.** Depuis **Types de demande**, la personne autorisée définit le libellé, l’aide de saisie, la règle des pièces, les permissions de soumission et de traitement ainsi que le circuit applicable.

## IA et automatisation

L’application appelle l’API LLM côté serveur pour une tâche précise. Elle vérifie les droits, sélectionne les données utiles, puis présente la réponse comme une suggestion modifiable. L’interface permet d’examiner la source, de corriger la proposition ou de continuer manuellement si l’IA échoue. Le système métier calcule les soldes, vérifie les disponibilités et applique les permissions. Une confirmation humaine précède toute action sensible.

## Parcours entre modules à illustrer

| Déclencheur | Passage entre espaces | Résultat visible |
| --- | --- | --- |
| Embauche confirmée | RH prépare une demande de compte dans Admin. | La fiche RH suit l’avancement. La personne habilitée dans Admin contrôle les accès avant activation. |
| Matériel défectueux | Support lie le ticket à un retour dans Stock. | Le demandeur suit la prise en charge. Le gestionnaire enregistre séparément le mouvement physique. |
| Facture contestée | Support transmet une demande d’examen à Comptabilité. | Le dossier financier conserve les détails autorisés. Support reçoit la conclusion partageable. |

Deux liaisons restent à arbitrer avant de les représenter comme parcours validés : ouvrir une demande de dépense depuis un besoin Stock et rapprocher une réception de sa facture.

## Utiliser ce dossier pour créer les maquettes

Commencer par un parcours de bout en bout, par exemple une demande de matériel. Dessiner successivement **Mes demandes → Nouvelle demande → Détail et suivi**, puis passer au point de vue du gestionnaire : **À traiter → Vérification des disponibilités → Confirmation de remise**. Le prototype est compréhensible si le demandeur peut retrouver sa demande, voir la décision et savoir si le matériel est effectivement disponible ou remis.

Réutiliser ensuite le formulaire, la chronologie et les confirmations dans les autres espaces. Pour chaque écran, préciser la ressource affichée, la permission nécessaire, l’action principale et son résultat. Prévoir les états vide, chargement, erreur, accès refusé et traitement terminé. Pour l’IA, dessiner également la suggestion à relire, sa correction et la reprise manuelle.
