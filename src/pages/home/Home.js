import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import VeroVideo from "../../assets/VeroVideo.mp4";
import { FaPlay, FaPause } from "react-icons/fa";
import HorizontalSlider from "../../components/horizontalslider/HorizontalSlider";
import SpecialSlider from "../../components/specialslider/SpecialSlider";

// Dummy data for now, can be replaced later with MongoDB data
const categories = [
  { name: 'Tops', image: '/images/tops.jpg' },
  { name: 'Sweater & Hoodie', image: '/images/hoodies.jpg' },
  { name: 'Bottoms', image: '/images/bottoms.jpg' },
  { name: 'Activewear', image: '/images/activewear.webp' },
  { name: 'Outerwear', image: '/images/outerwear.jpg' },
];

const brands = [
  { name: 'Adidas', image: '/brands/adidas.webp' },
  { name: 'Nike', image: '/brands/nike.jpg' },
  { name: 'Loro Piana', image: '/brands/loro.jpg' },
  { name: 'Louis Vuitton', image: '/brands/lv.jpg' },
  { name: 'H&M', image: '/brands/hm.jpg' },
];
const trending = [
  {
    image: "/images/dries.jpg",
    name: "embellished crepe bustier top",
    brand: "Dries Van Noten",
    description: "embellished crepe bustier top",
    price: 889000
  },
  {
    image: "/images/burberry.jpg",
    name: "cropped trench jacket",
    brand: "Burberry",
    description: "cropped Gabardine trench jacket",
    price: 23599000
  },
  // ...other items
];




function Home() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSeeAllCategories = () => {
    navigate("/categories");
  };

  const handleSeeAllBrands = () => {
    navigate("/brands");
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
      <HorizontalSlider
        title="Shop By Category"
        items={categories}
        onSeeAll={handleSeeAllCategories}
      />
      <HorizontalSlider
        title="Shop By Brands"
        items={brands}
        onSeeAll={handleSeeAllBrands}
      />
      <SpecialSlider
      title="Trending Pieces"
      subtitle="What's hot right now"
      items={trending}
      themeColor="#9A4949" // red
      />
    </div>
  );
}

export default Home;
