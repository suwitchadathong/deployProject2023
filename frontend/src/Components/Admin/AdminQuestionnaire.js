import {
    Link
} from "react-router-dom";
import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import TableAdminQuestionnaire from "../Tools/ToolsTableAdminQuestionnaire";
import Alertmanual from "../Tools/ToolAlertmanual";

function AppAdminQuestionnaire(){

    const [StartError, setStartError] = useState(0);
    useEffect(() => {
      
        setTimeout(() => {
          setStartError(2);
        }, 500); 
    }, []);

    const columns = useMemo(
        () => [
            {Header: 'ID แบบสอบถาม',accessor: 'quesheetid',},
            {Header: 'ผู้ใช้',accessor: 'userid', },
            {Header: 'ผู้ใช้',accessor: 'useridUpdate', },
            {Header: 'ชื่อแบบสอบถาม',accessor: 'quesheetname', },
            {Header: 'ชื่อหัวข้อแบบสอบถาม',accessor: 'quesheettopicname', },
            {Header: 'ลำดับการทำงาน',accessor: 'sequencesteps',},
            {Header: 'deletetimequesheet',accessor: 'deletetimequesheet', },
        ],[]
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
                        <p><Link to="/Admin/AdminSubject">จัดการแบบสอบถาม</Link> / แบบสอบถามทั้งหมด</p>
                        <div className='bx-grid-topic'>
                            <h2>แบบสอบถามทั้งหมด<Alertmanual name={"adminquestionnaire"} status={"1"}/></h2>
                        </div> 
                    </div>
                    <div className='bx-details light'>
                        <TableAdminQuestionnaire columns={columns}/>
                    </div>
                </div>
            </div>
        </main>
    </div>
        
    );

}

export default AppAdminQuestionnaire;