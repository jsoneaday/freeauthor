import { Profile } from "./ProfileSlice";
import { RootState } from "../Store";
import { useAppDispatch, useAppSelector } from "../StoreHooks";
import { setUserProfile } from "./ProfileSlice";

export function useProfile(): [
  profile: Profile | null,
  setProfile: (profile: Profile | null) => void
] {
  const profile = useAppSelector((state: RootState) => state.profile);

  const dispatch = useAppDispatch();

  const setProfile = (profile: Profile | null) => {
    console.log("setting profile", profile);
    const profileToDispatch = setUserProfile(profile);

    dispatch(profileToDispatch);
  };

  return [profile, setProfile];
}
