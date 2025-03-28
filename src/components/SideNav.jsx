import React, { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";
export default function SideNav(props) {
  const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu } =
    props;
  const [searchValue, setSearchValue] = useState("");
  const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
    // if pokemon index is there
    if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
      return true;
    }
    // if name is provided
    if (ele.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    return false;
  });
  return (
    <nav className={" " + (!showSideMenu ? " open" : "")}>
      <div className={"header " + (!showSideMenu ? " open" : "")}>
        <button onClick={handleCloseMenu} className="open-nav-button">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-gradient">Pokémon</h1>
      </div>
      <input
        placeholder="Eg bulba.. or 001"
        type="text"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            key={pokemonIndex}
            className={
              "nav-card " +
              (pokemonIndex === selectedPokemon ? " nav-card-selected" : " ")
            }
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleCloseMenu();
            }}
          >
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
