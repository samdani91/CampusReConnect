import React, { useEffect, useState } from "react";
import axios from "axios";

const StatsTab = ({ isOwnProfile, userId }) => {
  const [formData, setFormData] = useState({
    hIndex: 0,
    citationCount: 0,
    points: 0,
  });

  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!userId) return;

    try {
      const response = await axios.post(
        "http://localhost:3001/get-user-stats",
        { userId },
        { withCredentials: true }
      );

      if (response.data) {
        setFormData(response.data);
        setOriginalData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Math.max(0, parseInt(value, 10) || 0);
    setFormData({ ...formData, [name]: numericValue });
  };

  const handleSave = async () => {
    const maxHIndex = Math.floor(Math.sqrt(formData.citationCount));

    if (formData.hIndex > maxHIndex) {
      setError(`Invalid h-index! Maximum allowed h-index for ${formData.citationCount} citations is ${maxHIndex}. Please enter a valid value.`);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/update-user-stats",
        { userId, hIndex: formData.hIndex, citationCount: formData.citationCount },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        setOriginalData(formData);
        setIsEditing(false);
        fetchStats();
        setError(null);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error updating stats");
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-4">Statistics</h5>
      {isEditing ? (
        <>
          <div className="mb-3">
            <label className="form-label">h-index</label>
            <input
              type="number"
              className="form-control"
              name="hIndex"
              value={formData.hIndex}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Citations</label>
            <input
              type="number"
              className="form-control"
              name="citationCount"
              value={formData.citationCount}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex justify-content-end">
            <button className="btn btn-danger me-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <h6>h-index</h6>
            <p>{formData.hIndex || "No h-index provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Citations</h6>
            <p>{formData.citationCount || "No citations provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Points</h6>
            <p>{error ? "Error" : formData.points !== null ? formData.points : "Loading..."}</p>
          </div>
        </>
      )}
      {isOwnProfile && !isEditing && (
        <button className="btn btn-success" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      )}
      {showPopup && (
        <div className="alert alert-success mt-3" role="alert">
          Statistics updated successfully
        </div>
      )}
    </div>
  );
};

export default StatsTab;
