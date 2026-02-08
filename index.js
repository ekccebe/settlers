const express = require("express")
const path = require("path")
const fs = require("fs")
const cors = require("cors")


const app = express()
app.use(express.json())

var corsMiddleware = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
  next();
}

app.use(corsMiddleware);

const port = process.env.port || 3456

app.post("/api/save-guild-user-list", (req, resp) => {
  filename = "users-" + Date.now() + ".json"
  console.log("Start writing: " + filename)

  fs.writeFile("users/" + filename, JSON.stringify(req.body),
  (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });

  resp.send("Ok");

});

const htmlPath = path.join(__dirname + "/index.html")
app.get("/", (req, resp) => {
  resp.sendFile(htmlPath)
});

const mapToObject = (value) => {
  if (value instanceof Map) {
    return Object.fromEntries(
      [...value].map(([k, v]) => [k, mapToObject(v)])
    );
  }
  return value;
};

app.get("/api/guild-user-summary", (req, resp) => {
  let users = new Map()

  fs.readdirSync("users/").forEach(file => {
    var obj = JSON.parse(fs.readFileSync("users/" + file, 'utf8'))
    
    obj.forEach(el => {

      if (users.get(el.id) === undefined) {
        users.set(el.id, new Map())
      }

      let userObj = users.get(el.id)
      let datestr = el.datetime.slice(0, 10);
      if (userObj.get(datestr) === undefined) {
        userObj.set(datestr, {"online24h": el.online24h})
      }
    })

  })

  resp.send(mapToObject(users))
})


var server = app.listen(port, function() {
    console.log("Settlers app started at port: " + port)
})