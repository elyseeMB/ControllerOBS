import { useNavigate } from "react-router-dom";
import { socketEmitter, socketHandler } from "../../functions/websocket.ts";
import { useAppStore } from "../../store/store.ts";
import { FormEvent, useEffect, useRef } from "react";
import { Asset } from "../../../../types/types.ts";


export function ObsConnection() {
  const ref = useRef<HTMLButtonElement>(null);
  const refFeatures = useRef<HTMLButtonElement>(null);
  const navigation = useNavigate();
  const current = useAppStore((state) => state.profiles.getCurrent!());
  const socketStore = useAppStore((state) => state.socketStore);
  const connections = useAppStore((state) => state.connections);
  const connectionsStore = useAppStore((state) => state.profiles.connections);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const object: Record<string, string> = {};
    data.forEach((value, key) => {
      object[key] = value as string;
    });
    await socketEmitter({socket: socketStore, event: "connectionObs", data: object});
    useAppStore.setState((state) => ({
      profiles: {
        ...state.profiles,
        configConnections: object,
      },
    }));
  };
  
  
  socketHandler(socketStore, "handleObsConnected", (reachable: boolean) => {
    if (connections.obs !== reachable) {
      useAppStore.setState((state) => ({connections: {...state.connections, obs: reachable}}));
    }
  });
  
  socketHandler(socketStore, "handleMixerScenes", (scenes: Asset["scene"][]) => {
    useAppStore.setState((state) => ({
      assets: {
        ...state.assets,
        scenes: scenes,
      },
    }));
  });
  
  socketHandler(socketStore, "handleMainScene", (scene: Asset["scene"]["name"]) => {
    useAppStore.setState((state) => ({
      assets: {
        ...state.assets,
        scene: scene,
      },
    }));
  });
  
  if (connections.obs) {
    ref?.current?.setAttribute("disabled", "");
    refFeatures?.current?.removeAttribute("disabled");
  }
  
  const handleSkip = (e: any): void => {
    e.preventDefault();
    navigation("/obs/connections/profiles");
  };
  
  const connectObs = async () => {
    if (connections.obs) return;
    
    const connectionFunc = connectionsStore();
    if (!connectionFunc.obs) return;
    
    console.log(connectionFunc.obs);
    
    await socketEmitter({socket: socketStore, event: "connectionObs", data: connectionFunc.obs});
    
    // setTimeout(() => {
    //   if (connections.obs) {
    //     console.log("success");
    //   } else {
    //     console.error("error connection useEffect");
    //     socketEmitter({socket: socketStore, event: "disconnectObs"});
    //   }
    // }, 3000);
    
  };
  
  
  useEffect(() => {
    if (!connections.obs) {
      refFeatures.current?.setAttribute("disabled", "");
    }
    
  }, []);
  
  
  const handleSkipConnection = async () => {
    await connectObs();
    console.log(connections.obs);
    navigation("/home");
  };
  
  const handleReturn = async (e: any) => {
    e.preventDefault();
    if (connections.obs) {
      await socketEmitter({socket: socketStore, event: "backSetupPage", data: true});
    }
    navigation("/");
  };
  //
  // window.onload = async () => {
  //   const manager = new Manager("http://localhost:3000/obs/connection", {
  //     path: "",
  //   });
  //
  //   const socket = manager.socket("/");
  //
  //   globalUpdateSocket(socket);
  //
  //   socket.on("connect", () => {
  //     console.log("client connect !");
  //   });
  //
  //   await socketEmitter({socket: socketStore, event: "setup", data: true}) as any;
  // };
  
  return <div className="connection">
    <div className="wrapper__connection-obs">
      <h1>Connection OBS</h1>
      {current && <button className="btn btn-primary" onClick={handleSkipConnection}>you are already connect</button>}
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input type="text" name="ip" placeholder="id"/>
          <input type="text" name="password" placeholder="passeword"/>
          <button ref={ref} type="submit">Connect</button>
        </form>
      </div>
    </div>
    <div className="button__actions">
      <button className="btn btn-secondary" onClick={handleReturn}>return</button>
      <button className="btn btn-primary" ref={refFeatures} onClick={handleSkip}>skip</button>
    </div>
  </div>;
}