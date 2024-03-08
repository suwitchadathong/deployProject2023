import {
    Link
} from "react-router-dom";
import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import TableSubject from "../Tools/ToolsTableSubject";
import Alertmanual from "../Tools/ToolAlertmanual";
import Cookies from 'js-cookie';

function AppSubject(){

    const [StartError, setStartError] = useState(0);
    useEffect(() => {
      
        setTimeout(() => {
            if(Cookies.get('usageformat1') === 1 || Cookies.get('usageformat1') === "1"){
                setStartError(2);
            }else{
                setStartError(1);
            }
        }, 500); 
    }, []);

    const columns = useMemo(
        () => [
            {Header: 'subid',accessor: 'subid',},
            {Header: 'รหัสวิชา',accessor: 'subjectid', },
            {Header: 'ชื่อวิชา',accessor: 'subjectname', },
            {Header: 'ปีการศึกษา',accessor: 'year', },
            {Header: 'เทอม',accessor: 'semester',},
            {Header: 'statussubject',accessor: 'statussubject',},
            {Header: 'deletetimesubject',accessor: 'deletetimesubject', },
            {Header: 'createtimesubject',accessor: 'createtimesubject', },
            {Header: 'userid',accessor: 'userid',},
        ],
        []
    );


    return(

        <div className='content'>
        <main>
            <div className='box-content'>
                {StartError === 0 || StartError === 1 ? 
                    StartError === 0 ? 
                        <div className='box-content-view'>
                            <div className='bx-topic light '>
                                <div className='skeleton-loading'>
                                    <div className='skeleton-loading-topic'></div>
                                </div> 
                            </div>
                            <div className='bx-details light '>
                                <div className='skeleton-loading'>
                                    <div className='skeleton-loading-content'></div>
                                </div> 
                            </div>
                        </div>
                    :
                        <div className='box-content-view'>
                            <div className='bx-topic light'>เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง</div>
                            <div className='bx-details light'><h2>Not Found</h2></div>
                        </div>
                :
                    null
                }
                <div className={StartError === 2 ?'box-content-view':'box-content-view none'}>
                    <div className='bx-topic light'>
                        <p><Link to="/Subject">จัดการรายวิชา</Link> / รายวิชาทั้งหมด</p>
                        <div className='bx-grid2-topic'>
                            <h2>รายวิชาทั้งหมด<Alertmanual name={"subject"} status={"1"}/></h2>
                            <div className='flex-end'>
                                <Link to="/CreateSubject">
                                    <p className='button-create'><FontAwesomeIcon icon={faSquarePlus} />สร้างรายวิชา</p>
                                </Link>
                            </div>
                        </div> 
                    </div>
                    <div className='bx-details light'>
                        <TableSubject columns={columns}/>
                    </div>
                </div>
            </div>
        </main>
    </div>
        
    );

}

export default AppSubject;