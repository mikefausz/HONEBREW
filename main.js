$(document).ready(function() {
  sudsTrackerApp.init();
});

var templates = {
  breweryList: [
    '<li>',
        '<% if(brewery.images){ %>',
          '<div class="brew-photo" style="background-image: url(<%= brewery.images.large %>)">',
          '</div>',
        '<% } %>',
      '<div>',
        '<a href="<%= brewery.website %>"><h2><%= brewery.name %></h2></a>',
        '<p><%= distance %> miles from you</p>',
      '</div>',
    '<li>',
  ].join(""),
};

var sudsTrackerApp = {
  url: 'http://api.brewerydb.com/v2/search/geo/point?key=68288be6b4c8586574d85c0174da8682',
  brewApiKey: '68288be6b4c8586574d85c0174da8682',
  mapsApiKey: 'AIzaSyCaH8lgDN19w9SyQ4mNqMMQwn9cHqLx4Bw',
  locationUrl: 'http://maps.googleapis.com/maps/api/geocode/json?address=',
  init: function() {
    sudsTrackerApp.events();
    sudsTrackerApp.styling();
  },

  styling: function() {
    // sudsTrackerApp.useGeolocation();
  },

  events: function() {
    $('form').on('submit', function(event) {
      event.preventDefault();
      console.log("Submit");
      // if input entered
      if ($('input[type="text"]').val()){
        var location = $('input[type="text"]').val().trim().replace(" ", '');
        $('input[type="text"]').val("");
        var coordObj = sudsTrackerApp.getBreweriesFromInput(location);
        // TODO get data from coordinates
      }
        console.log('using geolocation');
        $('#home').removeClass('visible');
        $('#brewery-list').addClass('visible');

    });
  },

  getBreweriesFromInput: function(location) {
    $.ajax({
      url: sudsTrackerApp.locationUrl + location,
      method: "GET",
      success: function (locationObj) {
        var coords = locationObj.results[0].geometry.location;
        window.loc = locationObj.results[0].geometry.location;
        var newCoordObj = {
          coords: {
            latitude: coords.lat,
            longitude: coords.lng,
          }
        };
        sudsTrackerApp.getBreweryData(newCoordObj);
      },
      error: function(err) {
        console.log('err');
      }
    });
  },

  initMap: function (coordsObj) {
    var  map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: coordsObj.latitude, lng: coordsObj.longitude},
        zoom: 12
      });
  },

  useGeolocation: function () {
    navigator.geolocation.getCurrentPosition(sudsTrackerApp.getBreweryData);
  },

  getBreweryData: function(posObj) {
    console.log('this is the object containing lat and lng: ', posObj);
    var urlRight = sudsTrackerApp.buildTrackerURL(posObj.coords);
    var urlObj = { url: sudsTrackerApp.buildTrackerURL(posObj.coords) };
    sudsTrackerApp.initMap(posObj.coords);
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
    asdfdsafafas
  },
};
