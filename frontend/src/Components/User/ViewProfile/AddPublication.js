import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddPublication = () => {
  const [formData, setFormData] = useState({
    publicationType: "",
    file: null,
    title: "",
    authors: [""],
    date: {
      day: 2,
      month: "January",
      year: 2025,
    },
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      date: { ...prev.date, [name]: value },
    }));
  };

  const handleAddAuthor = () => {
    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, ""],
    }));
  };

  const handleAuthorChange = (index, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = value;
    setFormData((prev) => ({ ...prev, authors: updatedAuthors }));
  };

  const handleRemoveAuthor = (index) => {
    const updatedAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, authors: updatedAuthors }));
  };

  const handleUpload = () => {
    // Simulate a successful upload
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000); // Hide success message after 3 seconds
  };

  return (
    <div className="mt-4">
      <h4 className="mb-4">Your Research</h4>
      <div className="p-4 bg-light">
        <div className="mb-3">
          <label className="form-label">Publication Type</label>
          <select
            className="form-select"
            name="publicationType"
            value={formData.publicationType}
            onChange={handleInputChange}
          >
            <option value="">Select your publication type</option>
            <option value="Article">Article</option>
            <option value="Conference Paper">Conference Paper</option>
            <option value="Dataset">Dataset</option>
            <option value="Research">Research</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">File (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter the title"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a brief description of your publication"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Authors</label>
          {formData.authors.map((author, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={author}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
                placeholder="Author name"
              />
              {index > 0 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveAuthor(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddAuthor}
          >
            Add more authors
          </button>
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <div className="d-flex">
            <select
              className="form-select me-2"
              name="day"
              value={formData.date.day}
              onChange={handleDateChange}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              className="form-select me-2"
              name="month"
              value={formData.date.month}
              onChange={handleDateChange}
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="form-select"
              name="year"
              value={formData.date.year}
              onChange={handleDateChange}
            >
              {Array.from({ length: 50 }, (_, i) => 1975 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
      {showSuccessMessage && (
        <div className="alert alert-success mt-3" role="alert">
          Publication uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default AddPublication;
