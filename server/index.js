const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const PORT = 5000;

app.use(cors());

server.listen(PORT, () => {
  console.log(`Server is up and running on  port ${PORT}`);
});
