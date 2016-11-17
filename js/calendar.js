var btn=document.querySelector("#addEventButton");
var calendar=document.querySelector("#table-background");
var deleteWin=document.querySelector("#deleteWindow");
var addCalendarEvent = document.querySelector("#addEventBtn");

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
      if(eventList[i].eventDate[8] === "0"){
         newDate = eventList[i].eventDate.slice(0, 8) + eventList[i].eventDate.slice(9);
      }else{
         newDate = eventList[i].eventDate;
      }
      for(var r=0; r<7; r++){
         for(var c=0; c<7; c++){
            if(newDate === calendar.rows[r].cells[c].getAttribute("data-date")){
               calendar.rows[r].cells[c].innerHTML += "<div id='eventMonth'></div>";
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
   calendar.classList.add("opacity");
});

calendar.addEventListener("click", function(e){
   document.querySelector("#editMenu").classList.add("hide");
   calendar.classList.remove("opacity");
});

deleteWin.addEventListener("click", function(e){
   document.querySelector("#rightDrawer").classList.add("hide");
});
