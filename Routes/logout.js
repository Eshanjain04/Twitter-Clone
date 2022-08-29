let express = require("express");

const router = express.Router();

router.use(express.urlencoded({extended:true}));
router.use(express.json());

router.get("/",(req,res,next)=>{
    if(req.session){
        req.session.destroy(() =>{
            res.redirect("/login");
        })
    }
});

module.exports = router;