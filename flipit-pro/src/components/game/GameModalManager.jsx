import { NextStageModal } from "./NextStageModal.jsx";
import { ExitModal } from "./ExitModal.jsx";
import { GameOverModal } from "./GameOverModal.jsx";
import { ContinueGameModal } from "./ContinueGameModal.jsx";

export const GameModalManager = ({ modals, currentStage, actions }) => {
  const { isNextStageOpen, isExitOpen, isGameOverOpen, showContinue } = modals;

  return (
    <>
      {isNextStageOpen && (
        <NextStageModal
          stage={currentStage}
          onClose={actions.openExit}
          onNextStage={actions.handleNextStage}
        />
      )}
      {isExitOpen && (
        <ExitModal
          onConfirm={actions.goHome}
          onCancel={actions.closeExit}
        />
      )}
      {isGameOverOpen && (
        <GameOverModal
          onRestart={actions.handleRestart}
          onHome={actions.goHome}
        />
      )}
      {showContinue && (
        <ContinueGameModal
          onContinue={actions.handleContinue}
          onRestart={actions.handleFullRestart}
          onClose={actions.closeContinue}
        />
      )}
    </>
  );
};