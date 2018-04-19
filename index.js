const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromWalApi(searchItem, callback) {
//retrieve data from Walmart API based on what you searched for

  // $.getJSON(WALMART_SEARCH_URL, callback); //does not work with CORS
  
  $.ajax({
    url: `https://api.walmartlabs.com/v1/search?&format=json&apiKey=738gx42wg2zuq5cxrc4rfn7v&numItems=4&query=${searchItem}`,
    jsonp: "callback",
    dataType: "jsonp",
    success: displayProductToPage
  });
}

function displayProductToPage(data) {
//to display item name & img and retrieve item ID to get review comments JSON data
// console.log(data); //display JSON object
  const itemModel = data.items[0].name; //item name
  const itemImg = `<img src="${data.items[0].imageEntities[0].mediumImage}" alt="thumbnail">`;   // item img
  $(".js-search-results").html("<h3>" + itemModel + "</h3>" + "<br>" + itemImg);

  
  const WALMART_REVIEW_URL = `https://api.walmartlabs.com/v1/reviews/${data.items[0].itemId}?format=json&apiKey=738gx42wg2zuq5cxrc4rfn7v`;
  
    // $.getJSON(WALMART_REVIEW_URL, displayReviewToPage); //bad with CORS
    //need ID from 1st JSON object to get review info from 2nd JSON object
      
  $.ajax({
    url: WALMART_REVIEW_URL,
    jsonp: "callback",
    dataType: "jsonp",
    success: displayReviewToPage
  })
}

function displayReviewToPage(data) {
//to display review comments
  // console.log(data); // JSON Object for customer review info
  if (data.reviews.length === 0) {    //error handling
    $(".js-search-results2").html(`<p>No review comments available.</p>`);
  } else {
      const results = data.reviews.map((item, index) => renderCommentsResult(item));
      $(".js-search-results").on('click', 'h3', function(event) {
        $(".js-search-results2").html(results);                       //if next product has no comments,prev comments get displayed
      }); 

      $(".js-search-results").on('click', 'img', function(event) {    //combine these two???
        $(".js-search-results2").html(results);               
      }); 
  }
}

function renderCommentsResult(item) {
  const reviewTitle = item.title;
  const reviewComment = item.reviewText; //put if statement 
    return `<em>${reviewTitle}</em><br>${reviewComment}<br><br>`;   
       // if append, clear out previous search results with jquery search button new. Use strong & paragraph (no <br>) for review comments
}

function getDataFromTubeApi(searchItem, callback) {
//retrieve data from YouTube API based on what you searched for
    const query = {
    q: `${searchItem} review in:name`, 
    maxResults: 4,
    type: 'video',
    part: 'snippet',
    key: 'AIzaSyBesu0BNRelJsHk1k62KTugc1CJGtPFH8I',
  };
  
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function displayVidsToPage(data) {
//display YouTube thumbnails
  console.log(data);

  if (data.items.length === 0) {    //error handling
    $(".js-search-results3").html(`<p>No video reviews available.</p>`);
  } else {

  const results = data.items.map((item, index) => renderResult(item));
  $(".js-search-results3").html(results);
  }
}

function renderResult(item) {   //item is each object in array
//template of what to display in this function alone
  const videoTitle = item.snippet.title;
  const thumbnailPic = item.snippet.thumbnails.medium.url;
  const videoLink = item.id.videoId;
  return `<p>${videoTitle}</p><a href="https://www.youtube.com/watch?v=${videoLink}" target="_blank"><img src="${thumbnailPic}" alt="thumbnail"></a>`;
}

function displError(err) {
  $(".js-search-results3").html(`<p>No video reviews available.</p>`);
}

function beginSearch() {
//start app when search begins
  $(".js-search-form").submit(function(event) {
    event.preventDefault();
    const inputTarget = $(this).find(".js-query");
    const targetVal = inputTarget.val();
    inputTarget.val("");

    $(".js-search-results2").empty();   //to clear out comments from previously searched item

  getDataFromWalApi(targetVal, displayProductToPage);
  getDataFromTubeApi(targetVal, displayVidsToPage);
  });
}

$(beginSearch);