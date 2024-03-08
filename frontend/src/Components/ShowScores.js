import '../Style/Style.css'
import React, { useState} from 'react';
import { variables } from "../Variables";
import {
    Link
} from "react-router-dom";
import { useParams } from 'react-router-dom';

function AppShowScores(){

    const { id } = useParams();

    const [data, setdata] = useState([]);
    const [dataExam, setdataExam] = useState([]);
    const [dataExamanswers, setdataExamanswers] = useState([]);
    const [dataSubject, setdataSubject] = useState([]);
    

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataDetailByEmail = async () => {
        try{
            fetch(variables.API_URL+"examinformation/detail/"+id+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log("examinformation",result)
                    setdata(result)
                }
            )
        }catch (err) {
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
    const fetchDataexamanswers = async () => {
        try{
            fetch(variables.API_URL+"examanswers/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log("examanswers",result)
                    setdataExamanswers(result)
                }
            )
        }catch (err) {
            setdataExamanswers([])
        }
    };
    if(Start === 0){
        fetchDataDetailByEmail();
        fetchDataexam();
        fetchDataSubject();
        fetchDataexamanswers();
        setStart(1);
        setTimeout(function() {
            setStartError(2);
        }, 800);

    }

    function findSubject(inputExamId,format) {
        try{
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
        }catch(err){
            return null
        }
    }
    function findExam(inputExamId,format) {
        try{
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
        }catch(err){
            return null
        }
    }
    function findExamanswers(inputExamId,setexaminfo) {
        try{
            if(dataExam.length >= 1 && dataExamanswers.length>=1){
                const foundExam = dataExam.find(exam => exam.examid === inputExamId);
                const foundExamanswers = dataExamanswers.find(answers => answers.examid === foundExam.examid && parseInt(answers.examnoanswers,10) === parseInt(setexaminfo));
                
                const resultArray = foundExamanswers.scoringcriteria.split(",");
                let sum = 0;
                for (let i = 0; i < resultArray.length; i++) {
                    const resultArrayRemove =  resultArray[i].split(":");
                    const thirdCharacter = parseInt(resultArrayRemove[2]); // Parse the third character as an integer
                    sum += thirdCharacter; // Add the parsed value to the sum
                }
                return sum

            }else{
                return null
            }
        }catch(err){
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
                            <p><Link to='/Scores'>ดูคะแนนสอบ</Link> / {findSubject(data.examid,"subjectname")}</p>
                            <h2>ดูคะแนนสอบ</h2>  
                        </div>
                        <div className='bx-details light'>
                            {/* style inline */}
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 780 ? 'auto' : '50% auto', gridGap: '10px' }}>
                                    <div style={{ display: 'inline', padding: '0px', border: '1px solid #DDDDDD', borderRadius: '10px'}}>
                                        <p style={{textAlign: 'center',padding: '10px',background:'#C0DDFF',borderRadius:'10px 10px 0px 0px'}}><b>ข้อมูลการสอบ</b></p>
                                        <div style={{ padding: '10px'}}>
                                            <p>วิชา : {findSubject(data.examid,"subjectname")}</p>
                                            <p>รหัสวิชา : {findSubject(data.examid,"subjectid")}</p>
                                            <p>ชื่อการสอบ : {findExam(data.examid,"examname")}</p>
                                            <p>การสอบครั้งที่ : {findExam(data.examid,"examno")}</p>
                                            <p>รหัสนักศึกษา : {data.stdid}</p>
                                        </div>
                                        
                                    </div>
                                    <div style={{padding: '0px', border: '1px solid #DDDDDD', borderRadius: '10px'}}>
                                        <p style={{textAlign: 'center',padding: '10px',background:'#C0DDFF',borderRadius:'10px 10px 0px 0px'}}><b>คะแนนการสอบ</b></p>
                                        <div style={{ padding: '10px',display : 'grid', height: '70%', alignContent:'center'}}>
                                            <p style={{textAlign: 'center'}}> คะแนนที่ได้ /  คะแนนเต็ม</p>
                                            <h2 style={{textAlign: 'center' }}>{data.score} / {findExamanswers(data.examid,data.setexaminfo)}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* style inline */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppShowScores;