import {
  REQUEST_SYSTEM_NOTIFICATION,
  CHANGE_SYSTEM_NOTIFICATION,
  CHANGE_SYSTEM_NOTIFICATION_LOADING,
  REQUEST_SYSTEM_UNREAD_NOTIFICATION,
  CHANGE_SYSTEM_UNREAD_NOTIFICATION,
  CHANGE_SYSTEM_UNREAD_NOTIFICATION_LOADING,
  REQUEST_MY_NOTIFICATION,
  CHANGE_MY_NOTIFICATION,
  CHANGE_MY_NOTIFICATION_LOADING,
  REQUEST_MY_UNREAD_NOTIFICATION,
  CHANGE_MY_UNREAD_NOTIFICATION,
  CHANGE_MY_UNREAD_NOTIFICATION_LOADING,
} from "../../utils/constant";

const SYSTEM_NOTIFICATION_INITIAL_STATE = {
  loading: false,
  systemNotification: [],
};
export function systemNotification(
  state = SYSTEM_NOTIFICATION_INITIAL_STATE,
  action
) {
  switch (action.type) {
    case CHANGE_SYSTEM_NOTIFICATION:
      if (
        action.page != 1 &&
        state.systemNotification &&
        state.systemNotification.length > 0
      ) {
        console.log(state.systemNotification);
        console.log(action.data.systemNotification);
        let result = [];
        state.systemNotification.map((item) => {
          result.push(item);
        });
        if (
          action.data.systemNotification &&
          action.data.systemNotification.length > 0
        ) {
          action.data.systemNotification.map((item) => {
            result.push(item);
          });
        }
        return { ...state, systemNotification: result };
      }
      return { ...state, systemNotification: action.data };
    case CHANGE_SYSTEM_NOTIFICATION_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

const UNREAD_SYSTEM_NOTIFICATION_INITIAL_STATE = {
  loading: false,
  unreadSystemNotification: [],
};
export function unreadSystemNotification(
  state = UNREAD_SYSTEM_NOTIFICATION_INITIAL_STATE,
  action
) {
  switch (action.type) {
    case CHANGE_SYSTEM_UNREAD_NOTIFICATION:
      if (
        action.page != 1 &&
        state.unreadSystemNotification &&
        state.unreadSystemNotification.length > 0
      ) {
        console.log(state.unreadSystemNotification);
        console.log(action.data.unreadSystemNotification);
        let result = [];
        state.unreadSystemNotification.map((item) => {
          result.push(item);
        });
        if (
          action.data.unreadSystemNotification &&
          action.data.unreadSystemNotification.length > 0
        ) {
          action.data.unreadSystemNotification.map((item) => {
            result.push(item);
          });
        }
        return { ...state, unreadSystemNotification: result };
      }
      return { ...state, unreadSystemNotification: action.data };
    case CHANGE_SYSTEM_UNREAD_NOTIFICATION_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

const MY_NOTIFICATION_INITIAL_STATE = {
  loading: false,
  myNotification: [],
};
export function myNotification(state = MY_NOTIFICATION_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_MY_NOTIFICATION:
      if (
        action.page != 1 &&
        state.myNotification &&
        state.myNotification.length > 0
      ) {
        console.log(state.myNotification);
        console.log(action.data.myNotification);
        let result = [];
        state.myNotification.map((item) => {
          result.push(item);
        });
        if (
          action.data.myNotification &&
          action.data.myNotification.length > 0
        ) {
          action.data.myNotification.map((item) => {
            result.push(item);
          });
        }
        return { ...state, myNotification: result };
      }
      return { ...state, myNotification: action.data };
    case CHANGE_MY_NOTIFICATION_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
const UNREAD_MY_NOTIFICATION_INITIAL_STATE = {
  loading: false,
  unreadMyNotification: [],
};
export function unreadMyNotification(
  state = UNREAD_MY_NOTIFICATION_INITIAL_STATE,
  action
) {
  switch (action.type) {
    case CHANGE_MY_UNREAD_NOTIFICATION:
      if (
        action.page != 1 &&
        state.unreadMyNotification &&
        state.unreadMyNotification.length > 0
      ) {
        console.log(state.unreadMyNotification);
        console.log(action.data.unreadMyNotification);
        let result = [];
        state.unreadMyNotification.map((item) => {
          result.push(item);
        });
        if (
          action.data.unreadMyNotification &&
          action.data.unreadMyNotification.length > 0
        ) {
          action.data.unreadMyNotification.map((item) => {
            result.push(item);
          });
        }
        return { ...state, unreadMyNotification: result };
      }
      return { ...state, unreadMyNotification: action.data };
    case CHANGE_MY_UNREAD_NOTIFICATION_LOADING:
      return { ...state, loading: action.data };
    default:
      return state;
  }
}
