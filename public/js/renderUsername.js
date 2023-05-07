const generateUsername = document.getElementById("usernameGenerator");
generateUsername.addEventListener("click", () => {
  var input = document.getElementById("username");
  var jqxhr = $.ajax({
    type: "GET",
    url: "/profile/usernameGen",
  })
    .done(function (data) {
      var outputHTML = data;
      input.value = outputHTML;
    })
    .fail(function (err) {
      console.log(err);
    });
});
