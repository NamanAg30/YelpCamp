var express=require('express');
var router=express.Router();
var camp=require('../models/campground');
var middleware=require("../middleware");

router.get("/",function(req,res){
	camp.find({},function(err,cgr){
		if(err) console.log(err);
		else res.render("campgrounds/campgrounds",{cgr:cgr}); 
	});
});
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.desc;
	var price=req.body.price;
	var author={
	    	id:req.user._id,
		    username:req.user.username
	};
	var newcgr={name:name,image:image,desc:desc,author:author,price:price};
camp.create(newcgr,function(err,newcamp){
		if(err) console.log(err);
		else res.redirect("/campgrounds"); 
	});
});
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
router.get("/:id",function(req,res){

	camp.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err) console.log(err);
		else res.render("campgrounds/show",{cgr:foundcamp});
	});
});

//Edit Route
router.get("/:id/edit",middleware.checkCampOwnership,function(req,res){
	camp.findById(req.params.id,function(err,foundcgr){
		if(err) res.redirect("/campgrounds");
		else res.render("campgrounds/edit",{cgr:foundcgr}); 
	});
});
//Update Route
router.put("/:id",middleware.checkCampOwnership,function(req,res){
	camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcamp){
	if(err) res.redirect("/campgrounds");	
	else res.redirect("/campgrounds/"+req.params.id);	
	});
});
//Destroy Route
router.delete("/:id",middleware.checkCampOwnership,function(req,res){
	camp.findByIdAndRemove(req.params.id,function(err){
		 res.redirect("/campgrounds");
	});
});


module.exports=router;