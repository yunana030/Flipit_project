import "./ContinueGameModal.css"

export const ContinueGameModal = ({ onContinue, onRestart, onClose }) => {
  return (
    <div className="continue-modal-overlay">
      <div className="continue-modal-box">
        <h3 className="continue-modal-title">이전 게임 기록이 있습니다.</h3>
        <p className="continue-modal-text">이어서 하시겠습니까?</p>
        <p className="smalltalk">(마지막 단계일 시, 랭킹페이지로 이동합니다)</p>
        <div className="continue-modal-btn-group">
          <button className="continue-modal-btn continue-modal-btn-continue" onClick={onContinue}>
            이어하기
          </button>
          <button className="continue-modal-btn continue-modal-btn-restart" onClick={onRestart}>
            처음부터
          </button>
        </div>
      </div>
    </div>

  );
};
