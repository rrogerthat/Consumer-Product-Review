function getDataFromWalApi(searchItem, callback) {
//retrieve data from Walmart API based on what you searched for

// $.getJSON(WALMART_SEARCH_URL, callback); //does not work with CORS
  $.ajax({ //can also name query object and call it thru ajax
    url: `https://api.walmartlabs.com/v1/search?&format=json&apiKey=738gx42wg2zuq5cxrc4rfn7v&numItems=3&query=${searchItem}`, 
    //3 results
    jsonp: "callback",
    dataType: "jsonp",
    success: displayProductToPage
  });
}

function renderProductTitle(item) {
//template of product title and image
// console.log(item);
  if (item.name === undefined) {
    return `<p class="noComment">No products available for consumer review comments.</p>`;
  } else if (item.imageEntities === undefined) {
      return `<p class="titleImg">${item.name}</p><img src="${item.mediumImage}" tabindex="0" alt="thumbnail" role="img">`;
  } else {
      return `<p class="titleImg">${item.name}</p><img src="${item.imageEntities[0].mediumImage}" tabindex="0" alt="thumbnail" role="img">`;
  }  
}

function displayProductToPage(data) {
//to display item name & img and retrieve item ID to get review comments JSON data on another URL
// console.log(data); //display JSON object
  if (data.numItems === 0) {
    $('.js-feedback-results').html(`<p class="noComment">No products available for consumer review comments.</p>`);
  } else {
      const results = data.items.map((item, index) => renderProductTitle(item)); //data is object, items is array

      const vidButton = `<button type="button" role="button"><a href="#vidsSec" role="link">To Video Reviews Section</a></button>`; 
      //link to Vids Section
      const commInform = `<div class="clickInst">Click on each thumbnail below to display comments</div>`;
      $('.js-feedback-results').html
      (`<h2>Items with Consumer Feedback:</h2>${vidButton} ${commInform} <div class="border">${results.join("")}</div>`); 
  }

  
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
  return function(data) {               //function returning a function so scale down to 1 function (instead of 3 for each item)
  console.log(data);
    const results = data.reviews.map((item, index) => renderCommentsResult(item));
    $(".js-feedback-results").on('click keyup', `img:nth-of-type(${reviewOrder}), p.titleImg:nth-of-type(${reviewOrder})`, 
    function(event) {

      const targetImage = $(`img:nth-of-type(${reviewOrder})`); //provide border around selected item that comments are displayed
      const otherImages = $("img").not(targetImage);
      otherImages.removeClass("imgSelected");
      targetImage.addClass("imgSelected");

      $(".cr").remove();  //clear out previous comments and one's related to other products before displaying new comments

      if (data.reviews.length === 0) {  //error handling
        $(`.js-feedback-results img:nth-of-type(${reviewOrder})`).
        after(`<p class="cr">No review comments available.</p>`);
      } else {    
          $(`.js-feedback-results img:nth-of-type(${reviewOrder})`).
          after(`<div class="cr"><p>Consumer Reviews:</p><ul role="list">${results.join("")}</ul></div>`);
        //join so no commas before each Title
        }
    });
  };
}

function renderCommentsResult(item) {
  // console.log(item);
  const reviewTitle = item.title;
  const reviewComment = item.reviewText; 

  if (reviewTitle === undefined) {
    return `<li><b>No Review Title available</b><br>${reviewComment}</li>`; 
  } else {
      return `<li><b>${reviewTitle}</b><br>${reviewComment}</li>`;   
    }
}

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromTubeApi(searchItem, callback) {
//retrieve data from YouTube API based on what you searched for
    const query = {
    q: `${searchItem} review`, //can also do in:name 
    maxResults: 4,
    type: 'video',
    part: 'snippet',
    key: 'AIzaSyBesu0BNRelJsHk1k62KTugc1CJGtPFH8I'
  };
  
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function displayVidsToPage(data) {
//display YouTube thumbnails
// console.log(data);
  if (data.items.length === 0) {    //error handling
    $(".js-video-results").html(`<p class="noVids">No video reviews available.</p>`);
  } else {
      const results = data.items.map((item, index) => renderVideo(item));
      const reviewsButton = `<button type="button" role="button"><a href="#feedbackSec" role="link">To Consumer Reviews Section</a></button>`;
      const vidInform = `<p>Click on each thumbnail below to watch video</p>`;
      $(".js-video-results").
      html(`<h2>Video Reviews:</h2>${reviewsButton} ${vidInform} <div class="border">${results.join("")}<div>`);
  }

   $('a.html5lightbox').html5lightbox();  //achor tag not in DOM yet so put here for lightbox to work
}

function renderVideo(item) {   //item is each object in array
//template of what to display
  const videoTitle = item.snippet.title;
  const thumbnailPic = item.snippet.thumbnails.medium.url;
  const videoLink = item.id.videoId;
    return `<a href="https://www.youtube.com/watch?v=${videoLink}" class="html5lightbox" role="link"><p>${videoTitle}</p><img src="${thumbnailPic}" alt="thumbnail" role="img"></a>`;
}           //if problems: change to embed/ from watch?v= to display due to CORS

function beginSearch() {
//start app when search begins
  $(".js-search-form").submit(function(event) {
    event.preventDefault();
    const inputTarget = $(this).find(".js-query");
    const targetVal = inputTarget.val();
    inputTarget.val("");

  getDataFromWalApi(targetVal, displayProductToPage);
  getDataFromTubeApi(targetVal, displayVidsToPage);

  $(".mainpic").remove();
  $(".queryItem").html(`Search results for: ${targetVal}`);   
  });

  $(".js-query").keydown(function() { 
    $('.queryItem').empty();  
  })  //to clear out display of what you searched for previously when typing in a new search item
}

$(beginSearch);