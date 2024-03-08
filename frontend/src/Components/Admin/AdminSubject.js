import {
    Link
} from "react-router-dom";
import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import TableAdminSubject from "../Tools/ToolsAdminSubject";
import Alertmanual from "../Tools/ToolAlertmanual";

function AppAdminSubject(){

    const [StartError, setStartError] = useState(0);
    useEffect(() => {
      
        setTimeout(() => {
          setStartError(2);
        }, 500); 
    }, []);

    const columns = useMemo(
        () => [
            {Header: 'ID รายวิชา',accessor: 'subid',},
            {Header: 'ผู้ใช้',accessor: 'userid',},
            {Header: 'ผู้ใช้',accessor: 'useridUpdate',},
            {Header: 'รหัสวิชา',accessor: 'subjectid', },
            {Header: 'ชื่อวิชา',accessor: 'subjectname', },
            {Header: 'ปีการศึกษา',accessor: 'year', },
            {Header: 'เทอม',accessor: 'semester',},
            {Header: 'statussubject',accessor: 'statussubject',},
            {Header: 'deletetimesubject',accessor: 'deletetimesubject', },
            {Header: 'createtimesubject',accessor: 'createtimesubject', },
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
                        <p><Link to="/Admin/AdminSubject">จัดการรายวิชา</Link> / รายวิชาทั้งหมด</p>
                        <div className='bx-grid-topic'>
                            <h2>รายวิชาทั้งหมด<Alertmanual name={"adminsubject"} status={"1"}/></h2>
                            {/* <div className='flex-end'>
                                <Link to="/CreateSubject">
                                    <p className='button-create'><FontAwesomeIcon icon={faSquarePlus} />สร้างรายวิชา</p>
                                </Link>
                            </div> */}
                        </div> 
                    </div>
                    <div className='bx-details light'>
                        <TableAdminSubject columns={columns}/>
                    </div>
                </div>
            </div>
        </main>
    </div>
        
    );

}

export default AppAdminSubject;