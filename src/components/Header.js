import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../App.css";
const Header = (props) => {
  const [val, setVal] = useState("");

  const handleChange = (e) => {
    setVal(e.target.value);
  };

  const searchRecipe = (e) => {
    e.preventDefault();
    if (val) {
      props.userRecipe(val);
      setVal("");
    }
  };

  return (
    <div>
      <nav
        className="navbar lato-bold"
        style={{
          backgroundColor: "#6ca0dc",
          fontFamily: "Lato, serif",
          fontWeight: "700",
          fontStyle: "normal",
        }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src="/images/cook_logo.webp"
              alt="Logo"
              width="30"
              height="29"
              className="d-inline-block align-text-top"
              style={{ marginTop: "-5px" }}
            />
            <strong className="mx-1 text-light" style={{ fontSize: "2rem" }}>
              Cook Eazyy
            </strong>
          </a>
          <form className="d-flex" role="search" onSubmit={searchRecipe}>
            <input
              className="form-control me-2"
              type="search"
              onChange={handleChange}
              value={val}
              placeholder="Search for Recipes"
              aria-label="Search"
            />
            <button className="btn" type="submit">
              <SearchIcon sx={{ color: "white" }} />
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Header;
