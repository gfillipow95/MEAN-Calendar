function createRightDrawer(dateArray){
   let month = parseInt(dateArray[0].replace(/\u200E/g,""), 10)-1;
   let year = parseInt(dateArray[2].replace(/\u200E/g,""), 10);
   let day = parseInt(dateArray[1].replace(/\u200E/g,""), 10);
   let selectedDay = new Date(year, month, day);
   let dateString = dayFormat.format(selectedDay) + " " + monthFormat.format(selectedDay) + " " + dateArray[1] + ", " + dateArray[2];
   $("#drawerDate").text(dateString);
   $("#drawerEvents").empty();
   $.each(eventMap, function(dateKey, eventList){
      if(dateKey == localeFormat.format(selectedDay)){
         $.each(eventList, function(i, eventObj){
            let eventDiv = "<div class='eventDiv' id=e" +  eventObj.eventID +">";
            let eventName = "<h4 class=text-center>" + eventObj.title + "</h4>";
            let eventTime = "<p class='text-center'>" + formatEventTime(eventObj.stime) + " - " + formatEventTime(eventObj.etime) + "</p>";
            eventDiv += eventName;
            eventDiv += eventTime;
            let delBtn = "<button class='deleteButton' data-eId=" + eventObj.eventID + ">X</button>";
            let updateBtn = "<button class='updateButton' data-eId=" + eventObj.eventID + ">&#9998;</button>";
            eventDiv += updateBtn;
            eventDiv += delBtn;
            eventDiv += "</div>";
            $("#drawerEvents").append(eventDiv);
            $("#e"+eventObj.eventID).css("background-color", eventObj.color);
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


$("#addEventBtn").click(function(){
   let eTitle = $("#eventTitle").val();
   let eDate = $("#eventDate").val();
   let sTime = $("#eventStartTime").val();
   let eTime = $("#eventEndTime").val();
   let eColor = $(".selectedColor").attr("name");
   let newDate = new Date(eDate);
   newDate = newDate.setDate(newDate.getDate() + 1);
   newDate = localeFormat.format(newDate);
   let startDateTime = new Date(eDate + " " + sTime);
   let endDateTime = new Date(eDate + " " + eTime);
   let newEvent={
      title: eTitle,
      date: newDate,
      stime: startDateTime.toISOString(),
      etime: endDateTime.toISOString(),
      color: eColor
   }
   $.ajax({//Add Events
      method: "POST",
      url: "http://localhost:3000/events",
      data: newEvent,
      success: function(e){
         let eventData = JSON.parse(JSON.stringify(e));
         let formatStartTime = new Date(eventData['stime']);
         let formatEndTime = new Date(eventData['etime']);
         events = {
            title: eventData['title'],
            date: eventData['date'],
            stime: formatStartTime.toLocaleTimeString('en-GB'),
            etime: formatEndTime.toLocaleTimeString('en-GB'),
            color: eventData['color'],
            eventID: eventData['_id']
         }
         if(eventMap[newDate] != undefined){
            eventMap[newDate].push(events);
         }else{
            eventMap[newDate] = [events];
         }
         console.log(newDate); //Returns 1/4/2017 so I can pass this into the right drawer function
         createRightDrawer(newDate.split("/"));
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
            alert("the event, '" + e.responseJSON[0].title + "' is conflicting with the event you're trying to create.");
         }
      }
   });
   $("#eventTitle").val("");
   $("#eventDate").val("");
   $("#eventStartTime").val("");
   $("#eventEndTime").val("");
   $("#editMenu").fadeOut(400, function(){$("#editMenu").addClass("hide");});
   $("#table-background").animate({"opacity": "1"});
   $("#calendar").removeClass("disable");
});

$("#addEventButton").click(function(){
   $("#editMenu").fadeIn(400, function(){$("#editMenu").removeClass("hide");});
   $("#table-background").animate({"opacity": "0.4"});
   $("#calendar").addClass("disable");
   //$("#table-background").addClass("opacity");
});

$("#table-background").click(function(){
   if($("#editMenu").hasClass("hide") === false){
      $("#editMenu").fadeOut(400, function(){$("#editMenu").addClass("hide")});
      $("#table-background").animate({"opacity": "1"});
      //$("#editMenu").addClass("hide");
      $("#calendar").removeClass("disable");
      //$("#table-background").removeClass("opacity");
   }
   if($("#eventMenu").hasClass("hide") === false){
      $("#eventMenu").fadeOut(400, function(){$("#eventMenu").addClass("hide")});
      //$("#eventMenu").addClass("hide");
      $("#calendar").removeClass("disable");
      //$("#table-background").removeClass("opacity");
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
                        //$(idString).slideUp("slow", );
                        $(idString).animate({"right": "-90%"}, "fast", function() { $(idString).remove()});
                        if(eventList.length == 0){
                           $("[data-date='" + dateKey + "']").css("background-color", "white");
                           $("[data-date='" + dateKey + "']").text("");
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
                  $("#editColors>input.selectedColor").removeClass("selectedColor");
                  $("input[name*='"+eventObj.color+"']").addClass("selectedColor");
                  $("#saveEventBtn").attr("data-eId", eventObj.eventID);
               }
            })
         })
         $("#eventMenu").fadeIn(400, function(){$("#eventMenu").removeClass("hide");});
         $("#table-background").animate({"opacity": "0.4"});
         $("#calendar").addClass("disable");
      })
   }
});

