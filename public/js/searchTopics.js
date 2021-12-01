//Search members to project function
function addTopic(topicResults) {
  if (topicResults.length === 0) return;
  topicResults.forEach((item) => {
    item.addEventListener("click", () => {
      const topicContainer = document.getElementById("topicContainer");
      const topicText = item.textContent;
      const newInput = `<label class='chosenTopic checkbox-label'><input type='checkbox' name='topics' value='${topicText}' checked>${topicText} <span onClick="this.parentElement.remove();"><i class="fas fa-times"></i></span></label>`;
      topicContainer.innerHTML += newInput;
      item.remove();
    });
  });
}
function renderResults(search_value, topicsData) {
  const topicsList = $("#topicsList");
  const chosenTopics = document.querySelectorAll(".chosenTopic");
  topicsList.html("");
  if (topicsData.length == 0) return topicsList.append(`<span>No topics found with ${search_value}</span>`);
// TODO: Refactor this.
  const testArray = [];
  chosenTopics.forEach((topic) => testArray.push(topic.textContent.trim()));
  const testArray2 = [];
  topicsData.forEach((topic) => testArray2.push(topic.title.trim()));
  const topicResults = testArray2.filter((element) => !testArray.includes(element));
  if (topicResults.length === 0) return topicsList.append(`<span>Topic results are already chosen.</span>`);
  const resultList = [];
  topicResults.forEach((topic) => {
    const topicElement = document.createElement("li");
    topicElement.innerHTML = topic;
    resultList.push(topicElement);
    topicsList.append(topicElement);
  })
  addTopic(resultList);
}

const searchTopics = debounce((arg) => {
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
  .fail((err) => {
    console.log(err);
  });
}, 500); // debounce data every 500ms from each 2 keystrokes

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this;
    args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
