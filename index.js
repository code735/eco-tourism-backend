const express = require("express");
const jsonServer = require("json-server");

const app = express();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

app.use(middlewares);

app.get("/cardDetails", (req, res) => {
  const cardDetails = router.db.get("cardDetails");
  res.json(cardDetails);
});

app.get("/camping", (req, res) => {
  const camping = router.db.get("camping");
  res.json(camping);
});

app.get("/city", (req, res) => {
  const city = router.db.get("city");
  res.json(city);
});

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
