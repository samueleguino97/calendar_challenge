import { createStore, combineReducers } from "redux";
import { calendar } from "./reducers/calendar";

const combined = combineReducers({ calendar });

export default createStore(combined);
