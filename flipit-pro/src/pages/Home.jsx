import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Card } from "../components/game/Card";
import "./Home.css";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const cardsData = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  front: `/images/card${(i % 7) + 1}.png`,
}));

const Home = () => {
  const [rotationY, setRotationY] = useState(0);
  const radius = 700; // 돔 반지름 크게
  const cardWidth = 150; // 카드 크기 크게
  const totalCards = cardsData.length;
  const angleStep = 360 / totalCards;
  const navigate = useNavigate();

  const prevCard = () => setRotationY((prev) => prev - angleStep); // 좌측으로 회전
  const nextCard = () => setRotationY((prev) => prev + angleStep); // 우측으로 회전

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationY((prev) => prev - angleStep);
    }, 2000);
    return () => clearInterval(interval);
  }, [angleStep]);

    const handleGameStartButton = () => {
    navigate("/game");
    };

    return (
      <div className="home-page">

        {/* 1. 가장 뒤 하늘 배경 */}
        <div className="sky-background">
          <img src="/images/background_sky.png" alt="sky" />
        </div>

        {/* 2. 둥둥 떠다니는 조형물들 */}
        <div className="floating-objects">
          <img src="/images/sculpture4.png" className="float obj1" alt="float4" />
          <img src="/images/sculpture2.png" className="float obj2" alt="float2" />
          <img src="/images/sculpture3.png" className="float obj3" alt="float3" />
          <img src="/images/sculpture1.png" className="float obj4" alt="float1" />
          <img src="/images/sculpture5.png" className="float obj5" alt="float5" />
          <img src="/images/main_sculpture1.png" className="float obj6" alt="float6" />

          <img src="/images/cloud1.png" className="float obj7" alt="float9" />
          <img src="/images/cloud2.png" className="float obj8" alt="float9" />
          <img src="/images/cloud3.png" className="float obj9" alt="float9" />
          <img src="/images/cloud4.png" className="float obj10" alt="float10" />
          <img src="/images/cloud2.png" className="float obj11" alt="floa11" />
          <img src="/images/cloud5.png" className="float obj12" alt="floa12" />        
          <img src="/images/cloud6.png" className="float obj13" alt="floa13" />
          <img src="/images/cloud2.png" className="float obj14" alt="floa14" />


        </div>

        {/* 3. 돔 + 중앙 조형물 + 카드 */}
        <div className="carousel-area" style={{ position: 'relative' }}>
          <div className="carousel-wrapper">
            {/* 중앙 조형물 */}
            <div className="center-sculpture">
              <img src="/images/main_sculpture.png" alt="main sculpture" />
            </div>

            {/* 좌우 버튼 */}
            <button className="triangle-btn prev" onClick={prevCard}>
              <FaPlay className="triangle-icon prev-icon" />
            </button>
            <div className="carousel-dome" style={{ transform: `translateZ(-${radius}px) rotateY(${rotationY}deg)` }}>
              {cardsData.map((card, i) => (
                <div
                  key={card.id}
                  className="carousel-card"
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardWidth * 1.4}px`,
                    transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
                  }}
                >
                  <Card frontContent={card.front} isFlipped={false} />
                </div>
              ))}
            </div>
              <button className="triangle-btn next" onClick={nextCard}>
              <FaPlay className="triangle-icon next-icon" />
            </button>
          </div>
          
        </div>  
        <button className="start-button" onClick={handleGameStartButton}>
            GAME START
          </button>

      </div>
    );



};

export default Home;
