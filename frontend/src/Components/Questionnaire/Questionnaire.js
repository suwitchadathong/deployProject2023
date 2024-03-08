import {
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useMemo, useEffect } from 'react';
import ToolTableQuestionaire from "../Tools/ToolTableQuestionaire";
import Alertmanual from "../Tools/ToolAlertmanual";

function AppQuestionnaire(){
    const [StartError, setStartError] = useState(0);
    useEffect(() => {
      
        setTimeout(() => {
          setStartError(2);
        }, 500); 
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: 'quesheetid',
                accessor: 'quesheetid', // Replace with your data key
            },
            {
                Header: 'ชื่อแบบสอบถาม',
                accessor: 'quesheetname', // Replace with your data key
            },
            {
                Header: 'ชื่อหัวข้อแบบสอบถาม',
                accessor: 'quesheettopicname', // Replace with your data key
            },
            {
                Header: 'deletetimequesheet',
                accessor: 'deletetimequesheet', // Replace with your data key
            },

            // Add more columns as needed
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
                        <p><Link to="/Questionnaire">จัดการแบบสอบถาม</Link> / แบบสอบถามทั้งหมด</p>
                        <div className='bx-grid2-topic'>
                            <h2>แบบสอบถาม <Alertmanual name={"questionnaire"} status={"1"}/></h2>
                            <div className='flex-end'>
                                <Link to="/CreateQuestionnaire">
                                    <p className='button-create'><FontAwesomeIcon icon={faSquarePlus} />สร้างแบบสอบถาม</p>
                                </Link>
                            </div>
                           
                        </div> 
                    </div>
                    <div className='bx-details light'> 
                        <ToolTableQuestionaire columns={columns} />
                    </div>
                </div>
            </div>
        </main>
    </div>

    );

}

export default AppQuestionnaire;