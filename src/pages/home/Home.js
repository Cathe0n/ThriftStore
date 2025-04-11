import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";
import VeroVideo from "../../assets/VeroVideo.mp4";
import { FaPlay, FaPause } from "react-icons/fa";
import HorizontalSlider from "../../components/horizontalslider/HorizontalSlider";

// Dummy data for now, can be replaced later with MongoDB data
const categories = [
  { name: 'Tops', image: '/images/tops.jpg' },
  { name: 'Sweater & Hoodie', image: '/images/hoodies.jpg' },
  { name: 'Bottoms', image: '/images/bottoms.jpg' },
  { name: 'Activewear', image: '/images/activewear.webp' },
  { name: 'Outerwear', image: '/images/outerwear.jpg' },
];

const brands = [
  { name: 'Adidas', image: '/brands/adidas.png' },
  { name: 'Nike', image: '/brands/nike.png' },
  { name: 'Loro Piana', image: '/brands/loro.png' },
  { name: 'Louis Vuitton', image: '/brands/lv.png' },
  { name: 'H&M', image: '/brands/hm.png' },
];

function Home() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const location = useLocation();

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getSection = () => {
    if (location.pathname.includes("women")) return "Women";
    if (location.pathname.includes("men")) return "Men";
    if (location.pathname.includes("kids")) return "Kids";
    return "Everyone";
  };

  return (
    <div className="home">
      <div className="hero-video-container">
        <video
          ref={videoRef}
          className="hero-video"
          src={VeroVideo}
          autoPlay
          loop
          muted
        />
        <button className="play-pause-btn" onClick={togglePlayback}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      <div className="home-content">
        <h1>Welcome to VERO Thrift Store – {getSection()}</h1>
        <p>Please log in to access exclusive deals.</p>
      </div>

      {/* 👕 Category & Brand Sliders */}
      <HorizontalSlider title="Shop By Category" items={categories} />
      <HorizontalSlider title="Shop By Brands" items={brands} />
    </div>
  );
}

export default Home;
