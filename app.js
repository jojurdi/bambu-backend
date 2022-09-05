const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "h($NGWaYE8g(7@Mw", // should use as secret environment variable
    httpOnly: true,
    sameSite: 'strict'
  })
);

// database
const dbModels = require("./app/models/index.ts");
const roleModel = dbModels.role;

//db.sequelize.sync();
// force: true will drop the table if it already exists
dbModels.sequelize.sync({force: true}).then(() => {
   console.log('Drop and Resync Database with { force: true }');
   initial();
 });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bambu backend app." });
});

// routes
require("./app/routes/auth.routes.ts")(app);
require("./app/routes/user.routes.ts")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  roleModel.create({
    id: 1,
    name: "user",
  });

  roleModel.create({
    id: 2,
    name: "moderator",
  });

  roleModel.create({
    id: 3,
    name: "admin",
  });
}