var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekAndDayView = ["Time", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
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
   var curDate = new Date();
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
}

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
   month = month + 1;
   createMonthTable();
   populateMonth();
});

prev.addEventListener("click", function(e){
   month = month - 1;
   createMonthTable();
   populateMonth();
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
});
