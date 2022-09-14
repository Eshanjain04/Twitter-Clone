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
const logoutRoutes = require("./Routes/logout");
const postRoutes = require("./Routes/postRoutes");
const profileRoutes = require("./Routes/profileRoutes");

const postsApiRoutes = require("./Routes/api/posts");
const usersApiRoutes = require("./Routes/api/users");

app.use("/register",registerRoutes);
app.use("/login",loginRoute);
app.use("/logout",logoutRoutes);
app.use("/posts",middleWare.requireLogin,postRoutes);
app.use("/profile",middleWare.requireLogin,profileRoutes);
app.use("/api/posts",postsApiRoutes);
app.use("/api/users",usersApiRoutes);

app.set("view engine", "pug");
app.set("views","views");


app.use(express.static(path.join(__dirname,"public")));

app.get("/",middleWare.requireLogin,(req,res,next)=>{

    var payload = {
        pageTitle : `Welcome ${req.session.user.firstName}`,
        userLoggedin : req.session.user,
        userLoggedinJS : JSON.stringify(req.session.user)
    }
    res.status(200).render("home",payload);
})