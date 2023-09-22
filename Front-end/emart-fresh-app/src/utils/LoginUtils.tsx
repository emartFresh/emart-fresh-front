import { useRecoilValue } from "recoil";
import { loginState } from "../atoms";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export function IsLogIn(): boolean {
  const loginToken = useRecoilValue<JwtToken>(loginState);
  if (loginToken.accessToken) return true;
  else return false;
}

export function SendLoginPageIfNotLogin() {
  const navigate = useNavigate();
  if (!IsLogIn()) {
    navigate("/login");
  }
}

interface MemberInfo {
  exp: number;
  iat: number;
  memberAuth: number;
  memberEmail: string;
  memberId: string;
  memberName: string;
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

export function IsSameAuthNum(inpputedAuth: number): boolean {
  const userAuth: number = GetUserAuth();
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