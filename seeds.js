var mongoose=require("mongoose");
var Campground=require("./models/campgrounds");
var Comment=require("./models/comment");

var data=[
    {name:"Pehli jagah",
    image:"https://images.pexels.com/photos/236973/pexels-photo-236973.jpeg?cs=srgb&dl=adventure-backpackers-girls-236973.jpg&fm=jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."  
    },
    
    {name:"Dusri jagah",
    image:"https://images.pexels.com/photos/445849/pexels-photo-445849.jpeg?cs=srgb&dl=activity-adult-adventure-445849.jpg&fm=jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."  
    },
    
    {name:"Tesri Jagah",
    image:"https://images.pexels.com/photos/108992/pexels-photo-108992.jpeg?cs=srgb&dl=adventure-hike-hikers-108992.jpg&fm=jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."  
    }
    
]

function seedDB()
{
    
    //Remove all campgrounds
    Campground.remove({},function(err)
    {
    if(err)
    {
       console.log(err);
    }
    console.log("removed campgrounds"); 
    
     //Add a few campgrounds
    data.forEach(function(seed)
    {
          Campground.create(seed,function(err,campground)
          {
              if(err)
              {
                  console.log(err);
              }
              else
              {
                 console.log("added a campground"); 
                 //create a comment
                 Comment.create(
                     {
                         text:"This place is great",
                         author:"vishal marhatta"
                     },function(err,comment)
                     {
                         if(err)
                         {
                             console.log(err);
                         }
                         else
                         {
                             campground.comments.push(comment);
                             campground.save();
                             console.log("created new comment");
                         }
                         
                     });
              } 
        });
    });
  });
    
}

module.exports=seedDB;