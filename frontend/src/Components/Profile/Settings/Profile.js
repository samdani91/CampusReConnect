import React, { useState, useEffect } from "react";
import "./profile.css";
import EditNameModal from "./EditNameModal";
import axios from "axios";

export default function Profile() {
    const [profileData, setProfileData] = useState({
        full_name: "",
        degree: "",
        department: "",
    }); 
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/get-profile", {
                    withCredentials: true, 
                });
                setProfileData(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfileData();
    }, []);


    const handleUpdate = (field, newValue) => {
        setProfileData((prevData) => ({
            ...prevData,
            [field]: newValue,
        }));
    };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    return (
        <div className="container">
            <div className="card border border-light">
                <div className="card-body">
                    <h5 className="card-title mb-4 p-2">Profile settings</h5>
                    <hr />

                    <div className="mb-4 p-2">
                        <h6 className="mb-3">Name information</h6>
                        <p className="mb-1 text">
                            Edit your name. We ask that you use your real identity on CampusReConnect.
                        </p>
                        <h6 className="mt-2">Name</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{profileData.full_name || "N/A"}</span>
                            <button
                                className="btn btn-primary btn-sm ms-3"
                                onClick={() => openModal("full_name")}
                            >
                                Edit name
                            </button>
                        </div>
                    </div>
                    <hr />

                    <div className="mb-4 p-2">
                        <h6 className="mt-2">Degree</h6>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{profileData.degree || "N/A"}</span>
                            <button
                                className="btn btn-primary btn-sm ms-3"
                                onClick={() => openModal("degree")}
                            >
                                Edit Degree
                            </button>
                        </div>
                    </div>

                    <hr />

                    <div className="mb-4 p-2">
                        <h6 className="mt-2 mb-3">Institution details</h6>
                        <div className="mb-2">
                            <strong>Institution</strong>
                            <br />
                            <span>University of Dhaka</span>
                        </div>
                        <div className="mb-3">
                            <strong>Department</strong>
                            <br />
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{profileData.department || "N/A"}</span>
                                <button
                                    className="btn btn-primary btn-sm ms-3"
                                    onClick={() => openModal("department")}
                                >
                                    Edit details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditNameModal
                show={showModal}
                handleClose={closeModal}
                type={modalType}
                onSave={handleUpdate}
            />
        </div>
    );
}
