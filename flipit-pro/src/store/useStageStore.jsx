import { create } from 'zustand';
import axios from 'axios';
import { BASE_API_URL } from '../components/common/constants';

export const useStageStore = create((set) => ({
  currentStage: 1,
  isLastStage: false,

  fetchProgress: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const res = await axios.get(`${BASE_API_URL}/api/play-record/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.exists) {
        set({ 
          currentStage: res.data.stage, 
          isLastStage: res.data.isLastStage 
        });
        return res.data;
      }
      return null;
    } catch (err) { return null; }
  },

  saveProgress: async (username, stage, clickCount) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${BASE_API_URL}/api/play-record/save`,
        { username, stage, clickCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        set({
          currentStage: res.data.stage,
          isLastStage: <res className="data lastStage"></res>
        });
        return res.data; 
      }
    } catch (err) {
      console.error("세이브 실패:", err);
    }
  },

  setStageInfo: (stage, isLastStage) =>
    set({ currentStage: stage, isLastStage }),

  setStage: (stage) => set({ currentStage: stage })
  
}));