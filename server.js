const express = require("express");

const app = express();

app.get("/api/info", (req, res) => {
  res.json({
    name: "David",
    age: 32,
    sex: "男",
  });
});

app.listen("9092");
