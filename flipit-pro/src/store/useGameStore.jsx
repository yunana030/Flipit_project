import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // --- 1. 상태 (State) ---
  cards: [],
  timeLeft: 10,
  clickCount: 0,
  isGameStarted: false,
  isComparing: false,
  selectedCards: [],
  itemsUsed: { "TIME+": false, "SHOW ALL": false, "REVEAL ONE": false },

  // 타이머 작동
  tick: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  
  setGameStarted: (status) => set({ isGameStarted: status }),
  setCards: (newCards) => set({ cards: newCards }),
  incClick: () => set((state) => ({ clickCount: state.clickCount + 1 })),
  addExtraTime: (seconds) => set((state) => ({ timeLeft: state.timeLeft + seconds })),

  // 아이템 사용 로직
  useItem: (itemName) => {
    const { itemsUsed, cards } = get();
    if (itemsUsed[itemName]) return;

    set((state) => ({
      itemsUsed: { ...state.itemsUsed, [itemName]: true }
    }));

    switch (itemName) {
      case "TIME+":
        set((state) => ({ timeLeft: state.timeLeft + 5 }));
        break;
      case "SHOW ALL":
        set({ cards: cards.map(c => c.matched ? c : { ...c, isFlipped: false }) });
        setTimeout(() => {
          set({ cards: get().cards.map(c => c.matched ? c : { ...c, isFlipped: true }) });
        }, 1000);
        break;
      case "REVEAL ONE":
        const unflipped = cards.filter(c => c.isFlipped && !c.matched);
        if (unflipped.length === 0) return;
        const randomCard = unflipped[Math.floor(Math.random() * unflipped.length)];
        set({ cards: cards.map(c => c.id === randomCard.id ? { ...c, isFlipped: false } : c) });
        setTimeout(() => {
          set({ cards: get().cards.map(c => c.id === randomCard.id ? { ...c, isFlipped: true } : c) });
        }, 1000);
        break;
    }
  },

  // 카드 클릭 및 매칭 로직
  handleCardClick: (id) => {
    const { cards, isGameStarted, isComparing, selectedCards, incClick } = get();
    if (!isGameStarted || isComparing) return;
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.matched || !clickedCard.isFlipped) return;

    incClick();
    const flippedCards = cards.map(c => c.id === id ? { ...c, isFlipped: false } : c);
    set({ cards: flippedCards });

    const newSelection = [...selectedCards, clickedCard];
    set({ selectedCards: newSelection });

    if (newSelection.length === 2) {
      set({ isComparing: true });
      const [first, second] = newSelection;
      if (first.front === second.front) {
        setTimeout(() => {
          set((state) => ({
            cards: state.cards.map(c =>
              c.id === first.id || c.id === second.id ? { ...c, isFlipped: false, matched: true } : c
            ),
            selectedCards: [],
            isComparing: false
          }));
        }, 500);
      } else {
        setTimeout(() => {
          set((state) => ({
            cards: state.cards.map(c =>
              c.id === first.id || c.id === second.id ? { ...c, isFlipped: true } : c
            ),
            selectedCards: [],
            isComparing: false
          }));
        }, 800);
      }
    }
  },

  // 스테이지 시작 (카드 셔플 및 생성)
  startStage: (stageData, allCards) => {
    if (!stageData || !allCards) return;
    const count = stageData.cardCount;
    const time = stageData.timeLimit || (10 + (stageData.stageNum - 1) * 2);

    const selected = allCards.sort(() => Math.random() - 0.5).slice(0, Math.ceil(count / 2));
    const paired = [];
    selected.forEach((c, i) => {
      paired.push(
        { id: i * 2 + 1, front: c.imageUrl, matched: false, isFlipped: true },
        { id: i * 2 + 2, front: c.imageUrl, matched: false, isFlipped: true }
      );
    });

    set({
      cards: paired.sort(() => Math.random() - 0.5),
      timeLeft: time,
      isGameStarted: true,
      clickCount: 0,
      selectedCards: [],
      isComparing: false,
      itemsUsed: { "TIME+": false, "SHOW ALL": false, "REVEAL ONE": false }
    });
  },

  flipAllCards: (flipped) => {
    set((state) => ({
      cards: state.cards.map(c => ({ ...c, isFlipped: flipped }))
    }));
  },
}));