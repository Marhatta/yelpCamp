var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware"); //index.js is already required if named index.js inside a particular directory

//INDEX - show all campgrounds

router.get("/",function(req,res)
{
    //get all campgrounds from db
    Campground.find({},function(err,allCampgrounds)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});    
       }
    });
    
});


// CREATE -  add new campground to db
router.post("/",middleware.isLoggedIn,function(req,res)
{
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    
    var newCampground= {name:name,price:price,image:image,description:desc,author:author};
    //create new campground and save to db
    Campground.create(newCampground,function(err,newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
                res.redirect("/campgrounds");

        }
    });
    
}); 


//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res)
{
   res.render("campgrounds/new"); 
});


// SHOW -shows more info about one campground
router.get("/:id",function(req,res)
{
    //find campground with provoded id 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground)
    {
        if(err || !foundCampground)
        {
            req.flash("error","campground not found");
            res.redirect("back");
        }
        else
        {
            res.render("campgrounds/show",{campground:foundCampground});   
        }
    });
    
    
});


//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res)
{
    //is user logged in 
    Campground.findById(req.params.id,function(err,foundCampground)
    {
        if(err)
        {
            req.flash("error","Campground does not exist");
        }
        res.render("../views/campgrounds/edit",{campground:foundCampground});
    });
            
});

//update campground route

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res)
{
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);    
        }
    });
});


//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res)
{
    Campground.findByIdAndRemove(req.params.id,function(err)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;