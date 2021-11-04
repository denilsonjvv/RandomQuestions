//Search members to project function
let memberIds = [];
let list;
function addMember() {
  let addTopic = document.getElementById("addTopic");
  for (var i = 0; i < list.length; i++) {
    list[i].addEventListener("click", function() {
      let memId = this.getAttribute("data-memId"); // member Id from data Attribute
      // let memProImg = this.getAttribute("data-img");
      let newName = this.textContent; //innerHtml (name)
      let inputString = `<label class='checkbox-label'><input type='checkbox' name='topics' value='${memId}' checked></input><span class='checkbox-custom'></span>${newName}</label> `;

      memberIds.push(memId);
      addTopic.innerHTML += inputString;
    });
  } // end of for loop
}

//--------------
var showResults = debounce(function(arg) {
  var value = arg.trim();
  var topicsList = $("#topicsList");
  var popup = $("#memberPopup");
  var input = $("#assign");
  input.addClass("loading");
  if (value == "" || value.length <= 0) {
    input.removeClass("loading");
    popup.fadeOut();
    return;
  } else {
    popup.fadeIn();
  }
  var jqxhr = $.get("/p/search?q=" + value, function(data) {
    topicsList.html("");
  })
    .done(function(data) {
      if (data.length === 0) {
        topicsList.append(
          "<span>No topics found with ' " + value + " ' </span>"
        );
      } else {
        data.forEach(x => {
          console.log(x);
          let outputHTML = `<li class='lis' data-memId='${x._id}'>${x.title}</li>`;
          topicsList.append(outputHTML);
        });
        list = document.querySelectorAll(".lis");
        addMember();
      }
      input.removeClass("loading");
    })
    .fail(function(err) {
      console.log(err);
    });
}, 350); // debounce data every 350ms from each 2 keystrokes

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this;
    args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
