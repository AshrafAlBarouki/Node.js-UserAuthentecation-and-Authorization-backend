require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect");
const PORT = process.env.PORT || 3500;

//connect to mongoDB
connectDB();

// custom middleware logger to log the requist method, origin and url
app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data(form data)
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files (img,css...etc)
app.use(express.static(path.join(__dirname, "/public")));

//Api routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);
app.use("/emp", require("./routes/api/employess"));

// all unexisteing urls
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
  if (req.accepts("json")) {
    res.json({ error: "404 Page Not Found!" });
  } else {
    res.type("txt").send("404 Page Not Found!");
  }
});

app.use(errorHandler);

// if connected to DB listen otherwise dont

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB"),
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
});
