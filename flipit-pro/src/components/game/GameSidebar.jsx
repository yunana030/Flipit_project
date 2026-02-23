import { FaClock, FaSearch, FaLightbulb } from "react-icons/fa";

export const GameSidebar = ({ timeLeft, currentStage, clickCount, itemsUsed, onItemClick }) => {
  const gameStats = [
    { label: "Time", value: `${timeLeft}s`, id: "time" },
    { label: "Level", value: currentStage, id: "level" },
    { label: "Clicks", value: clickCount, id: "clicks" },
  ];
  const items = ["TIME+", "SHOW ALL", "REVEAL ONE"];

  return (
    <aside className="sidebar">
      {/* Stats Panel */}
      <section className="panel-section">
        <div className="panel-box" />
        <h2 className="panel-title">Game Stats</h2>
        <div className="panel-list">
          {gameStats.map((stat) => (
            <div key={stat.id} className="panel-item">
              <span className="label-text">{stat.label}</span>{" "}
              <span className="value-text">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Items Panel - CSS 선택자 호환을 위해 순서가 매우 중요함 */}
      <section className="panel-section">
        <div className="panel-box items-bg" />
        <h2 className="panel-title">Items Panel</h2>
        <div className="panel-list">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`panel-item ${itemsUsed[item] ? "used" : ""}`}
              onClick={() => onItemClick(item)}
            >
              {item === "TIME+" && <FaClock size={28} />}
              {item === "SHOW ALL" && <FaLightbulb size={28} />}
              {item === "REVEAL ONE" && <FaSearch size={28} />}
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};