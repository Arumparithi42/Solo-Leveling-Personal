import { useState } from "react";
import { api } from "./api";

// penalty: current penalty count from the user object
// onUpdate: replaces the parent's user state with the fresh server response
function Penalty({ penalty, onUpdate }) {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleCompensate() {
    if (!description.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const updatedUser = await api.compensate(description);
      onUpdate(updatedUser);
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="penalty">
      <h2>PENALTY</h2>
      <p className="progress">Penalty : {penalty}</p>

      {penalty > 0 && (
        <>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleCompensate} disabled={submitting}>
            {submitting ? "..." : "Compensate"}
          </button>
        </>
      )}

      {error && <p className="progress">{error}</p>}
    </div>
  );
}

export default Penalty;
