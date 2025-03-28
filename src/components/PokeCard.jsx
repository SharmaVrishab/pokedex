import { React, useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";
export default function PokeCard(props) {
  let { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);
  const { name, height, abilities, stats, types, moves, sprites } = data || {};
  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) {
      return false;
    }
    if (["versions", "other"].includes(val)) {
      return false;
    }
    return true;
  });
  async function fetchMoveData(move, moveUrl) {
    if ((loadingSkill || !localStorage, !moveUrl)) {
      return;
    }
    // check cache
    let cache = {};
    if (localStorage.getItem("pokemon-moves")) {
      cache = JSON.parse(localStorage.getItem("pokemon-moves"));
    }
    // check if the move is in the cache
    if (move in cache) {
      setSkill(cache[move]);
      console.log("found move in the cache");
      return;
    }
    // try and catch for api

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const move_data = await res.json();
      console.log("fetched data from api ", move_data);
      const description = move_data?.flavor_text_entries.filter((val) => {
        return val.version_group.name == "firered-leafgreen";
      })[0]?.flavor_text;
      console.log(description);
      const skillData = {
        name: move,
        description,
      };
      console.log(skillData);
      setSkill(skillData);
      cache[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSkill(false);
    }
  }
  useEffect(() => {
    // if loading exit loop
    if (!localStorage) return; // Exit if no Pokémon selected
    if (loading) return; // Prevent multiple API calls
    // check selected information is available in the cache
    // 1. -> define cache
    let cache = JSON.parse(localStorage.getItem("pokemonCache")) || {};
    // ✅ Check if Pokémon is in cache
    if (cache[selectedPokemon]) {
      console.log("Fetching from cache:", selectedPokemon);
      setData(cache[selectedPokemon]); // Set state with cached data
      return;
    }
    // 2. -> selected pokemon is in the cache oterwise fetch the pokemon
    //  if we fetch the pokeomon make sure to fetch the data to the cache
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        console.log("Fetching from API:", getPokedexNumber(selectedPokemon));
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(
            selectedPokemon
          )}`
        );

        if (!response.ok) throw new Error("Pokemon not found");

        const pokemonData = await response.json();
        console.log("fetched pokemon data", pokemonData);
        setData(pokemonData); // Update state
        // ✅ Store in cache
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokemonCache", JSON.stringify(cache));
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [selectedPokemon]);
  if (loading) {
    return (
      <div>
        <h4>LOADING.....</h4>
      </div>
    );
  } else {
    return (
      <div className="poke-card">
        {/*  condition rendering */}
        {skill && (
          <Modal
            handleCloseModal={() => {
              setSkill(null);
              //  to make the skill false and hide it bcz of it
            }}
          >
            <div>
              <h6>Name</h6>
              <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
            </div>
            <div>
              <h6>Description</h6>
              <p>{skill.description}</p>
            </div>
          </Modal>
        )}
        <div>
          <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
          <h2>{name}</h2>
        </div>
        <div className="type-container">
          {types?.map((type, typeIndex) => (
            <TypeCard
              key={typeIndex}
              slot={type.slot}
              typeName={type.type.name}
            />
          ))}
        </div>
        <img
          className="default-img"
          src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
          alt={`${name}-large-img`}
        />
        <div className="img-container">
          {imgList.map((spriteUrl, spriteUrlIndex) => {
            const imgUrl = sprites[spriteUrl];
            return (
              <img
                key={spriteUrlIndex}
                src={imgUrl}
                alt={`${name}-img-${spriteUrl}`}
              />
            );
          })}
        </div>
        <h3>Stats</h3>
        <div className="stats-card">
          {stats?.map((statObj, statIndex) => {
            const { stat, base_stat } = statObj;
            return (
              <div key={statIndex} className="stat-item">
                <p>{stat?.name.replaceAll("-", " ")}</p>
                <h4>{base_stat}</h4>
              </div>
            );
          })}
        </div>
        <h3>Moves</h3>
        <div className="pokemon-move-grid">
          {moves?.map((moveObj, moveIndex) => {
            return (
              <button
                className="button-card pokemon-move"
                key={moveIndex}
                onClick={() => {
                  fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
                }}
              >
                <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
