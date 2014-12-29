/* -- Full Screen Viewport Container
   ---------------------------- */

$(window).load(function(){
    init();
});

$(document).ready(function() {
  fullScreenContainer();
});


/* --- initialize functions on window load here -------------- */

function init() {
  onePageScroll();
  scrollAnchor();
}

/* --- Full Screen Container ------------- */

function fullScreenContainer() {

  // Set Initial Screen Dimensions

  var screenWidth = $(window).width() + "px";
  var screenHeight = $(window).height() + "px";

  $("#intro, #intro .item, #intro-video").css({
    width: screenWidth,
    height: screenHeight
  });

  // Every time the window is resized...

  $(window).resize( function () {

    // Fetch Screen Dimensions

    var screenWidth = $(window).width() + "px";
    var screenHeight = $(window).height() + "px";

    // Set Slides to new Screen Dimensions

    $("#intro, #intro .item, #intro-video, #intro-video .item").css({
      width: screenWidth,
      height: screenHeight
    });
  });
}

/* --- scrollReveal ------------------- */

window.scrollReveal = new scrollReveal();

/* --- One Page Scroll ------------------- */

function onePageScroll() {
  $('.nav').onePageNav({
      currentClass: 'current',
      changeHash: false,
      scrollSpeed: 650,
      scrollOffset: 30,
      scrollThreshold: 0.5,
      filter: ':not(.login, .signup)',
      easing: 'swing',
      begin: function() {
          //I get fired when the animation is starting
      },
      end: function() {
          //I get fired when the animation is ending
      },
      scrollChange: function(currentListItem) {
          //I get fired when you enter a section and I pass the list item of the section
      }
  });
}


$(window).scroll(function() {
  var windowpos = $(window).scrollTop() ;

  if (windowpos <= 500) {
      $('.nav li.current').removeClass('current');
  }
});
