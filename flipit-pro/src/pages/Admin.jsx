import React, { useState } from 'react';
import { CardManagement } from '../components/management/CardManagement.jsx';
import UserManagement from "../components/management/UserManagement";
import CardRegistrationModal from "../components/management/card/CardRegistrationModal";
import "./Admin.css"

const Admin = () => {
    const [activeMenu, setActiveMenu] = useState('cards'); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCards = () => console.log("카드 목록 새로고침");

    return (
        <div className="admin-container">
            {isModalOpen && (
                <CardRegistrationModal
                    onClose={() => setIsModalOpen(false)}
                    fetchCards={fetchCards}
                />
            )}

            <div className="admin-sidebar">
                <h2 className="sidebar-title">관리 메뉴</h2>
                <div className="sidebar-nav">
                    <button 
                        className={activeMenu === 'cards' ? 'nav-button active' : 'nav-button'}
                        onClick={() => setActiveMenu('cards')}
                    >🃏 카드 관리</button>
                    <button 
                        className={activeMenu === 'users' ? 'nav-button active' : 'nav-button'}
                        onClick={() => setActiveMenu('users')}
                    >👥 이용자 관리</button>
                </div>
            </div>

            <div className="admin-content-area">
                {/* <h1 className="content-title">관리자 전용 페이지</h1> */}
                <hr className="content-divider" />
                <div className="content-body">
                    {activeMenu === 'cards' && (
                        <CardManagement openModal={() => setIsModalOpen(true)} />
                    )}
                    {activeMenu === 'users' && <UserManagement />}
                </div>
            </div>
        </div>
    );
};

export default Admin;
