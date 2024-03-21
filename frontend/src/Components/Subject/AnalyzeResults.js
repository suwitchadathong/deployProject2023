import {
    Link
} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { variables } from "../../Variables";
import Cookies from "js-cookie";

import Chart from 'chart.js/auto';
import {Bar} from "react-chartjs-2";
import AnalyzeResultsCSV from "../Tools/AnalyzeResultsCSV";
import Alertmanual from "../Tools/ToolAlertmanual";
function AppAnalyzeResults() {
    const { id } = useParams();
    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');
    const [selectedValue, setSelectedValue] = useState('1');
    const [numberofexams, setnumberofexams] = useState('');
    const [numberofexamsets, setnumberofexamsets] = useState('');

    const [data, setdata] = useState([]);

    const [csvPathsArray, setcsvPathsArray] = useState('');

    const [Step, setStep] = useState(0);
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);
    
    const handleChange = (event) => {setSelectedValue(event.target.value);};

    const fetchDataExaminfo = async () => {
        try {
            const response = await fetch(variables.API_URL + "exam/detail/" + id + "/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });
            const result = await response.json();
    
            if (result.err !== undefined) {
                setStartError(1);
            } else {
                setExamNo(result.examno);
                setExamNoShow(result.examid);
                setsubid(result.subid);
                setnumberofexams(result.numberofexams)
                setnumberofexamsets(result.numberofexamsets)
                setcsvPathsArray(result.analysis_csv_path.split(","))
                
            }
            const subjectResponse = await fetch(variables.API_URL + "subject/detail/" + result.subid + "/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });
            const subjectResult = await subjectResponse.json();
            if (subjectResult.err !== undefined) {
                setStartError(1);
            } else {
                setsubjectname(subjectResult.subjectname);
            }
        } catch (err) {
            setStartError(1);
        }
    }
    const fetchDataExamInfoDetail = async () => {
        try{
            fetch(variables.API_URL+"examinformation/detail/exam/"+id+"/", {
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
                        setdata(result.non_duplicate_records)
                    }
                }
            )
        }catch (err) {
            setdata([])
        }

    }; 
    if (Start === 0) {
        fetchDataExaminfo();
        fetchDataExamInfoDetail();
        setStart(1);
        setTimeout(function() {
            setStartError(2)
        }, 800);
    }
    useEffect(() => {
        if(csvPathsArray.length >= 1){
            setStep(1)
        }
    }, [csvPathsArray]);
    
    function generateNumberArray(n) {
        return Array.from({ length: n }, (_, i) => i + 1);
    }
    function generateCorrect(data, set) {
        let result = Array(numberofexams).fill(0)
        for (let i = 0; i < data.length; i++) {
            if (data[i].setexaminfo === set) {
                let itemanalysis = data[i].itemanalysis.split(",")
                for (let ii = 0; ii< numberofexams; ii++) {
                    if(itemanalysis[ii] === 1 || itemanalysis[ii] === "1"){
                        result[ii] += 1
                    }
                }
            }
        }
        return result;
    }
    function generateWrong(data, set) {
        let result = Array(numberofexams).fill(0)
        for (let i = 0; i < data.length; i++) {
            if (data[i].setexaminfo === set) {
                let itemanalysis = data[i].itemanalysis.split(",")
                for (let ii = 0; ii< numberofexams; ii++) {
                    if(itemanalysis[ii] === 0 || itemanalysis[ii] === "0"){
                        result[ii] += 1
                    }
                }
            }
        }
        return result;
    }
    function studentspergradeAll(data) {
        let scoreall = []
        for (let i = 0; i < data.length; i++) {
            if(data[i].score === null || data[i].score === ''){

            }else{
                scoreall.push(data[i].score)
            }
        }
        let uniqueValuesSet = new Set(scoreall);
        let uniqueValuesArray = Array.from(uniqueValuesSet);
        uniqueValuesArray.sort((a, b) => a - b);
        return uniqueValuesArray;
    }
    function Numberofstudentspergrade(data) {
        let result = []
        let scoreall = []
        for (let i = 0; i < data.length; i++) {
            if(data[i].score === null || data[i].score === ''){

            }else{
                scoreall.push(data[i].score)
            }
        }
  
        let uniqueValuesSet = new Set(scoreall);
        let uniqueValuesArray = Array.from(uniqueValuesSet);
        uniqueValuesArray.sort((a, b) => a - b);

        result = Array(uniqueValuesArray.length).fill(0)

        for (let i = 0; i < scoreall.length; i++) {
            for (let ii = 0; ii < uniqueValuesArray.length; ii++) {
                if(scoreall[i] === uniqueValuesArray[ii]){
                    result[ii] += 1
                }
            }
        }

        return result;
    }
    return (
        <div className='content'>
            <main>
                <div className='box-content'>
                    {/* Error Handling and Loading */}
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
                    {/* Render Chart based on selected option */}
                    <div className={StartError === 2 ? 'box-content-view' : 'box-content-view none'}>
                        <div className='bx-topic light'>
                        {Cookies.get('typesid') === 1 || Cookies.get('typesid') === '1'?
                            <p><Link to="/Admin/AdminSubject">จัดการรายวิชา</Link> / <Link to="/Admin/AdminSubject">รายวิชาทั้งหมด</Link> / <Link to={"/Admin/AdminSubject/SubjectExam/"+subid}>{subjectname}</Link> / <Link to={"/Admin/AdminSubject/SubjectExam/Exam/"+ExamNoShow}>การสอบครั้งที่ {ExamNo} </Link> /  วิเคราะห์ผล</p>
                            :
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link>/ วิเคราะห์ผล</p>
                        }
                            <div className='bx-grid2-topic'>
                                <h2>แสดงผลการวิเคราะห์<Alertmanual name={"analyzeresults"} status={"1"}/></h2>
                            </div>
                        </div>
                        <div className='bx-details light'>
                            <div className="bx-input-fix">
                                <select value={selectedValue} onChange={handleChange} style={{ width: '230px' }}>
                                    {/* <option value="1"></option> */}
                                    {/* <option value="">กรุณาเลือกผลการวิเคราะห์</option> */}
                                    <option value="1">จำนวนนักเรียนต่อคะแนน</option>
                                    <option value="2">จำนวนนักเรียนที่ตอบถูกในแต่ละข้อ (แต่ละชุดข้อสอบ)</option>
                                    <option value="3">จำนวนนักเรียนที่ตอบผิดในแต่ละข้อ (แต่ละชุดข้อสอบ)</option>
                                    <option value="4">ItemAnalysis</option>
                                </select>
                            </div>
                            {selectedValue === '1' ?

                                <div className="AnalyzeResultsCSV2g">
                                    <div className="writing-mode">นักเรียน</div>
                                    <div>
                                        <Bar 
                                            data={{
                                                labels: studentspergradeAll(data),
                                                datasets: [
                                                    {
                                                        label: "จำนวนนักเรียนต่อคะแนน",
                                                        data: Numberofstudentspergrade(data),
                                                        backgroundColor: [
                                                            'rgba(255, 205, 86, 0.8)',
                                                        ]
                                                    },
                                                ],  
                                            }}
                                            options={{
                                                plugins: {
                                                    tooltip: {
                                                        callbacks: {
                                                            labels:function(context) {
                                                                return + context.labels.y +' คะแนน';
                                                            },
                                                            label: function(context) {
                                                                return 'จำนวน ' + context.parsed.y +' คน';
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                            // options={{
                                            //     scales: {
                                            //         x: {
                                            //             title: {
                                            //                 display: true,
                                                            
                                            //                 text: 'ข้อ'
                                            //             }
                                            //         },
                                            //         y: {
                                            //             title: {
                                            //                 display: true,
                                            //                 text: 'จำนวนนักเรียนที่ตอบถูก'
                                            //             }
                                            //         }
                                            //     }
                                            // }}
                                        />
                                        <p className="center">คะแนน </p>
                                    </div>
                                </div>
                            :null}
                            
                            {selectedValue === '2' ?
                                 Array.from({ length: numberofexamsets }, (_, index) => (
                                    <div key={index} className="AnalyzeResultsCSV2g">
                                        <div className="writing-mode">นักเรียน</div>
                                        <div>
                                            <h3>ชุดข้อสอบที่ {index+1}</h3>
                                            <Bar 
                                                data={{
                                                    labels: generateNumberArray(numberofexams),
                                                    datasets: [
                                                        {
                                                            label: "จำนวนนักเรียนที่ตอบถูก",
                                                            data: generateCorrect(data, index+1),
                                                            backgroundColor: [
                                                                'rgba(75, 192, 192, 0.8)',
                                                            ]
                                                        },
                                                    ],  
                                                }}
                                            />
                                            <p className="center">ข้อ </p>
                                        </div>
                                    </div>
                                ))
                            :null}
                            
                            {selectedValue === '3' ?
                                 Array.from({ length: numberofexamsets }, (_, index) => (
                                    <div key={index} className="AnalyzeResultsCSV2g">
                                        <div className="writing-mode">นักเรียน</div>
                                        <div>
                                            <h3>ชุดข้อสอบที่ {index+1}</h3>
                                            <Bar 
                                                data={{
                                                    labels: generateNumberArray(numberofexams),
                                                    datasets: [
                                                        {
                                                            label: "จำนวนนักเรียนที่ตอบผิด",
                                                            data: generateWrong(data, index+1),
                                                            backgroundColor: [
                                                                'rgba(255, 99, 132, 0.8)',
                                                            ]
                                                        },
                                                    ],  
                                                }}
                                            />
                                            <p className="center">ข้อ </p>
                                        </div>
                                    </div>
                                ))
                            :null}
                            {selectedValue === '4' &&
                                (Step === 1 &&
                                    csvPathsArray.map((path, index) => (
                                        <div key={index}>
                                            <h3>ชุดข้อสอบที่ {index+1}</h3>
                                            <div key={index}><AnalyzeResultsCSV url={path}/></div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AppAnalyzeResults;
