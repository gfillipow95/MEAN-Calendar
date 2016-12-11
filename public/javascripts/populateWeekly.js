const monthFormat = new Intl.DateTimeFormat('en-US', {month: 'long'});
const monthNumeric = new Intl.DateTimeFormat('en-US', {month: 'numeric'});
const localeFormat = new Intl.DateTimeFormat('en-US');
const monthAbv = new Intl.DateTimeFormat('en-US', {month: 'short'});
const dayFormat = new Intl.DateTimeFormat('en-US', {weekday: 'long'});
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm",
               "7pm", "8pm", "9pm", "10pm", "11pm"];

let eventMap = {};
let events = {};

let row = "<tr>";
let countHour = 0;
$("#calendar").empty();
if(!$("#calendar").hasClass("week")){
   $("#calendar").removeClass();
   $("#calendar").addClass("week");
}
date.setDate(date.getDate()-date.getDay());
let tempDate = new Date(date);
for(let i=0; i<25; i++){
   for(let j=0; j<8; j++){
      if(i===0 && j===0){
         row += "<th>Time</th>";
      }else if(i===0 && j!==0){
         row += "<th>" + daysOfWeek[j-1] + (date.getMonth()+1) + "/" + date.getDate() + "</th>";
         date.setDate(date.getDate() + 1);
      }else if(i>0 && j===0){
         row += "<td>" + times[i-1] + "</td>";
      }else{
         row += "<td data-time=" + countHour + " " + "data-date=" + localeFormat.format(tempDate) + "></td>";
         tempDate.setDate(tempDate.getDate()+1);
      }
   }
   if(i!==0){
      countHour++;
      tempDate.setDate(tempDate.getDate()-7);
   }
   row += "</tr>";
   $("#calendar").append(row);
   row = "<tr>";
}

$(document).ready(function(){
   $.ajax({
      method: "GET",
      url: "http://localhost:3000/events",
      success: function(eventData){
         $.each(eventData, function(i, e){
            let formatStartTime = new Date(e['stime']);
            let formatEndTime = new Date(e['etime']);
            events = {
               title: e['title'],
               date: e['date'],
               stime: formatStartTime.toLocaleTimeString('en-GB'),
               etime: formatEndTime.toLocaleTimeString('en-GB'),
               eventID: e['_id']
            }
            let newDate = new Date(e['date']);
            let formatDate = localeFormat.format(newDate);
            if(eventMap[formatDate] != undefined){
               eventMap[formatDate].push(events);
            }else{
               eventMap[formatDate] = [events];
            }
         })
         addWeekEvent();
      }
   });
});

function createRightDrawer(dateArray){
   let selectedDay = new Date(dateArray[2], dateArray[0]-1, dateArray[1]);
   let dateString = dayFormat.format(selectedDay) + " " + monthFormat.format(selectedDay) + " " + dateArray[1] + ", " + dateArray[2];
   $("#drawerDate").text(dateString);
   $("#drawerEvents").empty();
   $.each(eventMap, function(dateKey, eventList){
      if(dateKey == localeFormat.format(selectedDay)){
         $.each(eventList, function(i, eventObj){
            let eventDiv = "<div id=e" +  eventObj.eventID + ">";
            let eventName = "<h4 class=text-center>" + eventObj.title + "</h4>";
            let eventTime = "<p class='text-center'>" + formatEventTime(eventObj.stime) + " - " + formatEventTime(eventObj.etime) + "</p>";
            eventDiv += eventName;
            eventDiv += eventTime;
            let delBtn = "<button class='deleteButton' data-eId=" + eventObj.eventID + ">Delete</button>";
            let updateBtn = "<button class='updateButton' data-eId=" + eventObj.eventID + ">Edit</button>";
            eventDiv += delBtn;
            eventDiv += updateBtn;
            eventDiv += "</div>";
            $("#drawerEvents").append(eventDiv);
         })
      }
   })
}

function formatEventTime(t){
   let hour = t.split(":")[0];
   let minutes = t.split(":")[1];
   if(hour >= 12){
      if(hour != 12){
         hour -= 12;
      }
      hour += ":"+minutes;
      hour += "pm";
   }else{
      if(hour < 10){
         hour = hour.substring(1);
      }
      hour += ":"+minutes;
      hour += "am";
   }
   return hour;
}

$("#monthlyView").click(function(){
   let resetMonth = "http://"+window.location.host+"/calendar";
   window.location.replace(resetMonth);
});

$("#weeklyView").click(function(){
   let resetWeek = "http://"+window.location.host+"/calendar/weekly";
   window.location.replace(resetWeek);
});

$("#dailyView").click(function(){
   let resetDay = "http://"+window.location.host+"/calendar/daily";
   window.location.replace(resetDay);
});

$("#nextBtn").click(function(){
   let weekUrl = document.location.href.split("?")[0] + "?date=" + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
   document.location = weekUrl;
});

$("#prevBtn").click(function(){
   date.setDate((date.getDate() - 14));
   let weekUrl = document.location.href.split("?")[0] + "?date=" + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
   document.location = weekUrl;
});
