import "./assets/css/App.css";
import { Asset } from "../../types/types.ts";
import { useAppStore } from "./store/store.ts";
import { useState } from "react";


function App() {
  const [scenes, setScenes] = useState<Asset["scene"][]>([]);
  const connections = useAppStore((state) => state.connections);
  const {socketStore, updateScenesList} = useAppStore();
  
  socketStore.on("handleMixerScenes", (scenes: Asset["scene"][]) => {
    updateScenesList(scenes);
    setScenes(scenes);
  });
  
  console.log(connections);
  
  console.log(scenes);
  
  
  return (
    <>
      <ul>
        App
        {/*{scenes.map((scene, index) => (*/}
        {/*  <li key={index}> {scene.name} </li>*/}
        {/*))}*/}
      </ul>
    </>
  );
}

export default App;
