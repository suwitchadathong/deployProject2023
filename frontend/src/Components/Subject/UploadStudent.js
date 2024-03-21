import {
    Link
} from "react-router-dom";
import React, { useState,useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudArrowUp,faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Cookies from 'js-cookie';
import Papa from "papaparse";
import Alertmanual from "../Tools/ToolAlertmanual";

function AppUploadStudent(){
    // examid
    // userid
    // file
    const { id } = useParams();

    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');

    const [File_, setFile_] = useState(''); // สำหรับเก็บไฟล์
    const [statusitem, setStatusItem] = useState(false); // สำหรับเปิด box แสดงชื่อไฟล์และลบลบไฟล์ box item
    const [namefileupload, setNameFileUpload] = useState(''); // สำหรับชื่อไฟล์อัปโหลด

    const [csvData, setcsvData] = useState([]);

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataStart = async () => {
        try{
            //Fetch API เพื่อทำการดึกข้อมูล exam/detail ขอข้อมูล เกี่ยวกับ การสอบครั้งที่
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
                if (result.std_csv_path !== null) {
                    const csvResponse = await fetch(result.std_csv_path);
                    const csvText = await csvResponse.text();
                    const csvBlob = new Blob([csvText], { type: 'text/csv' });
                    const csvFile = new File([csvBlob], 'student_list.csv', { type: 'text/csv' });

                    parseCSVData(csvText); // โหลดไฟล์ CSV ใส่ตัวแปร
                    setFile_(csvFile);
                    setStatusItem(true);
                    setNameFileUpload(csvFile.name);
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
                }else{
                    setsubjectname(subjectResult.subjectname);
                }
            }
        }catch (err) {
            setStartError(1);
        }
    };

    if(Start === 0){
        fetchDataStart();
        setStart(1);
        setTimeout(function() {
            setStartError(2)
        }, 800);
    }

    const onDrop = useCallback((acceptedFiles) => {
        if(acceptedFiles[0].type === "text/csv" || acceptedFiles[0].type === "application/vnd.ms-excel"){
            handleFileInputChange(acceptedFiles[0]);
        }else{
            Swal.fire({
                title: "",
                text: `รองรับเฉพาะไฟล์ .CSV`,
                icon: "error",//error,question,warning,success
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
            }).then((result) => {
            });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accepts: "image/*",
        multiple: false,
    })

    const handleFileInputChange = (e) => {
        const file = e;
        parseCSVData(file)
        setStatusItem(true);
        setNameFileUpload(file.path);
        setFile_(file);
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

    async function handleSubmitFile(e) {
        e.preventDefault();
        if (File_ !== '') {

            const formdata = new FormData();
            formdata.append("file", File_);
            formdata.append("userid", Cookies.get('userid'));
            formdata.append("examid", id);

            Swal.fire({
                title: "",
                text: `กดยืนยันเพื่อทำการอัปโหลดรายชื่อนักศึกษา`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
                cancelButtonColor: "#d33",
                cancelButtonText: "ยกเลิก"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(variables.API_URL + "exam/upload/csv/", {
                            method: "POST",
                            body: formdata,
                        });

                        if (response.ok) {
                            // setNameFileUpload('');
                            // setFile('');
                            // setStatusItem(false);
                            Swal.fire({
                                title: "",
                                text: "อัปโหลดรายชื่อนักศึกษาเสร็จสิ้น",
                                icon: "success",
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ยืนยัน",
                            });
                        } else {
                            Swal.fire({
                                title: "",
                                text: "เกิดข้อผิดพลาดในการอัปโหลด",
                                icon: "error",
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ยืนยัน",
                            });
                        }
                    } catch (err) {
                        Swal.fire({
                            title: "",
                            text: "เกิดข้อผิดพลาดในการอัปโหลด",
                            icon: "error",
                            confirmButtonColor: "#341699",
                            confirmButtonText: "ยืนยัน",
                        });
                    }
                }
            });
        } else {
            Swal.fire({
                title: "",
                text: `กรุณาอัปโหลดไฟล์`,
                icon: "warning",//error,question,warning,success
                confirmButtonColor: "#341699",
                confirmButtonText: "ตกลง",
            }).then((result) => {
            });
        }
    }

    const handleDelFileUpload = (e) => {
        Swal.fire({
            title: "",
            text: `คุณต้องการลบไฟล์ออกใช่หรือไม่`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonColor: "#d33",
            cancelButtonText:"ยกเลิก"
        }).then((result) => {
        if (result.isConfirmed) { // กดยินยัน
            setNameFileUpload('');
            setFile_('');
            setStatusItem(false);
        }
        });
    }
  
    const handleDownload = () => {
        const filePath = '/csv/UploadStudent.csv';
        const link = document.createElement('a');
        link.href = process.env.PUBLIC_URL + filePath;
        link.download = 'UploadStudent.csv';
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
                    <div className='box-content-view'>
                        <div className='bx-topic light'>
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link>/ อัปโหลดรายชื่อนักศึกษา</p>
                            <div className='bx-grid-topic'> 
                                <h2>อัปโหลดรายชื่อนักศึกษา<Alertmanual name={"uploadstudent"} status={"1"}/></h2>
                                
                            </div> 
                        </div>
                        <div className='bx-details light'>
                            <div className="mw300px">
                                <div className="flex-end">
                                   
                                    <div className="bx-button">
                                        <div className="button-download" onClick={handleDownload}>
                                            ตัวอย่างไฟล์ CSV
                                        </div>
                                    </div>
                                </div>
                                <div className="dropzone">
                                    <div className="dz-box"{...getRootProps()}>
                                        <input className="file" name='file' {...getInputProps()} />
                                        <div className="dz-icon blue-font"><FontAwesomeIcon icon={faCloudArrowUp} /></div>
                                        { isDragActive ?
                                                <div>วางไฟล์ที่นี่ ...</div>:
                                                <div>ลากไฟล์มาที่นี่หรืออัปโหลด<p className="">รองรับ .CSV</p></div>  
                                        }
                                    </div>
                                </div>
                                {
                                    statusitem?
                                    <div className="box-item-name-trash space-between">
                                        <div>{namefileupload}</div>
                                        <div onClick={handleDelFileUpload} className="icon-Trash danger-font"><FontAwesomeIcon icon={faTrashCan} /></div>
                                    </div>
                                    :
                                    ''
                                }
                                <form className="flex-end" onSubmit={handleSubmitFile}>
                                    <div className='bx-button' >
                                        <button type="submit"  className='button-submit'>บันทึก</button>
                                    </div>
                                </form >
                            </div>
                            <div>แสดงรายชื่อนักศึกษา</div>
                            <div className="tableSub">
                                <table>
                                    <thead>
                                        <tr >
                                            {csvData.length > 0 && Object.keys(csvData[0]).map((key, index) => (
                                                <th key={index}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {/* Render table rows with CSV data */}
                                            {csvData.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {Object.values(row).map((value, colIndex) => (
                                                        <td key={colIndex} align="center">{value}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </main>
    </div>

    );

}

export default AppUploadStudent;