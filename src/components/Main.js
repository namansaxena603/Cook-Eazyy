import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import "../App.css";
import Header from "./Header";
import RecipeForm from "./RecipeForm";

const Main = () => {
  const [recipes, setRecipes] = useState([]);
  const [showIngd, setShowIngd] = useState(false);
  const [showInstr, setShowInstr] = useState(false);
  const [showForm, setForm] = useState(false);

  //fetching data from the API
  const fetchData = async (searchTerm) => {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&apiKey=5b58b7fb12e1418c9ebca942431686cc&query=${searchTerm}`
    );
    const data = await response.json();
    const recipesWithDetails = await Promise.all(
      data.results.map(async (recipe) => {
        const ingredientsResponse = await fetch(
          //fetching ingredients
          `https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget.json?apiKey=5b58b7fb12e1418c9ebca942431686cc`
        );
        const ingredientsData = await ingredientsResponse.json();

        //fetching instructions
        const instructionsResponse = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=5b58b7fb12e1418c9ebca942431686cc`
        );
        const instructionsData = await instructionsResponse.json();

        return {
          ...recipe,
          ingredients: ingredientsData.ingredients,
          instructions: instructionsData[0]?.steps || [],
        };
      })
    );

    // Retrieve user-added recipes from localStorage
    const userAddedRecipes =
      JSON.parse(localStorage.getItem("userRecipes")) || [];
    const combinedRecipes = [...userAddedRecipes, ...recipesWithDetails];
    setRecipes(combinedRecipes);
  };

  useEffect(() => {
    fetchData("").catch(console.error);
  }, []);

  const toggleIngredients = () => {
    setShowIngd(!showIngd);
  };

  const toggleInstructions = () => {
    setShowInstr(!showInstr);
  };

  const userRecipe = async (searchTerm) => {
    await fetchData(searchTerm).catch(console.error);
  };

  const addRecipe = (newRecipe) => {
    // Store new recipe in localStorage
    const storedRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    const updatedRecipes = [newRecipe, ...storedRecipes];
    localStorage.setItem("userRecipes", JSON.stringify(updatedRecipes));

    setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);
  };

  const handleForm = () => {
    setForm(!showForm);
  };

  return (
    <div className="main">
      <div className="my-5 w-100">
        <Header userRecipe={userRecipe} />
        <div className="container my-2">
          {!showForm && <small>Have a Recipe? Share It With Others</small>}
          <button
            className="btn mx-1 text-light"
            style={{ backgroundColor: "#6ca0dc" }}
            onClick={handleForm}
          >
            {showForm ? <CancelRoundedIcon /> : <AddCircleIcon />}
          </button>
        </div>
        {showForm && <RecipeForm addRecipe={addRecipe} />}
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4 my-5 mx-5">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div className="col" key={recipe.id}>
              <div className="card h-100">
                <h4 className="card-title text-light">
                  <strong>{recipe.title}</strong>
                </h4>
                <img
                  src={recipe.image}
                  className="card-img-top"
                  alt={recipe.title}
                />
                <div className="card-body">
                  <div className="icon-text mb-3">
                    <AccessAlarmsIcon />
                    <span>Ready In {recipe.readyInMinutes} minutes</span>
                    {recipe.vegan ? (
                      <img
                        src="/images/veg.png"
                        alt="Vegan"
                        style={{ height: "2rem", marginLeft: "auto" }}
                      />
                    ) : (
                      <img
                        src="/images/non-veg.png"
                        alt="Non-Vegan"
                        style={{ height: "2rem", marginLeft: "auto" }}
                      />
                    )}
                  </div>
                  <p className="card-text">
                    {recipe.summary ? recipe.summary.slice(0, 150) + "..." : ""}
                  </p>
                  <div className="d-flex flex-wrap gap-4">
                    {recipe.veryPopular && (
                      <span className="badge">Popular</span>
                    )}
                    {recipe.veryHealthy && (
                      <span className="badge">Healthy</span>
                    )}
                    {recipe.glutenFree && (
                      <span className="badge">Gluten-Free</span>
                    )}
                    {recipe.dairyFree && (
                      <span className="badge">Dairy-Free</span>
                    )}
                  </div>
                  <span
                    onClick={toggleIngredients}
                    style={{ cursor: "pointer" }}
                  >
                    {showIngd ? (
                      <h5 className="my-3 ingred">Hide Ingredients</h5>
                    ) : (
                      <h5 className="my-3 ingred">Show Ingredients</h5>
                    )}
                  </span>
                  {showIngd && (
                    <div className="ingredients mt-3">
                      <hr />
                      <ul>
                        {recipe.ingredients.map((ingredient) => (
                          <li
                            style={{ listStyle: "circle" }}
                            key={ingredient.id}
                          >
                            {ingredient.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="card-footer">
                  <small className="text-body-secondary">
                    <span
                      onClick={toggleInstructions}
                      style={{ cursor: "pointer" }}
                    >
                      {showInstr ? (
                        <h5 className="my-3 ingred">Hide Recipe</h5>
                      ) : (
                        <h5 className="my-3 ingred">Show Recipe</h5>
                      )}
                    </span>
                    {showInstr && (
                      <div className="instructions mt-3">
                        <hr />
                        <ul>
                          {recipe.instructions.map((step, index) => (
                            <li key={index}>
                              <strong>
                                <u>{"Step " + step.number}</u>
                              </strong>{" "}
                              : {step.step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading recipes...</p>
        )}
      </div>
    </div>
  );
};

export default Main;
