import moment from "moment";
const fs = require("fs");
const path = require("path");
const accessLogStream = fs.createWriteStream(path.join("access.log"), {
  flags: "a",
});

export const accessLog = (name: string, data: any): void => {
  if (typeof data === "object") {
    data = JSON.stringify(data, null, 2);
  } else if (typeof data === "symbol" || typeof data === "function") {
    data = data?.toString();
  }
  accessLogStream.write(
    `${name}: ${moment().format("DD/MM/YYY HH:mm")} ${data + "\n \n"}`
  );
};
