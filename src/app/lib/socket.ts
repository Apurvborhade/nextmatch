import { Server } from "socket.io";


let io: Server | null = null;
export function initializeSocket() {
    if (!io) {
        io = new Server({
            cors: { origin: "*" },
        });
        console.log("🔌 Socket.io initialized");


        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("join", (userId: string) => {
                console.log(`User ${userId} joined notifications`);
                socket.join(userId); // Join a room based on user ID
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }
    return io
}



export function getSocketInstance() {
    if (!io) throw new Error("Socket.io has not been initialized!");
    return io;
}
