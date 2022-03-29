## Projet 9 - Billed-app - Openclassrooms

Voici le projet 9 de débuggage/test d'un SASS RH permettant de gérer les factures et remboursements d'employés via le service RH.

## L'architecture du projet :
Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

## Organiser son espace de travail :
Pour une bonne organization, vous pouvez créer un dossier bill-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Clonez le projet backend dans le dossier bill-app :

## Comment lancer l'application en local ?

### Etape 1 - Lancer le backend :


#### Acceder au repertoire du projet :
```
cd Billed-app-FR-Back
```

#### Installer les dépendances du projet :

```
npm install
```

#### Lancer l'API :

```
npm run run:dev
```

#### Accéder à l'API :

L'api est accessible sur le port `5678` en local, c'est à dire `http://localhost:5678`

## Utilisateurs par défaut:

### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```

### Etape 2 - Lancer le frontend :

#### Allez au repo cloné :
```
$ cd Billed-app-FR-Front
```

#### Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

#### Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

#### Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`
