

function addMonthEvent(){
   let calendar = $("#calendar").find("tr td");
   $.each(eventMap, function(key, value){
      $.each(calendar, function(index, item){
         if(key == item.getAttribute("data-date")){
            $("[data-date='" + key + "']").css("background-color", "yellow");
         }
      });
   });
}

function addWeekEvent(){
   let calendar = $("#calendar").find("tr td");
   let startHour, endHour;
   $.each(eventMap, function(key, value){
      $.each(value, function(i, eventObj){
         startHour = eventObj.stime.split(":")[0];
         endHour = eventObj.etime.split(":")[0];
         if(startHour[0] == 0){
            startHour = startHour.substring(1);
         }
         if(endHour[0] == 0){
            endHour = endHour.substring(1);
         }
         $.each(calendar, function(index, item){
            if(key == item.getAttribute("data-date") && startHour <= item.getAttribute("data-time") && item.getAttribute("data-time") < endHour){
               $("[data-date='" + key + "'][data-time='" + item.getAttribute("data-time") + "']").css("background-color", "yellow");
            }
         })
      })
   })
}


$("#addEventBtn").click(function(){
   let eTitle = $("#eventTitle").val();
   let eDate = $("#eventDate").val();
   let sTime = $("#eventStartTime").val();
   let eTime = $("#eventEndTime").val();
   let newDate = new Date(eDate);
   newDate = newDate.setDate(newDate.getDate() + 1);
   newDate = localeFormat.format(newDate);
   events={
      title: eTitle,
      date: newDate,
      stime: sTime,
      etime: eTime
   }
   if(eventMap[newDate] != undefined){
      eventMap[newDate].push(events);
   }else{
      eventMap[newDate] = [events];
   }
   if($("#calendar").hasClass("month")){
      addMonthEvent();
   }else if($("#calendar").hasClass("week")){
      addWeekEvent();
   }
   $("#eventTitle").val("");
   $("#eventDate").val("");
   $("#eventStartTime").val("");
   $("#eventEndTime").val("");
   $("#editMenu").addClass("hide");
   $("#calendar").removeClass("disable");
   $("#table-background").removeClass("opacity");
});

$("#addEventButton").click(function(){
   $("#editMenu").removeClass("hide");
   $("#calendar").addClass("disable");
   $("#table-background").addClass("opacity");
});

$("#table-background").click(function(){
   $("#editMenu").addClass("hide");
   $("#calendar").removeClass("disable");
   $("#table-background").removeClass("opacity");
});

$("#calendar").click(function(e){
   createRightDrawer(e.target.getAttribute("data-date").split("/"));
   $("#rightDrawer").removeClass("hide");
});

$("#deleteWindow").click(function(){
   $("#rightDrawer").addClass("hide");
});