$("#saveEventBtn").on("click", function(){
   let eTitle = $("#editTitle").val();
   let eDate = $("#editDate").val();
   let sTime = $("#editStartTime").val();
   let eTime = $("#editEndTime").val();
   let eColor = $("#editColors>input.selectedColor").attr("name");
   let newDate = new Date(eDate);
   newDate = newDate.setDate(newDate.getDate() + 1);
   newDate = localeFormat.format(newDate);
   let startDateTime = new Date(eDate + " " + sTime);
   let endDateTime = new Date(eDate + " " + eTime);
   let newEvent={
      title: eTitle,
      date: newDate,
      stime: startDateTime.toISOString(),
      etime: endDateTime.toISOString(),
      color: eColor
   }
   let eId = $("#saveEventBtn").attr("data-eId");
   $.ajax({
      method: "PATCH",
      url: "http://localhost:3000/events/" + eId,
      data: newEvent,
      success: function(data){
         let eventData = JSON.parse(JSON.stringify(data));
         let formatStartTime = new Date(eventData['stime']);
         let formatEndTime = new Date(eventData['etime']);
         events = {
            title: eventData['title'],
            date: eventData['date'],
            stime: formatStartTime.toLocaleTimeString('en-GB'),
            etime: formatEndTime.toLocaleTimeString('en-GB'),
            color: eventData['color'],
            eventID: eventData['_id']
         }
         let replaceIndex;
         $.each(eventMap[newDate], function(index, e){
            if(e.eventID === events.eventID){
               replaceIndex = index;
            }
         });
         eventMap[newDate][replaceIndex] = events;
         createRightDrawer(newDate.split("/"));
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
            console.log(e.responseJSON[0].title)
            alert("the event, '" + e.responseJSON[0].title + "' is conflicting with the event you're trying to create.");
         }
      }
   });
   $("#eventMenu").fadeOut(400, function(){$("#eventMenu").addClass("hide");});
   $("#calendar").removeClass("disable");
});

$(".colorBtn").click(function(e){
   if($("#editMenu").hasClass("hide")){
      $("#editColors>input.selectedColor").removeClass("selectedColor");
   }else if($("#eventMenu").hasClass("hide")){
      $("#eventColors>input.selectedColor").removeClass("selectedColor");
   }
   $(this).addClass("selectedColor");
})

$("#calendar").click(function(e){
   $("#table-background").animate({"opacity": "0.4"});
   createRightDrawer(e.target.getAttribute("data-date").split("/"));
   let drawerWidth = $("#rightDrawer").width();
   $("#rightDrawer").animate({"right": 0,}, "450");
});

$("#deleteWindow").click(function(){
   let drawerWidth = $("#rightDrawer").width();
   $("#rightDrawer").animate({"right": "-30%"}, "450");
   $("#table-background").animate({"opacity": "1"});
});
