const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Synchronize database models
const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() => {
    console.log("Dropping tables and reinitializing database");
});

// Include the routes
require("./app/routes/users.routes")(app);
require("./app/routes/devices.routes")(app);
require("./app/routes/locations.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});