import { SpecificAndDefault } from "@src/main/utils/db";
import db from "@src/main/utils/db";
import { Subject } from "rxjs";
import { Profile } from "@src/types/types";
import { getLogger, Logger } from "@src/main/utils/logger";

export class Profiles {
  logger: Logger;
  default$: Subject<Profile["id"]>;
  private profiles: SpecificAndDefault;
  
  constructor() {
    this.logger = getLogger("class Profiles");
    this.profiles = db.getSpecificAndDefault(["profiles"], false);
    this.profiles.configPart$.subscribe(value => {
      this.profiles.defaultValue = value;
    });
    this.default$ = new Subject();
  }
  
  private getProfiles(): Profile[] {
    const profiles = this.profiles.defaultValue;
    return profiles || [];
  }
  
  private getIndex(id: Profile["id"], profiles: Profile[]): number {
    const ids = profiles.map(p => p.id);
    return ids.indexOf(id);
  }
  
  private save(profiles: Profile[]) {
    this.profiles.edit(profiles);
    this.profiles.defaultValue = profiles;
  }
  
  private isValid(profile: Profile): boolean {
    if (typeof profile !== "object") return false;
    
    if (Object.hasOwn(profile, "id") && typeof profile.id !== "number") return false;
    if (Object.hasOwn(profile, "name") && typeof profile.name !== "string") return false;
    if (Object.hasOwn(profile, "settings") && typeof profile.settings !== "object") return false;
    return true;
  }
  
  getAll(): Profile[] {
    return this.getProfiles();
  }
  
  set(profile: Profile) {
    if (!this.isValid(profile)) {
      return;
    }
    const profiles = this.getProfiles();
    const index = this.getIndex(profile.id, profiles);
    this.logger.info(index);
    // new Profile;
    if (index === -1) {
      profiles.push(profile);
    } else {
      profiles[index] = profile;
    }
    this.save(profiles);
  }
  
  setDefault(id: Profile["id"]) {
    const profiles = this.getProfiles();
    if (this.getIndex(id, profiles) === -1) {
      return;
    }
    for (const i in profiles) {
      profiles[i].active = (profiles[i].id === id);
    }
    this.default$.next(id);
    this.save(profiles);
  }
}