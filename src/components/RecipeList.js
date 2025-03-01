import React, { useState, useEffect } from "react";
import "../App.css";
const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
      try {
        const parsedRecipes = JSON.parse(storedRecipes);
        if (Array.isArray(parsedRecipes)) {
          setRecipes(parsedRecipes);
        } else {
          console.error("Stored recipes is not an array");
        }
      } catch (error) {
        console.error("Error parsing stored recipes:", error);
      }
    }
  }, []);

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe-item">
          <h3>{recipe.title}</h3>
          <img src={recipe.image} alt={recipe.title} />
          <p>Ready in: {recipe.readyInMinutes} minutes</p>
          <p>{recipe.vegan ? "Vegan" : "Non-Vegan"}</p>
          <h4>Ingredients:</h4>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.name}</li>
            ))}
          </ul>
          <h4>Instructions:</h4>
          <ol>
            {recipe.instructions.map((instruction) => (
              <li key={instruction.number}>{instruction.step}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
