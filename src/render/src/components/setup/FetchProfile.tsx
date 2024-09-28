import { Callback, Profile } from "../../../../types/types.ts";
import { useAppStore } from "../../store/store.ts";
import { socketEmitter } from "../../functions/websocket.ts";


export async function dataProfile(): Promise<Profile[]> {
  const socketStore = useAppStore((state) => state.socketStore);
  const data = await socketEmitter({socket: socketStore, event: "getProfiles", data: {}});
  return data as Profile[];
}


export async function fetchProfile(callback?: Callback, minDelay = 3000) {
  const setDefaultToCurrent = useAppStore((state) => state.profiles.setDefaultToCurrent)!;
  const data = dataProfile();
  // const date = new Date();
  
  // const delay = minDelay - ((new Date).getTime() - date.getTime());
  // setTimeout(async () => {
  if (callback) {
    callback(await data);
    setDefaultToCurrent();
  }
  // }, delay > 0 ? delay : 0);
  
}