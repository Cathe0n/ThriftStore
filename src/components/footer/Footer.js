// src/components/footer/Footer.js
import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaSnapchat } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section contact-us">
        <h3>Contact Us</h3>
        <p><strong>Email:</strong> verothrift@gmail.com</p>
        <p><strong>HQ location:</strong><br />
          Jl. Dr. Saharjo No.232, RT.1/RW.4, Menteng Dalam, Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12870
        </p>
        <p><strong>Customer service:</strong><br />
          +62 824 2375 2384
        </p>
      </div>

      <div className="footer-section get-to-know">
        <h3>Get to Know Us</h3>
        <ul>
          <li><a href="/about">About Us</a></li>
          <li><a href="/policies">Our Policies</a></li>
        </ul>
      </div>

      <div className="footer-section explore-more">
        <h3>Explore More</h3>
        <ul>
          <li><a href="/wishlist">Wishlist</a></li>
          <li><a href="/bag">Shopping Bag</a></li>
        </ul>
      </div>

      <div className="footer-section socials">
        <h3>Get in Touch with Our Socials!</h3>
        <div className="social-icons">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaSnapchat /></a>
        </div>
        <h3 className="payment-heading">Available Payment Methods</h3>
        <div className="payment-logos">
          <img src="/payments/visa.png" alt="Visa" />
          <img src="/payments/mastercard.png" alt="MasterCard" />
          <img src="/payments/paypal.png" alt="PayPal" />
          <img src="/payments/amex.png" alt="American Express" />
          <img src="/payments/klarna.png" alt="Klarna" />
          <img src="/payments/applepay.png" alt="Apple Pay" />
          <img src="/payments/afterpay.png" alt="AfterPay" />
          <img src="/payments/discover.png" alt="Discover" />
          <img src="/payments/diners.svg" alt="Diners Club" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
