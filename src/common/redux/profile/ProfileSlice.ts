import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Profile = {
  id: number;
  updatedAt: string;
  username: string;
  fullname: string;
  description: string;
  ownerAddress: string;
  socialLinkPrimary: string;
  socialLinkSecond: string;
};

let initialState: Profile | null = null;

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserProfile: (state: any, action: PayloadAction<Profile | null>) => {
      state = action.payload;

      return state;
    },
  },
});

export const { setUserProfile } = profileSlice.actions;
export default profileSlice.reducer;
