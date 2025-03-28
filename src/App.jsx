import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import PokeCard from "./components/PokeCard";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(true);
  function handleToggleMenu() {
    setShowSideMenu(!showSideMenu);
  }
  function handleCloseMenu() {
    handleToggleMenu(true);
  }
  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        showSideMenu={showSideMenu}
        handleCloseMenu={handleCloseMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
}

export default App;
