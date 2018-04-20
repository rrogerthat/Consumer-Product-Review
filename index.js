function getDataFromWalApi(searchItem, callback) {
//retrieve data from Walmart API based on what you searched for

  // $.getJSON(WALMART_SEARCH_URL, callback); //does not work with CORS
  
  $.ajax({
    url: `https://api.walmartlabs.com/v1/search?&format=json&apiKey=738gx42wg2zuq5cxrc4rfn7v&numItems=3&query=${searchItem}`, //max 4 results
    jsonp: "callback",
    dataType: "jsonp",
    success: displayProductToPage
  });
}

function renderProductTitle(item) {
//template of product title and image
  return `<h3>${item.name}</h3><br><img src="${item.imageEntities[0].mediumImage}" alt="thumbnail">`;   
// item title and img
}

function displayProductToPage(data) {
//to display item name & img and retrieve item ID to get review comments JSON data
// console.log(data); //display JSON object
    const results = data.items.map((item, index) => renderProductTitle(item));
  $('.js-search-results').html(results); //data is object, items is array


                              //for just 1 item so far??? make the comments request after you click on img, shopping list app ref
  const WALMART_REVIEW_URL = `https://api.walmartlabs.com/v1/reviews/${data.items[0].itemId}?format=json&apiKey=738gx42wg2zuq5cxrc4rfn7v`;
    // $.getJSON(WALMART_REVIEW_URL, displayReviewToPage); //bad with CORS
    //need ID from 1st JSON object to get review info from 2nd JSON object
      
  $.ajax({
    url: WALMART_REVIEW_URL,
    jsonp: "callback",
    dataType: "jsonp",
    success: displayReviewsToPage(1)
  });

  const WALMART_REVIEW2_URL = `https://api.walmartlabs.com/v1/reviews/${data.items[1].itemId}?format=json&apiKey=738gx42wg2zuq5cxrc4rfn7v`;

    $.ajax({
    url: WALMART_REVIEW2_URL,
    jsonp: "callback",
    dataType: "jsonp",
    success: displayReviewsToPage(2)
  });

  const WALMART_REVIEW3_URL = `https://api.walmartlabs.com/v1/reviews/${data.items[2].itemId}?format=json&apiKey=738gx42wg2zuq5cxrc4rfn7v`;

    $.ajax({
    url: WALMART_REVIEW3_URL,
    jsonp: "callback",
    dataType: "jsonp",
    success: displayReviewsToPage(3)
  });
}

function displayReviewsToPage(reviewOrder) {
  return function(data) {               //function returning a function so scale down to 1 function
    if (data.reviews.length === 0) {    //error handling
    $(".js-search-results2").html(`<p>No review comments available.</p>`);
  } else {
      const results = data.reviews.map((item, index) => renderCommentsResult(item));
      $(".js-search-results").on('click',`img:nth-of-type(${reviewOrder}), h3:nth-of-type(${reviewOrder})`,  function(event) {
        console.log('userClicked');
        $(".js-search-results2").html(`<p><u>Customer Reviews:</u></p> ${results.join("")}`); //join so no commas before each Title
      }); 
    }
  }
}

function renderCommentsResult(item) {
  // console.log(item);
  const reviewTitle = item.title;
  const reviewComment = item.reviewText; //put if statement 
    return `<em>${reviewTitle}</em><br>${reviewComment}<br><br>`;   
       // if append, clear out previous search results with jquery search button new. Use strong & paragraph (no <br>) for review comments
}

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

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
  // console.log(data);

  if (data.items.length === 0) {    //error handling
    $(".js-search-results3").html(`<p>No video reviews available.</p>`);
  } else {

  const results = data.items.map((item, index) => renderVideo(item));
  $(".js-search-results3").html(`<p><u>Video Reviews:</u></p> ${results}`);
  }
}

function renderVideo(item) {   //item is each object in array
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