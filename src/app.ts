import express from "express";
const app = express();
const port = 3001;
import bodyParser from "body-parser";

require("dotenv").config();

const cors = require("cors");
let corsOptions: object;

corsOptions = {
  origin: ["*", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessState: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`Hello from Instagram! running on port ${port}`);
});

export default app;
