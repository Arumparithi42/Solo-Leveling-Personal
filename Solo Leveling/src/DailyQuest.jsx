// missions: array of { _id, mission, done } from the backend
// progress: server-calculated dailyprogress (0-100)
// onUpdate: replaces the parent's user state with the fresh server response
import { api } from "./api";
import TodoTemplate from "./TodoTemplate";
function DailyQuest({ missions, progress, onUpdate }) {
  async function handleDone(missionId) {
    try {
      const updatedUser = await api.toggleDaily(missionId);
      onUpdate(updatedUser);
    } catch (err) {
      console.error("Failed to toggle daily mission:", err.message);
    }
  }

  return (
    <div className="dailyQuest">
      <h2>DAILY QUEST</h2>
      {missions.map((m) => (
          <TodoTemplate
            key={m._id}
            id={m._id}
            msg={m.mission}
            done={m.done}
            onDone={progress === 100 ? () => {} : handleDone}
          />
      ))}
      <p className="progress">Progress : {progress}%</p>
    </div>
  );
}

export default DailyQuest;
