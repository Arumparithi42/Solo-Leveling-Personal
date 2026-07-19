import { api } from "./api";
import TodoTemplate from "./TodoTemplate";

function WeeklyQuest({ missions, progress, onUpdate }) {
  async function handleDone(missionId) {
    try {
      const updatedUser = await api.toggleWeekly(missionId);
      onUpdate(updatedUser);
    } catch (err) {
      console.error("Failed to toggle weekly mission:", err.message);
    }
  }

  return (
    <div className="weeklyQuest">
      <h2>WEEKLY QUEST</h2>
      {missions.map((m) => (
        <TodoTemplate key={m._id} id={m._id} msg={m.mission} done={m.done} onDone={handleDone} />
      ))}
      <p className="progress">Progress : {progress}%</p>
    </div>
  );
}

export default WeeklyQuest;
