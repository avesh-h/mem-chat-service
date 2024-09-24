const express = require("express");
const { PORT } = require("./config/serverConfig");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToDB = require("./config/dbConfig");
const { initializeSocket } = require("./utils/socket/socket");
const serverRoutes = require("./routes/index");

const setupAndStartServer = async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  //DB connection
  connectToDB();

  //Server routes
  app.use("/api", serverRoutes);

  const server = app.listen(PORT, async () => {
    console.log("Chat Service is now on " + PORT);
  });

  //Socket initialization
  initializeSocket(server);
};

setupAndStartServer();
