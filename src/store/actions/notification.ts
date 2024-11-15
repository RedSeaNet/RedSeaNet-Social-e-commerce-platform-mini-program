import { getNotificationsList } from "../../api/request";
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

export const requestSystemNotificationList = (conditions) => {
  return async (dispatch) => {
    conditions.type = 1;
    conditions.status = 1;
    let result = await getNotificationsList(conditions);
    dispatch(changeSystemNotificationList(result));
  };
};

export const changeSystemNotificationList = (data) => ({
  type: CHANGE_SYSTEM_NOTIFICATION,
  data,
});

export const requestSystemUnreadNotificationList = (conditions) => {
  return async (dispatch) => {
    conditions.type = 1;
    conditions.status = 0;
    let result = await getNotificationsList(conditions);
    dispatch(changeSystemUnreadNotificationList(result));
  };
};

export const changeSystemUnreadNotificationList = (data) => ({
  type: CHANGE_SYSTEM_UNREAD_NOTIFICATION,
  data,
});

export const requestMyNotificationList = (conditions, lastId = 0) => {
  return async (dispatch) => {
    conditions.type = 0;
    conditions.status = 1;
    let result = await getNotificationsList(conditions, lastId);
    dispatch(changeMyNotificationList(result));
  };
};

export const changeMyNotificationList = (data) => ({
  type: CHANGE_MY_NOTIFICATION,
  data,
});

export const requestMyUnreadNotificationList = (conditions) => {
  return async (dispatch) => {
    conditions.type = 0;
    conditions.status = 0;
    let result = await getNotificationsList(conditions);
    dispatch(changeMyUnreadNotificationList(result));
  };
};

export const changeMyUnreadNotificationList = (data) => ({
  type: CHANGE_MY_UNREAD_NOTIFICATION,
  data,
});
