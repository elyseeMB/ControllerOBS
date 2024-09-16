import { socketEmitter } from "../functions/websocket.ts";
import { useAppStore } from "../store/store.ts";
import { useToast } from "../components/basic/Toast.tsx";
import { CardController } from "../components/basic/CardController.tsx";

type ParamsSplashView = {
  controllers: {
    name: string
    description: string
    valid: boolean
  }[]
}

export function SplashView({controllers}: ParamsSplashView) {
  const socketStore = useAppStore((state) => state.socketStore);
  const {pushToast} = useToast();
  
  async function handleClick(e: any) {
    e.preventDefault();
    const a = await socketEmitter({socket: socketStore, event: "setup", data: true}) as any;
    pushToast({message: a["success"], type: "info"});
  }
  
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