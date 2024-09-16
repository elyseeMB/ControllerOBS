import JSONdb from "simple-json-db";
import * as path from "node:path";
import { ServerConfig } from "@src/types/types";
import { BehaviorSubject, distinctUntilChanged, map, Observable, skip } from "rxjs";
import { deepCompare, deepCopy } from "@src/main/utils/utils";
import { getLogger, Logger } from "@src/main/utils/logger";

const CONFIG_FILE = path.join("./database.json");

export interface SpecificAndDefault {
  configPart$: Observable<any>;
  defaultValue: any;
  edit: (data: any) => void;
}

const EMPTY_CONFIG = {
  profiles: [],
};

class ConfigServer {
  logger: Logger;
  
  private db: JSONdb;
  private _data: ServerConfig;
  private _config$: BehaviorSubject<ServerConfig>;
  config$: Observable<ServerConfig>;
  
  constructor() {
    this.logger = getLogger("Module-db");
    this.db = new JSONdb(CONFIG_FILE);
    
    this._data = this.db.JSON() as ServerConfig;
    this._config$ = new BehaviorSubject<ServerConfig>(this._data);
    this.config$ = this._config$.pipe(
      distinctUntilChanged((a, b) =>
        deepCompare(a, b)));
  }
  
  async connect() {
    this._data = this.db.JSON() as ServerConfig;
    if (!this._data) {
      this._data = EMPTY_CONFIG;
    }
    this._config$ = new BehaviorSubject(<ServerConfig>this._data);
    this.config$ = this._config$.pipe(
      distinctUntilChanged((a, b) => deepCompare(a, b)),
    );
    this._config$.pipe(skip(1)).subscribe((data) => this.saveConfig(data));
  }
  
  
  private getDataFromPath(path: string[], object: any, profile?: boolean) {
    let data = object;
    if (data.profiles && data.profiles.length > 0) {
      for (const p of data.profiles) {
        if (p.actitve) {
          data = p;
          break;
        }
      }
    }
    
    for (const i in path) {
      data = data[path[i]];
    }
    
    return data;
  }
  
  dataFromPath(data: any) {
    return this.getDataFromPath(["profiles"], data);
  }
  
  getSpecific(path: string[], profile?: boolean): Observable<any> {
    return this._config$.pipe(
      map((object) => this.getDataFromPath(path, object, profile)),
      distinctUntilChanged((a, b) => deepCompare(a, b)),
    );
  }
  
  getDefaultValue(path: string[], profile?: boolean) {
    return this.getDataFromPath(path, this.getConfigCopy(), profile);
  };
  
  async editSpecific(path: string[], data: Object) {
    const _config = this.getConfigCopy();
    let _d = _config;
    
    let i = 0;
    for (i; i < path.length - 1; i++) {
      _d = _d[path[i]];
    }
    _d[path[i]] = data;
    
    this.editConfig(_config);
  }
  
  getSpecificAndDefault(path: string[], profile?: boolean): SpecificAndDefault {
    return {
      configPart$: this.getSpecific(path, profile),
      defaultValue: this.getDefaultValue(path, profile),
      edit: data => {
        this.editSpecific(path, data);
      },
    };
  }
  
  editConfig(data: ServerConfig) {
    this._config$.next(data);
  }
  
  getConfigCopy(): ServerConfig {
    return deepCopy(this._data);
    
  }
  
  private async saveConfig(data: ServerConfig) {
    this._data = data;
    this.db.JSON(data);
    this.db.sync();
  }
  
  
}

const configServer = new ConfigServer();
export default configServer;