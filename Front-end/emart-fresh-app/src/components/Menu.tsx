/* eslint-disable @typescript-eslint/no-unused-vars */
import { faArrowRightToBracket, faBagShopping, faBox, faGift, faLocationDot, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef } from 'react'
import logo from '../assets/images/pick-fresh24 logo.png';
import styles from './comp_css/Menu.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuProps{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Menu = ({isOpen, setIsOpen}: MenuProps) => {
    const navigate = useNavigate();
  return (
    <>
        <div>
            <div className={`${styles.menuHeader} ${isOpen ? styles.headerAnimaition : ''}`}>
            <img src={logo} alt="" className={styles.logoImage}/>
            <FontAwesomeIcon icon={faXmark} onClick={() => {setIsOpen(false)}} className={styles.xMark}/>
            </div> 
            <div className={`${styles.secondBack} ${isOpen ? styles.secondAnimation : ''}`}></div>
            <div className={`${styles.firstBack} ${isOpen ? styles.firstAnimation : ''}`}>1</div>
        </div>
        <div className={styles.mainMenu}>
            <div className={styles.menuList} onClick={() => {navigate('/show-all-product'), setIsOpen(false)}}>
                <FontAwesomeIcon icon={faBox} className={styles.menuIcon}/>
                전체 상품 보기</div>
            <div className={styles.menuList} onClick={() => {navigate('/search-store'), setIsOpen(false)}}>
                <FontAwesomeIcon icon={faLocationDot} className={styles.menuIcon}/>
                근처 매장 찾기</div>
            <div className={styles.menuList} onClick={() => {navigate('/eventlist'), setIsOpen(false)}}>
                <FontAwesomeIcon icon={faGift} className={styles.menuIcon}/>
                이벤트</div>
        </div>
        <div className={styles.subMenu}>
            <div className={styles.subList} onClick={() => {navigate('/login'), setIsOpen(false)}}>
                <FontAwesomeIcon icon={faArrowRightToBracket} className={styles.menuIcon}/>
                로그인
            </div>
            <div className={styles.subList} onClick={() => {navigate('/mypageMain'), setIsOpen(false)}}>
                <FontAwesomeIcon icon={faUser} className={styles.menuIcon}/>
                마이페이지
            </div>
            <div className={styles.subList} onClick={() => {navigate('/cart'), setIsOpen(false)}}>
                <FontAwesomeIcon icon={faBagShopping} className={styles.menuIcon}/>
                장바구니
            </div>
        </div>
    </>
  )
}
