Pour réécrire ce système de gestion de configuration, je commencerais par
définir une architecture plus modulaire et découper clairement les
responsabilités de chaque partie. Voici les étapes et le diagramme associés :

### Étape 1 : Identifier les responsabilités

Le code gère plusieurs aspects :

1. **Chargement de la configuration** depuis un fichier JSON.
2. **Stockage réactif** des données via RxJS.
3. **Gestion des profils** dans la configuration.
4. **Modification et sauvegarde des configurations**.
5. **Gestion des abonnés** pour les mises à jour en temps réel.

### Étape 2 : Moduler le code

Il faut séparer les responsabilités dans des classes et modules distincts :

- **JsonDbHandler** : pour gérer l'interaction avec le fichier JSON (chargement,
  sauvegarde).
- **ConfigState** : pour maintenir et modifier la configuration en mémoire (avec
  RxJS).
- **ProfileManager** : pour la gestion des profils.
- **ConfigServer** : une classe principale orchestrant ces modules.

### Étape 3 : Diagramme d'architecture

```plaintext
+--------------------------------------------+
|             ConfigServer                   |
|                                            |
|  +--------------------------------------+  |
|  |       ConfigState (RxJS Behavior)    |  |
|  |  - _config$: BehaviorSubject         |  |
|  |  - editConfig()                      |  |
|  |  - getSpecific()                     |  |
|  +--------------------------------------+  |
|                                            |
|  +--------------------------------------+  |
|  |       ProfileManager                 |  |
|  |  - getProfile()                      |  |
|  |  - setActiveProfile()                |  |
|  +--------------------------------------+  |
|                                            |
|  +--------------------------------------+  |
|  |       JsonDbHandler                  |  |
|  |  - loadConfigFromFile()              |  |
|  |  - saveConfigToFile()                |  |
|  +--------------------------------------+  |
+--------------------------------------------+

                    |
                    V
+--------------------------------------------+
|          Json Database (JSON file)         |
+--------------------------------------------+

Abonnés : Composants de l'application qui écoutent les changements de configuration via `BehaviorSubject`
```

### Étape 4 : Explication du diagramme

1. **ConfigServer** :
    - C’est l’interface principale qui orchestre les opérations de
      configuration. Elle utilise trois sous-modules :
        - **ConfigState** : Responsable de la gestion des états réactifs avec un
          **BehaviorSubject**.
        - **ProfileManager** : Pour gérer les profils utilisateurs actifs dans
          la configuration.
        - **JsonDbHandler** : Pour charger et sauvegarder la configuration dans
          le fichier JSON.

2. **ConfigState** :
    - Contient la configuration en mémoire, gérée via un **BehaviorSubject**.
    - Permet d’éditer la configuration (`editConfig()`) et de s’abonner à des
      chemins spécifiques (`getSpecific()`).
    - Ce module utilise des opérateurs RxJS comme `distinctUntilChanged` pour
      notifier les abonnés uniquement lorsque les données changent.

3. **ProfileManager** :
    - Gère les profils dans la configuration. Par exemple, il permet d'obtenir
      le profil actif (`getProfile()`) ou de définir un nouveau profil
      actif (`setActiveProfile()`).

4. **JsonDbHandler** :
    - S’occupe uniquement de la gestion de fichiers JSON. Il charge et
      sauvegarde la configuration avec `loadConfigFromFile()`
      et `saveConfigToFile()`.

5. **Abonnés** :
    - Différentes parties de l’application peuvent s’abonner à des sections de
      la configuration et recevoir les mises à jour en temps réel. Ces abonnés
      écoutent les données via le **BehaviorSubject** dans **ConfigState**.

### Étape 5 : Ébauche de la nouvelle structure de code

**1. JsonDbHandler.ts :**

```typescript
import JsonDb from "simple-json-db";
import path from "path";

class JsonDbHandler {
  private db: JsonDb;
  
  constructor(filePath: string) {
    this.db = new JsonDb(filePath);
  }
  
  loadConfigFromFile() {
    return this.db.JSON();
  }
  
  saveConfigToFile(data: any) {
    this.db.JSON(data);
    this.db.sync();
  }
}

export default JsonDbHandler;
```

**2. ConfigState.ts :**

```typescript
import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import deepEqual from "deep-eql";

class ConfigState<T> {
  private _config$: BehaviorSubject<T>;
  
  constructor(initialConfig: T) {
    this._config$ = new BehaviorSubject(initialConfig);
  }
  
  get config$(): Observable<T> {
    return this._config$.asObservable();
  }
  
  getSpecific(path: string[]): Observable<any> {
    return this.config$.pipe(
      map((config) => this.getFromPath(config, path)),
      distinctUntilChanged((a, b) => deepEqual(a, b))
    );
  }
  
  editConfig(newConfig: T) {
    this._config$.next(newConfig);
  }
  
  private getFromPath(object: any, path: string[]): any {
    return path.reduce((acc, key) => acc[key], object);
  }
}

export default ConfigState;
```

**3. ProfileManager.ts :**

```typescript
class ProfileManager {
  getActiveProfile(config: any) {
    return config.profiles.find((profile: any) => profile.active);
  }
  
  setActiveProfile(config: any, profileId: string) {
    config.profiles.forEach((profile: any) => {
      profile.active = profile.id === profileId;
    });
  }
}

export default ProfileManager;
```

**4. ConfigServer.ts :**

```typescript
import JsonDbHandler from "./JsonDbHandler";
import ConfigState from "./ConfigState";
import ProfileManager from "./ProfileManager";
import { ServerConfig } from "../../types/protocol";

const CONFIG_FILE = "./database.json";

class ConfigServer {
  private dbHandler: JsonDbHandler;
  private configState: ConfigState<ServerConfig>;
  private profileManager: ProfileManager;
  
  constructor() {
    this.dbHandler = new JsonDbHandler(CONFIG_FILE);
    const initialConfig = this.dbHandler.loadConfigFromFile();
    this.configState = new ConfigState(initialConfig);
    this.profileManager = new ProfileManager();
  }
  
  connect() {
    this.configState.config$.subscribe((config) => {
      this.dbHandler.saveConfigToFile(config);
    });
  }
  
  getSpecific(path: string[]) {
    return this.configState.getSpecific(path);
  }
  
  editConfig(config: ServerConfig) {
    this.configState.editConfig(config);
  }
}

export default ConfigServer;
```

### Conclusion

En structurant le code ainsi, chaque responsabilité est clairement délimitée, ce
qui rend le système plus facile à maintenir, à tester et à faire évoluer.