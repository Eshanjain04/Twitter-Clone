let express = require("express");

const app = express();

const router = express.Router();

const User = require("../../Schemas/UserSchema");
const Posts = require("../../Schemas/PostsSchema");

router.use(express.urlencoded({extended:true}));
router.use(express.json());

router.get("/",async (req,res,next)=>{
    var results = await getPosts({});
    res.status(200).send(results);
    
});

router.get("/:id",async (req,res,next)=>{
    var postId = req.params.id;

    var postdata = await getPosts({ _id: postId });
    postdata = postdata[0];

    var results = {
        postdata: postdata
    }

    if(postdata.replyTo !== undefined) {
        results.replyTo = postdata.replyTo;
    }

    results.replies = await getPosts({ replyTo: postId });

    res.status(200).send(results);
    
});

router.post("/", async (req, res, next) => {

    if(!req.body.content){
        console.log("Content param not set");
        return res.status(400).send("Bad Request");
    }

    var postdata = {
        content : req.body.content,
        postedBy : req.session.user
    }

    if(req.body.replyTo){
        postdata.replyTo = req.body.replyTo;
    } 

    Posts.create(postdata)
    .then(async (newPost)=>{

        newPost = await User.populate(newPost,{path:"postedBy"})

        res.status(201).send(newPost);
    })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })
    
})

router.put("/:id/like", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Posts.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post);
})

router.post("/:id/retweet", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    //try and delete retweet
    var deletePosts = await Posts.findOneAndDelete({postedBy:userId , retweetData:postId})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    var option = deletePosts != null ? "$pull" : "$addToSet";

    var repost = deletePosts;

    if(repost===null){
        repost = await Posts.create({postedBy:userId, retweetData:postId})
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    }

    // Insert user tweets
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post tweets
    var post = await Posts.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post);
});

router.delete("/:id", (req, res, next) => {
    Posts.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(202))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

async function getPosts(filter){
    var results = await Posts.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({"createdAt" : -1})
    .catch((error)=>{
        console.log(error);
    })
    results = await User.populate(results, { path: "replyTo.postedBy"});
    return await User.populate(results, { path: "retweetData.postedBy"});
}
module.exports = router;