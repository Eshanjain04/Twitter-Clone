let express = require("express");

const app = express();

const router = express.Router();

const User = require("../Schemas/UserSchema");

app.set("view engine", "pug");
app.set("views","views");

router.use(express.urlencoded({extended:true}));
router.use(express.json());

router.get("/",(req,res,next)=>{
    var payload = {
        pageTitle : req.session.user.username,
        userLoggedin : req.session.user,
        userLoggedinJS : JSON.stringify(req.session.user),
        profileUser:req.session.user
    }

    res.status(200).render("profilePage",payload);
});



module.exports = router;