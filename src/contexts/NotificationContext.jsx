
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const checkNewNotifications = () => {
      const savedNotifs = localStorage.getItem("notifications");
      if (savedNotifs) {
        const parsedNotifs = JSON.parse(savedNotifs);
        const newNotifs = parsedNotifs.filter(
          notif => !notifications.find(n => n.id === notif.id)
        );
        
        newNotifs.forEach(notification => {
          toast({
            title: notification.title,
            description: notification.description,
            variant: notification.priority === "high" ? "destructive" : "default",
            duration: 5000,
          });
        });

        setNotifications(parsedNotifs);
      }
    };

    const interval = setInterval(checkNewNotifications, 5000);
    return () => clearInterval(interval);
  }, [notifications, toast]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...notification,
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    toast({
      title: notification.title,
      description: notification.description,
      variant: notification.priority === "high" ? "destructive" : "default",
      duration: 5000,
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
