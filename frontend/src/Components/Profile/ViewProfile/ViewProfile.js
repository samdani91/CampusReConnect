import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileTab from "./ProfileTab";
import ResearchTab from "./ResearchTab";
import StatsTab from "./StatsTab";
import Footer from '../../Home/Footer';
import "./style.css";

const ViewProfile = () => {
    const [activeTab, setActiveTab] = useState("Profile");
    const [userData, setUserData] = useState({ full_name: "Loading...", degree: "Loading..." });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/get-profile", {
                    withCredentials: true,
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData({ full_name: "Error", degree: "Error" });
            }
        };

        fetchUserData();
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case "Profile":
                return <ProfileTab />;
            case "Research":
                return <ResearchTab />;
            case "Stats":
                return <StatsTab />;
            default:
                return <ProfileTab />;
        }
    };

    return (
        <>
            <div className="container profile-container">
                <div className="profile-card card ">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div
                                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        fontSize: "25px",
                                    }}
                                >
                                    {userData.full_name.charAt(0)}
                                </div>
                                <div className="ms-4">
                                    <h4 className="fw-bold mb-1">{userData.full_name}</h4>
                                    <p className="mb-1 text-muted">
                                        {userData.degree || "Degree"} · <span className="text-primary">University of Dhaka</span>
                                    </p>
                                    <p className="text-muted small">
                                        Bangladesh
                                    </p>
                                </div>
                            </div>
                            <div className="text-end">
                                <div>
                                    <p className="mb-0 text-muted small">Research Interest Score ----- <span>0</span></p>
                                </div>
                                <div>
                                    <p className="mb-0 text-muted small">Citations ----- <span>0</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                            <div>
                                <button className="btn btn-primary btn-sm">+ Add research</button>
                            </div>
                        </div>
                    </div>
                    <ul className="nav nav-tabs mt-3 px-3">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "Profile" ? "active" : ""}`}
                                onClick={() => setActiveTab("Profile")}
                            >
                                Profile
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "Research" ? "active" : ""}`}
                                onClick={() => setActiveTab("Research")}
                            >
                                Research
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "Stats" ? "active" : ""}`}
                                onClick={() => setActiveTab("Stats")}
                            >
                                Stats
                            </button>
                        </li>
                    </ul>
                    <div className="p-3">{renderTabContent()}</div>
                </div>
            </div >
            <Footer />
        </>
    );
};

export default ViewProfile;
