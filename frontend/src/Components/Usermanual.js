import {
    Link
} from "react-router-dom";
import Cookies from 'js-cookie';

function AppUsermanual(){

    const handleLinkClick = (event) => {
        // กดยืนยันเพื่อทำการเปิดคู่มือการใช้งาน
        event.preventDefault();
        window.open(event.target.href, '_blank');
    };

    return(
        <div className='content'>
            <main>
                <div className='box-content'>
                    <div className='box-content-view'>
                        <div className='bx-topic light'>
                            <p>คู่มือการใช้งาน / </p>
                            <h2>คู่มือการใช้งาน</h2>  
                        </div>
                        <div className='bx-details light'>
                            <div ><Link to="/manual/help/manualsubject.pdf" onClick={handleLinkClick} className="dark-font">คู่มือการใช้งานการจัดการรายวิชา</Link></div>
                            <div ><Link to="/manual/help/manualquestionnaire.pdf" onClick={handleLinkClick} className="dark-font">คู่มือการใช้งานการจัดการแบบสอบถาม</Link></div>
                            {Cookies.get('usageformat1') === 0 || Cookies.get('usageformat1') === "0" || Cookies.get('typesid') === 1 || Cookies.get('typesid') === "1"?
                                <div ><Link to="/manual/help/manualscores.pdf" onClick={handleLinkClick} className="dark-font">คู่มือการใช้งานการดูคะแนน</Link></div>
                                :
                                null
                            }
                            {Cookies.get('typesid') === 1 || Cookies.get('typesid') === "1"?
                                <div ><Link to="/manual/help/manualadmin.pdf" onClick={handleLinkClick} className="dark-font">คู่มือการใช้งาน Admin</Link></div>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppUsermanual;