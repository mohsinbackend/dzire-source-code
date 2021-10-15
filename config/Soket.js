// let io;
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 5000;
module.exports = {
    init: () => {
        server.listen(port, () => console.log("Chat server is Running:" + port))
        return io
    },
    getIo: () => {
        if (!io) {
            throw new Error("Socket Io Error")
        }
        return io
    },
    IoEmit: (eventName, data) => {
            // io.on(eventName, msg => {
            //   console.log(msg);
            //   io.emit(eventName, msg);
            // });
            io.emit(eventName, data)
    },
    IoOn: (eventName,) => {
        // io.on(eventName, msg => {
        //   console.log(msg);
        //   io.emit(eventName, msg);
        // });
        io.on(eventName,function (data) {
           console.log("message", data)
        })
},
}