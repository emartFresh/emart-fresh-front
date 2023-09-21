const SET_NAME_EMAIL = "legi/SET_NAME_EMAIL";

export interface user {
  name: string;
  email: string;
}

export interface userAction extends user {
  type: string;
}

//액션 생성 함수
export const setNameEmail = (name: string, email: string): userAction => ({
  type: SET_NAME_EMAIL,
  name,
  email,
});

const initialValue = [{ name: "", email: "" }];

//리듀서
export default function legister(
  state = initialValue,
  action: userAction
): user[] | undefined {
  switch (action.type) {
    case SET_NAME_EMAIL:
      let result: user[] = [
        ...state,
        {
          name: action.name,
          email: action.email,
        },
      ];
      return result;
    default:
      return state;
  }
}
