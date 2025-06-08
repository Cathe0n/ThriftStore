import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import VeroVideo from "../../assets/VeroVideo.mp4";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HorizontalSlider from "../../components/horizontalslider/HorizontalSlider";
import ProductDisplay from "../../components/productdisplay/ProductDisplay";
import { useQuery } from "@apollo/client";
import { GET_TRENDING_PRODUCTS } from "../../graphql/mutations";
import ChatBot from "../../components/popups/chatbot/ChatBot";

function Home() {
  const videoRef = useRef(null);
  const trendingRef = useRef(null);
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

  const { loading: trendingLoading, data: trendingData } = useQuery(GET_TRENDING_PRODUCTS);

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
    { name: "Adidas", image: "/brands/adidas.webp", value: "Adidas" },
    { name: "Nike", image: "/brands/nike.jpg", value: "Nike" },
    { name: "Loro Piana", image: "/brands/loro.jpg", value: "Loro Piana" },
    { name: "Louis Vuitton", image: "/brands/lv.jpg", value: "Louis Vuitton" },
    { name: "H&M", image: "/brands/hm.jpg", value: "H&M" },
  ];

  const handleCategoryClick = (category) => {
    const categoryType = `${gender}'s ${category.value}`;
    navigate("/product", {
      state: {
        categoryType,
        category: `${gender}'s ${category.name}`,
        gender,
      },
    });
  };

  const handleBrandClick = (brand) => {
    navigate("/product", { state: { brand: brand.value } });
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

  const trendingProducts =
    trendingData?.getTrendingProducts?.map((product) => ({
      ...product,
      images: product.imagePath
        ? product.imagePath.split(",").map((url) => url.trim()).filter(Boolean)
        : [],
    })) || [];

  const scrollTrending = (direction) => {
    const scrollAmount = 300;
    if (trendingRef.current) {
      trendingRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
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

      <HorizontalSlider
        title="Shop By Category"
        items={categories}
        onItemClick={handleCategoryClick}
        bgColor="#f8f8f8"
        loading={loadingCategories}
      />

      <HorizontalSlider
        title="Shop By Brands"
        items={brands}
        onItemClick={handleBrandClick}
        onSeeAll={handleSeeAllBrands}
        bgColor="#f8f8f8"
      />

      <div className="trending-section" style={{ backgroundColor: "#9A4949", padding: "2rem 1rem" }}>
        <h2 style={{ color: "white", textAlign: "center" }}>Trending Pieces</h2>
        <p style={{ color: "white", textAlign: "center", marginBottom: "2rem" }}>
          What's hot right now
        </p>
        {trendingLoading ? (
          <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
        ) : (
          <div className="trending-slider-container">
            <button className="slider-arrow left" onClick={() => scrollTrending("left")}>
              <FaChevronLeft />
            </button>

            <div className="trending-slider-wrapper" ref={trendingRef}>
              <div className="trending-slider">
                {trendingProducts.map((product) => (
                  <div key={product.id} className="trending-slide">
                    <ProductDisplay product={product} />
                  </div>
                ))}
              </div>
            </div>

            <button className="slider-arrow right" onClick={() => scrollTrending("right")}>
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
}

export default Home;
