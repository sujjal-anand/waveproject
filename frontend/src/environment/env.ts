interface Config {
  BASE_URL: string;
  LOGIN_USER: string;
  CREATE_USER: string;
  ADD_FRIEND_LOGIN: string;
  ADD_FRIEND_SIGNUP: string;
  GET_USER_DETAILS: string;
  SECRET_KEY: string;
  LATEST_WAVES: string;
  INVITE_FRIEND: string;
  CREATE_WAVE: string;
  CHANGE_PASSWORD: string;
  GET_FRIENDS_LIST: string;
  ADD_USER_PREFERNCE: string;
  UPDATE_USER_PICTURE: string;
  UPDATE_USER: string;
  GET_ACCEPTED_FRIENDS: string;
  GET_USER_WAVES: string;
  ADD_COMMENT: string;
  ADMIN_SIGNUP: string;
  ADMIN_LOGIN: string;
  GET_ALL_DATA: string;
  GET_ALL_USERS: string;
  GET_ALL_WAVES: string;
}

export const Local: Config = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  LOGIN_USER: import.meta.env.VITE_USER_LOGIN,
  CREATE_USER: import.meta.env.VITE_USER_SIGNUP,
  ADD_FRIEND_LOGIN: import.meta.env.VITE_ADD_FRIEND_LOGIN,
  ADD_FRIEND_SIGNUP: import.meta.env.VITE_ADD_FRIEND_SIGNUP,
  GET_USER_DETAILS: import.meta.env.VITE_GET_USER_DETAILS,
  LATEST_WAVES: import.meta.env.VITE_LATEST_WAVES,
  INVITE_FRIEND: import.meta.env.VITE_INVITE_FRIEND,
  CREATE_WAVE: import.meta.env.VITE_CREATE_WAVE,
  CHANGE_PASSWORD: import.meta.env.VITE_CHANGE_PASSWORD,
  GET_FRIENDS_LIST: import.meta.env.VITE_GET_FRIENDS_LIST,
  ADD_USER_PREFERNCE: import.meta.env.VITE_ADD_USER_PREFERNCE,
  UPDATE_USER_PICTURE: import.meta.env.VITE_UPDATE_USER_PICTURE,
  UPDATE_USER: import.meta.env.VITE_UPDATE_USER,
  GET_ACCEPTED_FRIENDS: import.meta.env.VITE_GET_ACCEPTED_FRIENDS,
  GET_USER_WAVES: import.meta.env.VITE_GET_USER_WAVES,
  ADD_COMMENT: import.meta.env.VITE_ADD_COMMENT,
  ADMIN_SIGNUP: import.meta.env.VITE_ADMIN_SIGNUP,
  ADMIN_LOGIN: import.meta.env.VITE_ADMIN_LOGIN,
  GET_ALL_DATA: import.meta.env.VITE_GET_ALL_DATA,
  GET_ALL_USERS: import.meta.env.VITE_GET_ALL_USERS,
  GET_ALL_WAVES: import.meta.env.VITE_GET_ALL_WAVES,
  SECRET_KEY: import.meta.env.VITE_SECRET_KEY,
};
