import { useNavigate } from "react-router-dom";
import { socketEmitter, socketHandler } from "../../functions/websocket.ts";
import { useAppStore } from "../../store/store.ts";
import { FormEvent, useEffect, useRef } from "react";


export function ObsConnection() {
  const ref = useRef<HTMLButtonElement>(null);
  const refFeatures = useRef<HTMLButtonElement>(null);
  const navigation = useNavigate();
  const socketStore = useAppStore((state) => state.socketStore);
  const connections = useAppStore((state) => state.connections);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const object: Record<string, string> = {};
    data.forEach((value, key) => {
      object[key] = value as string;
    });
    console.log(object);
    await socketEmitter({socket: socketStore, event: "connectionObs", data: object});
  };
  
  
  socketHandler(socketStore, "handleObsConnected", (reachable: boolean) => {
    if (connections.obs !== reachable) {
      useAppStore.setState((state) => ({connections: {...state.connections, obs: reachable}}));
    }
    
  });
  
  if (connections.obs) {
    ref?.current?.setAttribute("disabled", "");
    refFeatures?.current?.removeAttribute("disabled");
  }
  
  const handleSkip = (e: any): void => {
    e.preventDefault();
    navigation("/features");
  };
  
  useEffect(() => {
    if (!connections.obs) {
      refFeatures.current?.setAttribute("disabled", "");
    }
  }, []);
  
  const handleReturn = async (e: any) => {
    e.preventDefault();
    if (connections.obs) {
      await socketEmitter({socket: socketStore, event: "backSetupPage", data: true});
    }
    navigation("/");
  };
  
  return <div className="connection">
    <div className="wrapper__connection-obs">
      <h1>Connection OBS</h1>
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