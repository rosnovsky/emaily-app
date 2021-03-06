const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bodyBarser = require("body-parser");
const passport = require("passport");

require("./models/Survey");
require("./models/user");
require("./services/passport");
const keys = require("./config/keys");

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI, {
  useMongoClient: true
});

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(bodyBarser.json());
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
