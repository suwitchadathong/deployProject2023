import '../Style/StyleOutSide.css';
import '../Style/Style.css';

import {
    Link
} from "react-router-dom";
import Cookies from 'js-cookie';

function AppHeaderOutSide(){

    const handleLogoutLinkClick = () => {
        handleGoogleLogout();
    };
    const handleGoogleLogout = () => {
        Cookies.remove('userid');
        Cookies.remove('email');
        Cookies.remove('fullname');
        Cookies.remove('googleid');
        Cookies.remove('usageformat');
        Cookies.remove('e_kyc');
        Cookies.remove('typesid');
        Cookies.remove('clientId');
        Cookies.remove('userToken');
        window.location.reload();
    }
    return(
        <div className='HeadderOutSide'>
            <nav>
                <div className="logo">
                    <div className='logo-icon'><img src='/img/logo.png' alt=''/></div>
                    <div className="logo-name"><img src='/img/namelogo.png' alt=''/></div>
                </div>
                {Cookies.get('email') !== undefined || Cookies.get('email') === "undefined" ?
                    <ul className="menu">
                        <li ><Link to="/Home" className='light'>{Cookies.get('fullname')}</Link></li>
                        <li ><Link to="" onClick={handleLogoutLinkClick} className='danger light-font'>{"ออกจากระบบ"}</Link></li>
                    </ul>
                :
                    <ul className="menu">
                        <li ><Link to="/SingUp" className='light'>สมัครสมาชิก</Link></li>
                        <li ><Link to="/SingIn" className='primary-blue'>เข้าสู่ระบบ</Link></li>
                    </ul>
                }
            </nav>
        </div>
    );

}

export default AppHeaderOutSide;