import { RootState } from '../../store';

export const getUser = (store: RootState) => store.user.data;
export const isAuthorized = (store: RootState) => Boolean(store.user.data);
export const isUserLoading = (store: RootState) => store.user.loading;
export const isUserInitialized = (store: RootState) => store.user.initialized;
