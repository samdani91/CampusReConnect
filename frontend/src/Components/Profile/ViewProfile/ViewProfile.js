import React, { useState } from "react";
import ProfileTab from "./ProfileTab";
import ResearchTab from "./ResearchTab";
import StatsTab from "./StatsTab";
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Home/Footer';
import "./style.css"; // External CSS for styling

const ViewProfile = () => {
	const [activeTab, setActiveTab] = useState("Profile");

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
			<Navbar />
			<div className="container profile-container">
				<div className="profile-card card shadow-lg">
					<div className="card-body">
						<div className="d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center">
								<div className="profile-picture">
									<img
										src="https://via.placeholder.com/100"
										alt="Profile"
										className="rounded-circle border"
									/>
								</div>
								<div className="ms-4">
									<h4 className="fw-bold mb-1">A. M Samdani Mozumder</h4>
									<p className="mb-1 text-muted">
										Degree · Position · <span className="text-primary">University of Dhaka</span>
									</p>
									<p className="text-muted small">
										Bangladesh | <a href="#" className="text-primary">Website</a>
									</p>
								</div>
							</div>

							{/* Move this section to the right */}
							<div className="text-end">
								<div>
									<p className="mb-0 text-muted small">Research Interest Score ----- <span>0</span></p>
								</div>
								<div>
									<p className="mb-0 text-muted small">Citations ----- <span>0</span></p>
								</div>
							</div>
						</div>


						<div className="d-flex justify-content-end  mt-4">

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
