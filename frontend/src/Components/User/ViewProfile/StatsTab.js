import React, { useEffect, useState } from "react";
import axios from "axios";

const StatsTab = ({ userId }) => {
  const [points, setPoints] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/get-points",
          { userId },
          { withCredentials: true } // Ensures authentication cookies are sent
        );

        setPoints(response.data.points);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching points");
      }
    };

    fetchPoints();
  }, [userId]);

  return (
    <div>
      <h5>Statistics</h5>
      <p>Research Interest Score: 0</p>
      <p>Citations: 0</p>
      <p>Points: {error ? "Error" : points !== null ? points : "Loading..."}</p>
    </div>
  );
};

export default StatsTab;
