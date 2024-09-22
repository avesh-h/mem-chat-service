const express = require("express");
const { PORT } = require("./config/serverConfig");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupAndStartServer = async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  app.listen(PORT, () => {
    console.log("Chat Service is now on " + PORT);
  });
};

setupAndStartServer();
