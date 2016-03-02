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

var recipeApp = {
  url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients  ',

  init: function() {
    recipeApp.events();
    recipeApp.styling();
  },

  styling: function() {
    // don't know if we'll need this
  },

  events: function() {
    $('form').on('submit', function(event) {
      event.preventDefault();
      // add visible class to recipeList section
      // remove visible class from other sections
      recipeApp.getRecipes($('input').val()); // filter recipes by user input
    });

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
      method: 'GET',
      url: '',
      success: function(recipes) {
        recipeApp.addRecipesToDom();
      }
    });
  },

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
