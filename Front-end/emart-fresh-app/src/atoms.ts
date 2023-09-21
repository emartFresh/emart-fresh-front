import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const loginState = atom({
  key: "memberToken",
  default: {
      accessToken: '',
      refreshToken: '',
    },
  effects_UNSTABLE: [persistAtom],
});
