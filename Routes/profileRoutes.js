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


router.get("/:username",async (req,res,next)=>{
    var payload = await getUser(req.params.username , req.session.user)

    res.status(200).render("profilePage",payload);
});

router.get("/:username/replies", async (req, res, next) => {

    var payload = await getUser(req.params.username, req.session.user);
    payload.selectedTab = "replies";
    
    res.status(200).render("profilePage", payload);
})

router.get("/:username/following", async (req, res, next) => {

    var payload = await getUser(req.params.username, req.session.user);
    payload.selectedTab = "following";
    
    res.status(200).render("followersAndFollowing", payload);
})

router.get("/:username/followers", async (req, res, next) => {

    var payload = await getUser(req.params.username, req.session.user);
    payload.selectedTab = "followers";
    
    res.status(200).render("followersAndFollowing", payload);
})

async function getUser(username,userLoggedin){
    var user = await User.findOne({username:username});

    if(user===null){

        user = await User.findById(username);

        if(user===null){
            return {
                pageTitle : "User Not Found",
                userLoggedin : userLoggedin,
                userLoggedinJS : JSON.stringify(userLoggedin),
            }
        }
    }

    return {
        pageTitle : user.username,
        userLoggedin : userLoggedin,
        userLoggedinJS : JSON.stringify(userLoggedin),
        profileUser : user
    }
}


module.exports = router;