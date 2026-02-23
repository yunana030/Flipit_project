import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Card } from '../../game/Card';
import { BASE_API_URL } from '../../common/constants';
import './CardRegistrationModal.css';

const CardRegistrationModal = ({ onClose, fetchCards }) => {
    const [cardData, setCardData] = useState({ imageCode: '', cname: '' });

    const convertCodeToUrl = (code) => {
        if (!code || code.length === 0) return '';
        return `https://openmoji.org/data/color/svg/${code.toUpperCase()}.svg`;
    };

    const handleChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const finalImageUrl = convertCodeToUrl(cardData.imageCode);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cardData.imageCode.trim() || !cardData.cname.trim()) {
            alert("이미지 코드와 카드 이름을 모두 입력해주세요.");
            return;
        }

        const submissionData = { imageUrl: finalImageUrl, cname: cardData.cname };
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                BASE_API_URL + '/api/cards/admin/add',
                submissionData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`카드 '${cardData.cname}' 등록 완료`);
            onClose();
            fetchCards();
        } catch (error) {
            console.error("카드 등록 실패:", error.response || error);
            alert("카드 등록 실패. 권한/서버 확인");
        }
    };

    // Portal로 body 최상위에 렌더링
    return ReactDOM.createPortal(
        <div className="card-reg-backdrop" onClick={onClose}>
            <div className="card-reg-content" onClick={e => e.stopPropagation()}>
                <div className="card-reg-header">
                    <h4 className="card-reg-title">➕ 카드 등록</h4>
                    <button className="card-reg-close-btn" onClick={onClose}>X</button>
                </div>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="card-reg-preview-area">
                        <Card frontContent={finalImageUrl || '/images/placeholder.png'} isFlipped={false} onClick={() => {}} />
                        <div className="card-reg-nameplate">
                            {cardData.cname || "카드 이름 입력 대기"}
                        </div>
                    </div>

                    <hr className="card-reg-divider"/>

                    <div className="form-group">
                        <label htmlFor="imageCode">이미지 코드:</label>
                        <input
                            type="text"
                            id="imageCode"
                            name="imageCode"
                            value={cardData.imageCode}
                            onChange={handleChange}
                            placeholder="OpenMoji 코드 입력 (예: 1F4A5)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cname">카드 이름:</label>
                        <input
                            type="text"
                            id="cname"
                            name="cname"
                            value={cardData.cname}
                            onChange={handleChange}
                            placeholder="카드 이름"
                            required
                        />
                    </div>

                    <div className="card-reg-actions">
                        <button type="button" onClick={onClose} className="card-reg-close-btn">취소</button>
                        <button type="submit" className="card-reg-submit-btn">등록</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CardRegistrationModal;
