import { useGetNotificationsQuery } from "@/features/notifications/notificationsApi";
import { useEffect, useRef, useState } from "react";
import { io,Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Ensure this matches your backend

let socketInstance: Socket | null = null;


const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const initialized = useRef(false);
    
    useEffect(() => {
        if (!socketInstance) {
            console.log("🔌 Initializing socket...");
            socketInstance = io(SOCKET_URL, { transports: ["websocket"] });
        }

        setSocket(socketInstance);

        return () => {
            console.log("❌ Socket cleanup (Component unmount)");
        };
    }, []);


    return socket;
};

export default useSocket;
