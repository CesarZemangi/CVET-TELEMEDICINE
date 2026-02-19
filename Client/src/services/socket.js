import { io } from "socket.io-client"

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    const user = JSON.parse(localStorage.getItem("user"));
    cb({ token: user?.token });
  }
});

export default socket;