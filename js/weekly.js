var btn=document.querySelector("#addEventButton");
var calendar=document.querySelector("#table-background");

btn.addEventListener("click", function(e){
   document.querySelector("#editMenu").classList.remove("hide");
   calendar.classList.add("opacity");
});

calendar.addEventListener("click", function(e){
   document.querySelector("#editMenu").classList.add("hide");
   calendar.classList.remove("opacity");
});
