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
               color: e['color'],
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

function addMonthEvent(){
   let calendar = $("#calendar").find("tr td");
   $.each(eventMap, function(key, value){
      $.each(calendar, function(index, item){
         if(key == item.getAttribute("data-date")){
            $("[data-date='" + key + "']").css("background-color", "#80bfff");
         }
      });
   });
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
