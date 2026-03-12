const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  console.log("WebSocket connected successfully!");
};

socket.onmessage = (event) => {
  console.log("Received data:", event.data);
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("WebSocket connection closed.");
};

export default socket;
