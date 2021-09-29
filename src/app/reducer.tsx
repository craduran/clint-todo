import { combineReducers } from "redux"
import { categoryReducer } from "./categoryReducer"
import { todosReducer } from "./todosReducer"

export const rootReducer = combineReducers({categories: categoryReducer, todos: todosReducer});

export type RootState = ReturnType<typeof rootReducer>