import { Card } from "./Card.jsx";

export const GameBoard = ({ cards, onCardClick }) => {
  return (
    <div
      className="card-wrapper"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.ceil(cards.length / 2)}, 1fr)`,
        gap: "16px",
        justifyItems: "center",
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          frontContent={card.front}
          isFlipped={card.isFlipped}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
};