var express=require('express');
var router=express.Router({mergeParams:true});

var camp=require('../models/campground');
var Comment=require('../models/comment');
var middleware=require('../middleware/index');
//==============================
//comment routes
//==============================
router.get("/new",middleware.isLoggedIn,function(req,res){
	camp.findById(req.params.id,function(err ,campground){
		if(err) console.log(err);
		else
	res.render("comments/new",{camp:campground});	
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	camp.findById(req.params.id,function(err,campground){
		if(err) 
		res.redirect("/campgrounds");
		else
		{
			Comment.create(req.body.comments,function(err,comment)
			{
				if(err) console.log(err);
				else
				{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully Added Comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundcomment){
		if(err) res.redirect("back");
		else res.render("comments/edit",{camp_id:req.params.id,comment:foundcomment}); 
	});
//Update Route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comments,function(err,updatedcomment){
		if(err) res.redirect("back");
		else{
			req.flash("success","Successfully updated Comment");
			res.redirect("/campgrounds/"+req.params.id);
		}    
		
	})
})
	
})
//Delete Route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
					req.flash("success","Successfully deleted Comment");
res.redirect("/campgrounds/"+req.params.id);
	});
	
})

module.exports=router;