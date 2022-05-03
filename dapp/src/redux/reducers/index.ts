import { combineReducers } from "redux";

import { walletReducer } from "./wallet";
import { tasksReducer } from "./tasks";
import { loaderReducer } from "./loader";

export const rootReducer = combineReducers({
  wallet: walletReducer,
  tasks: tasksReducer,
  loader: loaderReducer,
});

// Reducer's root-state
export type RootState = ReturnType<typeof rootReducer>;
