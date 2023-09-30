import app from "./app";
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  return console.log(`Express is at http://localhost:${port}`);
});

export default server;
