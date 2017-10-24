# Nantes1900 Node

Cette API permet de faire le lien entre le projet Unity et la base de données spatiale.
Pour le moment la base de données ainsi que cette API doivent être installées localement.

## Installer l'API

Pour commencer vous devez avoir installé <a href="https://nodejs.org">NodeJs</a> avec npm.

#### Ouvrez un terminal à la racine du projet

### Vérifiez votre installation

`node --version`

### Lancez l'installation des modules nécessaires

`npm install`

### Connectez à votre base de données

`mv database_config_template.json database_config.json`

Définissez vos paramètres de connexion dans "database_config.json"

### Lancez le serveur

`node index.js`
