import { ObsClient } from "@src/main/clients/OBSClient";
import { Logger } from "@src/main/utils/logger";
import { BehaviorSubject } from "rxjs";
import db from "@src/main/utils/db";
import { ConnectionType } from "@src/types/types";

interface Connections {
  obs: boolean;
  vmix: boolean;
}

export class Controller {
  isReady: boolean;
  obs: ObsClient;
  
  connections$: BehaviorSubject<Connections>;
  
  power$: BehaviorSubject<boolean>;
  private logger: Logger;
  private defaultConnection: ConnectionType | undefined;
  
  constructor(public name: string) {
    this.logger.info(`${name} connection`);
    this.isReady = false;
    this.power$ = new BehaviorSubject<boolean>(false);
    
    this.connections$ = new BehaviorSubject<Connections>({
      obs: false,
      vmix: false,
    });
    
    this.init();
  }
  
  private connect() {
    const connections = db.getSpecificAndDefault(["connections"], true);
    this.logger.info("is connecting to", connections.defaultValue);
    console.log(connections);
    this.defaultConnection = connections.defaultValue.type;
    if (this.defaultConnection === "obs") {
      this.obs = new ObsClient();
    }
    
    if (this.obs) {
      this.updateConnections(this.obs.reachable$, "obs");
    }
    
    this.isReady = true;
  }
  
  private updateConnections(observable: BehaviorSubject<boolean>, key: keyof Connections) {
    observable.subscribe(r => {
      const c = this.connections$.getValue();
      c[key] = r;
      this.connections$.next(c);
    });
  }
  
  async init() {
    this.logger.info("is waking up 👍");
    
    if (!this.isReady) {
      this.connect();
    }
    
    
    this.obs?.connect();
    this.power$.next(true);
  }
  
  clean() {
    this.obs?.clean();
    this.power$.next(false);
  }
  
  
}