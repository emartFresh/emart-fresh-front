import { combineReducers } from "redux";
import legi from "./legi";
import locationReducer from "./location";

const rootReducer = combineReducers({
  legi,
  locationReducer,
});

export default rootReducer;
