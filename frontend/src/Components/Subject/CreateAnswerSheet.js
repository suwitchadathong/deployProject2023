
import {
    Link
} from "react-router-dom";
import React, { useState,useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudArrowUp,faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
import { SRLWrapper } from 'simple-react-lightbox';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Cookies from 'js-cookie';
import Alertmanual from "../Tools/ToolAlertmanual";


function AppCreateAnswerSheet(){
    const { id } = useParams();

    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');
    const [imganswersheetformat_path, setimganswersheetformat_path] = useState('');
    const [imgcheck, setimgcheck] = useState('');
    const [imgoriginal, setimgoriginal] = useState('');
    
    const [File, setFile] = useState(''); // สำหรับเก็บไฟล์
    const [statusitem, setStatusItem] = useState(false); // สำหรับเปิด box แสดงชื่อไฟล์และลบลบไฟล์ box item
    const [namefileupload, setNameFileUpload] = useState(''); // สำหรับชื่อไฟล์อัปโหลด
    const [selectedOption, setSelectedOption] = useState('1');
    const [isChecked, setChecked] = useState(false);
    const [isoriginal, setisoriginal] = useState(false);

    const handleCheckboxOriginal = () => {
        if(isoriginal === false){
            setImages(imgoriginal)
            setChecked(false)
            setFile('')
            setStatusItem('')
            setNameFileUpload('')
        }else{
            setImages(imganswersheetformat_path)
        }
        setisoriginal(!isoriginal);
    };

    const handleOptionChange = (event) => {setSelectedOption(event.target.value);};
    const handleCheckboxChange = () => {setChecked(!isChecked);};
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const [images, setImages] = useState([]);

    const fetchDataStart = async () => {
        try{
            //Fetch API เพื่อทำการดึกข้อมูล exam/detail ขอข้อมูล เกี่ยวกับ การสอบครั้งที่
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
                    setExamNo(result.examno)
                    setExamNoShow(result.examid)
                    setimgoriginal([
                        { id: '1', imageName: new URL(result.imganswersheetformat_path).origin+"/media/original_answersheet/answersheet_num.jpg"+"?"+ new Date().getTime(), tag: 'free' },
                        { id: '2', imageName: new URL(result.imganswersheetformat_path).origin+"/media/original_answersheet/answersheet_eng.jpg"+"?"+ new Date().getTime(), tag: 'free' },
                        { id: '3', imageName: new URL(result.imganswersheetformat_path).origin+"/media/original_answersheet/answersheet_thai.jpg"+"?"+ new Date().getTime(), tag: 'free' },
                    ])
                    setimganswersheetformat_path([
                        { id: '1', imageName: result.imganswersheetformat_path+"answersheet_num.jpg"+"?"+ new Date().getTime(), tag: 'free' },
                        { id: '2', imageName: result.imganswersheetformat_path+"answersheet_eng.jpg"+"?"+ new Date().getTime(), tag: 'free' },
                        { id: '3', imageName: result.imganswersheetformat_path+"answersheet_thai.jpg"+"?"+ new Date().getTime(), tag: 'free' }, 
                    ])
                    setSelectedOption(result.answersheetformat)
                    setsubid(result.subid)
                    setimgcheck(extractFilenameFromURL(result.imganswersheetformat_path))
                    setImages([
                        { id: '1', imageName: result.imganswersheetformat_path+"answersheet_num.jpg"+"?"+ new Date().getTime(), tag: 'free' },
                        { id: '2', imageName: result.imganswersheetformat_path+"answersheet_eng.jpg"+"?"+ new Date().getTime(), tag: 'free' },
                        { id: '3', imageName: result.imganswersheetformat_path+"answersheet_thai.jpg"+"?"+ new Date().getTime(), tag: 'free' }, 
                    ])
                    //Fetch API เพื่อทำการดึกข้อมูล subject/detail ขอข้อมูล เกี่ยวกับ รายวิชา
                    fetch(variables.API_URL+"subject/detail/"+result.subid+"/", {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        })
                        .then(response => response.json())
                        .then(result => {
                            if (result.err !== undefined) {
                                setStartError(1);
                            }else{
                                setsubjectname(result.subjectname)
                            }
                            
                        }
                    )
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
        fetchDataStart();
        setStart(1);
        setTimeout(function() {
            setStartError2()
        }, 800);
    }
    const onDrop = useCallback((acceptedFiles) => {
 
        if(acceptedFiles[0].type === "image/png" ||acceptedFiles[0].type === "image/jpeg" ||acceptedFiles[0].type === "image/jpg"){
            handleFileInputChange(acceptedFiles[0]);
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
        multiple: false,
    })
    const handleFileInputChange = (e) => {
        const file = e;
        setStatusItem(true);
        setNameFileUpload(file.path);
        setFile(file);
    }
    async function handleSubmitFile(e) {
        e.preventDefault();
        if ((File !== '' && isChecked === true) || isChecked === false) {
            if(isoriginal === true){
                resetlogo()
            }else{
                loading()
            }
           
        } else {
            Swal.fire({
                title: "",
                text: `กรุณาอัปโหลดไฟล์`,
                icon: "warning", //error,question,warning,success
                confirmButtonColor: "#341699",
                confirmButtonText: "ตกลง",
            }).then((result) => {});
        }
    }
    async function loading(){
        try {
            const loadingSwal = Swal.fire({
                title: 'กำลังประมวลผล...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: async () => { 
                    Swal.showLoading();
                    try {
                        const check = await saveAnswerSheet()
                       if(check === true){
                            Swal.close();
                            Swal.fire({
                                title: "",
                                text: "สร้างกระดาษคำตอบเสร็จสิ้น",
                                icon: "success",
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ยืนยัน",  
                            }).then((result) => {
                                window.location.href = '/Subject/SubjectNo/Exam/'+id;
                            });
                        }else{
                            Swal.close();
                            Swal.fire('เกิดข้อผิดพลาด'+check);
                        }
                    } catch (error) {
                        Swal.close();
                        Swal.fire('เกิดข้อผิดพลาด'+error);
                    }
                }
            });
            await loadingSwal;
        } catch (error) {
            Swal.fire('เกิดข้อผิดพลาด');
        }
    }
    async function saveAnswerSheet() {
        if (isChecked === true) {
            try {
                const formData = new FormData();
                formData.append("file", File);
                formData.append("userid", Cookies.get('userid'));
                formData.append("examid", id);
                const upload = await fetch(variables.API_URL + "exam/upload/logo/", {
                    method: "POST",
                    body: formData,
                });
                const result = await upload.json();
                if (result.err === undefined) {
                    setimganswersheetformat_path(result.imganswersheetformat_path);
                }else{
                    return result.err
                }
            } catch (err) {
                return err
            }
        }
        try {
            const response = await fetch(variables.API_URL + "exam/update/" + id + "/", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    answersheetformat: selectedOption,
                    statusexam: "1",
                    sequencesteps: "2",
                    userid: Cookies.get('userid')
                }),
            });
            const result = await response.json();
            if (result.err === undefined) {
                fetchDataStart()
                return true;
            } else {
                return result.err
            }
        } catch (err) {
            return err
        }
    }
    async function resetlogo(){
        //Fetch API เพื่อทำการส่งข้อมูล exam/update/
        const response = await fetch(variables.API_URL + "exam/update/"+id+"/", {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                reset_logo : "1",                
                userid : Cookies.get('userid')
            })
        });
    
        const result = await response.json();

        if(result.err === undefined){
            Swal.fire({
                title: "",
                text: "คืนค่ากระดาษคำตอบเสร็จสิ้น",
                icon: "success",
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",  
            }).then((result) => {
                setNameFileUpload('');
                setFile('');
                setStatusItem(false);
                window.location.reload();
            })
        } else {
            Swal.fire('เกิดข้อผิดพลาด '+result.err);
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
        if (result.isConfirmed) {
            setNameFileUpload('');
            setFile('');
            setStatusItem(false);
        }
        });
    }
    function extractFilenameFromURL(url) {
        const parts = url.split('/');
        const filenameWithSpaces = parts[parts.length - 2];
        const decodedFilename = decodeURIComponent(filenameWithSpaces);
        return decodedFilename;
    }
    
    const example_image = () => {
        const show_image = images.map(image => {
            if (image.id === selectedOption){
                return (
                    <div key={image.id} className="image-card">
                        <a href={`${image.imageName}`}>
                            <img className="image" src={`${image.imageName}`} alt={`${image.imageName.substring(image.imageName.lastIndexOf('/') + 1)}`} />
                        </a>
                    </div>
                );
            }
            return null;
        })
        return show_image;
    };
    const options = {}
    
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
                    <div className= {StartError === 2 ? 'box-content-view':'box-content-view none'} >
                        <div className='bx-topic light'>
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link> / สร้างกระดาษคำตอบ</p>
                            <div className='bx-grid2-topic'>
                                <h2>สร้างกระดาษคำตอบ<Alertmanual name={"createanswersheet"} status={"1"}/></h2>
                            </div> 
                        </div>
                        <div className='bx-details light'>
                            <div>
                                {imgcheck === 'original_answersheet'?
                                    ''
                                    :
                                    <div className="bx-input-fix">
                                        <span className="flex"><input className="mgR10" value = "Tree" type = "checkbox" checked={isoriginal} onChange = {handleCheckboxOriginal} /> คืนค่ารูปต้นฉบับ <p className="fs10 flexJACenter">&nbsp;</p> </span>
                                    </div>
                                }
                            </div>
                            <div className="fb">รูปแบบฟอร์มกระดาษคำตอบ</div>
                            <div className="gtc2-CAS">
                                <div className="jc-center">
                                    <div className="mw300px fit-content">
                                        <div>
                                            <div className="bx-input-fix pl20">
                                                <span className="flex">
                                                    <input className="mgR10" type="radio" name="option" value="1" checked={selectedOption === '1'} onChange={handleOptionChange}/>123 กระดาษคำตอบแบบ 1, 2, 3, ...
                                                </span>
                                            </div>
                                            <div className="bx-input-fix pl20">
                                                <span className="flex">
                                                    <input className="mgR10" type="radio" name="option" value="2" checked={selectedOption === '2'} onChange={handleOptionChange}/>ABC กระดาษคำตอบแบบ A, B, C, ...
                                                </span>
                                            </div>
                                            <div className="bx-input-fix pl20">
                                                <span className="flex">
                                                    <input className="mgR10" type="radio" name="option" value="3" checked={selectedOption === '3'} onChange={handleOptionChange}/>กขค กระดาษคำตอบแบบ ก, ข, ค, ...
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bx-input-fix">
                                            <span className="flex"><input className={isoriginal ? "mgR10 wait":"mgR10"} value = "Tree" type = "checkbox" checked={isChecked} onChange = {handleCheckboxChange} /> เพิ่มรูปโลโก้ <p className="fs10 flexJACenter">&nbsp;(ขนาดรูปภาพที่แนะนำ 300 x 300 Pixels)</p> </span>
                                        </div>
                                        <div className={isChecked ? "dropzone":"dropzone wait"}>
                                            <div className="dz-box"{...getRootProps()}>
                                                <input className="test" {...getInputProps()} />
                                                <div className="dz-icon blue-font"><FontAwesomeIcon icon={faCloudArrowUp} /></div>
                                                { isDragActive ?
                                                        <div>วางไฟล์ที่นี่ ...</div>:
                                                        <div>ลากไฟล์มาที่นี่หรืออัปโหลด<p className="">รองรับ .PNG .JPG และ JPEG</p></div>  
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
                                </div>
                                <div className="TB">
                                    <div className="TB-box">
                                        <h3 className="center">แสดงตัวอย่างรูปแบบฟอร์มกระดาษคำตอบ</h3>
                                        <SRLWrapper options={options}>
                                            <div className="container">
                                                {example_image()}
                                            </div>
                                        </SRLWrapper> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppCreateAnswerSheet;