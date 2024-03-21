import {
    Link
} from "react-router-dom";
import React, { useState,useCallback,useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudArrowUp,faTrashCan,faCheck} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
// import { SRLWrapper } from 'simple-react-lightbox';
import {variables} from "../../Variables";
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import Alertmanual from "../Tools/ToolAlertmanual";
function AppUploadAnswerSheet(){
    const { id } = useParams();

    const [File, setFile] = useState([]); // สำหรับเก็บไฟล์
    const [ShowFile, setShowFile] = useState([]);
    const [statusitem, setStatusItem] = useState(false); // สำหรับเปิด box แสดงชื่อไฟล์และลบลบไฟล์ box item
    const [namefileupload, setNameFileUpload] = useState(''); // สำหรับชื่อไฟล์อัปโหลด

    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');
    const [sequencesteps, setsequencesteps] = useState('');
    
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);
    
    const fetchDataStartExam = async () => {
        try{
            // featch ข้อมูล exam 
            fetch(variables.API_URL+"exam/detail/"+id+"/", {
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
                    else{
                        setExamNo(result.examno)
                        setExamNoShow(result.examid)
                        setsubid(result.subid)
                        setsequencesteps(result.sequencesteps)
                        // featch ข้อมูล subject 
                        fetch(variables.API_URL+"subject/detail/"+result.subid+"/", {
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
                                else{
                                    setsubjectname(result.subjectname)
                                    setStartError(2);
                                }
                            }
                        )
                    }
                }
            )
        }catch (err) {
            setStartError(1);
        }
    };
    
    if(Start === 0){
        fetchDataStartExam();
        setStart(1);
        setTimeout(function() {
            setStartError(2);
        }, 800);
    }

    const onDrop = useCallback((acceptedFiles) => {
        setNameFileUpload('')
        const imageFiles = acceptedFiles.filter(file => (
            file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg"
        ));

        if (imageFiles.length > 0) {
            handleFileInputChange(imageFiles);
        }else{
            Swal.fire({
                title: "",
                text: `รองรับเฉพาะไฟล์ .PNG .JPG และ .JPGE`,
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
        multiple: true,
    })

    const handleFileInputChange = (files) => {
        setFile(files)
        setNameFileUpload('')
        const fileArray = files.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                // setFile(prevFiles => [...prevFiles, reader.result]);
                setShowFile(prevFiles => [...prevFiles, reader.result]);
            }
            return file;
        });
        setStatusItem(true);
        setNameFileUpload(fileArray.map(file => file.name));
    }
    const handleDelFileUpload = (indexitem) => {
        setNameFileUpload(namefileupload.filter((_, index) => index !== indexitem))
        setShowFile(ShowFile.filter((_, index) => index !== indexitem))
        setFile(File)
    }

    async function handleSubmitFile(e) {
        e.preventDefault();
        if (File.length > 0) { // ต้องมีการอัปโหลดไฟล์
            Swal.fire({
                title: "",
                text: `กดยืนยันเพื่อจะทำการประมวลผลกระดาษคำตอบ`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
                cancelButtonColor: "#d33",
                cancelButtonText: "ยกเลิก"
            }).then(async (result) => {
                if(result.isConfirmed){ // กดยืนยัน
                    loading();  // เรียกใช้ โมดูล loading
                }
                
            });
        } else {
            Swal.fire({
                title: "",
                text: `กรุณาอัปโหลดไฟล์`,
                icon: "warning",
                confirmButtonColor: "#341699",
                confirmButtonText: "ตกลง",
            }).then(() => {
            });
        }
    }

    async function saveUpload(){
        const formdata = new FormData();
        for (let i = 0; i < File.length; i++) {
            formdata.append('file', File[i]);
        }
        formdata.append("userid", Cookies.get('userid'));
        formdata.append("examid", id);

        try { // fetch อัปเดท sequencesteps exam
            await fetch(variables.API_URL + "exam/update/"+id+"/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    sequencesteps:"3",
                    userid : Cookies.get('userid')
                }),
            });

            setFile([])
            setShowFile([])
            setNameFileUpload([])
            // fetch ตรวจกระดาษคำตอบ
            fetch(variables.API_URL + "examinformation/upload/paper/", {
                method: "POST",
                body: formdata,
            }).then(response => {
                return true; // รีเทิร์นค่า true เพื่อสื่อว่าการส่งข้อมูลเสร็จสิ้น
            })
            .catch(error => {
                fetch(variables.API_URL + "exam/update/"+id+"/", {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        sequencesteps:"2",
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
                    sequencesteps:"2",
                    userid : Cookies.get('userid')
                }),
            });
            return err; // รีเทิร์น error เมื่อเกิดข้อผิดพลาด
        }
    }
    
    async function loading(){
        try {
            const check = await saveUpload()
            if(check === undefined){
                setsequencesteps(3)
                let timerInterval;
                Swal.fire({
                title: "กำลังอัปโหลดกระดาษคำตอบ",
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
                        title: "อัปโหลดกระดาษคำตอบเสร็จสิ้น",
                        text: "ระหว่างที่รอกระดาษคำตอบประมวลผลสามารถทำอย่างอื่นรอก่อนได้",
                        icon: "success",
                        confirmButtonColor: "#341699",
                        confirmButtonText: "ยืนยัน",  
                    }).then((result) => {
                        fetchDataStartExam();
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

    // const options = {}
    useEffect(() => {
        const intervalId = setInterval(fetchDataStartExam, 30000);
        return () => clearInterval(intervalId);
    }, []);

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
                <div className={StartError === 2 ? 'box-content-view': 'box-content-view none'}>
                    <div className='bx-topic light'>
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link> / อัปโหลดกระดาษคำตอบ</p>
                        <div className='bx-grid2-topic'>
                            <h2>อัปโหลดกระดาษคำตอบ<Alertmanual name={"uploadanswersheet"} status={"1"}/></h2>
                        
                        </div> 
                    </div>
                    <div className='bx-details light'>
                        <div></div>
                        <div className="gtc2-CAS">
                            <div className="jc-center">
                                <div className="mw300px fit-content">
                                    <div className="dropzone">
                                        <div className={sequencesteps === 3 || sequencesteps === "3" ? "dz-box wait":"dz-box"} {...getRootProps()}>
                                            <input className="test" {...getInputProps()} />
                                            <div className="dz-icon blue-font"><FontAwesomeIcon icon={faCloudArrowUp} /></div>
                                            { isDragActive ?
                                                    <div>วางไฟล์ที่นี่ ...</div>:
                                                    <div>ลากไฟล์มาที่นี่หรืออัปโหลด<p className="">รองรับ .PNG .JPG และ JPEG</p></div>  
                                            }
                                        </div>
                                    </div>
                                    
                                    {
                                        statusitem ? (
                                            <div>
                                                <div className="space10"></div>
                                                <div className="ovf-auto">
                                                    <div className="ovfy-auto-h200">
                                                    {namefileupload.map((file, index) => (
                                                        <div key={index} className="box-item-name-trash space-between">
                                                            <div>{namefileupload[index]}</div>
                                                            <div onClick={() => handleDelFileUpload(index)} className="icon-Trash danger-font">
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : ''
                                    }
                                    <form className="flex-end" onSubmit={handleSubmitFile}>
                                        <div className='bx-button' >
                                            <button type="submit"  className={sequencesteps === 3 || sequencesteps === "3" ? "button-submit wait":"button-submit"}>บันทึก</button>
                                        </div>
                                    </form >
                                </div>
                            </div>
                            {sequencesteps === 3 || sequencesteps === "3" ? (
                                <div className="center loading-process">
                                    <div>
                                        กำลังประมวลผลกระดาษคำตอบ ระหว่างที่รอกระดาษคำตอบประมวลผลสามารถทำอย่างอื่นรอก่อนได้
                                    </div>
                                    <div id="loadingDiv" className="loading"> </div>
                                </div>
                            ) : (
                                sequencesteps === 4 || sequencesteps === "4" ? 
                                <div className="success-text"><FontAwesomeIcon icon={faCheck} /> การอัปโหลดกระดาษคำตอบก่อนหน้าประมวลผลเสร็จสิ้น</div>
                                : 
                                ''
                            )}

                                
                            {/* <div className="TB">
                                <div className="TB-box">
                                    <h3>แสดงตัวอย่างรูปแบบฟอร์มกระดาษคำตอบ</h3>
                                    <SRLWrapper options={options}>
                                    {File !== ''? 
                                        <div className="container">
                                        {ShowFile.map((file, index) => (
                                            <div key={index} className="image-card" style={index>=1?{ display: 'none' }:{}}>
                                                <a href={file} >
                                                    <img className="image" src={file} alt={namefileupload[index]} />
                                                </a>
                                            </div>
                                        ))}
                                        </div>
                                    :
                                        <div className="container">
                                        </div>
                                    }
                                    </SRLWrapper> 
                                </div>
                            </div> */}
                        </div>
                    </div>
                    {/* <div className="loading-container">
                        <div className="spinner"></div>
                    </div> */}
                    
                </div>
            </div>
        </main>
    </div>
    );

}

export default AppUploadAnswerSheet;