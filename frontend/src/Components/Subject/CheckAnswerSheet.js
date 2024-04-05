import {
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleXmark, faTrashCan, faPen, faTriangleExclamation, faCheck} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Cookies from 'js-cookie';
import Papa from "papaparse";
import Alertmanual from "../Tools/ToolAlertmanual";
function AppCheckAnswerSheet(){
    const { id } = useParams();
    const [data, setdata] = useState([]);
    const [dataduplicate, setdataduplicate] = useState([]);
    const [non_duplicate_records, setnon_duplicate_records] = useState([]);
    const [EmptyErrorType, setEmptyErrorType] = useState(0);


    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [numberofexamsets, setnumberofexamsets] = useState('');
    
    const [subid, setsubid] = useState('');
    const [subjectid, setsubjectid] = useState('');
    const [subjectname, setsubjectname] = useState('');

    const [csvData, setcsvData] = useState([]);

    const [sequencesteps, setsequencesteps] = useState('');

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataStartExam = async () => {
        try{
            const response = await fetch(variables.API_URL+"exam/detail/"+id+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });
            const result = await response.json();
                if(result.err !== undefined){
                    setStartError(1);
                }
                setExamNo(result.examno)
                setExamNoShow(result.examid)
                setsubid(result.subid)
                setnumberofexamsets(result.numberofexamsets)
                setsequencesteps(parseInt(result.sequencesteps))


                if (result.std_csv_path !== null) {
                    const csvResponse = await fetch(result.std_csv_path);
                    const csvText = await csvResponse.text();
                    parseCSVData(csvText);
                }


                fetch(variables.API_URL+"subject/detail/"+result.subid+"/", {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    })
                    .then(response => response.json())
                    .then(result => {
                        setsubjectid(result.subjectid)
                        setsubjectname(result.subjectname)
                        
                    }
                )
        }catch (err) {
            setStartError(1);
        }
    };
    const fetchDataExamInfo = async () => {
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
                    }
                    setdata(sortObjectsByProperty(result.non_duplicate_records,'stdid'))
                    setdataduplicate(sortObjectsByProperty(result.duplicate_records,'stdid'))
                    setnon_duplicate_records(result.non_duplicate_records)
                    hasEmptyErrorType(result.non_duplicate_records)
                }
            )
        }catch (err) {
            setdata([])
        }

    };
    function checknomistake(data) {
        for (let i = 0; i < data.length; i++) {
            if(data[i].errorstype !== '' && data[i].errorstype !== null){
                return false;
            } 
        }
        if(dataduplicate.length !== 0){
            return false;
        }
        return true;
    }
    function extractFilenameFromURL(url) {
        const parts = url.split('/');
        const filenameWithSpaces = parts[parts.length - 1];
        const decodedFilename = decodeURIComponent(filenameWithSpaces);
        return decodedFilename;
    }
    const handleDelCours = async (examinfoid,idindex) => {
        Swal.fire({
            title: "ลบข้อมูลข้อสอบ",
            text: `คุณต้องการลบข้อมูลเกี่ยวกับ ${idindex} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"examinformation/delete/"+examinfoid+"/", {
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
                            fetchDataExamInfo();
                        }
                    )
                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบรายวิชา",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };

    const showCustomAlert = (dataid,datastdid,datasubid,datasetexaminfo,dataimg,type) => {
        const isMobile = window.innerWidth < 780;
        const subjectpass = subjectid;
        Swal.fire({
            title: 'แก้ไขข้อผิดพลาด  ',
            html: `
                <div class='test' style="display: ${isMobile ? 'grid' : 'flex'}; ${isMobile ? 'grid-template-columns: 1fr;' : 'justify-content: center; align-items: center;'} width: 100%;">
                    <div style="flex: 1; text-align: center;">
                        <img src="${dataimg}" alt="Image" style="width: 584px; height: 413px;">
                    </div>
                    <div style="flex: 1; margin-left: 20px; text-align: left;"> 
                        <div style=" ${type === '1' || type === '3'? '' : 'display:none'}">
                            <div>
                                <label for="input1">รหัสนักศึกษา </label>
                            </div>
                            <div>
                                <select id="input1" class="swal2-select" style="width: 250px;margin:0px;height: 42px;font-size: 16px;color: black;border-radius: 5px; ">
                                    ${generateOptionsStd(csvData, datastdid)}
                                </select>
                            </div>
                            <div>
                                <label for="input2">รหัสวิชา:</label>
                            </div>
                            <div style="position: relative;">
                                <input type="text" id="input2" value="${datasubid}" class="swal2-input" style="width: 250px;margin:0px;padding-right: 40px;">
                                <img src="/img/check.png" alt="Image" id="passTextsubid" style="width: 30px; height: 30px; position: absolute; right: 10px; top: 50%; transform: translateY(-50%);left: 215;">
                            </div>
                            <div>
                                <label for="input3">ชุดข้อสอบ:</label>
                            </div>
                            <div>
                                <select id="input3" class="swal2-select" style="width: 250px;margin:0px;height: 42px;font-size: 16px;color: black;border-radius: 5px; ">
                                    ${generateOptionsNumberofExamSets(numberofexamsets, datasetexaminfo)}
                                </select>
                            </div>
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
            confirmButtonText: 'แก้ไข',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'custom-alert-popup',
            },
            preConfirm: () => {
                const input1Value = document.getElementById('input1').value;
                const input2Value = document.getElementById('input2').value;
                const input3Value = document.getElementById('input3').value;
    
                if (input1Value === '' || input2Value === '' || input3Value === '') {
                    Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
                    return false;
                }
            }
        }).then((result) => {
            const input1Value = document.getElementById('input1').value;
            const input2Value = document.getElementById('input2').value;
            const input3Value = document.getElementById('input3').value;
    
            if (input1Value === '' || input2Value === '' || input3Value === '') {
                Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
                return; // Prevent closing the alert
            }
    
            if (result.isConfirmed) {
                if(UpdateExamInfo(input1Value,input2Value,input3Value,dataid)){
                    fetchDataExamInfo();
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
        });

        document.getElementById('passTextsubid').addEventListener('click', function() {
            document.getElementById('input2').value = subjectpass;
            document.getElementById('input2').disabled = true;
            document.getElementById('input2').style.backgroundColor = '#DDDDDD';
            document.getElementById('passTextsubid').src = "/img/checkgreen.png";
        });
      
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if(UpdateuploadFile(file,dataid)) {
                fetchDataExamInfo();
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

    function nameRepeat(dataarray) {
        if(dataarray === null){
            return ""
        }
        const Repeat = dataarray.split(",")
        for (let i = 0; i < Repeat.length; i++) {
            if(Repeat[i] === "ไม่พบรหัสนักศึกษาในรายชื่อ"){
                return true
            }
        }
        return false
    }

    function generateOptionsStd(data, selectedValue) {
        let optionsHTML = '';
        optionsHTML += `<option value="">กรุณาเลือกรหัสนักศึกษา...</option>`;
        data.forEach(entry => {
            const isSelected = String(entry['รหัสนักศึกษา']) === String(selectedValue) ? 'selected' : '';
            optionsHTML += `<option value="${entry['รหัสนักศึกษา']}" ${isSelected}>${entry['รหัสนักศึกษา']}</option>`;
        });
        return optionsHTML;
    }

    function generateOptionsNumberofExamSets(data, selectedValue) {
        let optionsHTML = '';
        optionsHTML += `<option value="">กรุณาเลือกชุดข้อสอบ...</option>`;
        for (let i = 1; i <= data; i++) {
            optionsHTML += `<option value="${i}" ${String(selectedValue) === String(i) ? 'selected' : ''}>${i}</option>`;
        }
        return optionsHTML;
    }
    
    async function UpdateuploadFile(fileUpload,dataid) {
        try{
            const formData = new FormData();
            formData.append("file", fileUpload);
            formData.append("userid", Cookies.get('userid'));
            formData.append("examid", id);
            const response = await fetch(variables.API_URL + "examinformation/update/"+dataid+"/", {
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
    async function UpdateExamInfo(data1,data2,data3,dataid) {
        try{
            const formData = new FormData();
            formData.append("stdid", data1);
            formData.append("subjectidstd", data2);
            formData.append("setexaminfo", data3);
            formData.append("examinformation", dataid);
            formData.append("userid", Cookies.get('userid'));
            formData.append("examid", id);
            formData.append("errorstype", '');
            
            const response = await fetch(variables.API_URL + "examinformation/update/"+dataid+"/", {
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
    const parseCSVData = (text) => {
        Papa.parse(text, {
            header: true, 
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function (result) {
                setcsvData(result.data);
            },
        });
    };
    function sortObjectsByProperty(array, property) {
        return array.slice().sort((a, b) => {
          if (a[property] < b[property]) {
            return -1;
          }
          if (a[property] > b[property]) {
            return 1;
          }
          return 0;
        });
    }
    async function handleSubmitAnalyzeresults(e) {
        e.preventDefault();
        if(checknomistake(non_duplicate_records) === true){
            Swal.fire({
                title: "วิเคราะห์ผล",
                html: `โปรดมั่นใจว่า<br> <span style="color:red">คุณได้แก้ไขข้อผิดพลาดของข้อมูลเสร็จสิ้นแล้ว หากกดยืนยันแล้วจะไม่สามารถกลับมาแก้ไขข้อมูลได้</span> <br>กดยืนยันเพื่อทำการวิเคราะห์ผล`,
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
        }else{
            Swal.fire('ยังมีข้อมูลที่ยังรอการแก้ไขไม่สามารถวิเคราะห์ผลได้');
        }
    }

    async function loading(){
        try {
            const check = await Analyzeresults()
            if(check === undefined){
                fetchDataStartExam();
                let timerInterval;
                Swal.fire({
                title: "กำลังส่งผลคะแนนเพื่อวิเคราะห์ผลลัพธ์",
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
                        title:"ส่งผลคะแนนเสร็จสิ้น",
                        text: "ระหว่างที่รอวิเคราะห์ผลสามารถทำอย่างอื่นรอก่อนได้",
                        icon: "success",
                        confirmButtonColor: "#341699",
                        confirmButtonText: "ยืนยัน",  
                    }).then((result) => {
                        window.location.href = '/Subject/SubjectNo/Exam/'+id;
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
    
    async function Analyzeresults(){
        try {
            fetch(variables.API_URL + "exam/update/"+id+"/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    sequencesteps:"5",
                    userid : Cookies.get('userid')
                }),
            });
            fetchDataStartExam();
            fetch(variables.API_URL + "examinformation/result/"+id+"/", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    userid : Cookies.get('userid'),
                    examid : id
                }),
            }).then(response => {
                return true; // รีเทิร์นค่า true เพื่อสื่อว่าการส่งข้อมูลเสร็จสิ้น
                
            }).catch(error => {
                fetch(variables.API_URL + "exam/update/"+id+"/", {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        sequencesteps:"4",
                        userid : Cookies.get('userid')
                    }),
                });
                return error; // รีเทิร์น error เพื่อจัดการกับข้อผิดพลาดในการส่งข้อมูล
            });
    
        } catch (err) {
            await fetch(variables.API_URL + "exam/update/"+id+"/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    sequencesteps:"4",
                    userid : Cookies.get('userid')
                }),
            });
            return err; // รีเทิร์น error เมื่อเกิดข้อผิดพลาด
        }
    }
    
    useEffect(() => {
        const intervalId = setInterval(fetchDataStartExam, 30000);
        return () => clearInterval(intervalId);
    }, []);

    if(Start === 0){
        fetchDataStartExam();
        fetchDataExamInfo();
        setStart(1);
        setTimeout(function() {
            setStartError(2)
        }, 800);
    }
    const hasEmptyErrorType = (data) => {
        let numErrorType = 0; // Change const to let
        for (const item of data) {
            if (item.errorstype === null || item.errorstype === '') {
                numErrorType += 1; // Change const to let
            }
        }
        setEmptyErrorType(numErrorType); // Assuming setEmptyErrorType is properly defined
    };
    
    async function submitprocessimg(dataid,pathimg,nameimg) {
        Swal.fire({
            title: "",
            text: `คุณต้องการดูกระดาษคำตอบ `+(nameimg)+` ที่ประมวลผลแล้วใช่หรือไม่`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonColor: "#d33",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if(result.isConfirmed){
                const loadingSwal = Swal.fire({
                    title: 'กำลังประมวลผล...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: async () => { 
                        Swal.showLoading();
                        try {
                            const response = await fetch(variables.API_URL + "examinformation/tableans/"+dataid+"/", {
                                method: "GET",
                                headers: {
                                    'Accept': 'application/json, text/plain',
                                    'Content-Type': 'application/json;charset=UTF-8'
                                },
                            });
                        
                            const result = await response.json();
                            if(result.err === undefined){
                                Swal.close();
                                Swal.fire({
                                    imageUrl: result.img_path,
                                    imageAlt: result.img_path,
                                    customClass: {
                                        popup: 'custom-alert-popup', // Add your custom class here
                                    }
                                });
                                
                            }else{
                                Swal.close();
                                Swal.fire('เกิดข้อผิดพลาด :'+result.err);
                            }
                        }catch(error){
                            Swal.close();
                            Swal.fire('เกิดข้อผิดพลาด');
                        }
                    }
                });
            }
        });
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
                    <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link> / ตรวจความถูกต้องกระดาษคำตอบ</p>
                        <div className='bx-grid-topic'>
                            <div className="flex">
                                <h2>ตรวจความถูกต้องกระดาษคำตอบ<Alertmanual name={"checkanswersheet"} status={"1"}/></h2>
                                <div className="pdl10px" onClick={handleSubmitAnalyzeresults}>
                                    <Link to="#">
                                        <p className={sequencesteps >= 5 ?"button-process wait":"button-process"}><span className="fb">วิเคราะห์ผล</span></p>
                                    </Link>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className='bx-details light'>
                        <div>
                            {/* <div style={{ width: '200px', height: '450px', overflow: 'hidden' }}>
                                <img 
                                    src="/img/answersheet_eng.jpg" 
                                    alt="Image" 
                                    style={{ width: '584px', height: '413px', marginLeft: '0px', marginTop: '0' }} 
                                />
                            </div> */}
                                <div className="space5"></div>
                                {sequencesteps === 5 || sequencesteps === "5" ? (
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
                                    sequencesteps === 6 ?
                                        <Link to={"/Subject/SubjectNo/Exam/ScoreResults/"+id} className="light-font"> <div className="success-text light-font"><FontAwesomeIcon icon={faCheck} />คลิกดูผลการวิเคราะห์</div></Link>
                                    :
                                    null
                                )}
                                <div>ไฟล์กระดาษคำตอบที่ถูกต้อง {EmptyErrorType} / {csvData.length}</div>
                                {/* <div>จำนวนนักศึกษาในไฟล์ที่อัปโหลด {csvData.length} รายชื่อ</div> */}
                                <div className="fb">ตารางแสดงความถูกต้องของไฟล์กระดาษคำตอบ ที่ถูกต้อง</div>
                                <div className="tableSub">
                                <table className={sequencesteps >= 5 ? "" : ""}>
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>#</th>
                                            <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>รหัสนักศึกษา</th>
                                            <th style={{ minWidth: '130px',maxWidth: '130px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>รหัสวิชา</th>
                                            <th style={{ minWidth: '130px',maxWidth: '130px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>ชุดข้อสอบ</th>
                                            <th style={{ minWidth: '170px',maxWidth: '170px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>การตรวจคำตอบ</th>
                                            <th style={{ minWidth: '130px',maxWidth: '130px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>สาเหตุ</th>
                                            <th style={{ minWidth: '200px',maxWidth: '200px',overflowX: 'auto', whiteSpace: 'nowrap' }}>ชื่อไฟล์</th>
                                            <th style={{ minWidth: '100px',maxWidth: '100px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>การจัดการ</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.map((item, index) => (
                                            (item.stdid !== '' && item.stdid !== null && item.stdid !== "0" && item.stdid !== 0 ) &&
                                            (item.subjectidstd !== '' && item.subjectidstd !== null && item.subjectidstd !== "0" && item.setexaminfo !== 0 ) && 
                                            (item.setexaminfo !== '' && item.setexaminfo !== null && item.setexaminfo !== "0" && item.setexaminfo !== 0) && 
                                            (item.anschoicestd !== '' && item.anschoicestd !== null && item.anschoicestd !== "0" && item.anschoicestd !== 0) &&
                                            (item.errorstype === '' || item.errorstype === null)
                                            ? (
                                            <tr key={index}>
                                                <td className="center">{item.stdid} </td>
                                                <td className="center" >{item.stdid !== "" && item.stdid !== null && item.subjectidstd !== "0" && item.stdid !== 0 ? <p><FontAwesomeIcon className="green-font" icon={faCircleCheck} /></p> :<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                <td className="center">{item.subjectidstd !== "" && item.subjectidstd !== null && item.subjectidstd !== "0" && item.subjectidstd !== 0 ? <p><FontAwesomeIcon className="green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                <td className="center">{item.setexaminfo !== ""  && item.setexaminfo !== null && item.setexaminfo !== "0" && item.setexaminfo !== 0 ? <p><FontAwesomeIcon className="green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                <td className="center">{item.anschoicestd !== ""  && item.anschoicestd !== null && item.anschoicestd !== "0" && item.anschoicestd !== 0 ?<p onClick={() =>submitprocessimg(item.examinfoid,item.imgansstd_path,extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon className="cursor-p green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                <td className="hover-trigger center green-font"><p className="hover-content">รายละเอียดถูกต้อง{item.errorstype}</p><FontAwesomeIcon icon={faCircleCheck} /></td>
                                                <td className="w150px" style={{ overflowX: 'auto', whiteSpace: 'nowrap'}}>{extractFilenameFromURL(item.imgansstd_path)}</td>
                                                <td className={sequencesteps >= 5 ? "center mw80px wait" : "center mw80px"}> 
                                                    <Link to="#" onClick={() =>showCustomAlert(item.examinfoid,item.stdid,item.subjectidstd,item.setexaminfo,item.imgansstd_path, '3')} className='' style={{ display: 'contents' }}><span className='border-icon-dark'>{<FontAwesomeIcon icon={faPen} />}</span></Link>
                                                    <span className='danger light-font' onClick={() => handleDelCours(item.examinfoid,extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon icon={faTrashCan} /></span>
                                                </td>
                                            </tr>
                                            ) : null
                                        ))}
                                    </tbody>
                                </table>
                                
                                <div>
                                    <div className="space10"></div>
                                    <div className="fb">ตารางแสดงความถูกต้องของไฟล์กระดาษคำตอบ ที่ไม่ถูกต้อง</div>
                                    <table className={sequencesteps >= 5 ? "wait" : ""}>
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>#</th>
                                                <th style={{ minWidth: '150px',maxWidth: '150px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>รหัสนักศึกษา</th>
                                                <th style={{ minWidth: '130px',maxWidth: '130px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>รหัสวิชา</th>
                                                <th style={{ minWidth: '130px',maxWidth: '130px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>ชุดข้อสอบ</th>
                                                <th style={{ minWidth: '170px',maxWidth: '170px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>การตรวจคำตอบ</th>
                                                <th style={{ minWidth: '130px',maxWidth: '130px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>สาเหตุ</th>
                                                <th style={{ minWidth: '200px',maxWidth: '200px',overflowX: 'auto', whiteSpace: 'nowrap' }}>ชื่อไฟล์</th>
                                                <th style={{ minWidth: '100px',maxWidth: '100px' ,overflowX: 'auto', whiteSpace: 'nowrap'}}>การจัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item, index) => {
                                                if (
                                                    (item.stdid === '' || item.stdid === null || item.stdid === "0" || item.stdid === 0) ||
                                                    (item.subjectidstd === '' || item.subjectidstd === null || item.subjectidstd === "0" || item.subjectidstd === 0) ||
                                                    (item.setexaminfo === '' || item.setexaminfo === null || item.setexaminfo === "0" || item.setexaminfo === 0) ||
                                                    (item.anschoicestd === '' || item.anschoicestd === null || item.anschoicestd === "0" || item.anschoicestd === 0)||
                                                    (item.errorstype !== '' && item.errorstype !== null )
                                                ) {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="center">{item.stdid} </td>
                                                            <td className="center">
                                                                {
                                                                    nameRepeat(item.errorstype) ? (
                                                                        <FontAwesomeIcon className="danger-font" icon={faCircleXmark} />
                                                                    ) : (
                                                                        (item.stdid !== "" && item.stdid !== null && item.stdid !== "0" && item.stdid !== 0) ? (
                                                                            <p><FontAwesomeIcon className="green-font" icon={faCircleCheck} /></p>
                                                                        ) : (
                                                                            <FontAwesomeIcon className="danger-font" icon={faCircleXmark} />
                                                                        )
                                                                    )
                                                                }
                                                            </td>
                                                            <td className="center">{item.subjectidstd !== "" && item.subjectidstd !== null  && item.subjectidstd !== "0" && item.subjectidstd !== 0? <p><FontAwesomeIcon  className="green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                            <td className="center">{item.setexaminfo !== ""  && item.setexaminfo !== null  && item.setexaminfo !== "0" && item.setexaminfo !== 0? <p><FontAwesomeIcon className="green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                            <td className="center">{item.anschoicestd !== ""  && item.anschoicestd !== null && item.anschoicestd !== "0" && item.anschoicestd !== 0 ?<p onClick={() =>submitprocessimg(item.examinfoid,item.imgansstd_path,extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon className="cursor-p green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                            {/* <td className="center"><div className="floating-box">สาเหตุ</div></td> */}
                                                            <td className="hover-trigger center warning-font"><FontAwesomeIcon icon={faTriangleExclamation} /><p className="hover-content">{item.errorstype}</p></td>

                                                            <td className="w150px" style={{ overflowX: 'auto', whiteSpace: 'nowrap'}}>{extractFilenameFromURL(item.imgansstd_path)}</td>
                                                            <td className="center mw80px"> <Link to="#" onClick={() =>showCustomAlert(item.examinfoid,item.stdid,item.subjectidstd,item.setexaminfo,item.imgansstd_path,item.anschoicestd !== "" && item.anschoicestd !== null && item.anschoicestd !== "0" && item.anschoicestd !== 0 ? "1" : "2")} className='' style={{ display: 'contents' }}><span className='border-icon-dark'>{<FontAwesomeIcon icon={faPen} />}</span></Link><span className='danger light-font' onClick={() => handleDelCours(item.examinfoid,extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon icon={faTrashCan} /></span></td>
                                                        </tr>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })}
                                            {dataduplicate.map((item, index) => {   
                                                return (  
                                                    <tr key={index}>
                                                        <td className="center danger-font">{item.stdid} </td>
                                                        <td className="center">{item.stdid !== "" && item.stdid !== null  && item.stdid !== "0" && item.stdid !== 0? <p><FontAwesomeIcon className="green-font" icon={faCircleCheck} /></p> :<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                        <td className="center">{item.subjectidstd !== "" && item.subjectidstd !== null  && item.subjectidstd !== "0" && item.subjectidstd !== 0? <p><FontAwesomeIcon  className="green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                        <td className="center">{item.setexaminfo !== ""  && item.setexaminfo !== null  && item.setexaminfo !== "0" && item.setexaminfo !== 0? <p><FontAwesomeIcon className="green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                        <td className="center">{item.anschoicestd !== ""  && item.anschoicestd !== null && item.anschoicestd !== "0" && item.anschoicestd !== 0 ?<p  onClick={() =>submitprocessimg(item.examinfoid,item.imgansstd_path,extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon className="cursor-p green-font" icon={faCircleCheck} /></p>:<FontAwesomeIcon  className="danger-font" icon={faCircleXmark} />}</td>
                                                        <td className="hover-trigger center warning-font"><p className="hover-content">รหัสนักศึกษาซ้ำกัน{item.errorstype}</p><FontAwesomeIcon icon={faTriangleExclamation} /></td>
                                                        <td className="w150px" style={{ overflowX: 'auto', whiteSpace: 'nowrap'}}>{extractFilenameFromURL(item.imgansstd_path)}</td>
                                                        <td className="center mw80px"> <Link to="#" onClick={() =>showCustomAlert(item.examinfoid,item.stdid,item.subjectidstd,item.setexaminfo,item.imgansstd_path, "3")} className='' style={{ display: 'contents' }}><span className='border-icon-dark'>{<FontAwesomeIcon icon={faPen} />}</span></Link><span className='danger light-font' onClick={() => handleDelCours(item.examinfoid,extractFilenameFromURL(item.imgansstd_path))}><FontAwesomeIcon icon={faTrashCan} /></span></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <td className="center">{ true ?<FontAwesomeIcon icon={faCircleCheck} />:<FontAwesomeIcon icon={faCircleXmark} />}</td> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    );

}

export default AppCheckAnswerSheet;