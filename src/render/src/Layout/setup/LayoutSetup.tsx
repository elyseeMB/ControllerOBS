import { Outlet, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { globalFetchProfile, globalUpdateSocket, useAppStore } from "../../store/store.ts";
import { socketEmitter, socketHandler } from "../../functions/websocket.ts";
import { useEffect, useRef } from "react";
import { Manager } from "socket.io-client";
import { Asset, Profile } from "../../../../types/types.ts";
import { fetchProfile } from "../../components/setup/FetchProfile.tsx";
import { Profiles } from "../../../../main/modules/Profiles.ts";


const baseUrl = window.location.pathname.split("/")[1];
const address = `http://localhost:3000/${baseUrl}`;
// const ioPath = (baseUrl ? `/${baseUrl}` : "") + "/socket.io";

const manager = new Manager(address, {
  path: "",
});

const socket = manager.socket("/");

globalUpdateSocket(socket);

socket.on("connect", () => {
  console.log("client connect !");
});


export function LayoutSetup() {
  const connections = useAppStore((state) => state.connections);
  const refButton = useRef<HTMLButtonElement>(null);
  const navigation = useNavigate();
  const socketStore = useAppStore((state) => state.socketStore);
  const path = window.location.pathname;
  
  useEffect(() => {
    if (path === "/" || window.location.pathname.split("/")[2]) {
      refButton.current?.classList.add("hidden");
    }
    
    socketEmitter({socket: socketStore, event: "setup", data: true}) as any;
    
    
    return () => {
      refButton.current?.classList.remove("hidden");
    };
  }, [path]);
  
  
  fetchProfile(async (data) => {
    await globalFetchProfile(data);
  });
  
  
  const handleClick = async () => {
    await socketEmitter({socket: socketStore, event: "backSetupPage", data: true});
    navigation("/");
  };
  
  return <>
    <button ref={refButton} className="btn btn-rounded btn__back" onClick={handleClick}>
      <IoArrowBack className="icon"/>
    </button>
    <Outlet/>
  </>;
}