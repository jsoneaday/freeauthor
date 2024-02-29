import { create } from "zustand";
import { Profile } from "./profile";

export type Store = {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
};

export const useProfile = create<Store>((set) => ({
  profile: null,
  setProfile: (profile: Profile) => {
    set((_state) => ({ profile }));
  },
}));
