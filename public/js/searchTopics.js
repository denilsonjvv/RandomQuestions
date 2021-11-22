//Search members to project function
let resultList = [];
function addMember() {
  let addTopic = document.getElementById("addTopic");
  resultList.forEach((item) => {
    item.addEventListener("click", () => {
      const topicText = item.textContent;
      const newInput = `<label class='checkbox-label'><input type='checkbox' name='topics' value='${topicText}' checked></input><span class='checkbox-custom'></span>${topicText}</label> `;
      addTopic.innerHTML += newInput;
    })
  })
}
function renderResults(search_value, topicsData) {
  const topicsList = $("#topicsList");
  topicsList.html("");
  if (topicsData.length == 0) return topicsList.append(`<span>No topics found with ${search_value} </span>`);
  topicsData.forEach(topic => {
    const topicElement = document.createElement("li");
    topicElement.innerHTML = topic.title;
    resultList.push(topicElement);
    topicsList.append(topicElement);
  });
  addMember();
  console.log(resultList);
}
let searchTopics = debounce((arg) => {
  resultList = [];
  const searchValue = arg.trim();
  const topicsPopup = $("#topicsPopup");
  const searchInput = $("#searchTopic");
  searchInput.addClass("loading");
  if (searchValue == "" || searchValue.length <= 0) {
    searchInput.removeClass("loading");
    topicsPopup.fadeOut();
    return;
  } else {
    topicsPopup.fadeIn();
  }
  $.ajax({
    type: 'get',
    url: `/p/search?q=${searchValue}`,
  })
  .done((topicsData) => {
    renderResults(searchValue, topicsData);
    searchInput.removeClass("loading");
  })
  .fail(function (err) {
    console.log(err);
  });
}, 500); // debounce data every 500ms from each 2 keystrokes

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this;
    args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
