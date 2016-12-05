

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
               if(startHour == item.getAttribute("data-time")){
                  $("[data-date='" + key + "'][data-time='" + item.getAttribute("data-time") + "']").text(eventObj.title);
               }
               $("[data-date='" + key + "'][data-time='" + item.getAttribute("data-time") + "']").css("background-color", "yellow");
            }
         })
      })
   })
}

function addDayEvent(){
   let calendar = $("#calendar").find("tr td");
   let startHour, endHour;
   $.each(eventMap, function(dateKey, eventList){
      $.each(eventList, function(i, eventObj){
         startHour = eventObj.stime.split(":")[0];
         endHour = eventObj.etime.split(":")[0];
         if(startHour[0] == 0){
            startHour = startHour.substring(1);
         }
         if(endHour[0] == 0){
            endHour = endHour.substring(1);
         }
         $.each(calendar, function(index, item){
            if(dateKey == item.getAttribute("data-date") && startHour <= item.getAttribute("data-time") && item.getAttribute("data-time") < endHour){
               if(startHour == item.getAttribute("data-time")){
                  $("[data-date='" + dateKey + "'][data-time='" + item.getAttribute("data-time") + "']").text(eventObj.title);
               }
               $("[data-date='" + dateKey + "'][data-time='" + item.getAttribute("data-time") + "']").css("background-color", "yellow");
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
   let newEvent={
      title: eTitle,
      date: newDate,
      stime: sTime,
      etime: eTime
   }
   $.ajax({//Add Events
      method: "POST",
      url: "http://localhost:3000/events",
      data: newEvent,
      success: function(e){
         let eventData = JSON.parse(JSON.stringify(e));
         events = {
            title: eventData['title'],
            date: eventData['date'],
            stime: eventData['stime'],
            etime: eventData['etime'],
            eventID: eventData['_id']
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
         }else if($("#calendar").hasClass("day")){
            addDayEvent();
         }
      },
      error: function(e, status){
         if(e.status == 500){
            alert("Can't add the event");
         }
      }
   });
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
   if($("#editMenu").hasClass("hide") === false){
      $("#editMenu").addClass("hide");
      $("#calendar").removeClass("disable");
      $("#table-background").removeClass("opacity");
   }
   if($("#eventMenu").hasClass("hide") === false){
      $("#eventMenu").addClass("hide");
      $("#calendar").removeClass("disable");
      $("#table-background").removeClass("opacity");
   }
   if(document.querySelector(".deleteButton") !== null){
      let idString;
      $(".deleteButton").click(function(e){
         $.each(eventMap, function(dateKey, eventList){
            $.each(eventList, function(i, eventObj){
               if(e.target.getAttribute("data-eId") == eventObj.eventID){
                  let eIndex = eventList.indexOf(eventObj);
                  $.ajax({
                     method: "DELETE",
                     url: "http://localhost:3000/events/" + eventObj.eventID,
                     success: function(data){
                        eventList.splice(eIndex, 1);
                        idString = "#e"+eventObj.eventID;
                        $(idString).remove();
                        if(eventList.length == 0){
                           $("[data-date='" + dateKey + "']").css("background-color", "white");
                           delete eventMap[dateKey];
                        }
                     }
                  });
               }
            })
         })
      });
   }
   if($(".updateButton") !== null){
      $(".updateButton").click(function(e){
         e.stopPropagation();
         $.each(eventMap, function(dateKey, eventList){
            $.each(eventList, function(i, eventObj){
               if(e.target.getAttribute("data-eId") == eventObj.eventID){
                  let eIndex = eventList.indexOf(eventObj);
                  $("#editTitle").val(eventObj.title);
                  $("#editDate").val(eventObj.date.split("T")[0]);
                  $("#editStartTime").val(eventObj.stime);
                  $("#editEndTime").val(eventObj.etime);
                  $("#saveEventBtn").attr("data-eId", eventObj.eventID);
               }
            })
         })
         $("#eventMenu").removeClass("hide");
         $("#calendar").addClass("disable");
         $("#table-background").addClass("opacity");
      })
   }
});

$("#saveEventBtn").click(function(){
   let eTitle = $("#editTitle").val();
   let eDate = $("#editDate").val();
   let sTime = $("#editStartTime").val();
   let eTime = $("#editEndTime").val();
   let newDate = new Date(eDate);
   newDate = newDate.setDate(newDate.getDate() + 1);
   newDate = localeFormat.format(newDate);
   let newEvent={
      title: eTitle,
      date: newDate,
      stime: sTime,
      etime: eTime
   }
   let eId = $("#saveEventBtn").attr("data-eId");
   console.log(eId)
   $.ajax({
      method: "PATCH",
      url: "http://localhost:3000/events/" + eId,
      data: newEvent,
      success: function(data){
         location.reload();
      }
   });
   $("#eventMenu").addClass("hide");
   $("#calendar").removeClass("disable");
   $("#table-background").removeClass("opacity");
});

$("#calendar").click(function(e){
   createRightDrawer(e.target.getAttribute("data-date").split("/"));
   let drawerWidth = $("#rightDrawer").width();
   $("#rightDrawer").animate({"right": 0}, "fast");
});

$("#deleteWindow").click(function(){
   let drawerWidth = $("#rightDrawer").width();
   $("#rightDrawer").animate({"right": "-25%"}, "fast");
});
