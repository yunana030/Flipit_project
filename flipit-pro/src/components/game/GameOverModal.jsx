import React from "react";
import "./GameOverModal.css"

export const GameOverModal = ({ onRestart, onHome }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Game Over!</h2>
        <p className="modal-text">게임 시간이 종료되었습니다.</p>
        <button className="modal-next-btn" onClick={onRestart}>Restart</button>
        <button 
          className="modal-next-btn-home" 
          onClick={onHome}
        >
          Home
        </button>
      </div>
    </div>
  );
};