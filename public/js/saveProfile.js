$(function () {
  $("#saveButton").on("click", function () {
    var id = $(this).data("userid");
    var msg = $(".msg");
    var data = {
      name: $("#name").val(),
      email: $("#email").val(),
    };
    $.ajax({
      method: "PUT",
      url: "/profile/" + id + "?_method=PUT",
      data: data,
    })
      .done(function (data) {
        msg.removeClass("d-none");
        function removeMsg() {
          msg.addClass("d-none");
        }
        setTimeout(removeMsg, 4000);
      })
      .fail(function (err) {
        console.log("Oops not working" + err);
      });
  });
});
