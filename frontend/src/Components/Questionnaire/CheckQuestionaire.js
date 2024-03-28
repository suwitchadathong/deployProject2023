
import {
    Link
} from "react-router-dom";
import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrashCan,faCheck,faCircleXmark,faCircleCheck,faTriangleExclamation,faPen} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
// import { SRLWrapper } from 'simple-react-lightbox';
import {variables} from "../../Variables";
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import Alertmanual from "../Tools/ToolAlertmanual";

function AppCheckQuestionaire(){
    const { id } = useParams();

    const [sequencesteps, setsequencesteps] = useState('');
    const [QueSheetName, setQueSheetName] = useState('');
    const [quesheetid, setquesheetid] = useState('');

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
                    }
                    setquesheetid(result.quesheetid)
                    setQueSheetName(result.quesheetname)
                    setsequencesteps(parseInt(result.sequencesteps, 10))
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
                        setquesheetinfo(result)
                    }
                }
            )
        }catch (err) {
            setStartError(1);
           
        }
    };
    const setStartError2 = (e) => {
        setStartError(2);
    }
    if(Start === 0){
        fetchDataquesheet();
        fetchDataquesheetinfo();
        setStart(1);
        setTimeout(function() {
            setStartError2()
        }, 800);
    }
    function extractFilenameFromURL(url) {
        if(url === null){
            return "-";
        }
        const parts = url.split('/');
        const filenameWithSpaces = parts[parts.length - 1];
        const decodedFilename = decodeURIComponent(filenameWithSpaces);
        return decodedFilename;
    }
    useEffect(() => {
        const intervalId = setInterval(fetchDataquesheet, 30000);
        return () => clearInterval(intervalId);
    }, []);
    const showCustomAlert = (dataid,type,dataimg,dataerror) => {
        const isMobile = window.innerWidth < 780;
        Swal.fire({
            title: 'แก้ไขข้อผิดพลาด  ',
            html: `
                <div class='test' style="display: ${isMobile ? 'grid' : 'flex'}; ${isMobile ? 'grid-template-columns: 1fr;' : 'justify-content: center; align-items: center;'} width: 100%;min-width: fit-content;">
                    <div style="flex: 1; text-align: center;">
                        <img src="${dataimg}" alt="Image" style="width: 496px; height: 701px;">
                    </div>
                    <div style="flex: 1; margin-left: 20px; text-align: left;"> 
                        <div style="${dataerror === 'ไม่พบข้อมูล QR Code ในแบบสอบถาม'? 'pading:10px' : 'display:none'}">
                            <label for="input2">ยืนยัน QR Code แบบสอบถาม</label>
                        </div>
                        <div style="position: relative; ${dataerror === 'ไม่พบข้อมูล QR Code ในแบบสอบถาม'? '' : 'display:none'}">
                            <input type="text" id="input2" value="${""}" class="swal2-input" style="width: 250px;margin:0px;padding-right: 40px; display:none" disabled="true">
                            <img src="/img/check.png" alt="Image" id="passTextquzid" style="width: 30px; height: 30px; right: 10px;left: 0;">
                        </div>
                        <div style=" ${type === '2' || type === '3'? '' : 'display:none'}">
                            <div>
                                <label for="fileInput">อัปโหลดไฟล์:</label> 
                            </div>
                            <div>
                                <input type="file" id="fileInput" class="swal2-file" style="width: 250px;margin:0px;">
                            </div>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: "#341699",
            confirmButtonText: 'บันทึก',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'custom-alert-popup',
            },
            preConfirm: () => {
                const input2Value = document.getElementById('input2').value;
                if(dataerror === 'ไม่พบข้อมูล QR Code ในแบบสอบถาม'){
                    if (input2Value === '') {
                        Swal.showValidationMessage('กรุณายืนยันแบบสอบถาม');
                        return false;
                    }
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if(dataerror === 'ไม่พบข้อมูล QR Code ในแบบสอบถาม'){
                    if(UpdateQueInfo(dataid)){
                        // fetchDataExamInfo();
                        Swal.fire({
                            icon: 'success',
                            title: 'แก้ไขข้อมูลเสร็จสิ้น',
                            text: '',
                        }).then(() => {
                            window.location.reload();
                        });
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'เกิดข้อผิดพลาด',
                            text: '',
                        });
                    }
                }
            }
            
        });
        document.getElementById('passTextquzid').addEventListener('click', function() {
            document.getElementById('input2').value = quesheetid;
            document.getElementById('input2').disabled = true;
            document.getElementById('input2').style.backgroundColor = '#DDDDDD';
            document.getElementById('passTextquzid').src = "/img/checkgreen.png";
        });
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if(UpdateuploadFile(file,dataid)) {
                fetchDataquesheetinfo();
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขข้อมูลเสร็จสิ้น',
                    text: '',
                }).then(() => {
                    window.location.reload();
                });
                
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาดในการแก้ไข',
                    text: '',
                });
            }
        });
    };
    async function UpdateQueInfo(dataid) {
        try{
            const response = await fetch(variables.API_URL + "queinformation/update/"+dataid+"/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    errorstype: null
                }),
            });

            const result = await response.json();
            if(result.ok){
                return true;
            }

        }catch (err) {
            return false;
        }
    }

    async function UpdateuploadFile(fileUpload,dataid) {
        try{
            const formData = new FormData();
            formData.append("file", fileUpload);
            formData.append("userid", Cookies.get('userid'));
            formData.append("quesheetid", id);
            const response = await fetch(variables.API_URL + "queinformation/update/"+dataid+"/", {
                method: "PUT",
                body: formData,
            });
            const result = await response.json();
            if(result.ok){
                return true;
            }
        }catch (err) {
            return false;
        }
    }
    const handleDelCours = async (queinfoid,namefile) => {
        Swal.fire({
            title: "ลบข้อมูลกระดาบแบบสอบถาม",
            text: `คุณต้องการลบข้อมูลเกี่ยวกับ ${namefile} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"queinformation/delete/"+queinfoid+"/", {
                        method: "DELETE",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        })
                        .then(response => response.json())
                        .then(result => {
                            Swal.fire({
                                title: result.msg+"\n",
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            fetchDataquesheetinfo();
                        }
                    )
                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบกระดาบแบบสอบถาม",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };
    async function showimgQue(imgrequest) {
        Swal.fire({
            imageUrl: imgrequest,
            imageAlt: imgrequest,
            customClass: {
                popup: 'custom-alert-popup', // Add your custom class here
            }
        });
    }
    function checknomistake(data) {
        for (let i = 0; i < data.length; i++) {
            if(data[i].errorstype !== '' && data[i].errorstype !== null){
                return false;
            } 
        }
        if(quesheetinfo.length === 0){
            return "error";
        }
        return true;
    }
    async function handleSubmitAnalyzeresultsQue(e) {
        e.preventDefault();
        if(checknomistake(quesheetinfo) === true){
            Swal.fire({
                title: "วิเคราะห์ผล",
                text: `โปรดมั่นใจว่าคุณได้แก้ไขข้อผิดพลาดของข้อมูลเสร็จสิ้นแล้วหากกดยืนยันแล้วจะไม่สามารถกลับมาแก้ไขข้อมูลได้ \nกดยืนยันเพื่อทำการวิเคราะห์ผล `,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
                cancelButtonColor: "#d33",
                cancelButtonText: "ยกเลิก"
            }).then(async (result) => {
                if(result.isConfirmed){
                    loading();
                }
            });
        }else if(checknomistake(quesheetinfo) === "error"){
            Swal.fire('มีข้อมูลไม่มากพอในการประมวลผล');
        }else{
            Swal.fire('ยังมีข้อมูลที่ยังรอการแก้ไขไม่สามารถวิเคราะห์ผลได้');
        }
       
    }
    async function loading(){
        try {
            const check = await AnalyzeresultsQue()
            if(check === undefined){
                let timerInterval;
                Swal.fire({
                title: "กำลังส่งผลแบบสอบถามเพื่อวิเคราะห์ผลลัพธ์",
                html: "รอประมาณ <b></b> มิลลิวินาที.",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    Swal.fire({
                        title:"ส่งผลแบบสอบถามเสร็จสิ้น",
                        text: "ระหว่างที่รอวิเคราะห์ผลสามารถทำอย่างอื่นรอก่อนได้",
                        icon: "success",
                        confirmButtonColor: "#341699",
                        confirmButtonText: "ยืนยัน",  
                    }).then((result) => {
                        
                    });
                }
                });

                
            }else{
                Swal.fire('เกิดข้อผิดพลาด '+check);
            }
        } catch (error) {
            Swal.fire('เกิดข้อผิดพลาด');
        }
    }
    async function AnalyzeresultsQue(){
        try {
            fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    sequencesteps : "4",
                    userid : Cookies.get('userid')
                }),
            });
            setsequencesteps("4");
            fetch(variables.API_URL + "queinformation/result/"+id+"/", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    userid : Cookies.get('userid'),
                    quesheetid : id
                }),
            }).then(response => {
                
                if(response.status === 500){
                    fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            sequencesteps : "3",
                            userid : Cookies.get('userid')
                        }),
                    });
                    return "status 500"
                }else{
                    fetch(
                    variables.API_URL + "quesheet/update/" + id + "/",
                    {
                        method: "PUT",
                        headers: {
                        Accept: "application/json, text/plain",
                        "Content-Type": "application/json;charset=UTF-8",
                        },
                            body: JSON.stringify({
                            datetimestart: null,
                            datetimeend: null,
                            userid: Cookies.get("userid"),
                        }),
                    }
                    );
                    return true;
                }
                 // รีเทิร์นค่า true เพื่อสื่อว่าการส่งข้อมูลเสร็จสิ้น
                
            }).catch(error => {
                fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        sequencesteps : "3",
                        userid : Cookies.get('userid')
                    }),
                });
                return error; // รีเทิร์น error เพื่อจัดการกับข้อผิดพลาดในการส่งข้อมูล
            });
    
        } catch (err) {
            fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    sequencesteps : "3",
                    userid : Cookies.get('userid')
                }),
            });
            return err; // รีเทิร์น error เมื่อเกิดข้อผิดพลาด
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
                        <p><Link to="/Questionnaire">จัดการแบบสอบถาม</Link> / <Link to={"/Questionnaire/"}>แบบสอบถามทั้งหมด</Link> / <Link to={"/Questionnaire/QuestionnaireNo/"+id}>{QueSheetName}</Link> / ตรวจสอบความถูกต้องของแบบสอบถาม</p>

                            <div className='bx-grid-topic'>
                                <div className="flex">
                                    <h2>ตรวจสอบความถูกต้องของแบบสอบถาม <Alertmanual name={"checkquestionaire"} status={"1"}/></h2>
                                    <div className="pdl10px" onClick={handleSubmitAnalyzeresultsQue}>
                                        <Link to="#">
                                            <p className={sequencesteps >= 5 ?"button-process wait":"button-process"}><span className="fb">วิเคราะห์ผล</span></p>
                                        </Link>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className='bx-details light'>
                            {sequencesteps === 4 || sequencesteps === "4" ? (
                                    <div>
                                        <div className="center loading-process">
                                            <div>
                                                กำลังวิเคราะห์ผล ระหว่างที่รอวิเคราะห์ผลท่านสามารถดำเนินการอื่นๆก่อนได้
                                            </div>
                                            <div id="loadingDiv" className="loading"> </div>
                                            
                                        </div>
                                        <div className="space5"></div>
                                    </div>
                                ) : (
                                    sequencesteps === 5 || sequencesteps === "5" ?
                                        <Link to={"/Questionnaire/QuestionnaireNo/AnalyzeResultsQue/"+id} className="light-font"> <div className="success-text light-font"><FontAwesomeIcon icon={faCheck} />คลิกดูผลการวิเคราะห์</div></Link>
                                    :
                                    null
                                )}
                            <div className="fb">ตารางแสดงความถูกต้องของไฟล์กระดาษแบบสอบถาม ที่ถูกต้อง</div>
                            <div className="tableSub">
                                <table className={sequencesteps >= 4 ? "wait" : ""}>
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: '200px',maxWidth: '200px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>แหล่งที่มาของแบบสอบถาม</th>
                                            <th style={{ minWidth: '200px',maxWidth: '200px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>ชื่อไฟล์</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>คำตอบส่วนที่ 1</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>คำตอบส่วนที่ 2</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>สาเหตุ</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(quesheetinfo).map((item, index) => (
                                            (item) &&
                                            (item.errorstype === '' || item.errorstype === null)
                                            ? (
                                            <tr key={index}>
                                                <td className="center">{item.status_queinfo} </td>
                                                {/* <td className="center">{item.queinfoid} </td> */}
                                                <td className="center">{item.status_queinfo === "Online"?"-":<p onClick={() =>showimgQue(item.imgansstd_path)}>{extractFilenameFromURL(item.imgansstd_path)}</p>} </td>
                                                <td className="center">{item.ansquehead !== "" && item.ansquehead !== null?<FontAwesomeIcon icon={faCircleCheck} className="green-font"/>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />} </td>
                                                <td className="center">{item.ansquetopic !== "" && item.ansquetopic !== null?<FontAwesomeIcon icon={faCircleCheck} className="green-font"/>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />} </td>
                                                <td className="hover-trigger center green-font"><p className="hover-content">รายละเอียดถูกต้อง{item.errorstype}</p><FontAwesomeIcon icon={faCircleCheck} /></td>
                                                {item.status_queinfo === "Online"? 
                                                    <td className="center mw80px"> 
                                                        <span className='danger light-font' onClick={() => handleDelCours(item.queinfoid,1)}><FontAwesomeIcon icon={faTrashCan} /></span>
                                                    </td>
                                                :
                                                    <td className="center mw80px"> 
                                                        <Link to="#" onClick={() =>showCustomAlert(item.queinfoid,'3',item.imgansstd_path,item.errorstype)} className='' style={{ display: 'contents' }}><span className='border-icon-dark'>{<FontAwesomeIcon icon={faPen} />}</span></Link>
                                                        <span className='danger light-font' onClick={() => handleDelCours(item.queinfoid,item.status_queinfo === "Online" ? "Online" :extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon icon={faTrashCan} /></span>
                                                    </td>
                                                }
                                            </tr>
                                                    
                                            ) : null
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="fb">ตารางแสดงความถูกต้องของไฟล์กระดาษแบบสอบถาม ที่ผิดพลาด</div>
                            <div className="tableSub">
                                <table className={sequencesteps >= 4 ? "wait" : ""}>
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: '200px',maxWidth: '200px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>แหล่งที่มาของแบบสอบถาม</th>
                                            <th style={{ minWidth: '200px',maxWidth: '200px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>ชื่อไฟล์</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>คำตอบส่วนที่ 1</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>คำตอบส่วนที่ 2</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>สาเหตุ</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>การจัดการ</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {Object.values(quesheetinfo).map((item, index) => (
                                            (item.errorstype !== '' && item.errorstype !== null)
                                            ? (
                                            <tr key={index}>
                                                <td className="center">{item.status_queinfo} </td>
                                                <td className="center"><p onClick={() =>showimgQue(item.imgansstd_path)}>{extractFilenameFromURL(item.imgansstd_path)}</p></td>
                                                <td className="center">{item.ansquehead !== "" && item.ansquehead !== null ?<FontAwesomeIcon icon={faCircleCheck} className="green-font"/>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />} </td>
                                                <td className="center">{item.ansquetopic !== "" && item.ansquetopic !== null?<FontAwesomeIcon icon={faCircleCheck} className="green-font"/>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />} </td>
                                                <td className="hover-trigger center warning-font"><FontAwesomeIcon icon={faTriangleExclamation} /><p className="hover-content">{item.errorstype}</p></td>
                                                {item.status_queinfo === "Online"? 
                                                    <td className="center mw80px"> 
                                                        <span className='danger light-font' onClick={() => handleDelCours(item.queinfoid,1)}><FontAwesomeIcon icon={faTrashCan} /></span>
                                                    </td>
                                                :
                                                    <td className="center mw80px"> 
                                                        <Link to="#" onClick={() =>showCustomAlert(item.queinfoid,'3',item.imgansstd_path,item.errorstype)} className='' style={{ display: 'contents' }}><span className='border-icon-dark'>{<FontAwesomeIcon icon={faPen} />}</span></Link>
                                                        <span className='danger light-font' onClick={() => handleDelCours(item.queinfoid,extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon icon={faTrashCan} /></span>
                                                    </td>
                                                }
                                                    
                                            </tr>
                                            ) : null
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
      
    );

}

export default AppCheckQuestionaire;