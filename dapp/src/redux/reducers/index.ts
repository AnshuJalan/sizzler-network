import { combineReducers } from "redux";

import { walletReducer } from "./wallet";
import { tasksReducer } from "./tasks";

export const rootReducer = combineReducers({
  wallet: walletReducer,
  tasks: tasksReducer,
});

// Reducer's root-state
export type RootState = ReturnType<typeof rootReducer>;
