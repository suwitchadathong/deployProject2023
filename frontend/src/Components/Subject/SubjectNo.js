import {
    Link
} from "react-router-dom";
import React, { useState,useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import TableSubjectNo from "../Tools/ToolsTableSubjectNo";
import {variables} from "../../Variables";
import Alertmanual from "../Tools/ToolAlertmanual";
function AppSubjectNo(){
    const { id } = useParams(); 
    const [SubjectID, setSubjectID] = useState('');
    const [SubjectName, setSubjectName] = useState('');
    const [Semester, setSemester] = useState('');
    const [Year,setYear] = useState('');

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataSubject = async () => {
        try{
            fetch(variables.API_URL+"subject/detail/"+id+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    if(result.err !== undefined){
                        setStartError(1);
                    }else{
                        setSubjectID(result.subjectid)
                        setSubjectName(result.subjectname)
                        setSemester(result.semester)
                        setYear(result.year)
                    }
                }
            )
        }catch (err) {
            setSubjectID('')
            setSubjectName('')
            setSemester('')
            setYear('')
        }
        
    };
    const setStartError2 = (e) => {
        setStartError(2);
    }
    if(Start === 0){
        fetchDataSubject();
        setStart(1);
        setTimeout(function() {
            setStartError2()
        }, 800);
    }

    const columns = useMemo(
        () => [
        {Header: 'examid',accessor: 'examid',},
        {Header: 'ชื่อการสอบ', accessor: 'examname', },
        {Header: 'การสอบครั้งที่',accessor: 'examno', },
        {Header: 'จำนวนข้อสอบ',accessor: 'numberofexams', },
        {Header: 'จำนวนชุดข้อสอบ',accessor: 'numberofexamsets', },
        // {Header: 'answersheetformat',accessor: 'answersheetformat', },
        // {Header: 'imganswersheetformat_path',accessor: 'imganswersheetformat_path', },
        // {Header: 'std_csv_path',accessor: 'std_csv_path', },
        // {Header: 'sequencesteps',accessor: 'sequencesteps', },
        // {Header: 'showscores',accessor: 'showscores', },
        // {Header: 'sendemail',accessor: 'sendemail', },
        // {Header: 'statusexam',accessor: 'statusexam', },
        {Header: 'deletetimeexam',accessor: 'deletetimeexam', },
        // {Header: 'createtimeexam',accessor: 'createtimeexam', },
        {Header: 'subid',accessor: 'subid', },
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
                        <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / {SubjectName}</p>
                        <div className='bx-grid2-topic'>
                            <h2>{SubjectName}<Alertmanual name={"subjectno"} status={"1"}/></h2>
                        </div> 
                    </div>
                    <div className='bx-details light'>
                    
                        <div className="bx-grid2-detail-topic">
                            <div className="bx-details-items">
                                <div className="bx-bx-topic">
                                    ข้อมูลรายวิชา
                                </div>
                                <div className="bx-bx-details">
                                    <div className="bx-details-box inline-grid"><p className="text-overflow">รหัสวิชา : {SubjectID}</p></div>
                                    <div className="bx-details-box inline-grid "><p className="text-overflow">วิชา : {SubjectName}</p></div>
                                    <div className="bx-details-box inline-grid"><p className="text-overflow">ปีการศึกษา : {Year}</p></div>
                                    <div className="bx-details-box inline-grid"><p className="text-overflow">เทอม : {Semester}</p></div>
                                </div>
                            </div>
                            
                            <div className='bx-item-bottom'>
                                <Link to={'/Subject/SubjectNo/CreateExam/'+id}>
                                <p className='button-create'><FontAwesomeIcon icon={faSquarePlus} />สร้างการสอบ</p>
                                </Link>
                            </div>
                        </div>
                        <div className="pdb5px"></div>
                        <div>
                            <TableSubjectNo columns={columns}/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    );

}

export default AppSubjectNo;