import { create } from "zustand";
import { Socket } from "socket.io-client";
import { Asset, ConnectionsConfig, Profile, ProfileSettings } from "../../../types/types.ts";
import { defaultFuncToast, ToastParams } from "../components/basic/Toast.tsx";
import { useRef } from "react";
import { socketEmitter } from "../functions/websocket.ts";
import { klona } from "klona";


function generateId(): number {
  return Date.now();
}

const DEFAULT_SETTING = (): ProfileSettings => {
  return {
    containers: [],
  };
};

const DEFAULT_CONNECTIONS = (): ConnectionsConfig => {
  return {};
};

type defaultFuncToast = (toast: ToastParams) => void;

type ParamsStore = {
  socketStore: Socket
  assets: {
    scenes: Asset["scene"][] | null
    scene: Asset["scene"]["name"] | null
  }
  updateScenesList: (scenes: Asset["scene"][]) => void
  toasts: ToastParams[]
}

type Connections = {
  connections: {
    obs: boolean,
    vmix: boolean,
  }
}

type Profiles = {
  profiles: {
    list: Profile[]
    current: Profile["id"]
    newProfileId: Profile["id"]
    editProfile: boolean,
    ids: () => Profile["id"][]
    newProfile: (name: string) => void
    getCurrent?: () => Profile | undefined
    setCurrent?: (id: Profile["id"]) => void
    save?: () => Promise<void>
    setDefaultToCurrent?: () => void
  }
}

export const useAppStore = create<ParamsStore & Connections & Profiles>()((set, get) => ({
  socketStore: <any>undefined,
  assets: {
    scenes: [],
    scene: "",
  },
  updateScenesList: (scenesElements: Asset["scene"][]) => {
    set((state) => ({assets: {...state.assets, scenes: scenesElements}}));
  },
  toasts: [],
  connections: {
    obs: false,
    vmix: false,
  },
  profiles: {
    list: [],
    current: 0,
    editProfile: false,
    newProfileId: 0,
    ids(): Profile["id"][] {
      return get().profiles.list.map(p => p.id);
    },
    newProfile: (name: string): void => {
      const id = generateId();
      useAppStore.setState((state) => ({
        profiles: {
          ...state.profiles,
          list: [
            {
              id: generateId(),
              name,
              icon: "folder",
              settings: DEFAULT_SETTING(),
              connections: DEFAULT_CONNECTIONS(),
              active: true,
            },
          ],
          current: generateId(),
        },
      }));
      useAppStore.setState((state) => ({
        profiles: {
          ...state.profiles,
          current: id,
        },
      }));
    },
    setDefaultToCurrent: () => {
      set((state) => ({
        profiles: {
          ...state.profiles,
          current: 0,
        },
      }));
      for (const p of get().profiles.list) {
        if (p.active) {
          get().profiles.setCurrent!(p.id);
          break;
        }
        if (!get().profiles.current && get().profiles.list.length > 0) {
          get().profiles.setCurrent!(get().profiles.list[0].id);
        }
      }
    },
    setCurrent: (id: Profile["id"]) => {
      const ids = get().profiles.ids();
      if (ids.indexOf(id) > -1) {
        get().profiles.current = id;
      }
    },
    getCurrent: (): Profile | undefined => {
      const ids = get().profiles.ids();
      const index = ids.indexOf(get().profiles.current);
      if (index > -1) {
        return get().profiles.list[index];
      }
      return undefined;
    },
    save: async () => {
      const current = get().profiles.getCurrent?.();
      const socketStore = get().socketStore;
      if (!current) {
        return;
      }
      const currentClone = klona(current);
      await socketEmitter({socket: socketStore, event: "saveProfile", data: currentClone});
    },
  },
}));


export const addToast = () => {
  const pushToastRef = useRef(defaultFuncToast);
  pushToastRef.current = (toast) => {
    useAppStore.setState((state) => ({toasts: [...state.toasts, toast]}));
  };
  return {pushToastRef};
};

export const globalUpdateSocket = (socket: ParamsStore["socketStore"]) => {
  useAppStore.setState({socketStore: socket});
};

export const globalUpdateScenesList = (scenesElements: Asset["scene"][]) => {
  useAppStore.setState((state) => ({
    assets: {
      ...state.assets, scenes: scenesElements,
    },
  }));
};