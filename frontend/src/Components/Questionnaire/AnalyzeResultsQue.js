import {
    Link
} from "react-router-dom";
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import QuePart1 from "../Tools/QuePart1";
import QuePart2 from "../Tools/QuePart2";
import Alertmanual from "../Tools/ToolAlertmanual";

function AppAnalyzeResultsQue(){
    const { id } = useParams();

    const [dataque, setdataque] = useState('');
    const [QueSheetName, setQueSheetName] = useState('');
    const [resultpart1_csv_path, setresultpart1_csv_path] = useState('');
    const [resultpart2_csv_path, setresultpart2_csv_path] = useState('');
    const [Steppart1, setSteppart1] = useState('');
    const [Steppart2, setSteppart2] = useState('');

    const [Stepdataque, setStepdataque] = useState(0);
    const [part1select, setpart1select] = useState(0);
    const [part2select, setpart2select] = useState(0);
    const [part3select, setpart3select] = useState(0);
    
    const handlepart1select = (event) => {
        setpart1select(event.target.value);
    };
    const handlepart2select = (event) => {
        setpart2select(event.target.value);
    };
    const handlepart3select = (event) => {
        setpart3select(event.target.value);
    };

    const [showChart, setshowChart] = useState(false);

    const handleshowChart = () => {
        setshowChart(!showChart);
    };
    const [quesheetinfo, setquesheetinfo] = useState('');

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataquesheet = async () => {
        try{
            fetch(variables.API_URL+"quesheet/detail/"+id+"/", {
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
                        setQueSheetName(result.quesheetname)
                        setresultpart1_csv_path(result.resultpart1_csv_path.split(','))
                        setresultpart2_csv_path(result.resultpart2_csv_path.split(','))
                    }
                   
                }
            )
            fetch(variables.API_URL+"queheaddetails/detail/"+id+"/", {
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
                    }
                    
                }
            )
            fetch(variables.API_URL+"quetopicdetails/detail/"+id+"/", {
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
                    }
                }
            )
        }catch (err) {
            setStartError(1);
           
        }
    };
    const fetchDataquesheetinfo = async () => {
        try{
            fetch(variables.API_URL+"queinformation/detail/quesheet/"+id+"/", {
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
                        setdataque(result)
                        setquesheetinfo(result)
                    }
                    
                }
            )
            
        }catch (err) {
            setStartError(1);
           
        }
    };

    if(Start === 0){
        fetchDataquesheet();
        fetchDataquesheetinfo();
        setStart(1);
        setTimeout(() => {
                setStartError(2);
        }, 500); 
    }
    useEffect(() => {
        if(resultpart1_csv_path.length >= 1){
            setpart1select(resultpart1_csv_path[0])
            setSteppart1(1)
        }
        if(resultpart2_csv_path.length >= 1){
            setpart2select(resultpart2_csv_path[0])
            setpart3select(FromURL(resultpart2_csv_path[0]))
            setSteppart2(1)
        }
        if(dataque.length >= 1){
            setStepdataque(1)
        }
    }, [resultpart1_csv_path,resultpart2_csv_path,dataque]);

    function FromURL(url) {
        if(url === null || url === ''){
            return ""
        }
        const parts = url.split('/');
        const filenameWithSpaces = parts[parts.length - 1];
        if(filenameWithSpaces === "result_part1_All.csv" || filenameWithSpaces === "result_part2_All.csv"){
            return "สรุปผลรวม"
        }else if(filenameWithSpaces === "result_part1_Online.csv" || filenameWithSpaces === "result_part2_Online.csv"){
            return "รูปแบบออนไลน์"
        }else if(filenameWithSpaces === "result_part1_Offline.csv" || filenameWithSpaces === "result_part2_Offline.csv"){
            return "รูปแบบออฟไลน์"
        }
        const decodedFilename = decodeURIComponent(filenameWithSpaces);
        return decodedFilename;
    }

    const handleDownload = () => {
        const filePath = part1select;
        const link = document.createElement('a');
        link.href = process.env.PUBLIC_URL + filePath;
        link.download = 'result_student_list.csv';
        link.click();
    };
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
                    {Cookies.get('typesid') === 1 || Cookies.get('typesid') === '1'?
                            <p><Link to="/Admin/AdminQuestionnaire">จัดการแบบสอบถาม</Link> / <Link to={"/Admin/AdminQuestionnaire"}>แบบสอบถามทั้งหมด</Link> / <Link to={"/Admin/AdminQuestionnaire/QuestionnaireNo/"+id}>{QueSheetName}</Link> / สรุปผลแบบสอบถาม</p>
                        :
                            <p><Link to="/Questionnaire">จัดการแบบสอบถาม</Link> / <Link to={"/Questionnaire/"}>แบบสอบถามทั้งหมด</Link> / <Link to={"/Questionnaire/QuestionnaireNo/"+id}>{QueSheetName}</Link> / สรุปผลแบบสอบถาม</p>
                    }
                    <div className='bx-grid-topic'>
                            <h2>สรุปผลแบบสอบถาม <Alertmanual name={"analyzeresultsque"} status={"1"}/></h2>  
                        </div> 
                    </div>
                    
                    <div className='bx-details light'>
                    <div className="bx-input-fix">
                        <span className="flex">
                            <input className="mgR10" style={{minWidth:25}} value="" type="checkbox" checked={showChart} onChange = {handleshowChart} />แสดงข้อมูลเพิ่มเติมในรูปแบบแผนภูมิ
                        </span>
                    </div>
                    <div>
                    {Steppart1 === 1 &&
                        (part1select ? (
                            <div className="bx-button" style={{ display: 'grid' }}>
                                <div className="button-download center" onClick={handleDownload}>
                                    ดาวน์โหลดข้อมูลสรุปผล
                                </div>
                            </div>
                        ) : null)
                    }

                    </div>
                    <div>ส่วนที่ 1 ข้อมูลทั่วไป</div>
                    {Steppart1 === 1 && Stepdataque === 1?(
                        <div>
                           
                            <div className="bx-input-fix">
                                <select id="mySelect" value={part1select} onChange={handlepart1select} style={{ width: '150px' }}>
                                    {resultpart1_csv_path.map((path, index) => (
                                        <option key={index} value={path}>{FromURL(path)}</option>
                                    ))}
                                </select>
                                <div><QuePart1 url={part1select} showChart={showChart} data={dataque} status={FromURL(part1select)} /></div>
                            </div>
                          
                        </div>
                    ) : null}

                    
                    <div>ส่วนที่ 2 ระดับความคิดเห็นของแบบสอบถาม</div>
                        {Steppart2 === 1 &&
                            <div className="bx-input-fix">
                                <select id="mySelect" value={part2select} onChange={handlepart2select} style={{ width: '150px' }}>
                                {
                                    resultpart2_csv_path.map((path, index) => (
                                        <option key={index} value={path}>{FromURL(path)}</option>
                                    ))
                                }
                                </select>
                                <div ><QuePart2 url={part2select} showChart={showChart}/></div>
                            </div>
                        }
                    <div>ส่วนที่ 3 ข้อเสนอแนะเพิ่มเติม</div>
                    
                    {quesheetinfo.length !== 0 ? (
                        <>
                        {Steppart2 === 1 &&
                            <div className="bx-input-fix">
                                <select id="mySelect" value={part3select} onChange={handlepart3select} style={{ width: '150px' }}>
                                {
                                    resultpart2_csv_path.map((path, index) => (
                                        <option key={index} value={FromURL(path)}>{FromURL(path)}</option>
                                    ))
                                }
                                </select>
                            </div>
                        }
                            <div className="tableAnalyze">  
                                <table className="">
                                    <thead>
                                        <tr>
                                            <th className="">ข้อเสนอแนะเพิ่มเติม</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quesheetinfo.map((value, index) => {
                                            if ((part3select === 'รูปแบบออฟไลน์' || part3select === 'สรุปผลรวม') && value.status_queinfo === "Offline" && value.additionalsuggestions) {
                                                return (
                                                    <tr key={index}>
                                                        <td><img src={value.additionalsuggestions} alt="Description of the image" /></td>
                                                    </tr>
                                                );
                                            } else if ((part3select === 'รูปแบบออนไลน์' || part3select === 'สรุปผลรวม') && value.status_queinfo === "Online" && value.additionalsuggestions) {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.additionalsuggestions}</td>
                                                    </tr>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : null}
                    </div>
                </div>
            </div>
        </main>
    </div>

    );

}

export default AppAnalyzeResultsQue;