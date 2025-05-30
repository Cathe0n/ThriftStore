import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import VeroVideo from "../../assets/VeroVideo.mp4";
import { FaPlay, FaPause } from "react-icons/fa";
import HorizontalSlider from "../../components/horizontalslider/HorizontalSlider";
import SpecialSlider from "../../components/specialslider/SpecialSlider";
import ChatBot from "../../components/popups/chatbot/ChatBot";

function Home() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentGender = () => {
    if (location.pathname.includes("women")) return "Women";
    if (location.pathname.includes("men")) return "Men";
    if (location.pathname.includes("kids")) return "Kids";
    return "Unisex";
  };

  const gender = currentGender();

  // Dynamic category list based on gender
  const categoriesByGender = {
    Women: [
      { name: "Tops", image: "/categories/women/tops.jpg", value: "Tops" },
      { name: "Sweaters & Hoodies", image: "/categories/women/hoodies.jpg", value: "Sweaters & Hoodies" },
      { name: "Bottoms", image: "/categories/women/bottoms.jpg", value: "Bottoms" },
      { name: "Activewear", image: "/categories/women/activewear.webp", value: "Activewear" },
      { name: "Dresses & Skirts", image: "/categories/women/dresses.webp", value: "Dresses & Skirts" },
      { name: "Outerwear", image: "/categories/women/outerwear.jpg", value: "Outerwear" },
    ],
    Men: [
      { name: "Tops", image: "/categories/men/tops.jpg", value: "Tops" },
      { name: "Sweaters & Hoodies", image: "/categories/men/sweaters.jpg", value: "Sweaters & Hoodies" },
      { name: "Bottoms", image: "/categories/men/bottoms.webp", value: "Bottoms" },
      { name: "Activewear", image: "/categories/men/activewear.jpeg", value: "Activewear" },
      { name: "Outerwear", image: "/categories/men/outerwear.avif", value: "Outerwear" },
      { name: "Loungewear", image: "/categories/men/loungewear.webp", value: "Loungewear" },
    ],
    Kids: [
      { name: "Tops", image: "/categories/kids/tops.jpeg", value: "Tops" },
      { name: "Sweaters & Hoodies", image: "/categories/kids/sweaters.jpg", value: "Sweaters & Hoodies" },
      { name: "Bottoms", image: "/categories/kids/bottoms.avif", value: "Bottoms" },
      { name: "Activewear", image: "/categories/kids/activewear.jpg", value: "Activewear" },
      { name: "Outerwear", image: "/categories/kids/outerwear.webp", value: "Outerwear" },
      { name: "Loungewear & Pajamas", image: "/categories/kids/pajamas.webp", value: "Loungewear & Pajamas" },
    ],
  };

  const categories = categoriesByGender[gender] || [];

const brands = [
  { 
    name: 'Adidas', 
    image: '/brands/adidas.webp', 
    value: 'Adidas' 
  },
  { 
    name: 'Nike', 
    image: '/brands/nike.jpg', 
    value: 'Nike' 
  },
  { 
    name: 'Loro Piana', 
    image: '/brands/loro.jpg', 
    value: 'Loro Piana' 
  },
  { 
    name: 'Louis Vuitton', 
    image: '/brands/lv.jpg', 
    value: 'Louis Vuitton' 
  },
  { 
    name: 'H&M', 
    image: '/brands/hm.jpg', 
    value: 'H&M' 
  },
];

  const trending = [
    {
      image: "/images/women/Tops/Bershka/Dries/dries.jpg",
      name: "embellished crepe bustier top",
      brand: "Dries Van Noten",
      price: 889000
    },
    {
      image: "/categories/women/burberry.webp",
      name: "cropped trench jacket",
      brand: "Burberry",
      price: 23599000
    },
  ];

  const handleCategoryClick = async (category) => {
    const categoryType = `${gender}'s ${category.value}`;

    navigate("/product", {
      state: {
        categoryType,
        category: `${gender}'s ${category.name}`,
        gender
      }
    });
  };

const handleBrandClick = async (brands) => {
    navigate("/product", { state: { brand: brands.value } });
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
        <h1>Welcome to VERO Thrift Store – {gender}</h1>
        <p>Please log in to access exclusive deals.</p>
      </div>

      {/* Shop By Category*/}
      <HorizontalSlider
        title="Shop By Category"
        items={categories}
        onItemClick={handleCategoryClick}
        bgColor="#f8f8f8"
        loading={loadingCategories}
      />

      {/* Shop By Brands */}
      <HorizontalSlider
        title="Shop By Brands"
        items={brands}
        onItemClick={handleBrandClick}
        onSeeAll={handleSeeAllBrands}
        bgColor="#f8f8f8"
      />

      {/* Trending Products */}
      <SpecialSlider
        title="Trending Pieces"
        subtitle="What's hot right now"
        items={trending}
        themeColor="#9A4949"
        titleColor="white"
      />

      <ChatBot />
    </div>
  );
}

export default Home;
