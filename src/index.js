const express = require("express");
const { PORT } = require("./config/serverConfig");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToDB = require("./config/dbConfig");
const initializeSocket = require("./config/socket");

const setupAndStartServer = async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  //DB connection
  connectToDB();

  const server = app.listen(PORT, async () => {
    console.log("Chat Service is now on " + PORT);
  });

  //Socket initialization
  const io = initializeSocket(server);
};

setupAndStartServer();
