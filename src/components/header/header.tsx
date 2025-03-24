"use client";
import React, { useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import Logo from "../../utils/images/logo.png";
import Link from "next/link";
import SigninPage from "@/app/signIn/page"; // Assuming this is your login component
import RegisterPage from "@/app/register/page"; // Assuming you have a register page
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  // State to track the active link
  const [activeLink, setActiveLink] = useState<string>("home");
  // State to track which modal is shown
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);

  return (
    <header className={styles.header}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <Link href="/" passHref>
          <Image
            src={Logo}
            alt="Logo"
            width={38}
            height={38}
            className={styles.logo}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <Link
          href="/"
          className={`${styles.navPill} ${activeLink === "home" ? styles.active : ""}`}
          onClick={() => setActiveLink("home")}
        >
          Home Page
        </Link>
        <Link
          href="/volunteers"
          className={`${styles.navPill} ${activeLink === "opportunities" ? styles.active : ""}`}
          onClick={() => setActiveLink("opportunities")}
        >
          Opportunities
        </Link>
        <Link
          href="/analytics"
          className={`${styles.navPill} ${activeLink === "analytics" ? styles.active : ""}`}
          onClick={() => setActiveLink("analytics")}
        >
          Analytics
        </Link>
        <Link
          href="/about"
          className={`${styles.navPill} ${activeLink === "about" ? styles.active : ""}`}
          onClick={() => setActiveLink("about")}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={`${styles.navPill} ${activeLink === "contact" ? styles.active : ""}`}
          onClick={() => setActiveLink("contact")}
        >
          Contact
        </Link>
      </nav>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.authButtons}>
          <button onClick={() => setModalType("login")} className={styles.signInButton}>
            Sign in
          </button>
          <button onClick={() => setModalType("register")} className={styles.registerButton}>
            Register
          </button>
        </div>
        <div className={styles.rightButtons}>
          <FontAwesomeIcon icon={faBell} />
          <FontAwesomeIcon icon={faGear} />
        </div>
      </div>

      {/* Render Modal */}
      {modalType === "login" && <SigninPage onClose={() => setModalType(null)} />}
      {modalType === "register" && <RegisterPage onClose={() => setModalType(null)} />}
    </header>
  );
};

export default Header;