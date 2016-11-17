var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekAndDayView = ["Time", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthAbv = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
var times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm",
               "7pm", "8pm", "9pm", "10pm", "11pm"];
var date = new Date();
var month = date.getMonth();
var year = date.getFullYear();

function createMonthTable(){
   document.querySelector("#calendar").innerHTML = "";
   document.querySelector("#calendar").classList = "";
   document.querySelector("#calendar").classList.add("month");
   var tbl = document.querySelector('.month');
   for(var i=0; i<7; i++){
      var tr = tbl.insertRow(i);
      for(var j=0; j<7; j++){
         if(i === 0){
            tr.insertCell(j).outerHTML = "<th>"+ daysOfWeek[j]+"</th>";
         }else{
            tr.insertCell(j);
         }
      }
   }
};

function createWeekTable(){
   document.querySelector("#calendar").innerHTML = "";
   document.querySelector("#calendar").classList = "";
   document.querySelector("#calendar").classList.add("week");
   var tbl = document.querySelector(".week");
   for(var i=0; i<25; i++){
      var tr = tbl.insertRow(i);
      for(var j=0; j<8; j++){
         if (i===0) {
            tr.insertCell(j).outerHTML = "<th>"+weekAndDayView[j]+"</th>";
         }else{
            tr.insertCell(j);
         }
      }
   }
};

function populateWeek(){
   var calendar=document.querySelector(".week");
   date.setDate(date.getDate()-date.getDay());
   document.querySelector(".calendarHeader").innerHTML=(monthAbv[date.getMonth()]) + " " + (date.getDate()-date.getDay());
   for(var i=0; i<25; i++){
      for(var j=0; j<8; j++){
         if(i===0 && j!==0){
            calendar.rows[i].cells[j].innerHTML += (date.getMonth()+1) + "/" + (date.getDate());
            date.setDate(date.getDate() + 1);
         }else if(i>0 && j===0){
            calendar.rows[i].cells[j].innerHTML = times[i-1];
         }
      }
   }
   document.querySelector(".calendarHeader").innerHTML += " - " + monthAbv[date.getMonth()] + " " + (date.getDate()-1);
};


function populateMonth(){
   var newDate = new Date(year, month+1, 0);
   var days = newDate.getDate();
   var count = 1;
   var calendar=document.querySelector(".month");
   var firstDayMonth = new Date(year, month, 1);
   var startDate = firstDayMonth.getDay();
   var cHead = document.querySelector(".calendarHeader").innerHTML = months[month%12] + " " + firstDayMonth.getFullYear();
   for(var i = 1; i < 7; i++){
      for(var j = 0; j < 7; j++){
         if(count <= days && (j >= startDate || i > 1)){
            calendar.rows[i].cells[j].innerHTML = count;
            count++;
         }
      }
   }
};

//Initial Calendar Creation
////////////////////////////////////////////////////
createMonthTable();
populateMonth();
////////////////////////////////////////////////////

var next = document.querySelector("#nextBtn");
var prev = document.querySelector("#prevBtn");
var monthBtn = document.querySelector("#monthlyView");
var weekBtn = document.querySelector("#weeklyView");


next.addEventListener("click", function(e){
   if(document.querySelector("#calendar").classList.contains("month")){
      month = month + 1;
      createMonthTable();
      populateMonth();
   }else if(document.querySelector("#calendar").classList.contains("week")){
      date.setDate((date.getDate()-date.getDay() + 7));
      createWeekTable();
      populateWeek();
   }
});

prev.addEventListener("click", function(e){
   if(document.querySelector("#calendar").classList.contains("month")){
      month = month - 1;
      createMonthTable();
      populateMonth();
   }else if(document.querySelector("#calendar").classList.contains("week")){
      date.setDate(date.getDate() - 14);
      createWeekTable();
      populateWeek();
   }
})

monthBtn.addEventListener("click", function(e){
   date = new Date();
   month = date.getMonth();
   year = date.getFullYear();
   createMonthTable();
   populateMonth();
});

weekBtn.addEventListener("click", function(e){
   date = new Date();
   month = date.getMonth();
   year = date.getFullYear();
   createWeekTable();
   populateWeek();
});
