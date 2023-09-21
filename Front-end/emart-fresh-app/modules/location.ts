const SET_USER_LOCATION = "location/SET_USER_LOCATION";

export interface userLocation {
  latitude: number;
  longitude: number;
}

export interface userLocationAction extends userLocation {
  type: string;
}

export const setUserLoaction = (
  latitude: number,
  longitude: number
): userLocationAction => ({
  type: SET_USER_LOCATION,
  latitude,
  longitude,
});

const initialValue: userLocation = { latitude: 0, longitude: 0 };

export default function locationReducer(
  state = initialValue,
  action: userLocationAction
): userLocation {
  switch (action.type) {
    case SET_USER_LOCATION:
      return {
        latitude: action.latitude,
        longitude: action.longitude,
      };
    default:
      return state;
  }
}
