import { useAppStore } from "../store/store.ts";
import { useCallback, useEffect, useMemo } from "react";
import { ButtonUi } from "../components/basic/ButtonUi.tsx";
import { socketEmitter, socketHandler } from "../functions/websocket.ts";
import { useNavigate } from "react-router-dom";
import { Profile } from "../../../types/types.ts";

export function SidebarLayout() {
  const navigate = useNavigate();
  const socketStore = useAppStore((state) => state.socketStore);
  const profiles = useAppStore((state) => state.profiles.list.map(l => l));
  const getCurrent = useAppStore((state) => state.profiles.getCurrent!);
  const setCurrent = useAppStore((state) => state.profiles.setCurrent!);
  
  const profileCurrent = useMemo(() => {
    return profiles.filter(profile => profile.connections.obs);
  }, [profiles]);
  
  const changeProfile = useCallback(async (id: number) => {
    setCurrent(id);
    if (getCurrent()?.settings.containers.length) {
      await socketEmitter({socket: socketStore, event: "setDefaultProfile", data: id});
    }
    navigate("/home");
  }, []);
  
  useEffect(() => {
    socketHandler(socketStore, "handleDefault", (profileId: Profile["id"]) => {
      console.log(profileId);
    });
  }, []);
  
  
  return <div className="sidebar">
    <div className="sidebar__wrapper">
      <h3>Profiles Obs</h3>
      <div className="flex-column">
        {profileCurrent.map((profile) => (
          <ButtonUi {...profile} key={profile.id} onClick={() => changeProfile(profile.id)}
                    active={getCurrent()?.id === profile.id}/>
        ))}
      </div>
    </div>
  
  </div>;
}