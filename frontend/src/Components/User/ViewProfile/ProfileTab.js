import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileTab = ({ isOwnProfile, userId }) => {
  const [formData, setFormData] = useState({
    introduction: "",
    disciplines: "",
    department: "", // New department field
    skillsExpertise: "",
    languages: "",
    email: "",
    twitter: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/get-profileTab/${userId}`, {
          withCredentials: true,
        });
        if (response.data) {
          setFormData(response.data);
          setOriginalData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/update-profileTab",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        setOriginalData(formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-4">About Me</h5>
      {isEditing ? (
        <>
          <div className="mb-3">
            <label className="form-label">Introduction</label>
            <textarea
              className="form-control"
              name="introduction"
              value={formData.introduction}
              onChange={handleInputChange}
              placeholder="Introduce yourself and your research"
              rows="3"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Disciplines</label>
            <input
              type="text"
              className="form-control"
              name="disciplines"
              value={formData.disciplines}
              onChange={handleInputChange}
              placeholder="Enter or select disciplines"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter your department"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Skills and Expertise</label>
            <input
              type="text"
              className="form-control"
              name="skillsExpertise"
              value={formData.skillsExpertise}
              onChange={handleInputChange}
              placeholder="Enter or select skills and expertise"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Languages</label>
            <input
              type="text"
              className="form-control"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              placeholder="Enter or select languages"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control text-muted"
              name="email"
              value={formData.email}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Twitter</label>
            <input
              type="text"
              className="form-control"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="Enter your Twitter profile URL or username"
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
            <h6>Introduction</h6>
            <p>{formData.introduction || "No introduction provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Disciplines</h6>
            <p>{formData.disciplines || "No disciplines provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Department</h6>
            <p>{formData.department || "No department provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Skills and Expertise</h6>
            <p>{formData.skillsExpertise || "No skills and expertise provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Languages</h6>
            <p>{formData.languages || "No languages provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Email</h6>
            <p>{formData.email || "No email provided"}</p>
          </div>
          <div className="mb-3">
            <h6>Twitter</h6>
            <p>{formData.twitter || "No Twitter handle provided"}</p>
          </div>
          {isOwnProfile && (
            <button className="btn btn-success" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </>
      )}
      {showPopup && (
        <div className="alert alert-success mt-3" role="alert">
          Profile updated successfully
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
