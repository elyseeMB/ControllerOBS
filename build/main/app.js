"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const http = __importStar(require("node:http"));
const serve_static_1 = __importDefault(require("serve-static"));
const finalhandler_1 = __importDefault(require("finalhandler"));
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
const Setup_1 = require("@src/main/modules/Setup");
const logger_1 = require("@src/main/utils/logger");
const socket_io_1 = require("socket.io");
const process = __importStar(require("node:process"));
const db_1 = __importDefault(require("@src/main/utils/db"));
const Profiles_1 = require("@src/main/modules/Profiles");
const Controller_1 = require("@src/main/modules/Controller");
const DEFAULT = require("../resources/json/config.json");
const HTTP_PORT = DEFAULT.HTTP_PORT;
const BASE_URL = DEFAULT.BASE_URL;
// ROOM_SOCKET_IO
const IO_ROOM = {
    SETUP: "setup",
    CONTROLLER: "controller",
};
class App {
    constructor(autostart = false) {
        // ------------------------------------------
        this.toggleSetup = (power, socket) => {
            if (!this.setup && power) {
                this.initSetup();
                this.handleSetup();
            }
            else if (this.setup && !power) {
                this.setup.clean();
                this.setup = undefined;
            }
            if (power) {
                socket?.join(IO_ROOM.SETUP);
            }
            else {
                this.ioClients.forEach((c) => {
                    c.leave(IO_ROOM.SETUP);
                });
            }
            return { success: "proccess..." };
        };
        this.toggleController = (power, socket) => {
            if (!this.controller && power) {
                this.toggleSetup(false);
                this.initController();
                this.handeController();
            }
            else if (this.controller && !power) {
                this.controller.clean();
                this.controller = undefined;
            }
            if (power) {
                socket?.join(IO_ROOM.CONTROLLER);
            }
            else {
                this.ioClients.forEach((c) => c.leave(IO_ROOM.CONTROLLER));
            }
        };
        this.setDefaultProfile = (id) => {
            if (this.controller) {
                this.toggleController(false);
            }
            return this.profiles.setDefault(id);
        };
        this.logger = (0, logger_1.getLogger)("launch app class App");
        this.profiles = new Profiles_1.Profiles();
        this.ioClients = new Map();
        this.autostart = autostart;
    }
    initError() {
        const exit = (error) => {
            this.logger.error(error);
            this.clean();
            process.on("unhandledRejection", (err) => exit(err.stack));
            process.on("uncaughtException", (err) => exit(err.stack));
        };
    }
    getHttpServer() {
        const pathFile = path.join(__dirname, "../render/dist");
        const defaultPath = path.join(__dirname, "../render/dist/index.html");
        const serve = (0, serve_static_1.default)(pathFile, {
            setHeaders: (res) => {
                res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type");
                res.setHeader("Access-Control-Allow-Credentials", "true");
            },
        });
        const server = http.createServer((req, res) => {
            serve(req, res, (err) => {
                if (err) {
                    if (err.statusCode === 404) {
                        fs.readFile(defaultPath, (err, data) => {
                            if (err) {
                                res.writeHead(500, { "Content-Type": "text/plain" });
                                res.end("Error 500");
                            }
                            else {
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.end(data);
                            }
                        });
                    }
                    else {
                        (0, finalhandler_1.default)(req, res)(err);
                    }
                }
            });
        });
        return server;
    }
    getIoServer(http) {
        const ioOption = {
            cors: {
                origin: `http://localhost:5173`,
                methods: ["GET", "POST"],
                credentials: true,
            },
        };
        // ioOption.path = BASE_URL + "/socket.io";
        const io = new socket_io_1.Server(http, ioOption);
        return io;
    }
    initServer() {
        this.http = this.getHttpServer();
        this.io = this.getIoServer(this.http);
        this.http.listen(HTTP_PORT, () => {
            console.log(`server running port ${HTTP_PORT}`);
        });
    }
    async initDatabase() {
        await db_1.default.connect();
    }
    initController() {
        if (!this.controller)
            return;
        this.controller = new Controller_1.Controller("class controller");
    }
    initSetup() {
        if (this.setup) {
            return;
        }
        this.setup = new Setup_1.Setup();
    }
    async init() {
        this.initError();
        this.initServer();
        await this.initDatabase();
        this.handle();
    }
    clean() {
        this.logger.info("cleanning...");
        this.http?.close();
        this.io?.close();
    }
    handle() {
        this.handleIo();
    }
    handleIo() {
        if (!this.io) {
            return;
        }
        this.io.of("/").adapter.on("join-room", (room, id) => {
            const socket = this.ioClients.get(id);
            if (!socket) {
                return;
            }
            if (room === IO_ROOM.SETUP) {
                this.joinSetup(socket);
            }
            else if (room === IO_ROOM.CONTROLLER) {
                this.joinController(socket);
            }
        });
        // CONNECTION
        this.io.on("connection", (socket) => {
            this.logger.info("Client connected-socketIO", socket.id);
            this.ioClients.set(socket.id, socket);
            //PROFILE
            socket.on("getProfiles", (_date, callback) => {
                callback(this.profiles.getAll());
            });
            socket.on("saveProfile", (p, callback) => {
                this.logger.warn(p);
                callback(this.profiles.set(p));
            });
            socket.on("setDefaultProfile", (id, callback) => {
                callback(this.setDefaultProfile(id));
            });
            // SETUP
            socket.on("setup", (p, callback) => {
                callback(this.toggleSetup(p, socket));
            });
            // Controller
            socket.on("togglePower", (power, callback) => {
                callback(this.toggleController(power, socket));
            });
            this.sendAppState();
        });
        this.profiles.default$.subscribe((profile) => {
            this.logger.info("Default profile changed", profile);
            this.io?.emit("handleDefault", profile);
        });
    }
    handleSetup() {
        if (!this.setup) {
            return;
        }
        this.setup.obs.reachable$.subscribe((reachable) => {
            this.io?.to(IO_ROOM.SETUP).emit("handleObsConnected", reachable);
        });
        this.setup.obs.scenes$.subscribe((scenes) => {
            this.io?.to(IO_ROOM.SETUP).emit("handleMixerScenes", scenes);
        });
    }
    joinSetup(socket) {
        this.logger.info("New setup client connected", socket.id);
        // OBS
        socket.on("connectionObs", (c, callback) => {
            callback(this.setup?.connectObs(c));
        });
        socket.on("disconnectObs", (_data, callback) => {
            callback(this.setup?.disconnectObs());
        });
        // EVENT PAGE CLIENT
        socket.on("backSetupPage", (isBack, callback) => {
            if (!isBack)
                return;
            callback(this.setup?.clean());
        });
    }
    handeController() {
        if (!this.controller || !this.io) {
            return;
        }
        this.controller.power$.subscribe((p) => {
            this.io?.emit("handlePower", p);
        });
        this.controller.connections$.subscribe((c) => {
            this.io?.to(IO_ROOM.CONTROLLER).emit("handleObsConnected", c.obs);
        });
    }
    joinController(socket) {
        this.logger.info("new Controller client connected");
        this.sendAppState();
    }
    sendAppState() {
        if (!this.io) {
            return;
        }
        this.io.emit("handlePower", this.controller ? true : false);
        this.io.emit("handleObsConnected", this.controller?.connections$.getValue().obs || this.setup?.obs.isReachable);
    }
}
exports.App = App;
