$(document).ready(function() {
  sudsTrackerApp.init();
});

var templates = {
  breweryList: [
    '<li>',
        // '<% if(brewery.image) { %>',
          '<div class="brew-photo" style="background-image: url(<%= image %>)">',
          '</div>',
        // '<% } %>',
      '<div>',
        '<a href="<%= website %>"><h2><%= name %></h2></a>',
        '<p><%= distance %> miles from you</p>',
        // '<% if(streetAddress) { %>',
          "<a class='directions' href='http://maps.google.com/maps?z=&t=m&q<%= address %><%= city %><%= state %>'<span>Directions</span></a>",
          // "<a class='directions' >'<span>Directions</span></a>",
        // '<% } %>',
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
      var distance = $(this).children("select").val();
      if ($(this).children('input').val()){
        var location = $(this).children('input').val();
        sudsTrackerApp.setHeaderHtml(location);
        var parseLocation = location.trim().replace(" ", '');
        $(this).children('input').val('');
        var coordObj = sudsTrackerApp.getBreweriesFromInput(parseLocation, distance);
      }
      else {
        sudsTrackerApp.setHeaderHtml("your location");
        sudsTrackerApp.useGeolocation();
      }
      $('#home').removeClass('visible');
      $('#brewery-list').addClass('visible');
    });
    $('body').on('click', '.directions', function(event) {
      event.preventDefault();
      var newMap = sudsTrackerApp.initMap('map-canvas', {latitude: 32.778, longitude: -79.927});
      $('#brewery-list').removeClass('visible');
      $('#brewery-view').addClass('visible');
    });
  },

  setHeaderHtml: function(location) {
    $('.main-page-header').find('h1').html("Breweries near " + location);
  },

  getBreweriesFromInput: function(location, distance) {
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
        sudsTrackerApp.getBreweryData(newCoordObj, distance);
      },
      error: function(err) {
        console.log('err');
      }
    });
  },

  useGeolocation: function () {
    navigator.geolocation.getCurrentPosition(sudsTrackerApp.getBreweryData);
  },

  getBreweryData: function(posObj, distance) {
    if (!distance) {
      distance = 10;
    }
    console.log('this is the object containing lat and lng: ', posObj);
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

  buildTrackerURL: function (coordsObj) {
      return sudsTrackerApp.url + "&lat=" + coordsObj.latitude + "&lng=" + coordsObj.longitude;
  },

  addBreweriesToDOM: function(data, coords, distance, $target) {
    var breweryHtmlStr = "";
    var map = sudsTrackerApp.initMap('map', coords);
    data.forEach(function(brewery) {
    if (brewery.distance < distance) {
        new google.maps.Marker({
          position: {lat: brewery.latitude, lng: brewery.longitude},
          map: map,
          title: brewery.brewery.name,
        });
        breweryHtmlStr += sudsTrackerApp.buildBreweryHtml(brewery);
      }
    });
    $target.html(breweryHtmlStr);
  },

  initMap: function (mapId, coordsObj) {
      return new google.maps.Map(document.getElementById(mapId), {
        center: {lat: coordsObj.latitude, lng: coordsObj.longitude},
        zoom: 12
      });
  },

  displayRoute: function() {

    var start = new google.maps.LatLng(28.694004, 77.110291);
    var end = new google.maps.LatLng(28.72082, 77.107241);

    var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
    directionsDisplay.setMap(map); // map should be already initialized.

    var request = {
        origin : start,
        destination : end,
        travelMode : google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
  },

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
      cleanBrew.address = brewery.streetAddress.replace(" ", '');
      cleanBrew.city = brewery.locale;
      cleanBrew.state = brewery.region;
    }
    else {
      cleanBrew.address = '17PrincessSt';
      cleanBrew.city = 'Charleston';
      cleanBrew.state = 'SC';
    }
    return cleanBrew;
  },

  buildBreweryHtml: function(brewery) {
    cleanBrew = sudsTrackerApp.cleanBreweryData(brewery);
    var breweryListTempl = _.template(templates.breweryList);
    return breweryListTempl(cleanBrew);
  },
};
