import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const loginState = atom({
  key: "memberToken",
  default: {
    accessToken: "",
    refreshToken: "",
  },
  effects_UNSTABLE: [persistAtom],
});

export const kakaoAccessToken = atom({
  key: "kakaoAccessToken",
  default: "",
  effects_UNSTABLE: [persistAtom], 
});

export const loginTypeState = atom({
  key: "loginType",
  default: "", 
  effects_UNSTABLE: [persistAtom],
});

export const cartItemCount = atom({
  key: "cartItemCount",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const naverAccessToken = atom({
  key: "naverAccessToken",
  default: "",
  effects_UNSTABLE: [persistAtom], 
});