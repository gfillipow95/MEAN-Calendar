const monthFormat = new Intl.DateTimeFormat('en-US', {month: 'long'});
const monthNumeric = new Intl.DateTimeFormat('en-US', {month: 'numeric'});
const localeFormat = new Intl.DateTimeFormat('en-US');
const monthAbv = new Intl.DateTimeFormat('en-US', {month: 'short'});
const dayFormat = new Intl.DateTimeFormat('en-US', {weekday: 'long'});
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm",
               "7pm", "8pm", "9pm", "10pm", "11pm"];

console.log(date)

//function createMonth(){
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
   $(".calendarHeader").text(monthFormat.format(firstDayCurrMonth) + " " + firstDayCurrMonth.getFullYear());
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
//}

//createMonth();

$("#monthlyView").click(function(){

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
