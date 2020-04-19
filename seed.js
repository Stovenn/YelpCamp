var mongoose = require("mongoose");
var Comment  = require("./models/comment");
var Campground = require("./models/campground");

 
var seeds = [
    {
        name: "Cloud's Rest", 
        image: "https://wallpaperaccess.com/full/5828.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://wallpaperaccess.com/full/5828.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://wallpaperaccess.com/full/5828.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
async function seedDB(){
	try{
		await Campground.deleteMany({});
		console.log('Campgrouds removed');
		await Comment.deleteMany({});
		console.log('Comments removed');
	
			for(const seed of seeds) {
				let campground = await Campground.create(seed);
				console.log('Campgrouds created');
				let comment = await Comment.create(
					{
							text: "This place is great, but I wish there was internet",
							author: "Homer"
					}
				)
				console.log('Comment created');
				campground.comments.push(comment);
				campground.save();
				console.log('Comment added to campgroud');
			}	
		}
	catch(err){
		console.log(err);
	}
}
 
module.exports = seedDB;