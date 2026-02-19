import React from 'react';
import Link from 'next/link';
import styles from '@/app/(admin)/navbar/Navbar.module.css';

const RoundedButton = ({ label = "Click Me", href = "#", className = "" }) => {
  return (
      <Link href={href} className={`btn ${styles['btn-primary']} ${className}`}>
          {label}
      </Link>
  );
};

export default RoundedButton;
