import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import VeroVideo from "../../assets/VeroVideo.mp4";
import { FaPlay, FaPause } from "react-icons/fa";
import HorizontalSlider from "../../components/horizontalslider/HorizontalSlider";
import SpecialSlider from "../../components/specialslider/SpecialSlider";
import { getProductsByCategory } from "../../App";
import ChatBot from "../../components/popups/chatbot/ChatBot";

function Home() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get gender from URL (women/men/kids)
  const currentGender = () => {
    if (location.pathname.includes("women")) return "Women";
    if (location.pathname.includes("men")) return "Men";
    if (location.pathname.includes("kids")) return "Kids";
    return "Unisex";
  };

  // Hardcoded categories with click handlers
  const categories = [
    { name: 'Tops', image: '/images/tops.jpg', value: 'Tops' },
    { name: 'Sweater & Hoodie', image: '/images/hoodies.jpg', value: 'Sweater' },
    { name: 'Bottoms', image: '/images/bottoms.jpg', value: 'Bottoms' },
    { name: 'Activewear', image: '/images/activewear.webp', value: 'Activewear' },
    { name: 'Outerwear', image: '/images/outerwear.jpg', value: 'Outerwear' },
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
      price: 889000
    },
    {
      image: "/images/burberry.webp",
      name: "cropped trench jacket",
      brand: "Burberry",
      price: 23599000
    },
  ];

  const handleCategoryClick = async (category) => {
    try {
      setLoadingCategories(true);
      const products = await getProductsByCategory(currentGender(), category.value);
      
      navigate("/product", { 
        state: { 
          products,
          category: `${currentGender()}'s ${category.name}`,
          gender: currentGender()
        }
      });
    } catch (error) {
      console.error("API Error:", error);
      navigate("/error", { state: { error: "Failed to load products" } });
    } finally {
      setLoadingCategories(false);
    }
  };

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
        <h1>Welcome to VERO Thrift Store – {currentGender()}</h1>
        <p>Please log in to access exclusive deals.</p>
      </div>

      {/* Shop By Category - With API integration */}
      <HorizontalSlider
        title="Shop By Category"
        items={categories}
        onItemClick={handleCategoryClick}
        onSeeAll={handleSeeAllCategories}
        bgColor="#f8f8f8"
        loading={loadingCategories}
      />

      {/* Shop By Brands */}
      <HorizontalSlider
        title="Shop By Brands"
        items={brands}
        onSeeAll={handleSeeAllBrands}
        bgColor="#f8f8f8"
      />

      {/* Trending Products */}
      <SpecialSlider
        title="Trending Pieces"
        subtitle="What's hot right now"
        items={trending}
        themeColor="#9A4949"
      />

      <ChatBot />
    </div>
  );
}

export default Home;