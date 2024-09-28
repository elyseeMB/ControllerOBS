## ControllerOBS

**Une application Node.js pour contrôler OBS Studio via l'API obs-websocket**

### Description
ControllerOBS est une application Node.js, utilisant TypeScript, conçue pour interagir avec OBS Studio via l'API obs-websocket. Elle offre une interface utilisateur moderne pour contrôler à distance les différentes fonctionnalités d'OBS, et un serveur gérant les opérations en arrière-plan.

### Prérequis
* **Node.js** (version recommandée : 20.12.0)
* **pnpm** (gestionnaire de paquets)
* **TypeScript**

### Installation
1. **Cloner le dépôt:**
   ```bash
   git clone https://github.com/votre-utilisateur/controllerobs.git
   ```
2. **Accéder au répertoire:**
   ```bash
   cd ControllerOBS
   ```
3. **Installer les dépendances:**
   ```bash
   pnpm install
   ```

### Scripts
* **`build`:** Nettoie le répertoire de build et exécute les builds du client et du serveur.
* **`build:client`:** Compile le client avec TypeScript et Vite.
* **`build:server`:** Compile le serveur avec TypeScript.
* **`clean`:** Supprime le répertoire de build.
* **`dev`:** Lance le serveur en mode développement avec nodemon.
* **`preview`:** Construit le projet avec des paramètres de mémoire étendus.

### Dépendances
* **finalhandler:** Gestion des erreurs.
* **OBS-Websocket-JS:** Client JavaScript pour l'API obs-websocket.
* **RxJS:** Programmation réactive.
* **serve-static:** Servir des fichiers statiques.
* **Socket.IO:** Communications en temps réel.

### Dépendances de développement
* **@types/*:** Types TypeScript pour les dépendances.
* **cross-env:** Définition de variables d'environnement.
* **nodemon:** Surveillance des changements de fichiers.
* **ts-node:** Exécution directe de fichiers TypeScript.
* **tsconfig-paths:** Résolution des chemins d'importation dans TypeScript.

### Contribuer
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request. Assurez-vous que votre code est testé et respecte les conventions du projet.

### Licence
Ce projet est sous licence ISC. Consultez le fichier LICENSE pour plus de détails.

