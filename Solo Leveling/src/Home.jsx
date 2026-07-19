import { useState, useEffect } from "react";
import { api } from "./api";

import DailyQuest from "./DailyQuest";
import BonusDailyQuest from "./BonusDailyQuest";
import WeeklyQuest from "./WeeklyQuest";
import Penalty from "./Penalty";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the user once when the page mounts
  useEffect(() => {
    api
      .getUser()
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="progress">Loading...</p>;
  if (error) return <p className="progress">Error: {error}</p>;
  if (!user) return null;

  return (
    <div className="questContainer">
      {/* Each child receives the relevant slice of user data plus a
          callback to replace the whole user object once the backend
          responds with the fresh, server-calculated state. */}
      <DailyQuest
        missions={user.dailyquest}
        progress={user.dailyprogress}
        onUpdate={setUser}
      />

      {user.dailyprogress === 100 && (
        <BonusDailyQuest
          missions={user.bonusquest}
          progress={user.bonusprogress}
          onUpdate={setUser}
        />
      )}

      <WeeklyQuest
        missions={user.weeklyquest}
        progress={user.weeklyprogress}
        onUpdate={setUser}
      />

      <Penalty penalty={user.penalty} onUpdate={setUser} />
    </div>
  );
}

export default Home;
