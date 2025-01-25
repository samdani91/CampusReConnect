import React, { useEffect, useRef, useState } from "react";
import img1 from './images/image1.png'
import img2 from './images/image2.jpg'
import img3 from './images/image3.jpg'

const Carousel = () => {
    const images = [img1,img2,img3];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div>
            <img
                src={images[currentIndex]}
                alt="carousel"
                className="img-fluid rounded"
                style={{
                    width: "600px", 
                    height: "400px",
                    objectFit: "cover", 
                    transition: "opacity 1s ease-in-out"
                }}
            />
        </div>
    );
};

export default Carousel;
