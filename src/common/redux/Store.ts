import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "./profile/ProfileSlice";
import NotificationStateReducer from "./notification/NotificationStateSlice";

const reducer = {
  profile: ProfileReducer,
  notificationState: NotificationStateReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
