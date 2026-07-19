import { useEffect } from "react";
import { api } from "./api";
import TodoTemplate from "./TodoTemplate";

// Only ever rendered by Home once dailyprogress === 100
function BonusDailyQuest({ missions, progress, onUpdate }) {
  useEffect(() => {
    alert("You have Unlocked 'Bonus Daily Quest' by completing Daily Quest");
  }, []);

  async function handleDone(missionId) {
    try {
      const updatedUser = await api.toggleBonus(missionId);
      onUpdate(updatedUser);
    } catch (err) {
      console.error("Failed to toggle bonus mission:", err.message);
    }
  }

  return (
    <div className="bonusDailyQuest">
      <h2>BONUS DAILY QUEST</h2>
      {missions.map((m) => (
        <TodoTemplate key={m._id} id={m._id} msg={m.mission} done={m.done} onDone={handleDone} />
      ))}
      <p className="progress">Progress : {progress}%</p>
    </div>
  );
}

export default BonusDailyQuest;
