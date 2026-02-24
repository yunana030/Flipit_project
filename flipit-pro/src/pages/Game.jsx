import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../components/common/constants";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { useGameStore } from "../store/useGameStore.jsx";
import { useStageStore } from "../store/useStageStore.jsx";

import { GameSidebar } from "../components/game/GameSidebar";
import { GameBoard } from "../components/game/GameBoard";
import { GameModalManager } from "../components/game/GameModalManager";
import "./Game.css";

export const Game = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  
  // 스토어에서 DB 기반 상태 가져오기
  const { currentStage, isLastStage, fetchProgress, saveProgress, setStageInfo } = useStageStore();
  const { 
    cards, timeLeft, clickCount, isGameStarted, itemsUsed,
    tick, setGameStarted, setCards, handleCardClick, useItem, startStage, flipAllCards
  } = useGameStore();

  const [isNextStageOpen, setIsNextStageOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const startGameFromStage = async (stage) => {
    try {
      const [stageRes, cardsRes] = await Promise.all([
        axios.get(`${BASE_API_URL}/api/stage/${stage}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_API_URL}/api/cards`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      // DB 응답에 포함된 isLastStage 정보를 스토어에 동기화
      setStageInfo(stage, stageRes.data.isLastStage);
      
      startStage(stageRes.data, cardsRes.data);
      flipAllCards(false); 
      setTimeout(() => flipAllCards(true), 2000);
    } catch (err) { console.error("게임 시작 실패:", err); }
  };

  const handleGameStartButton = async () => {
    if (!token) return startGameFromStage(1);
    const data = await fetchProgress();
    if (data) setShowContinue(true);
    else startGameFromStage(1);
  };

  const handleNextStage = async () => {
    setIsNextStageOpen(false);

    try {
      const username = user?.username || user?.sub;

      const result = await saveProgress(username, currentStage, clickCount);

      if (result?.isLastStage || result?.lastStage) {
        alert("모든 스테이지를 클리어하셨습니다!");
        navigate("/rank");
        return;
      }

      startGameFromStage(currentStage + 1);

    } catch (err) {
      console.error("단계 이동 실패:", err);
    }
  };

  useEffect(() => {
    if (!isGameStarted || isNextStageOpen) return;
    if (timeLeft <= 0) { setIsGameOverOpen(true); setGameStarted(false); return; }
    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  }, [isGameStarted, isNextStageOpen, timeLeft, tick, setGameStarted]);

  useEffect(() => {
    if (isGameStarted && cards.length > 0 && cards.every(c => c.matched)) {
      setTimeout(() => setIsNextStageOpen(true), 100);
    }
  }, [cards, isGameStarted]);

  useEffect(() => {
    return () => { setGameStarted(false); setCards([]); };
  }, [setGameStarted, setCards]);

  return (
    <div className="game-page">
      <div className="box-container">
        <div className="box-fixed">
          <GameSidebar 
            timeLeft={timeLeft} currentStage={currentStage} 
            clickCount={clickCount} itemsUsed={itemsUsed} 
            onItemClick={useItem} 
          />
          <main className="main-board">
            {!isGameStarted && !isNextStageOpen ? (
              <button className="start-button" onClick={handleGameStartButton}>Game Start</button>
            ) : (
              <GameBoard cards={cards} onCardClick={handleCardClick} />
            )}
          </main>
        </div>
      </div>

      <GameModalManager 
        modals={{ isNextStageOpen, isExitOpen, isGameOverOpen, showContinue }}
        currentStage={currentStage}
        actions={{
          handleNextStage,
          handleRestart: () => { setIsGameOverOpen(false); startGameFromStage(1); },
          handleFullRestart: () => { setShowContinue(false); setCards([]); startGameFromStage(1); },
          handleContinue: () => { setShowContinue(false); startGameFromStage(currentStage); },
          openExit: () => setIsExitOpen(true),
          closeExit: () => setIsExitOpen(false),
          closeContinue: () => setShowContinue(false),
          goHome: () => navigate("/")
        }}
      />
    </div>
  );
};