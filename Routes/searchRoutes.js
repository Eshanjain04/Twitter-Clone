let express = require("express");

const app = express();

const router = express.Router();

const User = require("../Schemas/UserSchema");

app.set("view engine", "pug");
app.set("views","views");

router.use(express.urlencoded({extended:true}));
router.use(express.json());

router.get("/",(req,res,next)=>{
    var payload = createPayload(req.session.user);

    res.status(200).render("searchPage",payload);
});

router.get("/:selectedTab",(req,res,next)=>{
    var payload = createPayload(req.session.user);
    payload.selectedTab = req.params.selectedTab;

    res.status(200).render("searchPage",payload);
});

function createPayload(userLoggedin){
    return {
        pageTitle : "Search",
        userLoggedin : userLoggedin,
        userLoggedinJS : JSON.stringify(userLoggedin),
    }
}


module.exports = router;