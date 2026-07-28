const express = require("express")
const path = require("path")
const fs = require("fs")
const cors = require("cors")


const app = express()
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

var corsMiddleware = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
  next();
}

app.use(corsMiddleware);

const port = process.env.port || 3456

app.post("/api/save-guild-user-list", (req, resp) => {

  const now = new Date();
  const formattedDate = getDateString();
  const filename = "users-" + formattedDate + ".json";

  console.log("Saving file: " + filename)
  fs.writeFile("users/" + filename, JSON.stringify(req.body),
  (err) => {
    if (err)
      console.log(err);
  });

  resp.send("Ok");

});

app.post("/api/save-building-list", (req, resp) => {

  const now = new Date();
  const formattedDate = getDateString();
  const filename = "buildings-" + formattedDate + ".json";

  console.log("Saving file: " + filename)
  fs.writeFile("island/" + filename, JSON.stringify(req.body),
  (err) => {
    if (err)
      console.log(err);
  });

  resp.send("Ok");

});

app.post("/api/save-resource-list", (req, resp) => {

  const now = new Date();
  const formattedDate = getDateString();
  const filename = "resources-" + formattedDate + ".json";

  console.log("Saving file: " + filename)
  fs.writeFile("island/" + filename, JSON.stringify(req.body),
  (err) => {
    if (err)
      console.log(err);
  });

  resp.send("Ok");

});

app.get("/", (req, resp) => {
  resp.sendFile(path.join(__dirname + "/pages/index.html"))
});

app.get("/buildings", (req, resp) => {
  resp.sendFile(path.join(__dirname + "/pages/buildings.html"))
});

app.get("/resources", (req, resp) => {
  resp.sendFile(path.join(__dirname + "/pages/resources.html"))
});

app.get("/compare", (req, resp) => {
  resp.sendFile(path.join(__dirname + "/pages/compare.html"))
});

const getDateString = () => {
  const now = new Date();
  return formattedDate = now.toISOString()
    .replace('T', '_')
    .replace(/\..+/, '')
    .replace(/:/g, '');
};

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

    if (file.startsWith("users")) {
      var obj = JSON.parse(fs.readFileSync("users/" + file, 'utf8'))
      
      obj.forEach(el => {

        if (users.get(el.id) === undefined) {
          users.set(el.id, new Map())
        }

        let userObj = users.get(el.id)
        let datestr = el.datetime.slice(0, 10);
        if (userObj.get(datestr) === undefined) {
          userObj.set(datestr, {"online24h": el.online24h})
        } else {
          // overwrite if any file for a day has activity = true
          if (el.online24h === true) {
            userObj.set(datestr, {"online24h": el.online24h})
          }
        }
      })
    }
  })

  resp.send(mapToObject(users))
})

app.get("/api/get-building-list", (req, resp) => {
  const files = fs.readdirSync("island/")
      .filter(file => file.startsWith("buildings"))
      .sort()
      .reverse();

  if (files.length === 0) {
      return resp.json([]);
  }

  const obj = JSON.parse(
      fs.readFileSync("island/" + files[0], "utf8")
  );

  resp.json(obj);
})

app.get("/api/get-resource-list", (req, resp) => {
  const files = fs.readdirSync("island/")
      .filter(file => file.startsWith("resources"))
      .sort()
      .reverse();

  if (files.length === 0) {
      return resp.json([]);
  }

  const obj = JSON.parse(
      fs.readFileSync("island/" + files[0], "utf8")
  );

  resp.json(obj);
})

app.get("/api/users-buildings-summary", (req, resp) => {
  let users = new Map()

  fs.readdirSync("island/")
    .filter(file => file.startsWith("buildings"))
    .sort()
    .reverse() 
    .forEach(file => {

      var obj = JSON.parse(fs.readFileSync("island/" + file, 'utf8'))
      
      if (users.get(obj.player) === undefined) {
        let userBuildings = new Map()

        obj.buildings.forEach(el => {
          if (userBuildings.get(el.locName) === undefined) {
            userBuildings.set(el.locName, 1)
          } else {
            userBuildings.set(el.locName, userBuildings.get(el.locName) + 1)
          }
          
        })
        users.set(obj.player, {'level': obj.level, 'datetime': obj.datetime, 'buildings': mapToObject(userBuildings)})
      } 
  })

  resp.send(mapToObject(users))
})


var server = app.listen(port, function() {
  console.log("Settlers app started at port: " + port)
  console.log("---")
})