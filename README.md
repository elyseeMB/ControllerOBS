# ControllerOBS

ControllerOBS est une application Node.js qui utilise TypeScript pour interagir avec OBS via l'API obs-websocket. Ce projet comprend un serveur pour gérer les opérations en arrière-plan et un client avec une interface utilisateur moderne.

## Prérequis

- Node.js (version recommandée : 20.12.0)
- pnpm (pour la gestion des paquets)
- TypeScript

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/votre-utilisateur/controllerobs.git
Accédez au répertoire du projet :

bash
Copier le code
cd ControllerOBS
Installez les dépendances :

bash
Copier le code
pnpm install
Scripts
Voici une liste des scripts disponibles dans le fichier package.json :

build : Nettoie le répertoire de build et exécute les builds du client et du serveur.

bash
Copier le code
pnpm run build
build
: Compile le client avec TypeScript et Vite, puis copie les fichiers construits dans le répertoire de build.

bash
Copier le code
pnpm run build:client
build
: Compile le serveur avec TypeScript et copie les ressources nécessaires dans le répertoire de build.

bash
Copier le code
pnpm run build:server
clean : Supprime le répertoire de build.

bash
Copier le code
pnpm run clean
dev : Lance le serveur en mode développement avec nodemon.

bash
Copier le code
pnpm run dev
preview : Construit le projet en utilisant les paramètres de mémoire étendus et exécute le build.

bash
Copier le code
pnpm run preview
Dépendances
Finalhandler : Middleware pour gérer les erreurs.
OBS-Websocket-JS : Client JavaScript pour interagir avec l'API obs-websocket.
RxJS : Bibliothèque pour la programmation réactive.
Serve-Static : Middleware pour servir des fichiers statiques.
Socket.IO : Bibliothèque pour les communications en temps réel.
Dépendances de développement
@types/finalhandler : Types TypeScript pour finalhandler.
@types/serve-static : Types TypeScript pour serve-static.
Cross-Env : Permet de définir des variables d'environnement de manière compatible avec les environnements Windows et Unix.
Nodemon : Outil pour surveiller les changements de fichiers et redémarrer le serveur.
Ts-Node : Exécute des fichiers TypeScript directement.
Tsconfig-Paths : Résout les chemins d'importation dans TypeScript.
TypeScript : Langage de programmation qui ajoute des types statiques à JavaScript.
Contribuer
Pour contribuer à ce projet, veuillez ouvrir une issue ou soumettre une demande de tirage (pull request). Assurez-vous que votre code est testé et respecte les conventions de style du projet.

Licence
Ce projet est sous licence ISC. Voir le fichier LICENSE pour plus de détails.
