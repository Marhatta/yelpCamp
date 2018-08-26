var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");


// all the middleware goes here
var middlewareObj={};
middlewareObj.checkCampgroundOwnership=function(req,res,next)
{
   

    if(req.isAuthenticated())
    {
        
        Campground.findById(req.params.id,function(err,foundCampground)
        {
            if(err || !foundCampground)//if someone changes id that does not exist, !foundCampground
            {
                req.flash("error","Campground not found");
                res.redirect("back");
            }
            else
            {
                        //does the user own the campground ?
                    if(foundCampground.author.id.equals(req.user._id)) //one is object and other is in string
                    {
                        next();
                    }
                    else
                    {
                        req.flash("error","You don't have permission to do that");
                        res.redirect("back");
                    }
            }
        });   
    }
    else
    {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

    

middlewareObj.checkCommentOwnership=function(req,res,next)
{
     if(req.isAuthenticated())
    {
        
        Comment.findById(req.params.comment_id,function(err,foundComment)
        {
            if(err || !foundComment)
            {
                req.flash("error","comment not found");
                res.redirect("back");
            }
            else
            {
                        //does the user own the comment ?
                    if(foundComment.author.id.equals(req.user._id)) //one is object and other is in string
                    {
                        next();
                    }
                    else
                    {
                        req.flash("error","You don't have permission to do that");
                        res.redirect("back");
                    }
            }
        });   
    }
    else
    {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }

}

middlewareObj.isLoggedIn=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","Please login first");
    res.redirect("/login");
}

module.exports=middlewareObj;