import React from 'react';

const Footer = () => {
    return (
        <div className="card mt-4 text-center bg-white w-80"> {/* Added w-100 to ensure it spans the full width */}
            <div className="container-fluid"> {/* Changed container to container-fluid for full-width */}
                <div className="row">
                    <div className="col-md-3">
                        <a href="#">About us</a>
                    </div>
                    <div className="col-md-3">
                        <a href="#">Blog</a>
                    </div>
                    <div className="col-md-3">
                        <a href="#">Careers</a>
                    </div>
                    <div className="col-md-3">
                        <a href="#">Help Center</a>
                    </div>
                </div>
                <div className="row mt-2"> {/* Added mt-2 for spacing */}
                    <div className="col-md-3">
                        <a href="#">Contact us</a>
                    </div>
                    <div className="col-md-3">
                        <a href="#">Terms</a>
                    </div>
                    <div className="col-md-3">
                        <a href="#">Privacy</a>
                    </div>
                    <div className="col-md-3">
                        <a href="#">Copyright</a>
                    </div>
                </div>
                <div className="row mt-2"> {/* Added mt-2 for spacing */}
                    <div className="col-md-3">
                        <a href="#">Imprint</a>
                    </div>
                    <div className="col-md-3">
                        <a href="#">Preferences</a>
                    </div>
                </div>
                <p className="mt-3">&copy; 2008-2025 ResearchGate GmbH. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
