import React, { useState, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import "./RecipeForm.css";

const RecipeForm = ({ addRecipe }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [readyInMinutes, setReadyInMinutes] = useState("");
  const [vegan, setVegan] = useState(false);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("recipes"));
    setRecipes(savedRecipes || []);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      id: Date.now(),
      title,
      image,
      ingredients: ingredients.split(",").map((item) => ({ name: item })),
      instructions: instructions.split(".").map((item, index) => ({
        number: index + 1,
        step: item,
      })),
      readyInMinutes,
      vegan,
    };

    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    addRecipe(newRecipe);

    setTitle("");
    setImage("");
    setIngredients("");
    setInstructions("");
    setReadyInMinutes("");
    setVegan(false);
  };

  return (
    <div className="container rec-form">
      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Recipe Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="file"
          onChange={handleImageUpload}
          className="input-file"
          accept="image/*"
        />
        <textarea
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
          className="textarea-field"
        />
        <textarea
          placeholder="Instructions (dot-separated)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          className="textarea-field"
        />
        <input
          type="number"
          placeholder="Ready In Minutes"
          value={readyInMinutes}
          onChange={(e) => setReadyInMinutes(e.target.value)}
          required
          className="input-field"
        />

        <div className="form-check form-switch">
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            Vegan
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              onChange={(e) => setVegan(e.target.checked)}
            />
          </label>
        </div>
        <button className="submit-button" type="submit">
          <AddCircleIcon
            sx={{ backgroundColor: "#6ca0dc", fontSize: "2.5rem" }}
          />
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
