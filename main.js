$(document).ready(function() {
  recipeApp.init();
});

var templates = [];

templates.recipeList = [
  // a template for each recipe listing in the photo grid
].join();

templates.recipeView = [
  // a template for a full recipe listing on recipe view page
].join();

var sudsTrackerApp = {
  url: '',

  init: function() {
    recipeApp.events();
    recipeApp.styling();
    apiKey: '68288be6b4c8586574d85c0174da8682',
    getLocation: function () {
      navigator.geolocation.getCurrentPosition(sudsTrackerApp.onPosition);
}
  },

  styling: function() {
    // don't know if we'll need this
  },

  events: function() {
    $('form').on('submit', function(event) {
      event.preventDefault();
      // add visible class to recipeList section
      // remove visible class from other sections
      console.log("Submit");
      var submitIngredients = $('input[type="text"]').val();
      $('input[type="text"]').val("");

      var url ='http://api.brewerydb.com/v2/search/geo/point?key=' + apiKey + "&lat="+coords.latitude + "&lon=" + coords.longitude;
      recipeApp.getRecipes(url); // filter recipes by user input
    });
  }

  onPosition: function (coordsObj) {
    console.log('this is the object containing lat and lng: ', coordsObj);
    $.ajax({
      url: sudsTrackerApp.buildTrackerURL(coordsObj.coords),
      method: "GET",
      dataType: "json",
      success: function (responseFromBreweryDB) {
         sudsTrackerApp.getData(responseFromWeatherAPI);
      }
    });
  },
  buildTrackerURL: function (coords) {
      return 'http://api.brewerydb.com/v2/search/geo/point?key=' + apiKey + "&lat="+coords.latitude + "&lon=" + coords.longitude;

  addRecipesToDom: function(recipes, $target) {
    var recipeListStr = "";
    // for each recipe in recipes
      // create a string from the recipeList template
      // add the string to recipeListStr
    // append/replace recipeListStr to recipeList html
  },

  constructRecipeHtml: function(templateStr, recipe) {
    // construct an html string for the given recipe
    // from the given templateStr
  },

  getRecipe: function() {
    // haven't read the API documentation on this yet
    // but it'll work much like getRecipes() except for
    // a single selected recipe
  }
};
