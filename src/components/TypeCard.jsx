import React from "react";
import { pokemonTypeColors } from "../utils";

export default function TypeCard(props) {
  const { typeName } = props;
  return (
    <div
      className="type-tile"
      style={{
        color: pokemonTypeColors?.[typeName]?.color,
        background: pokemonTypeColors?.[typeName]?.background,
      }}
    >
      <p>{typeName}</p>
    </div>
  );
}
