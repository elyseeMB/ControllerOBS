import { Client } from "@src/main/clients/Client";
import { ObsServer } from "@src/main/server/ObsServer";

export class ObsClient extends Client {
  
  private obs: ObsServer;
  
  constructor() {
    super("obs");
    this.obs = new ObsServer();
  }
  
  init() {
    this.addSubscription(this.obs.reachable$.subscribe(r => {
      if (r !== this.isReachable) {
        this.reachable$.next(r);
        if (r) {
          this.logger.info("obs-Client connected");
        }
      }
    }));
  }
  
  override async connect() {
    super.connect();
    this.obs.connect();
  }
  
  override clean(): void {
    this.obs.clean();
    this.reachable$.next(false);
    super.clean();
  }
}