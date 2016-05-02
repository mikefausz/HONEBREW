$(document).ready(function() {
  sudsTrackerApp.init();
});

var templates = {
  breweryList: [
    '<li>',
          '<div class="brew-photo" style="background-image: url(<%= image %>)">',
          '</div>',
      '<div>',
        '<a href="<%= website %>"><h2><%= name %></h2></a>',
        '<p><%= address %> <%= city %>, <%= state %></p>',
        '<p><%= distance %> miles from you</p>',
      '</div>',
      '<div class="brew-links">',
        '<a href="<%= website %>"><p>Website</p></a>',
          "<a class='directions' href='http://maps.google.com/?q=<%= addrStr %>'<p>Directions</p></a>",
      '</div>',
    '</li>',
  ].join(""),
};

var sudsTrackerApp = {
  url: 'http://api.brewerydb.com/v2/search/geo/point?key=68288be6b4c8586574d85c0174da8682',
  brewApiKey: '68288be6b4c8586574d85c0174da8682',
  mapsApiKey: 'AIzaSyCaH8lgDN19w9SyQ4mNqMMQwn9cHqLx4Bw',
  locationUrl: 'http://maps.googleapis.com/maps/api/geocode/json?address=',

  // made this an object property so we can pass it to geolocation callback
  distance: 10,

  init: function() {
    sudsTrackerApp.events();
    sudsTrackerApp.styling();
  },

  styling: function() {
  },

  events: function() {
    // ON FORM SUBMIT
    $('form').on('submit', function(event) {
      event.preventDefault();
      // get search radius
      sudsTrackerApp.distance = $(this).children("select").val();
      // if location given, parse input, get brewery data
      // if ($(this).children('input').val()){
        var location = $(this).children('input').val();
        sudsTrackerApp.setHeaderHtml(location);
        var parseLocation = location.trim().replace(" ", '');
        $(this).children('input').val('');
        var coordObj = sudsTrackerApp.getBreweriesFromInput(parseLocation, sudsTrackerApp.distance);
      // }
      // otherwise get brewery data from browser location
      // else {
      //   sudsTrackerApp.setHeaderHtml("you");
      //   sudsTrackerApp.useGeolocation(sudsTrackerApp.distance);
      // }
      // show brewery listing page
      $('#home').removeClass('visible');
      $('#brewery-list').addClass('visible');
    });
  },

  // fill brewery listing page header with search location
  setHeaderHtml: function(location) {
    $('.main-page-header').find('h3').html("Breweries near " + location + ":");
  },

  // get breweries within given radius of city/zip user input
  getBreweriesFromInput: function(location, distance) {
    $.ajax({
      url: sudsTrackerApp.locationUrl + location,
      method: "GET",
      success: function (locationObj) {
        // get coordinates from input via Google Maps API
        var coords = locationObj.results[0].geometry.location;
        var newCoordObj = {
          coords: {
            latitude: coords.lat,
            longitude: coords.lng,
          }
        };
        sudsTrackerApp.getBreweryData(newCoordObj, distance);
      },
      error: function(err) {
        console.log('err');
      }
    });
  },

  // get browser location, give to getBreweryData callback
  useGeolocation: function (distance) {
    navigator.geolocation.getCurrentPosition(function(coords) {
        sudsTrackerApp.getBreweryData(coords, sudsTrackerApp.distance);
    });
  },

  // get breweries within given radius of given position
  getBreweryData: function(posObj, distance) {
    // the next few lines are where Nathan feeds our request to his server
    var urlRight = sudsTrackerApp.buildTrackerURL(posObj.coords);
    var urlObj = { url: sudsTrackerApp.buildTrackerURL(posObj.coords) };
    $.ajax({
      url: 'https://sudstracker.herokuapp.com/any-request/' + encodeURIComponent(urlRight),
      // url: '10.0.10.68:3000/any-request/',
      method: "GET",
      data: urlObj,
      success: function (breweryData) {
        sudsTrackerApp.addBreweriesToDOM(JSON.parse(breweryData).data, posObj.coords, distance, $('ul'));
      },
      error: function(err) {
        console.log('err');
      }
    });
  },

  // construct API search URL from coordinates
  buildTrackerURL: function (coordsObj) {
      return sudsTrackerApp.url + "&lat=" + coordsObj.latitude + "&lng=" + coordsObj.longitude;
  },

  // add brewery listings to DOM, init Google Map with brewery pins
  addBreweriesToDOM: function(data, coords, distance, $target) {
    var breweryHtmlStr = "";
    // create new map centered on given coordinates
    var map = sudsTrackerApp.initMap(coords);
    _.each(data, function(brewery) {
      // for each brewery within search radius
      if (brewery.distance < distance) {
        // drop a pin on the map at brewery coordinates
        new google.maps.Marker({
          position: {lat: brewery.latitude, lng: brewery.longitude},
          map: map,
          title: brewery.brewery.name,
        });
        // add brewery listing HTML to master string
        breweryHtmlStr += sudsTrackerApp.buildBreweryHtml(brewery);
      }
    });
    // add master string to DOM
    $target.html(breweryHtmlStr);
  },

  // initialize a Google Map centered on given coordinates
  initMap: function (coordsObj) {
      return new google.maps.Map(document.getElementById('map'), {
        center: {lat: coordsObj.latitude, lng: coordsObj.longitude},
        zoom: 12
      });
  },

  // map relevant brewery data to new object, providing defaults for missing fields
  cleanBreweryData (brewery) {
    var cleanBrew = {
      name: brewery.brewery.name,
      website: brewery.brewery.website,
      distance: brewery.distance,
    };
    if (brewery.brewery.images) {
      cleanBrew.image = brewery.brewery.images.large;
    }
    else {
      cleanBrew.image = 'http://i.cbc.ca/1.3194454.1442511576!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_620/irrelevant-show-beer.jpg';
    }
    if (brewery.streetAddress) {
      cleanBrew.address = brewery.streetAddress;
      cleanBrew.city = brewery.locality;
      cleanBrew.state = brewery.region;
      cleanBrew.addrStr = cleanBrew.address.replace(" ", '') + cleanBrew.city + cleanBrew.state.replace(" ", '');
    }
    else {
      cleanBrew.address = 'No address available';
      cleanBrew.city = '';
      cleanBrew.state = '';
      cleanBrew.addrStr = '';
    }
    return cleanBrew;
  },

  // construct brewery listing HTML from template
  buildBreweryHtml: function(brewery) {
    cleanBrew = sudsTrackerApp.cleanBreweryData(brewery);
    var breweryListTempl = _.template(templates.breweryList);
    return breweryListTempl(cleanBrew);
  },
};
