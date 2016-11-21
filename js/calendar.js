var btn=document.querySelector("#addEventButton");
var calendar=document.querySelector("#table-background");
var addCalendarEvent = document.querySelector("#addEventBtn");
var rightDrawer = document.querySelector("#rightDrawer");

var title = document.querySelector("#eventTitle");
var date = document.querySelector("#eventDate");
var stime = document.querySelector("#eventStartTime");
var etime = document.querySelector("#eventEndTime");
var ecolorBtn = document.querySelectorAll(".colorBtn");
var eColorID;
var eventList = [];
var event = {};



function addMonthEvent(){
   var calendar = document.querySelector(".month");
   var newDate;
   for (var i=0; i<eventList.length; i++){
      newDate = new Date(eventList[i].eventDate);
      for(var r=0; r<7; r++){
         for(var c=0; c<7; c++){
            if(newDate.toLocaleDateString() === calendar.rows[r].cells[c].getAttribute("data-date")){
               calendar.rows[r].cells[c].style.background = "yellow";
            }
         }
      }
   }
}

addCalendarEvent.addEventListener("click", function(e){
   eventList.push(
      event = {
         eventTitle: title.value,
         eventDate: date.value,
         startTime: stime.value,
         endTime: etime.value
      })
   addMonthEvent();
   title.value = "";
   date.value = "";
   stime.value = "";
   etime.value = "";
   document.querySelector("#editMenu").classList.add("hide");
   calendar.classList.remove("opacity");
});



btn.addEventListener("click", function(e){
   document.querySelector("#editMenu").classList.remove("hide");
   document.querySelector("#calendar").classList.add("opacity");
});

calendar.addEventListener("click", function(e){
   if(document.querySelector("#calendar").classList.contains("month")){
      if(document.querySelector("#calendar").classList.contains("opacity")){
         document.querySelector("#editMenu").classList.add("hide");
         document.querySelector("#calendar").classList.remove("opacity");
      }else{
         var selectMonthDay = document.querySelectorAll(".monthDays");
         for(var i=0; i<selectMonthDay.length; i++){
            selectMonthDay[i].addEventListener("click", function(e){
               createRightDrawer(e.target.getAttribute("data-date").split("/"));
               rightDrawer.classList.remove("hide");
            })
         }
      }
   }
});

document.querySelector("#deleteWindow").addEventListener("click", function(e){
   rightDrawer.classList.add("hide");
});
