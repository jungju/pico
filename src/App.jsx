import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FindLearnGame } from "./games/findLearn/FindLearnGame";
import { findLearnStage } from "./games/findLearn/stages/stage001";

const GAMES = [
  {
    id: "find-learn",
    title: "Find & Learn",
    category: "Spot the Difference",
    image: findLearnStage.images.changed,
  },
];

export default function App() {
  const [selectedGameId, setSelectedGameId] = useState(null);

  if (selectedGameId === "find-learn") {
    return <FindLearnGame onBack={() => setSelectedGameId(null)} />;
  }

  return (
    <main className="game-select-shell">
      <header className="game-select-header">
        <h1>Pico</h1>
      </header>

      <section className="game-list" aria-label="Games">
        {GAMES.map((game) => (
          <button className="game-option" type="button" key={game.id} onClick={() => setSelectedGameId(game.id)}>
            <span className="game-option-media">
              <img src={game.image} alt="" draggable="false" />
            </span>
            <span className="game-option-copy">
              <strong>{game.title}</strong>
              <span>{game.category}</span>
            </span>
            <ArrowRight aria-hidden="true" size={22} />
          </button>
        ))}
      </section>
    </main>
  );
}
