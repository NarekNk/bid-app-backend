const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const { sequelize } = require("./models");
const api = require("./controllers");
require("./auth/passport");

const app = express();

const port = process.env.PORT;

const corsOpts = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOpts));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/", api);

app.listen({ port }, async () => {
  console.log("Server up on port " + port);
  await sequelize.authenticate();
  console.log("Database Authenticated.");
});
