// src/components/game/NextStageModal.jsx
import React from "react";
import "./NextStageModal.css";

export const NextStageModal = ({ stage, onNextStage, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Stage {stage} Clear!</h2>
        <p className="modal-text">다음 단계로 이동하세요!</p>
        <button className="modal-next-btn" onClick={onNextStage}>Next Stage</button>
      </div>
    </div>
  );
};