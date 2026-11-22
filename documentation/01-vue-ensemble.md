# 1. Vue d'ensemble et contexte métier

## Nom et proposition de valeur

**Nexora** est un ERP RH intelligent, modulaire et sécurisé destiné à une entreprise unique. Il centralise les informations des employés, les congés, les absences, les jours fériés, les fiches de paie et les tickets internes.

L'application combine des écrans métier classiques avec un assistant conversationnel. Celui-ci peut rechercher des informations, préparer des actions et les soumettre à validation humaine avant application.

## Contexte et objectifs

Le projet vise à réduire les opérations RH dispersées et répétitives en proposant une interface de gestion centralisée. Les objectifs opérationnels actuels sont :

- rechercher et maintenir le référentiel employé ;
- gérer les demandes de congés, absences et jours fériés ;
- préparer des fiches de paie à partir des données RH ;
- suivre les tickets internes ;
- permettre à un assistant basé sur un LLM d'effectuer des opérations de lecture et de proposer des écritures contrôlées.

Des KPIs métier formalisés ne sont pas encore présents dans le dépôt. À définir avec le propriétaire du produit : nombre d'opérations réussies, temps moyen de traitement RH, taux d'adoption de l'assistant, taux d'erreur et taux d'annulation des propositions.

## Personas et cas d'usage

| Persona | Besoins principaux | Parcours critiques |
|---|---|---|
| Gestionnaire RH | Création et mise à jour des employés, congés, absences | Rechercher un employé, créer une demande, approuver/refuser une demande |
| Responsable paie | Préparer et suivre les bulletins | Sélectionner un employé et une période, vérifier l'aperçu, générer la fiche |
| Opérateur / employé | Consulter ou demander des congés et créer des tickets | Rechercher son information, soumettre une demande, suivre un ticket |
| Utilisateur de l'assistant | Obtenir une réponse rapide à partir des données ERP | Poser une question, accepter une proposition, annuler ou appliquer une proposition |

Cas limites à couvrir explicitement :

- employé introuvable ou plusieurs employés correspondant à une recherche ;
- dates de congé invalides ou fin antérieure au début ;
- solde insuffisant ;
- fiche de paie déjà existante pour le mois et l'année ;
- suppression d'un employé lié à des congés, absences, fiches ou tickets ;
- double application d'une proposition ;
- interruption ou indisponibilité du fournisseur LLM ;
- modification concurrente des données.

## Règles métier principales

- Un employé possède un matricule unique et peut être actif, en congé ou terminé.
- Les types de contrat sont CDI, CDD, stagiaire ou freelance.
- Les demandes de congés sont en attente, approuvées, rejetées ou annulées.
- Les absences peuvent être justifiées ou non.
- Une fiche de paie est unique par employé, mois et année.
- Les actions écrites demandées à l'assistant restent à l'état `PREVIEW` jusqu'à validation.
- Une proposition appliquée une seule fois passe atomiquement de `PREVIEW` à `APPLIED`.
- Les échecs d'application sont enregistrés avec `FAILED` et un message d'erreur.

Les règles détaillées sont implémentées dans les schémas Zod de `packages/contracts` et les services Prisma de `packages/core`.

## Périmètre

Inclus dans la version actuelle :

- employés ;
- congés ;
- absences ;
- jours fériés ;
- fiches de paie ;
- tickets ;
- assistant conversationnel avec outils de lecture et propositions d'écriture ;
- PWA React ;
- API REST NestJS ;
- PostgreSQL avec migrations Prisma ;
- conteneurs Docker pour l'infrastructure locale et la production.

Non implémentés ou non encore documentés :

- authentification et rôles utilisateur ;
- gestion fine des permissions ;
- génération PDF réelle des fiches de paie ;
- stockage objet/S3 ;
- notifications externes ;
- workflows métier complets ;
- environnement CI/CD hébergé ;
- tests automatisés présents dans le dépôt ;
- sauvegardes et procédures de restauration opérationnelles.

## Glossaire

| Terme | Définition |
|---|---|
| ERP | Progiciel centralisant les processus métier de l'entreprise |
| Employé | Personne enregistrée dans Nexora avec contrat, statut, poste et rémunération de base |
| Congé | Période demandée pour absence planifiée |
| Absence | Entrée quotidienne indiquant une absence et sa justification |
| Jour férié | Date officielle ou interne considérée comme fermée |
| Fiche de paie | Synthèse mensuelle du salaire de base, déductions, primes et net |
| Ticket | Demande ou incident suivi en interne |
| Proposition | Action modifiée par l'assistant mais non appliquée tant que l'utilisateur ne la valide pas |
| AuditLog | Trace d'une proposition : outil, paramètres, résultat, statut et erreur |

## Parties prenantes

Les rôles formels ne sont pas configurés dans le dépôt. Ils devront être confirmés par le projet : commanditaire, Product Owner, Tech Lead, développeurs, responsable RH, référent paie, sécurité/opérations et support.
