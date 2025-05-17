"use client";
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import Logo from "../../utils/images/logo.png";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSignOut } from "@fortawesome/free-solid-svg-icons";
import RegisterPage from "@/app/register/page";

const Header = () => {
  const Links = [
    {name:"Home Page",href:"/"},
    {name:"Opportunities",href:"/volunteers"},
    {name:"Analytics",href:"/analytics"},
    {name:"About",href:"/aboutUs"},
    {name:"Contact",href:"/contact"},
  ];

  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    router.push('/viewProfile');
    setShowProfileMenu(false);
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRegisterModal(true);
  };
  
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
        {Links.map((linkObj,index) => {
          return (
            <Link
              key={index}
              href={linkObj.href}
              className={`${styles.navPill} ${isLinkActive(linkObj.href) ? styles.active : ""}`}
            >
              {linkObj.name}
            </Link>
          );
        })}
      </nav>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {!isLoading && (
          <>
            {isAuthenticated && user ? (
              <>
                <div className={styles.userSection}>
                  <button 
                    className={styles.userButton}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
                    <span className={styles.userName}>{user.firstName}</span>
                  </button>
                  {showProfileMenu && (
                    <div className={styles.profileMenu}>
                      <button onClick={handleProfileClick} className={styles.menuItem}>
                        <FontAwesomeIcon icon={faUser} className={styles.menuIcon} />
                        View Profile
                      </button>
                      <button onClick={handleLogout} className={styles.menuItem}>
                        <FontAwesomeIcon icon={faSignOut} className={styles.menuIcon} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <div className={styles.rightButtons}>
                  <FontAwesomeIcon icon={faBell} className={styles.icon} />
                </div>
              </>
            ) : (
        <div className={styles.authButtons}>
                <Link href="/login" className={styles.signInButton}>
            Sign in
                </Link>
                <button onClick={handleRegisterClick} className={styles.registerButton}>
            Register
          </button>
        </div>
            )}
          </>
        )}
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterPage onClose={() => setShowRegisterModal(false)} />
      )}
    </header>
  );
};

export default Header;