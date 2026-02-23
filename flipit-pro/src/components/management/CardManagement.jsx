import { useEffect, useState } from "react";
import { BASE_API_URL } from "../common/constants";
import axios from "axios";
import "./CardManagement.css"
import { Card } from "../game/Card";
import { FaPlay } from "react-icons/fa";



export function CardManagement({ openModal }) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const indexOfLastCard = currentPage * itemsPerPage;
    const indexOfFirstCard = indexOfLastCard - itemsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(cards.length / itemsPerPage);


    const fetchCards = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                BASE_API_URL + '/api/cards/admin', 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCards(response.data);
        } catch (err) {
            console.error("카드 리스트 로드 실패:", err);
            setError("❌ 카드 리스트 로드 실패. 서버/경로/권한(403)을 확인하세요.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCards();
    }, []);

    if (loading) return <p className="loading-message">카드 목록을 불러오는 중...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const deleteCard = async (cid) => {
    const confirmDelete = window.confirm("정말 이 카드를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_API_URL}/api/cards/admin/${cid}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        fetchCards(); // 삭제 후 목록 갱신
    } catch (err) {
        console.error("카드 삭제 실패:", err);
        alert("카드 삭제 실패. 서버/권한을 확인하세요.");
    }
    };

    // 페이징 추가


    return (
    <div className="card-management">
        {loading && <p className="loading-message">카드 목록을 불러오는 중...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
            <>
                <h3 className="card-list-title">
                    💌 등록된 카드 목록 ({cards.length}개)
                </h3>

                <div className="card-actions">
                    <button className="register-button" onClick={openModal}>
                        카드 등록/추가
                    </button>
                </div>

                <div className="card-wrapper">
                    {currentCards.map(card => (
                        <div key={card.cid} className="admin-card-item-wrapper">
                            <Card frontContent={card.imageUrl} isFlipped={false} />
                            <div className="admin-card-meta">
                                <div className="card-display-name">{card.cname}</div>
                                <div className="card-admin-actions">
                                    <button 
                                        className="delete-button"
                                        onClick={() => deleteCard(card.cid)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <button className="triangle-btn prev" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>
                        <FaPlay className="triangle-icon prev-icon" />
                    </button>

                    <button className="triangle-btn next" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}>
                        <FaPlay className="triangle-icon next-icon" />
                    </button>
                </div>
            </>
        )}
    </div>
);
}
