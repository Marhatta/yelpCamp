var express=require("express");
var router=express.Router({mergeParams:true}); //because id  is not available for these routes & therefore need to merge params
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware");

//comments new
router.get("/new",middleware.isLoggedIn,function(req,res)
{
    //find campground by id
    Campground.findById(req.params.id,function(err,campground)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
             res.render("comments/new",{campground:campground});
        }
    });
});


//comments create
router.post("/",middleware.isLoggedIn,function(req,res)
{
    //lookup campground using id
    Campground.findById(req.params.id,function(err,campground)
    {
        if(err)
        {
            req.flash("error","Campground not found");
            console.log(err);
            res.redirect("/campgrounds")
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment)
            {
               if(err)
               {
                   req.flash("error","Something went wrong");
                   console.log(err);
               }
               else
               {
                   //add username and id to comment
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


//comments edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res)
{
    Campground.findById(req.params.id,function(err,foundCampground)//if someone changes campground id in url
    {
        if(err ||  !foundCampground)
        {
            req.flash("error","No campground found");
            return res.redirect("back");
        }
        
        Comment.findById(req.params.comment_id,function(err,foundComment)
        {
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                res.render("./comments/edit",{campground_id:req.params.id,comment:foundComment});
            }
        });
    });
    
});

//comments/update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//comments destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res)
{
        Comment.findByIdAndRemove(req.params.comment_id,function(err)
        {
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                req.flash("success","Comment Deleted");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
});

module.exports=router;