import express from "express";
import bodyParser from "body-parser";
import { authRouter } from "./routes/auth";
import { postRouter } from "./routes/post";
import { userRouter } from "./routes/user";
import { commentRouter } from "./routes/comment";
import { getS3Objects } from "./helpers/s3";
import { accessLog } from "./helpers/logger";
var cookieParser = require("cookie-parser");

const app = express();
const port = 3001;

require("dotenv").config();

const cors = require("cors");
let corsOptions: object;

corsOptions = {
  origin: ["*", "http://localhost:3000", "http://localhost:3002"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessState: 204,
  // credentials: true,
};

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// getS3Objects().then((data: string[]) => {
//   accessLog("s3", data);
// });

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);

app.get("/", (req, res) => {
  res.send(`Hello from Instagram! Running on port ${port}`);
});

export default app;
