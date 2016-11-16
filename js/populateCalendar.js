var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function createMonthTable(){
   document.querySelector("#calendar").classList = "";
   document.querySelector("#calendar").classList.add("month");
   var tbl = document.querySelector('.month');
   for(var i=0; i<6; i++){
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

function populateMonth(){
   var date = new Date();
   var month = date.getMonth();
   var year = date.getFullYear();
   var newDate = new Date(year, month, 0);
   var days = newDate.getDate();
   var count = 1;
   var calendar=document.querySelector(".month");
   var startDate = newDate.getDay() + 1;
   var cHead = document.querySelector(".calendarHeader").innerHTML = months[month] + " " + year;
   for(var i = 1; i < 6; i++){
      for(var j = 0; j < 7; j++){
         if(count < days && (j >= startDate || i > 1)){
            calendar.rows[i].cells[j].innerHTML = count;
            count++;
         }
      }
   }
};

createMonthTable();
populateMonth();
