import React from "react";
import "./ExitModal.css";

export const ExitModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">게임 종료</h2>
        <p className="modal-text">게임 정보가 저장되지 않습니다. 나가시겠습니까?</p>
        <div className="modal-buttons">
          <button className="modal-next-btn" onClick={onConfirm}>예</button>
          <button className="modal-cancel-btn" onClick={onCancel}>아니오</button>
        </div>
      </div>
    </div>
  );
};
