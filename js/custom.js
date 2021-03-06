(function(window, document) {

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

  var video = $('video')[0];
  video.addEventListener('canplaythrough', hideImageWhenVideoCanPlay);

  $('.carousel').carousel({interval:1000});


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
  console.log('paragraphs', paragraphs);
  $('#history p').each(function(i, e) {
    var text = paragraphs[i].text;
    console.log('text', text);
    $(e).text(text);
  });
}

function createItem(id, name, location) {
  var item = makeTemplateObject('mill-template');

  item.attr('id', id);
  item.find('.item-info h2').text(name);
  item.find('.item-info p').text(location);
  item.find('.item-picture').each(function(pictureIndex, el) {
    var imgBaseUrl = 'img/mills/' + id;
    var imgUrl = imgBaseUrl + '/' + (pictureIndex + 1) + '.jpg';
    $(el).css('background-image', 'url(' + imgUrl + ')');
  });

  return item;
}

function addItems(target, items) {
  var $target = $('#' + target);

  items.forEach(function(data, aIndex) {
    var name = data.name;
    var location = data.location;
    var item = createItem(data.millidusedforphotos, data.name, data.location);

    $target.append(item);
  });
}

function createSubmenu(target, items) {
  var $menu = $('<ul class="sub-menu"></ul>');

  items.forEach((function(item) {
    var $el = $('<li><a href="#' + item.millidusedforphotos + '">' + item.name + '</a></li>')
    $menu.append($el);
  }));

  $('#' + target).append($menu);
}

function addMills(mills) {
  addItems('mill-target', mills);
  createSubmenu('mills-menu', mills);
}

function addAtelier(atelier) {
  addItems('atelier-target', atelier);
  createSubmenu('atelier-menu', atelier);
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

function clearStaticContent() {
  console.log('Clearing static content');
  $('#testimonial-list').empty();
}

function processSpreadsheetData(data, tabletop) {
  console.log("Successfully processed!");
  console.log('data', data);

  clearStaticContent();

  addAboutParagraphs(data['About']['elements']);
  addMills(data['Mills']['elements']);
  addAtelier(data['Atelier']['elements']);
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
})(window, document);
