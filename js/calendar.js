var btn=document.querySelector("#addEventButton");
var calendar=document.querySelector("#table-background");
var addCalendarEvent = document.querySelector("#addEventBtn");
var rightDrawer = document.querySelector("#rightDrawer");

var title = document.querySelector("#eventTitle");
var evDate = document.querySelector("#eventDate");
var stime = document.querySelector("#eventStartTime");
var etime = document.querySelector("#eventEndTime");
var ecolorBtn = document.querySelectorAll(".colorBtn");
var eColorID;

//Figure out how to add to weekly and day view
//Figure out how to put drawer events in order
//Add Color to the Event data structure

function addMonthEvent(){
   var calendar = document.querySelector(".month");
   var newDate;
   for (var i=0; i<eventList.length; i++){
      newDate = new Date(eventList[i].eventDate);
      newDate.setDate(newDate.getDate()+1);
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
   $.ajax({
      method:"POST",
      url: "http://thiman.me:1337/gen",
      data: {title: title.value, date: evDate.value, start: stime.value, end: etime.value},
      success: function(data){
         let eventData = JSON.parse(JSON.stringify(data))['data'];
         eventList.push(
            event = {
               eventTitle: eventData['title'],
               eventDate: eventData['date'],
               startTime: eventData['start'],
               endTime: eventData['end'],
               eventID: eventData['_id']
            })
      }
   });
   addMonthEvent();
   title.value = "";
   evDate.value = "";
   stime.value = "";
   etime.value = "";
   document.querySelector("#editMenu").classList.add("hide");
   document.querySelector("#calendar").classList.remove("disable");
   calendar.classList.remove("opacity");
});


btn.addEventListener("click", function(e){
   document.querySelector("#editMenu").classList.remove("hide");
   document.querySelector("#calendar").classList.add("disable");
   calendar.classList.add("opacity");
});

calendar.addEventListener("click", function(e){
   if(document.querySelector("#calendar").classList.contains("month")){
      document.querySelector("#editMenu").classList.add("hide");
      document.querySelector("#calendar").classList.remove("disable");
      calendar.classList.remove("opacity");
   }
   if(document.querySelector(".deleteButton") !== null){
      var idString;
      document.querySelector(".deleteButton").addEventListener("click", function(e){
         eventList.forEach(function(eventObj){
            if(e.target.getAttribute("data-eId") == eventObj.eventID){
               var eIndex = eventList.indexOf(eventObj);
               eventList.splice(eIndex, 1);
               idString = "#e"+eventObj.eventID;
               document.querySelector(idString).remove();
            }
         })
      });
   }
});

document.querySelector("#calendar").addEventListener("click", function(e){
   createRightDrawer(e.target.getAttribute("data-date").split("/"));
   rightDrawer.classList.remove("hide");
})

document.querySelector("#deleteWindow").addEventListener("click", function(e){
   rightDrawer.classList.add("hide");
});
