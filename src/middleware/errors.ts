const handleSqlErrors = (err: any, req: any, res: any, next: any) => {
  switch (err.message) {
    case "User not found":
    case "Invalid password":
      res.status(401).send({ message: "Invalid username or password." });
      break;
    default:
      next(err);
  }
};

// const handleCustomErrors = (err: any, req: any, res: any, next: any) => {
//   console.log("in here 2", err);
//   if (err.status && err.msg) {
//     res.status(err.status).send({ msg: err.msg });
//   } else next(err);
// };

const handleGenericErrors = (err: any, req: any, res: any, next: any) => {
  switch (err.message) {
    case "User not found":
    case "Invalid password":
      res.status(401).send({ message: "Invalid username or password." });
      break;
    case "Invalid data format":
      res.status(400).send({ message: "Invalid data format" });
      break;
    case "User already exists":
      res.status(409).send({ message: "User already exists" });
    case "Username already exists":
      res.status(409).send({ message: "Username already exists" });
    default:
      next(err);
  }
};

const handleServerErrors = (err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
};

export { handleSqlErrors, handleGenericErrors, handleServerErrors };
