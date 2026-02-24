import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../common/constants";
import "./UserManagement.css"
import { FaPlay } from "react-icons/fa";
import api from '../../api/api'

const UserManagement = () =>{
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const currentUsers = users.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
    );

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                BASE_API_URL
                 + '/api/user/users', 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setUsers(response.data);
        } catch (err) {
            console.error("사용자 리스트 로드 실패:", err);
            setError("사용자 리스트 로드 실패. 서버 상태/경로/권한(403)을 확인하세요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsersData = async () => {
            setLoading(true); // 로딩 시작
            try {
                const token = localStorage.getItem("token"); // 토큰 가져오기
                
                //헤더에 Authorization을 직접 실어서
                const response = await api.get('/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }); 
                
                setUsers(response.data);
            } catch (error) {
                console.error("관리자 데이터 호출 실패:", error);
                // 만약 403이 뜬다면 권한 문제라고 알림
                if(error.response && error.response.status === 403) {
                    alert("관리자 권한이 없거나 세션이 만료되었습니다.");
                }
            } finally {
                setLoading(false); // 로딩 종료
            }
        };
        
        fetchUsersData();
    }, []);

    
    if (loading) return <p className="loading-message">이용자 목록을 불러오는 중...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (users.length === 0) return <p className="empty-message">등록된 이용자가 없습니다.</p>;

    const deleteUser = async (userId) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await api.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("이용자가 삭제되었습니다.");
            
            window.location.reload(); 
        } catch (err) {
            console.error("사용자 삭제 실패:", err);
            alert("이용자 삭제 실패. 권한(403)이나 서버 경로를 확인하세요.");
        }
    };


    return (
        <div className="user-management">
            <h3 className="user-list-title">
                👥 등록된 이용자 목록 ({users.length}명)
            </h3>
            
            <table className="user-table">
                <thead>
                    <tr className="user-table-header-row">
                        <th className="user-table-cell">ID</th>
                        <th className="user-table-cell">USERNAME</th>
                        <th className="user-table-cell">NAME</th>
                        <th className="user-table-cell">가입일</th>
                        <th className="user-table-cell">삭제</th>
                    </tr>
                </thead>
                <tbody>
                {currentUsers
                    .filter(user => user.username !== 'adyuna1')
                    .map(user => (
                    <tr key={user.id} className="user-table-row">
                        <td className="user-table-cell">{user.id}</td>
                        <td className="user-table-cell">{user.username}</td>
                        <td className="user-table-cell">{user.name}</td>
                        <td className="user-table-cell">
                        {user.createTime ? new Date(user.createTime).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="user-table-cell action-cell">
                        <button 
                            className="delete-button"
                            onClick={() => deleteUser(user.id)}
                        >
                            삭제
                        </button>
                        </td>
                    </tr>
                    ))
                }
                </tbody>
                

            </table>
            <div className="pagination">
                    <button
                        className="triangle-btn prev"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        <FaPlay className="triangle-icon prev-icon" />
                    </button>

                    <button
                        className="triangle-btn next"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        <FaPlay className="triangle-icon next-icon" />
                    </button>
                    </div>
        </div>
    );

}
export default UserManagement;