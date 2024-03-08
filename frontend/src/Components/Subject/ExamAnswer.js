import {
    Link
} from "react-router-dom";
import React, { useState, useMemo } from 'react';
import TableExamAnswer from "../Tools/ToolsTableExamAnswer";
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Alertmanual from "../Tools/ToolAlertmanual";
// import Swal from 'sweetalert2'
function AppExamAnswer(){
    const { id } = useParams();
    const [NameExam, setNameExam] = useState('');
    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [NumExam, setNumExam] = useState('');
    const [SetExam, setSetExam] = useState('');
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);
    
    const fetchDataUpdateExam = async () => {
        try{
            fetch(variables.API_URL+"exam/detail/"+id+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    if(result.err !== undefined){
                        setStartError(1);
                    }
                    setNameExam(result.examname)
                    setExamNo(result.examno)
                    setExamNoShow(result.examid)
                    setNumExam(result.numberofexams)
                    setSetExam(result.numberofexamsets)
                    setsubid(result.subid)
                    fetch(variables.API_URL+"subject/detail/"+result.subid+"/", {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        })
                        .then(response => response.json())
                        .then(result => {
                            // console.log(result)
                            setsubjectname(result.subjectname)
                            // setStartError(2);
                        }
                    )
                }
            )
        }catch (err) {
            // console.error(err)
            setStartError(1);
        }
    };
    const setStartError2 = (e) => {
        setStartError(2);
    }
    if(Start === 0){
        // fetchDataExamAnswer();
        fetchDataUpdateExam();
        setStart(1);
        setTimeout(function() {
            setStartError2()
        }, 800);
    }
    const columns = useMemo(
        () => [
            {Header: 'examanswersid',accessor: 'examanswersid',},
            {Header: 'ชุดข้อสอบ', accessor: 'examnoanswers', },
            {Header: 'scoringcriteria',accessor: 'scoringcriteria', },
            {Header: 'choiceanswers',accessor: 'choiceanswers', },
            {Header: 'papeans_path',accessor: 'papeans_path', }
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
                    ''
                }
                <div className={StartError === 2 ?'box-content-view ' : 'box-content-view none'} >
                    <div className='bx-topic light'>
                        <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link> / เฉลยคำตอบ</p>
                        <div className='bx-grid2-topic'>
                            <h2>เฉลยคำตอบ<Alertmanual name={"examanswers"} status={"1"}/></h2>                           
                        </div> 
                    </div>
                    <div className='bx-details light'>
                    <div className="bx-grid-detail-topic">
                        <div className="bx-details-items">
                            <div className="bx-bx-topic">
                                ข้อมูลการสอบ
                            </div>
                            <div className="bx-bx-details">
                                <div className="bx-details-box inline-grid"><p className="text-overflow">การสอบครั้งที่ : {ExamNo}</p></div>
                                <div className="bx-details-box inline-grid "><p className="text-overflow">ชื่อการสอบ : {NameExam}</p></div>
                                <div className="bx-details-box inline-grid"><p className="text-overflow">จำนวนข้อสอบ : {NumExam}</p></div>
                                <div className="bx-details-box inline-grid"><p className="text-overflow">จำนวนชุดข้อสอบ : {SetExam}</p></div>
                            </div>
                        </div> 

                    </div>
                        <div className="space10"></div>
                        <div className="fb">ตารางสร้างเฉลย</div>
                            <TableExamAnswer columns={columns} examnoanswers={SetExam} />
                    </div>
                </div>
            </div>
        </main>
    </div>

    );

}

export default AppExamAnswer;