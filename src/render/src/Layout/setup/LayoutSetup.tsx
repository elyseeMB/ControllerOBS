import { Outlet, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAppStore } from "../../store/store.ts";
import { socketEmitter } from "../../functions/websocket.ts";
import { useEffect, useRef } from "react";

export function LayoutSetup() {
  const refButton = useRef<HTMLButtonElement>(null);
  const navigation = useNavigate();
  const socketStore = useAppStore((state) => state.socketStore);
  const path = window.location.pathname;
  
  useEffect(() => {
    if (path === "/" || window.location.pathname.split("/")[2]) {
      refButton.current?.classList.add("hidden");
    }
    return () => {
      refButton.current?.classList.remove("hidden");
    };
  }, [path]);
  
  
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