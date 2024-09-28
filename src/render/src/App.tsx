import "./assets/css/App.css";
import { useAppStore } from "./store/store.ts";
import { socketEmitter, socketHandler } from "./functions/websocket.ts";


function App() {
  const socketStore = useAppStore((state) => state.socketStore);
  const current = useAppStore((state) => state.profiles.getCurrent!());
  
  const handeClick = async () => {
    await socketEmitter({socket: socketStore, event: "togglePower", data: true});
  };
  
  const handeObs = () => {
    socketHandler(socketStore, "handleObsConnected", (reachable: boolean) => {
      console.log(reachable);
    });
  };
  
  const handlePower = () => {
    socketHandler(socketStore, "handlePower", (p: boolean) => {
      console.log(p);
    });
  };
  
  
  // console.log(current);
  
  return (
    <div>
      <h1>Info Profile</h1>
      <table className="manager__profile">
        {/*<thead>*/}
        {/*<td>name</td>*/}
        {/*<td>password</td>*/}
        {/*<td>ip</td>*/}
        {/*<td>icon</td>*/}
        {/*</thead>*/}
        {/*<tbody>*/}
        {/*<td>*/}
        {/*  {current?.name}*/}
        {/*</td>*/}
        {/*<td>*/}
        {/*  {current?.connections.obs?.password}*/}
        {/*</td>*/}
        {/*<td>*/}
        {/*  {current?.connections.obs?.ip}*/}
        {/*</td>*/}
        {/*<td>*/}
        {/*  {current?.icon}*/}
        {/*</td>*/}
        {/*</tbody>*/}
      </table>
      
      <button onClick={handeClick}>Connected</button>
      
      <button onClick={handeObs}>ConnectionObs</button>
      <button onClick={handlePower}>power</button>
    </div>
  );
}

export default App;
