import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore,
} from "redux";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic, rootReducer } from "./modules/root";

function configureStore() {
  const epicMiddleware = createEpicMiddleware();

  if (import.meta.env.VITE_ENV === "development") {
    const composeEnhancers =
      typeof window !== "undefined"
        ? // @ts-expect-error Redux devtools
          window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;
    const store = createStore(
      rootReducer,
      composeEnhancers(applyMiddleware(epicMiddleware))
    );
    epicMiddleware.run(rootEpic);
    return store;
  } else {
    const store = createStore(rootReducer, applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
    return store;
  }
}

const store = configureStore();
export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export default store;
