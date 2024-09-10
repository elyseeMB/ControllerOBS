import { ObsServer } from "@src/main/server/ObsServer";
import { Connection } from "@src/types/types";
import { getLogger, Logger } from "@src/main/utils/logger";

const config = {
  ip: "localhost:4455",
  password: "5nAso3mFWBNhNzSb",
} satisfies Connection;

export class Setup {
  obs: ObsServer;
  logger: Logger;
  
  constructor() {
    this.logger = getLogger("Setup logger");
    this.obs = new ObsServer(false);
  }
  
  clean() {
    this.disconnectObs();
    this.obs.clean();
  }
  
  connectObs(connection: Connection) {
    this.logger.info(connection);
    console.log(connection);
    if (!this.obs.isReachable) {
      this.obs.connect(connection);
    }
  }
  
  disconnectObs() {
    if (this.obs.isReachable) {
      this.obs.clean();
    }
  }
  
  
}