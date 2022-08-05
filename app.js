let express = require("express");

const app = express();

const port = 3001;

const server = app.listen(port,() => console.log("Server is running on port "+[port]));

const middleWare = require("./middleware");

const path = require("path");

const mongoose = require("./database");

const session = require("express-session");

//Route

app.use(session({
    secret:"sessionInProgress",
    resave : true,
    saveUninitialized : false
}))

const loginRoute = require("./Routes/loginRoute");
const registerRoutes = require("./Routes/registerRoutes");
app.use("/register",registerRoutes);
app.use("/login",loginRoute);

app.set("view engine", "pug");
app.set("views","views");


app.use(express.static(path.join(__dirname,"public")));

app.get("/",middleWare.requireLogin,(req,res,next)=>{

    var payload = {
        pageTitle : "Home"
    }
    res.status(200).render("home",payload);
})