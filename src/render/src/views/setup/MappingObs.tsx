import { useAppStore } from "../../store/store.ts";


export function MappingObs() {
  const socketSource = useAppStore((state) => state.socketStore);
  const newName = useAppStore((state) => state.profiles.newProfile);
  const current = useAppStore((state) => state.profiles.getCurrent?.());
  const save = useAppStore((state) => state.profiles.save);
  
  async function name(): Promise<void> {
    return new Promise((resolve) => {
      newName("test");
      resolve();
    });
  }
  
  async function first() {
    return await name();
  }
  
  
  async function second(): Promise<void> {
    if (!current) return;
    await save!();
  }
  
  async function operations() {
    await first();
    await second();
  }
  
  
  return <div>
    <button onClick={operations}>save</button>
    hello
  </div>;
}