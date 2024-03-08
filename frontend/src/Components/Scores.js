import Cookies from 'js-cookie';
import '../Style/Style.css'
import React, { useState} from 'react';
import { variables } from "../Variables";
import {
    Link
} from "react-router-dom";
import Alertmanual from './Tools/ToolAlertmanual';
function AppScores(){
    
    const [data, setdata] = useState([]);
    const [dataExam, setdataExam] = useState([]);
    const [dataSubject, setdataSubject] = useState([]);


    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataDetailByEmail = async () => {
        try{
            fetch(variables.API_URL+"examinformation/detail/email/"+Cookies.get('email')+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log("DetailByEmail",result)
                    setdata(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setdata([])
        }
    };
    const fetchDataexam = async () => {
        try{
            fetch(variables.API_URL+"exam/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log("exam",result)
                    setdataExam(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setdataExam([])
        }
    };
    const fetchDataSubject = async () => {
        try{
            fetch(variables.API_URL+"subject/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log("Subject",result)
                    setdataSubject(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setdataSubject([])
        }
    };
    if(Start === 0){
        fetchDataDetailByEmail();
        fetchDataexam();
        fetchDataSubject();
        setStart(1);
        setTimeout(function() {
            setStartError(2);
        }, 800);

    }

    function findSubject(inputExamId,format) {
        if(dataExam.length >= 1 && dataSubject.length>=1){
            const foundExam = dataExam.find(exam => exam.examid === inputExamId);
            if(foundExam){
                const foundSubject = dataSubject.find(subject => subject.subid === foundExam.subid);
                if(format === "subjectname"){
                    return foundSubject.subjectname
                }else if(format === "subjectid"){
                    return foundSubject.subjectid
                }else{
                    return foundSubject.subjectid
                }
                
            }else{
                return null
            }
        }else{
            return null
        }
    }
    function findExam(inputExamId,format) {
        if(dataExam.length >= 1 && dataSubject.length>=1){
            const foundExam = dataExam.find(exam => exam.examid === inputExamId);
            if(foundExam){
                if(format === "examname"){
                    return foundExam.examname
                }else if(format === "examno"){
                    return foundExam.examno
                }else{
                    return foundExam.examname
                }
            }else{
                return null
            }
        }else{
            return null
        }
    }
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
                            <p>ดูคะแนนสอบ /</p>
                            <h2>ดูคะแนนสอบ <Alertmanual name={"scores"} status={"1"}/></h2>  
                        </div>
                        <div className='bx-details light'>
                            {/* style inline */}
                            <div className="bx-scores-content">
                                {Array.isArray(data) && data.length >= 1 ? (
                                    data.map((examinfo, index) => (
                                        <div className="bx-show" key={examinfo.examinfoid}>
                                            <Link to={'/Scores/ShowScores/'+examinfo.examinfoid}>
                                                <div className="box">
                                                    <div className="box-img">
                                                        <p>
                                                            <span> รหัสวิชา : {findSubject(examinfo.examid,"subjectid")}</span>
                                                        </p>
                                                        <p>
                                                            <span> วิชา : {findSubject(examinfo.examid,"subjectname")}</span>
                                                        </p>
                                                        <p>
                                                            <span> ชื่อการสอบ : {findExam(examinfo.examid,"examname")}</span>
                                                        </p>
                                                        <p>
                                                            <span> การสอบครั้งที่ : {findExam(examinfo.examid,"examno")}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : <div className='center'>ไม่พบข้อมูลการสอบ</div>}
                            </div>
                            {/* style inline */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppScores;