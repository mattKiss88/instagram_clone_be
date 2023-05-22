import express from "express";
import bodyParser from "body-parser";
import { authRouter } from "./routes/auth";
import { postRouter } from "./routes/post";
import { userRouter } from "./routes/user";
import { commentRouter } from "./routes/comment";
import cors from "cors";

var cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ): void => {
    // const whitelistedOrigins: string[] = process.env.CORS_WHITELIST
    //   ? process.env.CORS_WHITELIST.split(",")
    //   : [];

    callback(null, true);
    // if (origin && whitelistedOrigins.indexOf(origin) !== -1) {
    // } else {
    //   callback(new Error("Not allowed by CORS"));
    // }
  },

  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
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
