import { useAppStore } from "../../store/store.ts";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useToast } from "../../components/basic/Toast.tsx";
import { useNavigate } from "react-router-dom";

export function MappingObs() {
  const {pushToast} = useToast();
  const navigation = useNavigate();
  const refInput = useRef<HTMLInputElement>(null);
  const newName = useAppStore((state) => state.profiles.newProfile);
  const current = useAppStore((state) => state.profiles.getCurrent?.());
  const configConnection = useAppStore((state) => state.profiles.configConnections);
  const save = useAppStore((state) => state.profiles.save)!;
  const list = useAppStore((state) => state.profiles.list);
  const setScenes = useAppStore((state) => state.profiles.setScenes)!;
  const scenes = useAppStore((state) => state.assets.scenes);
  
  const config = {
    ip: configConnection.ip,
    password: configConnection.password,
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const object: Record<string, string> = {};
    data.forEach((value, key) => {
      object[key] = value as string;
    });
    const profileName = getUniqueName(object.profileName);
    newName(profileName);
    if (!current) {
      return;
    } else {
      setScenes(scenes ?? [], {
        type: "obs", obs: config,
      }, "folder");
    }
    await save();
    pushToast({message: "Profile save !", type: "success"});
    
    
    navigation("/features");
    
  };
  
  useEffect(() => {
    refInput.current!.focus();
  }, []);
  
  const getUniqueName = (originalName: string): string => {
    let index = 0;
    let count = 0;
    let profileName: string = "";
    
    const names = list.map(p => p.name);
    while (index > -1) {
      profileName = !count ? originalName : originalName + `(${count + 1})`;
      index = names.indexOf(profileName);
      count++;
    }
    return profileName;
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={refInput} type="text" name="profileName"/>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
