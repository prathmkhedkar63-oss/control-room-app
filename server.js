const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Mobile sends offer
  socket.on("offer", (data) => {
    io.to("admin-room").emit("offer", { offer: data.offer, clientId: socket.id });
  });

  // Admin sends answer
  socket.on("answer", (data) => {
    io.to(data.clientId).emit("answer", data.answer);
  });

  // Admin joins special room
  socket.on("join-admin", () => {
    socket.join("admin-room");
    console.log("Admin joined control room");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
