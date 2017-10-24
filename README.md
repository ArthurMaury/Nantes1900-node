# Nantes1900 Node

Cette API est développée dans le cadre du projet Nantes1900 pour l'École Centrale de Nantes.
Elle permet de faire le lien entre le projet Unity et la base de données spatiale.

## Installer l'APIÉ

Pour commencer vous devez avoir installé <a href="https://nodejs.org">NodeJs</a> avec npm.

Ouvrez un terminal à la racine du projet

#### - Vérifiez votre installation

```
node --version
```

#### - Lancez l'installation des modules nécessaires

```
npm install
```

#### - Connectez à votre base de données

```
mv database_config_template.json database_config.json
```

Définissez vos paramètres de connexion dans "database_config.json"

#### - Lancez le serveur

```
node index.js
```


## Modules utilisés

* [express](http://expressjs.com/fr/) - Création de l'API
* [pg](https://github.com/brianc/node-postgres) - Connexion à la base de données postgres
* [fs](https://rometools.github.io/rome/) - Lecture de fichier