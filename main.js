$(document).ready(function() {
  sudsTrackerApp.init();
});

var templates = [];

templates.breweryList = [
  // STILL TODO
  // a template for each brewery listing in the photo grid
  '<a href="<%= URL_FROM_JSON %>">',
    '<li>',
      '<img src="<%= IMG_URL_FROM_JSON %>" alt="" />',
      '<h2><%= BREWERY_NAME_FROM_JSON =></h2>',
    '<li>'
].join();

var sudsTrackerApp = {
  url: 'http://api.brewerydb.com/v2/search/geo/point?key=68288be6b4c8586574d85c0174da8682',
  apiKey: '68288be6b4c8586574d85c0174da8682',

  init: function() {
    sudsTrackerApp.events();
    sudsTrackerApp.styling();
  },

  styling: function() {
    // don't know if we'll need this
  },

  events: function() {
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

  useGeolocation: function () {
    navigator.geolocation.getCurrentPosition(sudsTrackerApp.getBreweryData);
  },

  // I think we can use getBreweryData instead - same but more descriptive
  // onPosition: function (coordsObj) {
  //   console.log('this is the object containing lat and lng: ', coordsObj);
  //   $.ajax({
  //     url: sudsTrackerApp.buildTrackerURL(coordsObj.coords),
  //     method: "GET",
  //     dataType: "json",
  //     success: function (breweryData) {
  //       console.log(breweryData.data);
  //       sudsTrackerApp.getBreweryData(breweryData.data);
  //     }
  //   });
  // },

  getBreweryData: function(posObj) {
    console.log('this is the object containing lat and lng: ', posObj);
    $.ajax({
      url: sudsTrackerApp.buildTrackerURL(posObj.coords),
      method: "GET",
      dataType: "jsonp",
      success: function (breweryData) {
        console.log(breweryData.data);
        sudsTrackerApp.addBreweriesToDOM(breweryData.data, $('ul'));
      },
      error: function(err) {
        console.log('err');
      }
    });
  },

  addBreweriesToDOM: function(data, $target) {
    var breweryHtmlStr = "";
    data.forEach(function(brewery) {
      breweryHtmlStr += buildBreweryHtml(brewery);
    });
    $target.html(breweryHtmlStr);
  },

  buildTrackerURL: function (coordsObj) {
      console.log('in buildTrackerURL');
      console.log('lat =' + coordsObj.latitude + ' long=' + coordsObj.longitude);
      return sudsTrackerApp.url + "&lat=" + coordsObj.latitude + "&lng=" + coordsObj.longitude;
  },

  buildBreweryHtml: function(brewery) {
    var breweryListTempl = _.template(templates.breweryList);
    return complTodoTempl(brewery);
  },
};
