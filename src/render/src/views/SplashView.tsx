import { socketEmitter, socketHandler } from "../functions/websocket.ts";
import { globalFetchProfile, useAppStore } from "../store/store.ts";
import { useToast } from "../components/basic/Toast.tsx";
import { CardController } from "../components/basic/CardController.tsx";
import { fetchProfile } from "../components/setup/FetchProfile.tsx";
import { useEffect } from "react";
import { Asset } from "../../../types/types.ts";
import { useNavigate } from "react-router-dom";

type ParamsSplashView = {
  controllers: {
    name: string
    description: string
    valid: boolean
  }[]
}

export function SplashView({controllers}: ParamsSplashView) {
  const navigate = useNavigate();
  const socketStore = useAppStore((state) => state.socketStore);
  const current = useAppStore((state) => state.profiles.current);
  const {pushToast} = useToast();
  
  
  async function handleClick(e: any) {
    e.preventDefault();
    const a = await socketEmitter({socket: socketStore, event: "setup", data: true}) as any;
    pushToast({message: a["success"], type: "info"});
    
    if (current) {
      navigate("/home");
    }
  }
  
  socketHandler(socketStore, "handleMixerScenes", (scenes: Asset["scene"][]) => {
    useAppStore.setState((state) => ({
      assets: {
        ...state.assets,
        scenes: scenes,
      },
    }));
  });
  
  // fetchProfile(async (data) => {
  //   await globalFetchProfile(data);
  // });
  
  
  return <div className="splash-view">
    <h1>Welcome !</h1>
    
    <div className="container__controller">
      {controllers.map((controller) => (
        <CardController key={controller.name} isValid={controller.valid} onClick={handleClick} name={controller.name}
                        description={controller.description}/>
      ))}
    </div>
    
    <span>
      {(new Date()).getFullYear()} -
      Controller video
    </span>
  </div>;
}