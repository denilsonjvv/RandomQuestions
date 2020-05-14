//Search members to project function

//--------------
var showResults = function () {
  var input = document.getElementById("username");
  var jqxhr = $.get("/profile/usernameGen", function (data) {})
    .done(function (data) {
      var outputHTML = data;
      input.setAttribute("value", outputHTML);
      input.value = outputHTML;
      console.log(outputHTML);
    })
    .fail(function (err) {
      console.log(err);
    });
};
