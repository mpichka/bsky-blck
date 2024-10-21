import { RootState } from '../../store';

export const getErrorNotification = (store: RootState) => store.app.error;
