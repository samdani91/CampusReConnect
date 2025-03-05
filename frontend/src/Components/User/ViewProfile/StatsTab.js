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

  // Function to fetch user stats
  const fetchStats = async () => {
    if (!userId) return;

    try {
      const response = await axios.post(
        "http://localhost:3001/get-user-stats",
        { userId }, // Send userId in request body
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

  // Fetch stats on component mount and when userId changes
  useEffect(() => {
    fetchStats();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
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

        // Fetch updated stats after successful update
        fetchStats();
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error updating stats");
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
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
            />
          </div>
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
