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
  const Links = [
    {name:"Home Page",href:"/"},
    {name:"Opportunities",href:"/volunteers"},
    {name:"Analytics",href:"/analytics"},
    {name:"About",href:"/aboutUs"},
    {name:"Contact",href:"/contact"},
  ]
  // State to track the active link
  const [activeLink, setActiveLink] = useState<string>(Links[0].name);
  // State to track which modal is shown
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);

  // This are 
  
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
            onClick={() => setActiveLink(Links[0].name)}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        {Links.map((linkObj,index) => {
          return (
            <Link
              key={index}
              href={linkObj.href}
              className={`${styles.navPill} ${activeLink === linkObj.name ? styles.active : ""}`}
              onClick={() => setActiveLink(linkObj.name)}
            >
              {linkObj.name}
            </Link>
          );
        })}
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