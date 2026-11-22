# 4. Données, base de données et sécurité

## Modèle de données

PostgreSQL est la base principale. Prisma définit les modèles suivants :

- `Employee` ;
- `LeaveRequest` ;
- `Absence` ;
- `Holiday` ;
- `Payslip` ;
- `Ticket` ;
- `AuditLog`.

Relations principales :

- un employé possède plusieurs congés, absences, fiches de paie et tickets ;
- la suppression d'un employé entraîne la suppression en cascade des congés, absences et fiches ;
- la suppression d'un employé retire l'employé des tickets (`SetNull`) ;
- le matricule employé, l'e-mail et la combinaison employé/mois/année sont uniques ;
- les dates de congé sont stockées sans heure ;
- les montants sont des `Decimal(12,2)`.

La migration initiale se trouve dans `prisma/migrations/20261122000115_init_erp/migration.sql`.

## Indexation

Les index définis dans le schéma couvrent notamment :

- employés : nom/prénom et département ;
- congés : employé/date et statut ;
- absences : employé/date ;
- tickets : statut ;
- audit : outil/date ;
- plusieurs contraintes uniques servent aussi d'index.

Des métriques de requêtes, seuils de performance et partitionnement ne sont pas encore documentés.

## Migrations

- outil : Prisma ;
- migrations locales : `pnpm db:migrate` ;
- déploiement : `pnpm db:deploy` ;
- génération du client : `pnpm db:generate`.

La migration doit être testée sur une copie des données avant production. Les migrations destructives, le maintien de compatibilité entre deux versions et une procédure de rollback validée restent à formaliser pour obtenir des déploiements sans interruption.

## Stockage de fichiers

Le champ `pdfUrl` existe sur les fiches de paie, mais aucun bucket, stockage objet, générateur PDF ni URL signée n'est implémenté. Le champ `certificateUrl` existe sur les demandes de congé, mais l'upload n'est pas exposé.

## Sauvegarde

Docker Compose conserve les données PostgreSQL dans le volume nommé `postgres-data`. Aucun RPO, RTO, calendrier de sauvegarde, stockage hors site ou test de restauration n'est formalisé dans le dépôt. Ils doivent être définis avant la production.

## Sécurité applicative

Protections présentes :

- validation Zod des entrées ;
- headers de sécurité Nginx : `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` ;
- HSTS activé derrière Caddy ;
- proxy API configuré pour désactiver le buffering ;
- aucun secret LLM n'est écrit dans le dépôt ;
- l'assistant utilise une confirmation humaine pour les écritures ;
- les propositions sont réservées atomiquement avant application.

Protections à compléter :

- authentification et autorisation ;
- CSRF si des cookies de session sont introduits ;
- CORS explicite ;
- CSP plus complète ;
- rate limiting côté API ;
- protection anti-abus du stream LLM ;
- filtrage des données sensibles dans les logs ;
- gestion centralisée des secrets ;
- règles de rotation des clés ;
- politique OWASP Top 10 documentée et testée ;
- vérification antivirus/scan pour les futurs fichiers ;
- TLS applicatif au-delà du proxy Caddy.

## Données sensibles

Le système contient des données personnelles et RH : identité, e-mail, téléphone, salaire, congés, absences et pièces justificatives sous forme de références. Ces données doivent être :

- classées ;
- limitées aux personnes autorisées ;
- chiffrées en transit ;
- chiffrées ou protégées au repos selon l'hébergement ;
- conservées selon une durée définie ;
- pseudonymisées ou anonymisées pour les tests si possible.

## Conformité

Les exigences RGPD, locales, de consentement, d'accès/suppression/portabilité et les CGU/mentions légales ne sont pas implémentées ou documentées dans le dépôt. Une revue juridique est nécessaire avant un usage réel impliquant des données personnelles.
