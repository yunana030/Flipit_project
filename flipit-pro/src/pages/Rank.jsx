import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Rank.css";
import { BASE_API_URL } from '../components/common/constants';
import { FaPlay } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../store/useAuthStore';

const Rank = () => {
  
  const { user, isLoggedIn } = useAuthStore();
  const [userRanks, setUserRanks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // 1. 전체 랭킹 호출 (공통 데이터)
  const fetchRanks = () => {
    axios.get(`${BASE_API_URL}/api/play-record/ranks`)
      .then(res => {
        setUserRanks(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("전체 랭킹 불러오기 실패:", err));
  };

  useEffect(() => {
    fetchRanks();
  }, []);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => {
    const maxPage = Math.max(0, Math.floor((userRanks.length - 1) / ITEMS_PER_PAGE));
    setCurrentPage(prev => Math.min(prev + 1, maxPage));
  };
  console.log("💎 Zustand의 user 객체 상태:", JSON.stringify(user, null, 2));

  return (
    <main className="rank-frame">
      <div className="rank-frame-container">
        {/* 전체 랭킹 섹션 */}
        <section className="user-rank-section">
          <div className="user-rank-header">
            <h1 className="user-rank-title">USER RANK</h1>
            <button className="refresh-button" onClick={fetchRanks}>갱신</button>
          </div>

          <div className="rank-list-header">
            <div>RANK</div>
            <div>USERNAME</div>
            <div>LEVEL</div>
            <div>CLICKCOUNT</div>
          </div>

          <div className="user-rank-list">
            {userRanks.length > 0 ? (
              userRanks
                .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
                .map((item, index) => {
                  const rank = currentPage * ITEMS_PER_PAGE + index + 1;
                  return (
                    <div className="rank-list-item" key={item.userId || item.id || index}>
                      <div className="rank-number">
                        {rank === 1 ? <FontAwesomeIcon icon={faMedal} style={{ color: '#ffdf00' }} /> :
                         rank === 2 ? <FontAwesomeIcon icon={faMedal} style={{ color: 'silver' }} /> :
                         rank === 3 ? <FontAwesomeIcon icon={faMedal} style={{ color: '#cd7f32' }} /> : rank}
                      </div>
                      <div>{item.userName || item.username || "Unknown"}</div>
                      <div>{item.bestStage || item.beststage || 0}</div>
                      <div>{item.clickCount}</div>
                    </div>
                  );
                })
            ) : (
              <div className="my-rank-empty">데이터가 없습니다.</div>
            )}
          </div>
        </section>

        <div className="rank-pagination">
          <button className="triangle-btn prev" onClick={handlePrev}><FaPlay className="triangle-icon prev-icon" /></button>
          <button className="triangle-btn next" onClick={handleNext}><FaPlay className="triangle-icon next-icon" /></button>
        </div>

        <div className="section-divider"></div>

        {/* 마이 랭킹 섹션 */}
        <section className="my-rank-section">
          <h2 className="my-rank-title">MY RANK</h2>
          <div className="rank-list-header">
            <div>RANK</div>
            <div>USERNAME</div>
            <div>LEVEL</div>
            <div>CLICKCOUNT</div>
          </div>

          <div className="my-rank-list-container">
            {!isLoggedIn ? (
              <div className="my-rank-empty">로그인 이후 이용 가능합니다.</div>
            ) : (!user) ? (
              <div className="my-rank-empty">저장된 기록이 없습니다.</div>
            ) : (
              (() => {
                const myData = userRanks.find(
                  u => (u.userId || u.id) === (user.id || user.userId)
                );

                const myRank = userRanks.findIndex(
                  u => (u.userId || u.id) === (user.id || user.userId)
                ) + 1;

                if (!myData) {
                  return <div className="my-rank-empty">저장된 기록이 없습니다.</div>;
                }

                return (
                  <div className="my-rank-item">
                    <div className="rank-number">
                      {myRank > 0 && myRank <= 3 ? (
                        <FontAwesomeIcon
                          icon={faMedal}
                          style={{
                            color:
                              myRank === 1
                                ? "gold"
                                : myRank === 2
                                ? "silver"
                                : "#cd7f32",
                            fontSize: "32px"
                          }}
                        />
                      ) : myRank}
                    </div>

                    <div>{myData.userName || myData.username}</div>
                    <div>{myData.bestStage}</div>
                    <div>{myData.clickCount}</div>
                  </div>
                );
              })()
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Rank;