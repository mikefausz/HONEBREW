$(document).ready(function() {
  sudsTrackerApp.init();
});

var templates = [];

templates.breweryList = [
  // a template for each brewery listing in the photo grid
  '<a href="<%= website %>">'
    '<li>'
      '<div class="photo-div" style="background-image: url( <%= url %> )">'
    '</li>'
  '<a/>'
  '<p class="name"><%= name %></p>',
  '<p class="city"><%= city %></p>',
  '<p class="distance"><%= distance %></p>'
].join("");


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

  brewTemplate: function(templateStr, brewery){
    return _.template(breweries[templateStr])
  }

  addBreweriesToDom: function(templateStr,brewery $target) {
    $target.html('');
    var brewTmpl = sudsTrackerApp.brewTemplate(templateStr);
    var htmlStr = "";
    brewery.forEach(function(el) {
      htmlStr += brewTmpl(el);
    })
    $target.html(htmlStr);
  },

  // constructBreweryHtml: function(templateStr, brewery) {
  //   // construct an html string for the given brewery
  //   // from the given templateStr
  // },

  getbrewery: function() {

  }
};
