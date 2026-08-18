import { useEffect, useState } from 'react';
import { getNotifications } from '../services/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount };
};
