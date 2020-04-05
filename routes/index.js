var express=require('express');
var router=express.Router();
var passport=require('passport');

var User =require("../models/user");


//Auth Routes
//show signup form
router.get("/register",function(req,res){
		res.render("register");
});

router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
	if(err){
					req.flash("error",err.message);

		return res.redirect("/register");
        }	
	passport.authenticate("local")(req,res,function(){
		req.flash("success","Welcomr to Yelp Camp"+user.username);
        res.redirect("/campgrounds");
		});	
	});
});
//login routes
router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
		 
});
//Log Out Route
router.get("/logout",function(req,res){
	req.logout();
    req.flash("success","Logged You Out")	
	res.redirect("/campgrounds");
});

module.exports=router;