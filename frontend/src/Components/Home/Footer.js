export default function Footer(){
    return(
        <>
        <div className="container-fluid footerArea">
                <div className="container-md">
                    <footer className="text-center text-white mb-0">
                        <div className="container p-4 pb-0">
                            <div className="mb-4 social footer-social">

                                <a className="btn-floating m-1" href="#" target="_blank"
                                    role="button">
                                    <i className='bx bxl-facebook'></i>
                                </a>

                                <a className="btn-floating m-1" href="#" target="_blank" role="button">
                                    <i className='bx bxl-twitter'></i>
                                </a>

                                <a className="btn-floating m-1" href="#" target="_blank" role="button">
                                    <i className='bx bxl-google'></i>
                                </a>

                                <a className="btn-floating m-1" href="#" target="_blank"
                                    role="button">
                                    <i className='bx bxl-instagram'></i>
                                </a>

                                <a className="btn-floating m-1" href="#"
                                    target="_blank" role="button">
                                    <i className='bx bxl-linkedin'></i>
                                </a>

                                <a className="btn-floating m-1" href="#" target="_blank" role="button">
                                    <i className='bx bxl-github'></i>
                                </a>
                            </div>
                        </div>

                        <div className="line mx-auto"></div>

                        <div className="text-center p-3">
                            © 2024 Copyright:
                            <a className="text-white text-decoration-none" href="#"> samdani1412,yasin1406</a>
                        </div>
                    </footer>
                </div>
            </div >
        </>
    )
}