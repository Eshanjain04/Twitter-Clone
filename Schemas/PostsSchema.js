const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostsSchema = new Schema({
   content :  { type: String, trim: true },
   postedBy :  { type: Schema.Types.ObjectId ,ref:"User"},
   pinned : Boolean,
   likes : [{ type: Schema.Types.ObjectId ,ref:"User"}],
   retweetUsers : [{ type: Schema.Types.ObjectId ,ref:"User"}],
   retweetData : { type: Schema.Types.ObjectId ,ref:"Posts"},
   replyTo : { type: Schema.Types.ObjectId ,ref:"Posts"},

}, {timestamps:true} );

var Posts= mongoose.model('Posts', PostsSchema);
module.exports = Posts;