var express = require("express");
var app = express();


app.set("view engine", "ejs");

// add routes below
app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
        {name: "Salmon Creek", image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439df2c079a3e8b4_340.jpg"},
        {name: "Loard Hill", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c378a7e9b0b9_340.jpg"},
        {name: "Pitts Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"}
        ];
        res.render("campgrounds", {campgrounds : campgrounds});
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started!");
});