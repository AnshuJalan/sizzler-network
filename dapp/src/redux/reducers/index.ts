import { combineReducers } from "redux";

import { walletReducer } from "./wallet";
import { tasksReducer } from "./tasks";
import { loaderReducer } from "./loader";
import { proposalsReducer } from "./proposals";

export const rootReducer = combineReducers({
  wallet: walletReducer,
  tasks: tasksReducer,
  loader: loaderReducer,
  proposals: proposalsReducer,
});

// Reducer's root-state
export type RootState = ReturnType<typeof rootReducer>;
