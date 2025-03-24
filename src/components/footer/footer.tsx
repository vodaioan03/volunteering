"use client";
import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Logo from "../../utils/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Social Section */}
      <div className={styles.socialSection}>
        <div className={styles.logoWrapper}>
          <Image
            src={Logo}
            alt="Company Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
        </div>
        <div className={styles.socialIcons}>
          <FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} />
          <FontAwesomeIcon icon={faTwitter} className={styles.socialIcon} />
          <FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} />
          <FontAwesomeIcon icon={faLinkedin} className={styles.socialIcon} />
        </div>
      </div>

      {/* Link Sections */}
      <div className={styles.linkSection}>
        <h3 className={styles.columnTitle}>Explore</h3>
        <nav className={styles.linkList}>
          <a href="#" className={styles.link}>
            Development features
          </a>
          <a href="#" className={styles.link}>
            Design systems
          </a>
          <a href="#" className={styles.link}>
            Collaboration features
          </a>
          <a href="#" className={styles.link}>
            Design process
          </a>
        </nav>
      </div>

      <div className={styles.linkSection}>
        <h3 className={styles.columnTitle}>Explore</h3>
        <nav className={styles.linkList}>
          <a href="#" className={styles.link}>
            Development features
          </a>
          <a href="#" className={styles.link}>
            Design systems
          </a>
          <a href="#" className={styles.link}>
            Collaboration features
          </a>
          <a href="#" className={styles.link}>
            Design process
          </a>
        </nav>
      </div>

      <div className={styles.linkSection}>
        <h3 className={styles.columnTitle}>Resources</h3>
        <nav className={styles.linkList}>
          <a href="#" className={styles.link}>
            Blog
          </a>
          <a href="#" className={styles.link}>
            Best practices
          </a>
          <a href="#" className={styles.link}>
            Support
          </a>
          <a href="#" className={styles.link}>
            Developers
          </a>
        </nav>
      </div>

      {/* Decorative elements */}
      <div className={`${styles.decorativeCircle} ${styles.decorativeCircleTop}`}></div>
      <div className={`${styles.decorativeCircle} ${styles.decorativeCircleBottom}`}></div>
    </footer>
  );
};

export default Footer;