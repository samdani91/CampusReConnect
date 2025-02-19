import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPublication from "./AddPublication"; 

const ResearchTab = ({ isOwnProfile }) => {
  const [selectedItem, setSelectedItem] = useState("Article");
  const [showAddPublication, setShowAddPublication] = useState(false);

  const renderContent = () => {
    if (showAddPublication) {
      return <AddPublication />;
    }

    switch (selectedItem) {
      case "Article":
        return <p>No articles added yet. Use this section to showcase your articles.</p>;
      case "Conference Paper":
        return <p>No conference papers added yet. Add your conference papers to highlight your contributions.</p>;
      case "Data":
        return <p>No data entries added yet. Share your research data here.</p>;
      case "Research":
        return <p>No research items added yet. Use this section to showcase your research work.</p>;
      case "Questions":
        return <p>No questions added yet. Use this section to manage your questions.</p>;
      case "Answers":
        return <p>No answers added yet. Use this section to manage your answers.</p>;
      default:
        return <p>No content available.</p>;
    }
  };

  return (
    <div className="d-flex">
      <div className="border-end p-3" style={{ width: "250px" }}>
        <h6>Research Items</h6>
        <ul className="list-unstyled mb-4">
          {["Article", "Conference Paper", "Data", "Research"].map((item) => (
            <li
              key={item}
              className={`p-2 ms-3 ${selectedItem === item ? "bg-primary text-white" : "text-dark"}`}
              style={{ cursor: "pointer", borderRadius: "5px" }}
              onClick={() => {
                setSelectedItem(item);
                setShowAddPublication(false); 
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        <h6>Questions</h6>
        <ul className="list-unstyled mb-4">
          <li
            className={`p-2 ms-3 ${selectedItem === "Questions" ? "bg-primary text-white" : "text-dark"}`}
            style={{ cursor: "pointer", borderRadius: "5px" }}
            onClick={() => {
              setSelectedItem("Questions");
              setShowAddPublication(false); 
            }}
          >
            Questions
          </li>
        </ul>
        <h6>Answers</h6>
        <ul className="list-unstyled">
          <li
            className={`p-2 ms-3 ${selectedItem === "Answers" ? "bg-primary text-white" : "text-dark"}`}
            style={{ cursor: "pointer", borderRadius: "5px" }}
            onClick={() => {
              setSelectedItem("Answers");
              setShowAddPublication(false); 
            }}
          >
            Answers
          </li>
        </ul>
      </div>

      <div className="p-4 flex-grow-1">
        <div className="border rounded p-4 text-center">
          <div>
            {renderContent()}
          </div>
          {!showAddPublication && selectedItem !== "Questions" && selectedItem !== "Answers" && isOwnProfile && (
            <button
              className="btn btn-primary mt-3"
              onClick={() => setShowAddPublication(true)} 
            >
              Add a publication
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchTab;
