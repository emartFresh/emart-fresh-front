/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { SetterOrUpdater } from "recoil";

export function getUserLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      // 위치 정보 가져오기 시도
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log("유저의 위치 정보:");
          console.log("위도 (Latitude):", latitude);
          console.log("경도 (Longitude):", longitude);

          resolve({ latitude, longitude }); // 위치 정보를 성공적으로 가져왔을 때 resolve
        },
        (error) => {
          console.error("위치 정보 가져오기 실패:", error.message);
          reject(error); // 위치 정보 가져오기 실패시 reject
        }
      );
    } else {
      console.error("Geolocation API가 지원되지 않는 브라우저입니다.");
      reject(new Error("Geolocation API 지원되지 않음"));
    }
  });
}

// jjs
export async function sendAxiosGetRequest(
  url: string,
  jwtToken: JwtToken,
  setLoginToken: any,
  queryParams: null | object = null,
  callStack: number = 0
): Promise<any> {
  console.log("콜스택", callStack);
  if (callStack >= 5) return null; // callStack이 5 이상이면 null을 반환합니다.

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwtToken.accessToken}`,
        refreshToken: jwtToken.refreshToken,
      },
      params: queryParams,
    });
    console.log("반환값 -----", response.data);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      try {
        // 새로운 액세스 토큰을 사용하여 요청을 재시도
        console.log("401에러 발생!!!");
        const res = await axios.post(
          `${import.meta.env.VITE_BACK_PORT}/refreshToken/newAccessToken`,
          jwtToken
        );

        const newJwtToken: JwtToken = {
          refreshToken: jwtToken.refreshToken,
          accessToken: res.data.newAccessToken,
        };

        console.log("세팅전 값 전 ", res.data.newAccessToken);
        console.log("세팅전 값", newJwtToken);
        setLoginToken(newJwtToken);

        // 재귀 호출에서 반환 값을 명시적으로 반환합니다.
        return await sendAxiosGetRequest(
          url,
          newJwtToken,
          setLoginToken,
          queryParams,
          ++callStack
        );
      } catch (refreshError) {
        console.log("리프래쉬 에러");
        //const currentURL = window.location.href;
        // localStorage.setItem("preUrl", currentURL); // 수정 필요 리다이렉트 코드
        //location.href = "/login";
        throw refreshError;
      }
    } else {
      throw err;
    }
  }
}

// jjs
export async function sendAxiosPostRequest(
  url: string,
  jwtToken: JwtToken,
  setLoginToken: any,
  queryParams: null | object = null,
  callStack: number = 0
): Promise<any> {
  console.log("post 콜스택", callStack);
  if (callStack >= 5) return null; // callStack이 5 이상이면 null을 반환합니다.

  try {
    console.log("post쿼리 파람", queryParams);

    const response = await axios.post(url, queryParams, {
      headers: {
        Authorization: `Bearer ${jwtToken.accessToken}`,
        refreshToken: jwtToken.refreshToken,
      },
    });
    console.log("데이터", response.data);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      try {
        // 새로운 액세스 토큰을 사용하여 요청을 재시도
        console.log("401에러 발생!!!");
        const res = await axios.post(
          `${import.meta.env.VITE_BACK_PORT}/refreshToken/newAccessToken`,
          jwtToken
        );

        const newJwtToken: JwtToken = {
          refreshToken: jwtToken.refreshToken,
          accessToken: res.data.newAccessToken,
        };

        console.log("세팅전 값 전 ", res.data.newAccessToken);
        console.log("세팅전 값", newJwtToken);
        setLoginToken(newJwtToken);

        // 재귀 호출에서 반환 값을 명시적으로 반환합니다.
        return await sendAxiosPostRequest(
          url,
          newJwtToken,
          setLoginToken,
          queryParams,
          ++callStack
        );
      } catch (refreshError) {
        console.log("리프래쉬 에러");
        //location.href = "/login";
        throw refreshError;
      }
    } else {
      throw err;
    }
  }
}
//yewon=========================================================
export const sendAxiosRequest = async (
  url: string,
  httpMethod: string,
  loginToken: JwtToken,
  setLoginToken: SetterOrUpdater<JwtToken>,
  params?: Params | Array<object>,
  callStack: number = 0
): Promise<responseData> => {
  if (callStack >= 10) {
    return { isError: true };
  }
  console.log("sendAxios!!!!!!!!!!!!!!!!!!!!!!!");

  const result = await axios({
    method: httpMethod,
    url: "http://localhost:8080" + url,
    headers: {
      Authorization: `Bearer ${loginToken.accessToken}`,
      refreshToken: loginToken.refreshToken,
    },
    ...(httpMethod === "get" || httpMethod === "delete"
      ? { params: params }
      : { data: params }),
  })
    .then((response) => response.data)
    .catch(async (error) => {
      console.error("ecatch error status>>> ", error.response?.status);
      if (error.response?.status === 401) { 
        console.log("401error, refreshToken >>> " + loginToken.refreshToken);
        return await axios
        .post("http://localhost:8080/refreshToken/newAccessToken", {
          refreshToken: loginToken.refreshToken,
        })
        .then((response) => {
          const newAccessToken = response.data.newAccessToken;
          setLoginToken({
            ...loginToken,
            accessToken: newAccessToken,
          });
          return sendAxiosRequest(
            url,
            httpMethod,
            { ...loginToken, accessToken: newAccessToken },
            setLoginToken,
            params,
            ++callStack
          );
        })
        .catch((error) => { // refresh token 만료 status
          if(error.response.data === "Refresh Token이 유효하지 않습니다."){
            console.log("refresh error >>> " + error.response.data);
            setLoginToken({
              accessToken: "",
              refreshToken: "",
            });            
            toast.error("로그인 유효시간이 만료되었습니다. 다시 로그인해주세요.");
            return;
          }
        });
      }else{
        throw error;
      }
    });
  return result;
};
