const fs = require("fs");
const express = require("express");
const app = express();
const Crypto = require("crypto");

const port = 8000;
app.listen(port, () => {
  console.log(`listening at port ${port}`);
});

app.use(express.static("static"));
app.use(express.json());

let session = {};
app.get("/api", (request, response) => {
  if (request.header("Authorization") in session) {
    delete session[request.header("Authorization")];
    fs.readFile("count.json", (err, data) => {
      let d = JSON.parse(data);
      d.count = d.count + 1;
      fs.writeFile("count.json", JSON.stringify(d), "utf-8", (err, data) => {
        response.json(d.count);
      });
    });
  } else {
    response.status(403).send();
  }
});

app.get("/api/session", (request, response) => {
  const sessionID = Crypto.randomBytes(20).toString("hex");
  const date = new Date();
  session[sessionID] = date.getTime();
  response.json({ sessionID: sessionID });
});

const interval = setInterval(function () {
  const date = new Date();
  let time = date.getTime() - 100000;
  Object.keys(session).map(function (key, index) {
    if (session[key] < time) delete session[key];
  });
}, 10000);
