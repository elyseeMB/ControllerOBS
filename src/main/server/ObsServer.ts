import { Server } from "@src/main/server/Server";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";
import { Asset, Connection, ResponseObsItem, ResponseObsScene } from "@src/types/types";
import { BehaviorSubject } from "rxjs";

export class ObsServer extends Server {
  initScene: Asset["sources"]["name"] = "";
  websocket: OBSWebSocket;
  scenes$: BehaviorSubject<Asset["scene"][]>;
  obsConfig: Connection;
  
  private isTryingToConnect = false;
  private tryConnectOnce = false;
  
  
  constructor(fromProfile: boolean = false) {
    super("obs-server");
    
    this.websocket = new OBSWebSocket();
    this.scenes$ = new BehaviorSubject<Asset[
      "scene"][]>([]);
  }
  
  async connect(connections?: Connection, once: boolean = false) {
    if (connections) {
      this.obsConfig = connections;
    }
    
    this.isTryingToConnect = true;
    this.tryConnectOnce = once;
    this.websocketConnection();
  }
  
  override async clean() {
    if (this.websocket) {
      this.websocket.disconnect();
    }
    this.reachable$.next(false);
    super.clean();
  }
  
  private async websocketConnection() {
    try {
      await this.websocket.connect("ws://" +
        this.obsConfig?.ip, this.obsConfig?.password);
      await this.initWebsocket();
      this.isTryingToConnect = false;
      this.reachable$.next(true);
    } catch (e) {
      this.logger.error("obs-server connect error", e);
    }
  }
  
  private async initWebsocket() {
    await this.manageSceneList();
  }
  
  
  private async manageSceneList() {
    const getListScene = async () => {
      return await this.websocket.call("GetSceneList");
    };
    
    const getParsedSceneList = async () => {
      const data = await getListScene();
      return this.parseScenes(data.scenes);
    };
    
    const updateSceneList = (scenes: Asset["scene"][]) => {
      this.scenes$.next(scenes);
    };
    
    const data = await getListScene();
    this.initScene = data["currentProgramSceneName"];
    const scenes = await this.parseScenes(data.scenes);
    updateSceneList(scenes);
    
  }
  
  async getSceneItemList(sceneName: Asset["scene"]["name"]) {
    return await this.websocket.call("GetSceneItemList", {sceneName});
  }
  
  async parseScenes(scenes: OBSResponseTypes["GetSceneList"]["scenes"]): Promise<Asset["scene"][]> {
    const data = [];
    
    for (const scene of scenes as ResponseObsScene[]) {
      const items = await this.getSceneItemList(scene.sceneName);
      const sceneItems = items.sceneItems as ResponseObsItem[];
      data.push({
        name: scene.sceneName,
        containers: [
          {
            name: "root",
            sources: sceneItems.map((source) => ({
              name: source.sourceName,
              options: {
                id: source.sceneItemId,
              },
            })),
          },
        ],
      });
    }
    return data;
    
  }
}