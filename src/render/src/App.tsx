import "./App.css";
import { Manager } from "socket.io-client";
import { socketEmitter } from "./functions/websocket.ts";
import { Asset } from "../../types/types.ts";
import { FormEvent, useEffect, useRef } from "react";

const url = window.location;
const baseUrl = url.pathname.split("/")[1];
const address = "http://localhost:3000";

const ioPath = (baseUrl ? `/${baseUrl}` : "") + "/socket.io";

const manager = new Manager(address, {
  path: ioPath,
});

const socket = manager.socket("/");

socket.on("connect", () => {
  console.log("client connect");
});

async function handleClick(e: any) {
  e.preventDefault();
  const a = await socketEmitter({socket: socket, event: "setup", data: true});
  console.log(a);
}

socket.on("handleMixerScenes", (scenes: Asset["scene"][]) => {
  console.log(scenes);
});

function App() {
  const ref = useRef(null);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const object: Record<string, string> = {};
    data.forEach((value, key) => {
      object[key] = value as string;
    });
    
    console.log(object);
    const a = await socketEmitter({socket: socket, event: "connectionObs", data: object});
    console.log(a);
    return a;
  };
  
  useEffect(() => {
  
  }, []);
  
  return (
    <>
      <button onClick={handleClick}>setup</button>
      hello word
      <form ref={ref} onSubmit={handleSubmit}>
        <input type="text" name="ip"/>
        <input type="text" name="password"/>
        <button type="submit">Connecté</button>
      </form>
    </>
  );
}

export default App;
