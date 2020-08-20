export const STORAGE_KEY = 'cloud-ssp';

export const state = {
  backendURL: 'http://localhost:8000',
  wzuURL: 'http://localhost:8001',
  user: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null'),
  notification: {},
  packageVersion: process.env.PACKAGE_VERSION || '0',
  version: 'SSP_FRONTEND_VERSION',
  gitCommit: 'SSP_FRONTEND_GIT_COMMIT'
};

export const mutations = {
  setUser(state, { user }) {
    state.user = user;
  },
  setNotification(state, { notification }) {
    state.notification = notification;
  }
};
