import { ObsServer } from "@src/main/server/ObsServer";
import { Connection, IconName, Profile, ProfileSettings } from "@src/types/types";
import { getLogger, Logger } from "@src/main/utils/logger";
import { Profiles } from "@src/main/modules/Profiles";

const config = {
  ip: "localhost:4455",
  password: "5nAso3mFWBNhNzSb",
} satisfies Connection;

export class Setup {
  obs: ObsServer;
  logger: Logger;
  profiles: Profiles;
  
  constructor() {
    this.logger = getLogger("Setup logger");
    this.obs = new ObsServer(false);
    this.profiles = new Profiles();
  }
  
  clean() {
    this.disconnectObs();
    this.obs.clean();
  }
  
  connectObs(connection: Connection) {
    this.logger.info(connection);
    if (!this.obs.isReachable) {
      this.obs.connect(connection);
      // const data = this.profiles.getAll();
      // this.profiles.set({
      //   id: 6,
      //   name: "string 4 jfksd",
      //   icon: "folder",
      //   active: false,
      //   settings: {
      //     containers: [{
      //       name: "container-name 4",
      //       containers: {
      //         name: "container 4",
      //         sources: [{
      //           name: "sourceName",
      //           options: {},
      //         }],
      //         options: {},
      //       },
      //     }],
      //   },
      //   connections: {
      //     type: "obs",
      //   },
      //   autoStart: false,
      //   record: "start",
      // });
    }
  }
  
  disconnectObs() {
    if (this.obs.isReachable) {
      this.obs.clean();
    }
  }
  
  
}