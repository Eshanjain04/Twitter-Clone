let express = require("express");

const app = express();

const port = 3000;

const server = app.listen(port,() => console.log("Server is running on port "+[port]));

const middleWare = require("./middleware");

const path = require("path");

//Route
const loginRoute = require("./Routes/loginRoute");

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