"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const rxjs_1 = require("rxjs");
const logger_1 = require("@src/main/utils/logger");
class Server {
    constructor(name) {
        this.name = name;
        this.reachable$ = new rxjs_1.BehaviorSubject(false);
        this.logger = (0, logger_1.getLogger)(name);
        this.reachable$.subscribe((reachable) => {
            this.logger.info(`${this.name} server ${reachable ? "connected" : "disconnected"} `);
        });
    }
    listen() {
        this.logger.info(`${this.name} server is listening`);
    }
    clean() {
        this.logger.info(`cleaning ${this.name} server`);
    }
    get isReachable() {
        return this.reachable$.getValue();
    }
}
exports.Server = Server;
