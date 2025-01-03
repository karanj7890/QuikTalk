import {Server} from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io= new Server(server, {
    cors:{
        origin: ["http://localhost:5173"]
    }
})
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }
// it will store which users are online or not
const userSocketMap= {};

io.on("connection", (socket)=>{
    console.log("user has been connected",socket.id);

    const userId= socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]= socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));


    socket.on("disconnect",()=>{
        console.log("user has been disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
    
})

export {io, server, app}