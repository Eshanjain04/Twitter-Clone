let express = require("express");

const app = express();

const router = express.Router();

const User = require("../Schemas/UserSchema");

app.set("view engine", "pug");
app.set("views","views");

router.use(express.urlencoded({extended:true}));
router.use(express.json());

router.get("/:id",(req,res,next)=>{
    var payload = {
        pageTitle : `View Post`,
        userLoggedin : req.session.user,
        userLoggedinJS : JSON.stringify(req.session.user),
        postId:req.params.id
    }

    res.status(200).render("postPage",payload);
});



module.exports = router;