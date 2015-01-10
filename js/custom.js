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
  addMap();
  getDataFromGoogleSpreadsheet();
  startFlippingAboutImages();
}

/* --- Full Screen Container ------------- */

function fullScreenContainer() {

  // Set Initial Screen Dimensions

  var screenWidth = $(window).width() + "px";
  var screenHeight;

  if (window.innerHeight > 720) {
    screenHeight = '590px';
  }
  else {
    screenHeight = window.innerHeight + "px";
  }

  console.log('screenWidth', screenWidth);
  console.log('screenHeight', screenHeight);

  $("#intro").css({
    width: screenWidth,
    height: screenHeight
  });

  // Every time the window is resized...

  $(window).resize( function () {

    // Fetch Screen Dimensions

    var screenWidth = $(window).width() + "px";
    var screenHeight;

    if (window.innerHeight > 720) {
      screenHeight = '590px';
    }
    else {
      screenHeight = window.innerHeight + "px";
    }

    console.log('screenWidth', screenWidth);
    console.log('screenHeight', screenHeight);

    // Set Slides to new Screen Dimensions

    $("#intro").css({
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

function hideImageWhenVideoCanPlay() {
  console.log('well play away');
  $('.video-fallback').css('display', 'none');
}

var templateCache = {};

function makeTemplateObject(templateId) {
  var templateText, templateObject;

  if (templateCache[templateId] == undefined) {
    templateText = $('#'+templateId).text().trim();
    templateCache[templateId] = templateText;
  }
  else {
    templateText = templateCache[templateId]
  }

  templateObject = $('<div/>').html(templateText).contents();

  return templateObject;
}

function addAboutParagraphs(paragraphs) {
  $('#about p').each(function(i, e) {
    $(e).text(paragraphs[i]['text']);
  });
}

function addMills(mills) {

  mills.forEach(function(e, i) {
    var mill = makeTemplateObject('mill-template'),
        millId = mills[i]['millidusedforphotos'];

    if (i == 0) {
      mill.addClass('active');
    }

    var pictureElements = mill.find('.mill-picture');

    pictureElements.each(function(pictureIndex, pictureElement) {
      $(pictureElement).css('background-image', 'url(img/mills/' + millId + '/' + (pictureIndex + 1) + '.jpg)');
    });

    mill.find('h2').text(mills[i]['name']);
    mill.find('p').text(mills[i]['location']);

    $('#mill-carousel').append(mill);
  });

}

function addTestimonial(testimonialData) {
  var testimonial = makeTemplateObject('testimonial-template');

  testimonial.find('p').text(testimonialData['text']);
  testimonial.find('.name').text(testimonialData['name']);
  testimonial.find('.company').text(testimonialData['company']);

  $('#testimonial-list').append(testimonial);
}

function addContactAddresses(addressData) {
  addressData.forEach(function(d) {
    var id;
    if (d['location'] == 'New York') {
      id = 'nyc';
    }
    else if (d['location'] == 'Italy') {
      id = 'italy';
    }

    $('#'+id+' .street').text(d['streetaddress']);
    $('#'+id+' .city').text(d['city']);
    $('#'+id+' .state').text(d['state']);
    $('#'+id+' .country').text(d['country']);
    $('#'+id+' .phone').text(d['phonenumber']);
  })
}

function updateSocialMediaLinks(socialMediaData) {
  socialMediaData.forEach(function(d) {
    if (d['service'] == 'Facebook') {
      $('.icon#fb').attr('href', 'https://www.facebook.com/' + d['username']);
    }
    else if (d['service'] == 'Twitter') {
      $('.icon#twitter').attr('href', 'https://www.twitter.com/' + d['username']);
    }
    else if (d['service'] == 'Instagram') {
      $('.icon#instagram').attr('href', 'https://www.instagram.com/' + d['username']);
    }
  })
}

function processSpreadsheetData(data, tabletop) {
  console.log("Successfully processed!")
  console.log('data', data);

  addAboutParagraphs(data['About']['elements']);
  addMills(data['Mills']['elements']);
  updateSocialMediaLinks(data['Social']['elements']);
  addContactAddresses(data['Contact']['elements'])
  for (var t=0;t<data['Testimonials']['elements'].length;t++) {
    addTestimonial(data['Testimonials']['elements'][t]);
  }
}

function getDataFromGoogleSpreadsheet() {
  var docKey = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=15RKaYrdMGn-FSglHi4_QBKHVgiF_VwF7seg2jg6epyU&output=html';
  Tabletop.init( {key: docKey, callback: processSpreadsheetData, debug:true} );
}

function setIntervalForImageFlipping(sel, ms) {
  setInterval(function() {
    $(sel).toggleClass('flipped');
  }, ms);
}

function startFlippingAboutImages() {
  var flipDuration = 4000;

  setIntervalForImageFlipping('.first-image .card', flipDuration);
  setTimeout(function() {
    // using a timeout to make sure the images dont flip at the same time
    setIntervalForImageFlipping('.second-image .card', flipDuration);
  }, flipDuration/2);
}

function addMap() {
  var map = L.map('map', { zoomControl:false }).setView([40.7541085, -73.990679], 14);
  var marker = L.marker([40.7541085, -73.990679]).addTo(map);

  L.tileLayer('http://{s}.tiles.mapbox.com/v3/jeremiak.kkaci7o7/{z}/{x}/{y}.png',{maxZoom: 18}).addTo(map);
}

$(window).scroll(function() {
  var windowpos = $(window).scrollTop() ;

  if (windowpos <= 500) {
      $('.nav li.current').removeClass('current');
  }
});
