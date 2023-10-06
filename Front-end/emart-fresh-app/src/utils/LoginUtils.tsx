import { useRecoilValue } from "recoil";
import { loginState } from "../atoms";
import { useNavigate } from "react-router-dom";

import jwtDecode from "jwt-decode";

export function IsLogin(): boolean {
  const loginToken = useRecoilValue<JwtToken>(loginState);
  console.log("로그인 토큰", loginToken);
  if (loginToken.accessToken) return true;
  else return false;
}

export function SendLoginPageIfNotLogin() {
  const navigate = useNavigate();
  if (!IsLogin()) {
    navigate("/login");
  }
}

export interface MemberInfo {
  exp: number;
  iat: number;
  memberAuth: number;
  memberEmail: string;
  memberId: string;
  memberName: string;
}

export function GetUserAllInfo(): MemberInfo {
  const loginToken = useRecoilValue<JwtToken>(loginState);
  if (loginToken.accessToken) {
    const memberInfo: MemberInfo = jwtDecode(loginToken.accessToken);
    console.log("토큰 해석", jwtDecode(loginToken.accessToken));
    return memberInfo;
  }
  return null;
}

export function GetUserAuth(): number {
  const loginToken = useRecoilValue<JwtToken>(loginState);
  if (loginToken.accessToken) {
    const memberInfo: MemberInfo = jwtDecode(loginToken.accessToken);
    console.log("토큰 해석", jwtDecode(loginToken.accessToken));
    return memberInfo.memberAuth;
  }
  return -1;
}

export function GetUserName(): string {
  const loginToken = useRecoilValue<JwtToken>(loginState);
  if (loginToken.accessToken) {
    const memberInfo: MemberInfo = jwtDecode(loginToken.accessToken);
    console.log("토큰 해석", jwtDecode(loginToken.accessToken));
    return memberInfo.memberName;
  }
  return "";
}

export function IsSameAuthNum(inpputedAuth: number): boolean {
  const userAuth: number = GetUserAuth();
  console.log("유저 auth", userAuth);
  return userAuth === inpputedAuth;
}

export function SendHomePageIfNotAuth(validAuth: number) {
  const navigate = useNavigate();
  if (IsSameAuthNum(validAuth)) {
    return;
  } else {
    return navigate("/");
  }
}
