$(document).ready(function() {
  sudsTrackerApp.init();
});

var templates = {
  breweryList: [
  // STILL TODO
  // a template for each brewery listing in the photo grid
  '<a href="<%= brewery.attributes.website %>">',
    '<li>',
      '<img src="<%= brewery.images.large %>" alt="" />',
      '<h2><%= distance %></h2>',
    '<li>',
  '</a>'
  ].join(""),
};

var sudsTrackerApp = {
  url: 'http://api.brewerydb.com/v2/search/geo/point?key=68288be6b4c8586574d85c0174da8682',
  brewApiKey: '68288be6b4c8586574d85c0174da8682',
  mapsApiKey: 'AIzaSyCaH8lgDN19w9SyQ4mNqMMQwn9cHqLx4Bw',

  init: function() {
    sudsTrackerApp.events();
    sudsTrackerApp.styling();
  },

  styling: function() {
    sudsTrackerApp.initMap();
  },

  events: function() {
    $("h1").click(function() {
      google.load("maps", "3", {other_params:'sensor=false', callback: function(){
        alert('maps API loaded!');
        var map;
        function initMap() {
          map = new google.maps.Map($('#map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
          });
        };
      }});
    });
    $('form').on('submit', function(event) {
      event.preventDefault();
      console.log("Submit");
      // if input entered
      if ($('input[type="text"]').val()){
        var location = $('input[type="text"]').val();
        $('input[type="text"]').val("");
        // TODO get coordinates from city/zip input
        // TODO get data from coordinates
      }
      // if no input, use current location
      else {
        console.log('using geolocation');
        sudsTrackerApp.useGeolocation();
      }
      $('#home').removeClass('visible');
      $('#brewery-list').addClass('visible');
    });
  },

  initMap: function () {
      var  map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
  },
  useGeolocation: function () {
    navigator.geolocation.getCurrentPosition(sudsTrackerApp.getBreweryData);
  },

  getBreweryData: function(posObj) {
    console.log('this is the object containing lat and lng: ', posObj);
    var urlRight = sudsTrackerApp.buildTrackerURL(posObj.coords);
    var urlObj = { url: sudsTrackerApp.buildTrackerURL(posObj.coords) };
    // console.log(urlObj);
    $.ajax({
      url: 'https://sudstracker.herokuapp.com/any-request/' + encodeURIComponent(urlRight),
      // url: '10.0.10.68:3000/any-request/',
      method: "GET",
      data: urlObj,
      success: function (breweryData) {
        console.log(JSON.parse(breweryData));
        window.glob = JSON.parse(breweryData);
        sudsTrackerApp.addBreweriesToDOM(JSON.parse(breweryData).data, $('ul'));
      },
      error: function(err) {
        console.log('err');
      }
    });
  },

  addBreweriesToDOM: function(data, $target) {
    var breweryHtmlStr = "";
    data.forEach(function(brewery) {
      breweryHtmlStr += sudsTrackerApp.buildBreweryHtml(brewery);
    });
    $target.html(breweryHtmlStr);
  },

  buildTrackerURL: function (coordsObj) {
      // console.log('in buildTrackerURL');
      // console.log('lat =' + coordsObj.latitude + ' lng=' + coordsObj.longitude);
      // console.log(sudsTrackerApp.url + "&lat=" + coordsObj.latitude + "&lng=" + coordsObj.longitude);
      return sudsTrackerApp.url + "&lat=" + coordsObj.latitude + "&lng=" + coordsObj.longitude;
  },

  buildBreweryHtml: function(brewery) {
    var breweryListTempl = _.template(templates.breweryList);
    console.log(brewery);
    return breweryListTempl(brewery);
  },
};
