const localeFormat = new Intl.DateTimeFormat('en-US');
const dayFormat = new Intl.DateTimeFormat('en-US', {weekday: 'long'});
const monthFormat = new Intl.DateTimeFormat('en-US', {month: 'long'});
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let eventMap = {};
let events = {};

let lastDateCurrMonth = new Date(year, month+1, 0);
let firstDayCurrMonth = new Date(year, month, 1);
let lastDatePrevMonth = new Date(year, month, 0);
let currMonthDays = lastDateCurrMonth.getDate();
let prevMonthDays = lastDatePrevMonth.getDate();
let row = "<tr>";
let count = 0;
$("#calendar").empty();
if(!$("#calendar").hasClass("month")){
   $("#calendar").removeClass();
   $("#calendar").addClass("month");
}

for(let i=0; i<7; i++){
   row += "<th>" + daysOfWeek[i] + "</th>";
}
row += "</tr>";
$("#calendar").append(row);
row = "<tr>";
for(let i=firstDayCurrMonth.getDay()-1; i>=0; i--){
   count = prevMonthDays - i;
   row += "<td class='grayDates' data-date=" + localeFormat.format(new Date(year, month-1, count)) + ">" + count + "</td>";
}
count = 1;
for(let i = 1; i < 7; i++){
   for(let j = 0; j < 7; j++){
      if(count <= currMonthDays && (j >= firstDayCurrMonth.getDay() || i > 1)){
         row += "<td data-date=" + localeFormat.format(new Date(year, month, count)) + ">" + count + "</td>";
         count++;
      }
   }
   if(count <= currMonthDays){
      row += "</tr>";
      $("#calendar").append(row);
      row ="<tr>";
   }else{
      count = 1;
      for(let i=lastDateCurrMonth.getDay(); i<6; i++){
         row += "<td class='grayDates' data-date=" + localeFormat.format(new Date(year, month+1, count)) + ">" + count + "</td>";
         count++;
      }
      row += "</tr>";
      $("#calendar").append(row);
      break;
   }
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
         addMonthEvent();
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
   let incMonth;
   incMonth = month + 2;
   if(incMonth > 12){
      incMonth = 1;
      year += 1;
   }
   let monthUrl = document.location.href.split("?")[0] + "?date=" + year +"-"+ (incMonth);
   document.location = monthUrl;
});

$("#prevBtn").click(function(){
   let incMonth;
   incMonth = month;
   if(incMonth === 0){
      incMonth = 12;
      year -= 1;
   }
   let monthUrl = document.location.href.split("?")[0] + "?date=" + year +"-"+ (incMonth);
   document.location = monthUrl;
});
