$(document).ready(function(){
   $("#registerUser").click(function(){
      let fullName = $("#fullNameInput").val();
      let userEmail = $("#emailInput").val();
      let userPassword = $("#passwordInput").val();

      let userInfo = {
         name: fullName,
         email: userEmail,
         password: userPassword
      };

      $.ajax({
         method: "POST",
         url: "http://localhost:3000/register",
         data: userInfo,
         success: function(e){
            window.location = e.redirect;
         },
         error: function(e, status){
            alert(e);
         }
      });
   });
});
