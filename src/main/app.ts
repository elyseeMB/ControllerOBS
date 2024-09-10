import * as http from "node:http";
import serverStatic from "serve-static";
import finalhandler from "finalhandler";
import * as path from "node:path";
import * as fs from "node:fs";
import { Setup } from "@src/main/modules/Setup";
import { getLogger, Logger } from "@src/main/utils/logger";
import { Server, Socket } from "socket.io";
import { Connection } from "@src/types/types";


const DEFAULT = require("../resources/json/config.json");
const HTTP_PORT = DEFAULT.HTTP_PORT;
const BASE_URL = DEFAULT.BASE_URL;

// ROOM_SOCKET_IO
const IO_ROOM = {
  SETUP: "setup",
};


export class App {
  
  /* TOOLS */
  private logger: Logger;
  
  /* INIT SERVER */
  private http: http.Server | undefined;
  private io: Server | undefined;
  
  /* SETUP */
  private setup: Setup | undefined;
  
  private ioClients: Map<string, Socket>;
  
  private autostart: boolean;
  
  constructor(autostart: boolean = false) {
    this.logger = getLogger("launch app class App");
    this.ioClients = new Map();
    this.autostart = autostart;
  }
  
  
  private getHttpServer(): http.Server {
    const pathFile = path.join(__dirname, "../render/dist");
    const defaultPath = path.join(__dirname, "../render/dist/index.html");
    const serve = serverStatic(pathFile, {
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
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.end("Error 500");
              } else {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(data);
              }
            });
          } else {
            finalhandler(req, res)(err);
          }
        }
      });
    });
    
    return server;
  }
  
  private getIoServer(http: http.Server): Server {
    const ioOption = {
      cors: {
        origin: `http://localhost:5173`,
        methods: ["GET", "POST"],
        credentials: true,
      },
    };
    // ioOption.path = BASE_URL + "/socket.io";
    const io = new Server(http, ioOption);
    return io;
  }
  
  private initServer() {
    this.http = this.getHttpServer();
    this.io = this.getIoServer(this.http);
    this.http.listen(HTTP_PORT, () => {
      console.log(`server running port ${HTTP_PORT}`);
    });
  }
  
  private initSetup() {
    if (this.setup) {
      return;
    }
    this.setup = new Setup();
  }
  
  init() {
    console.log("je suis l'initialisation");
    this.initServer();
    this.handle();
  }
  
  private handle() {
    this.handleIo();
  }
  
  private handleIo() {
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
    });
    
    // CONNECTION
    this.io.on("connection", (socket) => {
      this.logger.info("Client connected", socket.id);
      this.ioClients.set(socket.id, socket);
      
      // SETUP
      socket.on("setup", (p: boolean, callback) => {
        callback(this.toggleSetup(p, socket));
      });
    });
    
  }
  
  private handleSetup() {
    if (!this.setup) {
      return;
    }
    
    this.setup.obs.scenes$.subscribe((scenes) => {
      this.io?.to(IO_ROOM.SETUP).emit("handleMixerScenes", scenes);
    });
    
  }
  
  private joinSetup(socket: Socket) {
    this.logger.info("New setup client connected", socket.id);
    // OBS
    socket.on("connectionObs", (c: Connection, callback) => {
      callback(this.setup?.connectObs(c));
    });
  }
  
  
  // ------------------------------------------
  private toggleSetup = (power: boolean, socket: Socket) => {
    if (!this.setup && power) {
      this.initSetup();
      this.handleSetup();
    } else if (this.setup && !power) {
      this.setup.clean();
      this.setup = undefined;
    }
    if (power) {
      socket?.join(IO_ROOM.SETUP);
    } else {
      this.ioClients.forEach((c) => {
        c.leave(IO_ROOM.SETUP);
      });
    }
    return {success: "proccess..."};
  };
  
}