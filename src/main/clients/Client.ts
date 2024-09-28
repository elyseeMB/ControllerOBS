import { BehaviorSubject, Subscription } from "rxjs";
import { getLogger, Logger } from "@src/main/utils/logger";

export class Client {
  reachable$ = new BehaviorSubject<boolean>(false);
  logger: Logger;
  private clientSubscriptions: Subscription[] = [];
  
  constructor(public name: string) {
    this.logger = getLogger(name);
    this.reachable$.subscribe((reachable) => {
      this.logger.info(`${name} client ${reachable ? "connected" : "disconnected"}`);
    });
  }
  
  connect() {
    this.logger.info(`connecting ${this.name} client`);
  }
  
  clean() {
    this.logger.info(`cleaning ${this.name} client`);
    this.cleanSubscriptions();
  }
  
  protected addSubscription(subscription: Subscription) {
    this.clientSubscriptions.push(subscription);
  }
  
  private cleanSubscriptions() {
    for (const s of this.clientSubscriptions) {
      s.unsubscribe();
    }
  }
  
  get isReachable() {
    return this.reachable$.getValue();
  }
}