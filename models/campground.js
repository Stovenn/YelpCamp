const mongoose = require("mongoose");
const Comment = require("./comment");

const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price:Number,
  author: {
    id:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
    username:String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
});

campgroundSchema.pre('remove', async function(){
  await Comment.remove({
    _id:{
          $in: this.comments
    }
  })
})

const Campground = mongoose.model("Campground", campgroundSchema);


module.exports = Campground;