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

    
    const [sequencesteps, setsequencesteps] = useState('');
    const [QueSheetName, setQueSheetName] = useState('');
    const [QueSheetTopicName, setQueSheetTopicName] = useState('');
    const [DetailsLineOne, setDetailsLineOne] = useState('');
    const [DetailsLinetwo, setDetailsLinetwo] = useState('');


    const [quehead1, setquehead1] = useState('');
    const [quehead2, setquehead2] = useState('');
    const [quehead3, setquehead3] = useState('');
    const [quehead4, setquehead4] = useState('');
    const [quehead5, setquehead5] = useState('');

    const [quetopicdetails, setquetopicdetails] = useState('');
    const [quetopicformat, setquetopicformat] = useState('');

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
                    console.log("quesheet :",result)
                    setQueSheetName(result.quesheetname)
                    setsequencesteps(result.sequencesteps)
                    setQueSheetTopicName(result.quesheettopicname)
                    setDetailsLineOne(result.detailslineone)
                    setDetailsLinetwo(result.detailslinetwo)
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
                        console.log(result)
                        setquehead1(result.quehead1)
                        setquehead2(result.quehead2)
                        setquehead3(result.quehead3)
                        setquehead4(result.quehead4)
                        setquehead5(result.quehead5)
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
                        console.log(result)
                        setquetopicdetails(result.quetopicdetails)
                        setquetopicformat(result.quetopicformat)
                    }
                   
                }
            )
            
        }catch (err) {
            console.error(err)
            setStartError(1);
           
        }
    };
    
    const setStartError2 = (e) => {
        setStartError(2);
    }
    if(Start === 0){
        fetchDataquesheet();
        setStart(1);
        setTimeout(function() {
            setStartError2()
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
        console.log(File)
        console.log(namefileupload)
        console.log(indexitem)
    }
    async function handleSubmitFile(e) {
        e.preventDefault();
        if (File.length > 0) {
            Swal.fire({
                title: "",
                text: `กดยืนยันเพื่อจะทำการประมวลผลแบบสอบถาม`,
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
        } else {
            Swal.fire({
                title: "",
                text: `กรุณาอัปโหลดไฟล์`,
                icon: "warning",
                confirmButtonColor: "#341699",
                confirmButtonText: "ตกลง",
            }).then(() => {
                // Handle user response here if needed
            });
        }
    }
    async function saveUpload(){
        const formData = new FormData();
        const quesheet_data = {
            userid : Cookies.get('userid'),
            quesheetname : QueSheetName,
            quesheettopicname : QueSheetTopicName,
            detailslineone : DetailsLineOne,
            detailslinetwo : DetailsLinetwo,
            sequencesteps : 2,
        }
        const queheaddetails_data = {
            quehead1 :quehead1,
            quehead2 :quehead2,
            quehead3 :quehead3,
            quehead4 :quehead4,
            quehead5 :quehead5,
        }
        const quetopicdetails_data = {
            quetopicdetails : quetopicdetails,
            quetopicformat : quetopicformat,
        }
        formData.append("userid", Cookies.get('userid'));
        formData.append("quesheet", JSON.stringify(quesheet_data))
        formData.append("queheaddetails", JSON.stringify(queheaddetails_data))
        formData.append("quetopicdetails", JSON.stringify(quetopicdetails_data))
        formData.append("nonelogo",false)
        console.log(formData)

        const formDataFalse = new FormData();
        const quesheet_data_false = {
            userid : Cookies.get('userid'),
            quesheetname : QueSheetName,
            quesheettopicname : QueSheetTopicName,
            detailslineone : DetailsLineOne,
            detailslinetwo : DetailsLinetwo,
            sequencesteps : 1,
        }

        formDataFalse.append("userid", Cookies.get('userid'));
        formDataFalse.append("quesheet", JSON.stringify(quesheet_data_false))
        formDataFalse.append("queheaddetails", JSON.stringify(queheaddetails_data))
        formDataFalse.append("quetopicdetails", JSON.stringify(quetopicdetails_data))
        formDataFalse.append("nonelogo",false)

        try {
            const queupdateTime = await fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    sequencesteps : 2,
                    userid : Cookies.get('userid')
                }),
            });

            const result = await queupdateTime.json()

            fetchDataquesheet()
            setFile([])
            setShowFile([])
            setNameFileUpload([])
            
            if (result) {
                if(result.err === undefined){

                    const formdataQueinfo = new FormData();
                    for (let i = 0; i < File.length; i++) {
                        formdataQueinfo.append('file', File[i]);
                    }
                    formdataQueinfo.append("userid", Cookies.get('userid'));
                    formdataQueinfo.append("quesheetid", id);

                    fetch(variables.API_URL + "queinformation/upload/paper/", {
                        method: "POST",
                        body: formdataQueinfo,
                    }).then(response => {
                        return true; 
                    })
                    .catch(error => {
                        try {
                            fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                                method: "PUT",
                                body: formDataFalse,
                            });
                        }catch(error){
                            return error; 
                        }
                        return error; 
                    });
                }else{
                    fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                        method: "PUT",
                        body: formDataFalse,
                    });
                    return result.err
                }
                
            }else{
                fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                    method: "PUT",
                    body: formDataFalse,
                });
                return result.err
            }
            
    
        } catch (err) {
            return err; // รีเทิร์น error เมื่อเกิดข้อผิดพลาด
        }
    } 
    async function loading(){
        try {
            const check = await saveUpload()
            if(check === undefined){
                // fetchDataStartExam();
                let timerInterval;
                Swal.fire({
                title: "กำลังอัปโหลดแบบสอบถาม",
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
                        title: "อัปโหลดแบบสอบถามเสร็จสิ้น",
                        text: "ระหว่างที่รอแบบสอบถามประมวลผลสามารถทำอย่างอื่นรอก่อนได้",
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
            console.error(error);
            Swal.fire('เกิดข้อผิดพลาด');
        }
    }
    useEffect(() => {
        const intervalId = setInterval(fetchDataquesheet, 30000);
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
                <div className={StartError === 2 ?'box-content-view':'box-content-view none'}>
                    <div className='bx-topic light'>
                    <p><Link to="/Questionnaire">จัดการแบบสอบถาม</Link> / <Link to={"/Questionnaire/"}>แบบสอบถามทั้งหมด</Link> / <Link to={"/Questionnaire/QuestionnaireNo/"+id}>{QueSheetName}</Link> / อัปโหลดแบบสอบถาม</p>

                        <div className='bx-grid2-topic'>
                            <h2>อัปโหลดแบบสอบถาม<Alertmanual name={"uploadquestionnaire"} status={"1"}/></h2>
                        </div> 
                    </div>
                    <div className='bx-details light'>
                        <div>รูปแบบฟอร์มแบบสอบถาม</div>
                        <div className="gtc2-CAS">
                            <div className="jc-center">
                                <div className="mw300px fit-content">
                                    <div className="dropzone">
                                        <div className={sequencesteps === 2 || sequencesteps === "2" ? "dz-box wait":"dz-box"} {...getRootProps()}>
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
                                            <button type="submit"  className={sequencesteps === 2 || sequencesteps === "2" ? "button-submit wait":"button-submit"}>บันทึก</button>
                                        </div>
                                    </form >
                                </div>
                            </div>
                            {sequencesteps === 2 || sequencesteps === "2" ? (
                                <div className="center loading-process">
                                    <div>
                                        กำลังประมวลผลแบบสอบถาม ระหว่างที่รอแบบสอบถามประมวลผลท่านสามารถดำเนินการอื่นๆก่อนได้
                                    </div>
                                    <div id="loadingDiv" className="loading"> </div>
                                </div>
                            ) : (
                                sequencesteps === 3 || sequencesteps === "3" ? 
                                <div className="success-text"><FontAwesomeIcon icon={faCheck} /> การอัปโหลดแบบสอบถามก่อนหน้าประมวลผลเสร็จสิ้น</div>
                                : 
                                ''
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    );

}

export default AppUploadAnswerSheet;