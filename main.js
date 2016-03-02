$(document).ready(function() {
  sudsTrackerApp.init();
});

var templates = [];

templates.breweryList = [
  // a template for each brewery listing in the photo grid
].join();


var sudsTrackerApp = {
  url: '',
  apiKey: '68288be6b4c8586574d85c0174da8682',

  init: function() {
    sudsTrackerApp.events();
    sudsTrackerApp.styling();
  },

  styling: function() {
    sudsTrackerApp.getLocation();
  },

  events: function() {
    $('form').on('submit', function(event) {
      event.preventDefault();
      // add visible class to recipeList section
      // remove visible class from other sections

      console.log("Submit");
      var submitIngredients = $('input[type="text"]').val();
      $('input[type="text"]').val("");
      buildTrackerURL(coords);
    });
  },

  getLocation: function () {
    navigator.geolocation.getCurrentPosition(sudsTrackerApp.onPosition);
  },

    // CLICK EVENT for a recipe listing
    // preventDefault
    // add visible class to recipeView section
    // remove visible class from other sections
    recipeApp.getRecipe();
  },

  getRecipes: function(ingredients) {
    // parse input string for individual ingredients
    // construct GET url from ingredients
    $.ajax({
      url: sudsTrackerApp.buildTrackerURL(coordsObj.coords),
      method: "GET",
      dataType: "json",
      success: function (dataFromBreweryDB) {
         sudsTrackerApp.getData(dataBreweryDB);
      }
    });
  },

  buildTrackerURL: function (coords) {
      return 'http://api.brewerydb.com/v2/search/geo/point?key=' + apiKey + "&lat="+coords.latitude + "&lon=" + coords.longitude;
  },

  addBreweriesToDom: function(breweries, $target) {
    var breweryListStr = "";
    // for each brewery in breweries
      // create a string from the breweryList template
      // add the string to breweryListStr
    // append/replace breweryListStr to breweryList html
  },

  constructBreweryHtml: function(templateStr, brewery) {
    // construct an html string for the given brewery
    // from the given templateStr
  },

  getbrewery: function() {

  }
};
