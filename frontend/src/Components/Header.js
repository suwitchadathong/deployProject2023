import './../Style/Header.css';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Link
} from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars, faCircleUser,faXmark, faHouse, faFolderPlus, faBook, faFileCirclePlus,faArrowRightFromBracket, faClipboardList, faUserShield, faBookOpenReader, faIdCardClip, faWrench, faBell,faUserGraduate} from "@fortawesome/free-solid-svg-icons";
// import {GoogleLogout} from 'react-google-login'

function AppHeader(){
    useEffect(() => {
        if (Cookies.get('email') === "undefined" || Cookies.get('email') === undefined) {
            window.location.href = '/SingIn';
        }else{
            console.log(Cookies.get())
        }
    }, []);

    const [Sidebar,setSidebar] = useState(false);
    const handSidebar = () => setSidebar(!Sidebar);

    const location = useLocation();
    const handleLogoutLinkClick = () => {
        handleGoogleLogout();
    };
    const handleGoogleLogout = () => {
        Cookies.remove('userid');
        Cookies.remove('email');
        Cookies.remove('fullname');
        Cookies.remove('googleid');
        Cookies.remove('usageformat1');
        Cookies.remove('usageformat2');
        Cookies.remove('e_kyc');
        Cookies.remove('typesid');
        Cookies.remove('clientId');
        Cookies.remove('userToken');
        console.log(Cookies.get())
        window.location.href = '/SingIn';
    }

    return(
        <>
        <div className={!Sidebar ? "sidebar":"sidebar close"}>
            <Link to="Home" className="logo">
                <div className='logo-icon'><img src='/img/logo.png' alt=''/></div>
                <div className="logo-name"><img src='/img/namelogo.png' alt=''/></div>  
            </Link>
            <div className='logo-xmark' onClick={handSidebar}><FontAwesomeIcon icon={faXmark} /></div>
            {Cookies.get('typesid') === 1 || Cookies.get('typesid') === '1'?
                <ul className="side-menu">
                    <li className={location.pathname.includes("/Home") ? "active" : ""} ><Link to="/Home"><div className='iconmenu'><FontAwesomeIcon icon={faHouse} /></div>หน้าแรก</Link></li>
                    <li className={location.pathname.includes("/Admin/AdminSubject") ? "active" : ""} ><Link to="/Admin/AdminSubject"><div className='iconmenu'><FontAwesomeIcon icon={faBook} /></div>รายวิชาทั้งหมด</Link></li>
                    <li className={location.pathname.includes("/Admin/AdminQuestionnaire") ?"active":""}><Link to="/Admin/AdminQuestionnaire"><div className='iconmenu'><FontAwesomeIcon icon={faClipboardList} /></div>แบบสอบถามทั้งหมด</Link></li>
                    <li className={location.pathname.includes("/Admin/User") ? "active" : ""} ><Link to="/Admin/User"><div className='iconmenu'><FontAwesomeIcon icon={faIdCardClip} /></div>ผู้ใช้ทั้งหมด</Link></li>
                    <li className={location.pathname.includes("/Admin/Type") ? "active" : ""} ><Link to="/Admin/Type"><div className='iconmenu'> <FontAwesomeIcon icon={faWrench} /></div>ประเภทผู้ใช้</Link></li>
                    <li className={location.pathname.includes("/Admin/Request") ? "active" : ""} ><Link to="/Admin/Request"><div className='iconmenu'> <FontAwesomeIcon icon={faBell} /></div>การร้องขอ</Link></li>
                    <li className={location.pathname.includes("/Usermanual") ?"active":""}><Link to="/Usermanual"><div className='iconmenu'><FontAwesomeIcon icon={faBookOpenReader} /> </div>คู่มือการใช้งาน</Link></li>

                </ul>
            :
                <ul className="side-menu">
                    <li className={location.pathname.includes("/Home") ? "active" : ""} ><Link to="/Home"><div className='iconmenu'><FontAwesomeIcon icon={faHouse} /></div>หน้าแรก</Link></li>
                    {Cookies.get('usageformat1') === 1 || Cookies.get('usageformat1') === '1'?
                        <li className={location.pathname.includes("/Subject") ?"active":""}><Link to="/Subject"><div className='iconmenu'><FontAwesomeIcon icon={faBook} /></div>รายวิชาทั้งหมด</Link></li>
                        :null
                    }
                    {Cookies.get('usageformat1') === 1 || Cookies.get('usageformat1') === '1'?
                        <li className={location.pathname.includes("/CreateSubject") ?"active":""}><Link to="/CreateSubject"><div className='iconmenu'><FontAwesomeIcon icon={faFolderPlus} /></div>สร้างรายวิชา</Link></li>
                        :null
                    }
                    <li className={location.pathname.includes("/Questionnaire") ?"active":""}><Link to="Questionnaire"><div className='iconmenu'><FontAwesomeIcon icon={faClipboardList} /></div>แบบสอบถามทั้งหมด</Link></li>
                    <li className={location.pathname.includes("/CreateQuestionnaire") ?"active":""}><Link to="CreateQuestionnaire"><div className='iconmenu'><FontAwesomeIcon icon={faFileCirclePlus} /></div>สร้างแบบสอบถาม</Link></li>
                    {Cookies.get('usageformat1') === 0 || Cookies.get('usageformat1') === '0'?
                        <li className={location.pathname.includes("/Scores") ?"active":""}><Link to="/Scores"><div className='iconmenu'><FontAwesomeIcon icon={faUserGraduate} /></div>ดูคะแนนสอบ</Link></li>
                        :null
                    }
                    <li className={location.pathname.includes("/Usermanual") ?"active":""}><Link to="/Usermanual"><div className='iconmenu'><FontAwesomeIcon icon={faBookOpenReader} /> </div>คู่มือการใช้งาน</Link></li>
                    <li className={location.pathname.includes("/Contact") ?"active":""}><Link to="/Contact"><div className='iconmenu'><FontAwesomeIcon icon={faUserShield} /></div>ติดต่อ Admin</Link></li>
                </ul>
            }
            <ul className="side-menu">
                <li className='' onClick={handleLogoutLinkClick} ><Link><div className='iconmenu danger-font'><FontAwesomeIcon icon={faArrowRightFromBracket} /></div><span className='danger-font'>Logout</span></Link></li>
                {/* <GoogleLogout clientId={Cookies.get('clientId')} buttonText="Log out" onLogoutSuccess={handleGoogleLogout} /> */}
            </ul>
        </div>
        <div className="content contentnavbar">
            <nav>
                <div className='bx bx-menu' onClick={handSidebar}><FontAwesomeIcon icon={faBars} /></div> 
                <form action="#">
                    <div className="form-input">
                        {/* <input type="search" placeholder="Search..." /> */}
                        {/* <button class="search-btn" type="submit"><i class='bx bx-search'></i></button> */}
                    </div>
                </form>
                {/* <input type="checkbox" id="theme-toggle" hidden/>
                <label htmlFor="theme-toggle" className="theme-toggle"></label> */}
                {/* <Link to="#" className="notif"><div className='bx bx-bell'><FontAwesomeIcon icon={faCircleUser} /></div><span className="count">1   </span></Link> */}
                <p style={{ textAlign: 'end' }}>{Cookies.get("fullname")}</p>
                <Link to="Profile" className="profile"><div className='profile-icon'><FontAwesomeIcon icon={faCircleUser} /></div></Link>
            </nav>
        </div>
        </>
    );

}

export default AppHeader;