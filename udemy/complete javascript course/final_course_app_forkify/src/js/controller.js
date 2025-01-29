import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // 1. Take the hash of the link, and if there isn't one exit the function as there's nothing to do.
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1.5) Update results view to mark the selected search result + bookmarks
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 2. load the recipe and while waiting render the spinner for some nice UI.
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    // 3. once recipe loaded from 3rd party API render the received information on a page!
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

//4. Call the control recipes!
controlRecipes();

// Search functionality
const controlSearchResults = async function () {
  try {
    // Get search query, return if there isn't one
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // Wait for search results to load
    await model.loadSearchResults(query);

    // Render the search results
    resultsView.render(model.getSearchResultsPage());

    // Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
controlSearchResults();

// Pagination functionality
const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Servings functionality
const controlServings = function (newServings) {
  // Update the recipe servings in state
  model.updateServings(newServings);

  // Update the recipe view
  //   recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// Bookmarks functionality
const controlAddBookmark = function () {
  //1. add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2. update the recipe view
  recipeView.update(model.state.recipe);

  // 3. render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show the loading spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data...
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // display success message
    addRecipeView.renderMessage();

    // Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
