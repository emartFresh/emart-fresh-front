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

//jjs에 의한 수정 : 추가
export const loginTypeState = atom({
  key: "loginType",
  default: "", // 다른 상태의 초기값을 여기에 설정하세요.
  effects_UNSTABLE: [persistAtom], // 다른 상태도 필요한 경우에만 추가하세요.
});
