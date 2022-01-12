const fs = require("fs");
const express = require("express");
const app = express();

const port = 8000;
app.listen(port, () => {
  console.log(`listening at port ${port}`);
});

app.use(express.static("static"));
app.use(express.json());

app.get("/api", (request, response) => {
  fs.readFile("count.json", (err, data) => {
    let d = JSON.parse(data);
    d.count = d.count + 1;
    fs.writeFile("count.json", JSON.stringify(d), "utf-8", (err, data) => {
      response.json(d.count);
    });
  });
});
