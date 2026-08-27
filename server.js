const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Root route → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// WebRTC signaling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("offer", ({ offer }) => {
    socket.broadcast.emit("offer", { offer, clientId: socket.id });
  });

  socket.on("answer", ({ answer, clientId }) => {
    io.to(clientId).emit("answer", answer);
  });

  socket.on("join-admin", () => {
    console.log("Admin joined");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
