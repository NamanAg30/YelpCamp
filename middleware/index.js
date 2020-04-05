//all the middle ware goes here
var middlewareObj={};
var camp=require('../models/campground');
var Comment=require('../models/comment');

middlewareObj.checkCampOwnership=function(req,res,next){
	if(req.isAuthenticated())
		{
			camp.findById(req.params.id,function (err,foundcamp){
				if(err) res.redirect("back");
				else
					{
						
						if(foundcamp.author.id.equals(req.user.id))
						    next();	
						else{
							req.flash("error","Permission Denied");
							res.redirect("back");
						}
					}
			})
		}
    else{ 
		req.flash("error","Please Login First");
		res.redirect("back");
	    }
}
	
middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated())
		{
			Comment.findById(req.params.comment_id,function (err,foundcomment){
				if(err) res.redirect("back");
				else
					{
						if(foundcomment.author.id.equals(req.user.id))
						    next();	
						else
							{
							req.flash("error","Permission denied");	
							res.redirect("back");
							}
					}
			})
		}
    else
		{
		req.flash("error","Please Login First");	
		res.redirect("back");
		}	
}
middlewareObj.isLoggedIn = function(req,res,next){
if(req.isAuthenticated())
{return next();
}   
req.flash("error","Please Login First")	
 res.redirect("/login");
};

module.exports=middlewareObj;