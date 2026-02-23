// Card.jsx
import "./Card.css";

export const Card = ({ frontContent, isFlipped, onClick }) => {
  return (
    <div className={`card ${isFlipped ? "flipped" : ""}`} onClick={onClick}>
      {/* 카드 앞면 */}
      <div className="card-front">
        <div className="card-border">
          <div className="card-inner">
            {/* 여기가 이미지 들어가는 곳 */}
              <img
                src={frontContent}  // 나중에 API에서 받아오는 이미지 URL
                // src="/images/dino.png"
                alt="Card front"
                className="card-front-img"
              />
          </div>
        </div>
      </div>

      {/* 카드 뒷면 */}
      <div className="card-back"></div>
    </div>
  );
};
