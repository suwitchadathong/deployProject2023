import {
    Link
} from "react-router-dom";
import React, { useState,useCallback,useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudArrowUp,faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
import {variables} from "../../Variables";
import { useParams } from 'react-router-dom';
function AppUpdateQuetionaire(){
    const { id } = useParams(); 
    const [step,setstep] = useState(true);

    const handstep = (e) => {
        e.preventDefault();
        if(step === true){
            setstep(false)
        }else{
            setstep(true)
        }
    }

    const [QueSheetName, setQueSheetName] = useState('');
    const [QueSheetTopicName, setQueSheetTopicName] = useState('');
    const [DetailsLineOne, setDetailsLineOne] = useState('');
    const [DetailsLinetwo, setDetailsLinetwo] = useState('');
    // const [Symbolposition, setSymbolposition] = useState('');
    const [checknonelogo, setchecknonelogo] = useState(false);

    const handlenonelogo = (e) => {
        if(e.target.checked === true){
            setNameFileUpload('');
            setFile('');
            setStatusItem(false);
            setFileShow('')
        }else{

        }
        setchecknonelogo(e.target.checked);
    
    };
    const handleInputQueSheetName = (e) => { setQueSheetName(e.target.value); };
    const handleInputQueSheetTopicName = (e) => {setQueSheetTopicName(e.target.value);};
    const handleInputDetailsLineOne = (e) => { setDetailsLineOne(e.target.value); };
    const handleInputDetailsLinetwo = (e) => {setDetailsLinetwo(e.target.value);};
    // const handleInputSymbolposition = (e) => {setSymbolposition(e.target.value);};


    //QueHeadDetails
    const [QH1C1, setQH1C1] = useState('');
    const [QH1C2, setQH1C2] = useState('');
    const [QH1C3, setQH1C3] = useState('');
    const [QH1C4, setQH1C4] = useState('');
    const [QH1C5, setQH1C5] = useState('');
    const handleQH1C1 = (e) => { setQH1C1(e.target.value); };
    const handleQH1C2 = (e) => { setQH1C2(e.target.value); };
    const handleQH1C3 = (e) => { setQH1C3(e.target.value); };
    const handleQH1C4 = (e) => { setQH1C4(e.target.value); };
    const handleQH1C5 = (e) => { setQH1C5(e.target.value); };
    const [QH1, setQH1] = useState([QH1C1,QH1C2,QH1C3,QH1C4,QH1C5]);
    const [QH2C1, setQH2C1] = useState('');
    const [QH2C2, setQH2C2] = useState('');
    const [QH2C3, setQH2C3] = useState('');
    const [QH2C4, setQH2C4] = useState('');
    const [QH2C5, setQH2C5] = useState('');
    const handleQH2C1 = (e) => { setQH2C1(e.target.value); };
    const handleQH2C2 = (e) => { setQH2C2(e.target.value); };
    const handleQH2C3 = (e) => { setQH2C3(e.target.value); };
    const handleQH2C4 = (e) => { setQH2C4(e.target.value); };
    const handleQH2C5 = (e) => { setQH2C5(e.target.value); };
    const [QH2, setQH2] = useState([QH2C1,QH2C2,QH2C3,QH2C4,QH2C5]);
    const [QH3C1, setQH3C1] = useState('');
    const [QH3C2, setQH3C2] = useState('');
    const [QH3C3, setQH3C3] = useState('');
    const [QH3C4, setQH3C4] = useState('');
    const [QH3C5, setQH3C5] = useState('');
    const handleQH3C1 = (e) => { setQH3C1(e.target.value); };
    const handleQH3C2 = (e) => { setQH3C2(e.target.value); };
    const handleQH3C3 = (e) => { setQH3C3(e.target.value); };
    const handleQH3C4 = (e) => { setQH3C4(e.target.value); };
    const handleQH3C5 = (e) => { setQH3C5(e.target.value); };
    const [QH3, setQH3] = useState([QH3C1,QH3C2,QH3C3,QH3C4,QH3C5]);
    const [QH4C1, setQH4C1] = useState('');
    const [QH4C2, setQH4C2] = useState('');
    const [QH4C3, setQH4C3] = useState('');
    const [QH4C4, setQH4C4] = useState('');
    const [QH4C5, setQH4C5] = useState('');
    const handleQH4C1 = (e) => { setQH4C1(e.target.value); };
    const handleQH4C2 = (e) => { setQH4C2(e.target.value); };
    const handleQH4C3 = (e) => { setQH4C3(e.target.value); };
    const handleQH4C4 = (e) => { setQH4C4(e.target.value); };
    const handleQH4C5 = (e) => { setQH4C5(e.target.value); };
    const [QH4, setQH4] = useState([QH4C1,QH4C2,QH4C3,QH4C4,QH4C5]);
    const [QH5C1, setQH5C1] = useState('');
    const [QH5C2, setQH5C2] = useState('');
    const [QH5C3, setQH5C3] = useState('');
    const [QH5C4, setQH5C4] = useState('');
    const [QH5C5, setQH5C5] = useState('');
    const handleQH5C1 = (e) => { setQH5C1(e.target.value); };
    const handleQH5C2 = (e) => { setQH5C2(e.target.value); };
    const handleQH5C3 = (e) => { setQH5C3(e.target.value); };
    const handleQH5C4 = (e) => { setQH5C4(e.target.value); };
    const handleQH5C5 = (e) => { setQH5C5(e.target.value); };
    const [QH5, setQH5] = useState([QH5C1,QH5C2,QH5C3,QH5C4,QH5C5]);

    useEffect(() => {
        setQH1([QH1C1, QH1C2, QH1C3, QH1C4, QH1C5]);
    }, [QH1C1, QH1C2, QH1C3, QH1C4, QH1C5]);

    useEffect(() => {
        setQH2([QH2C1, QH2C2, QH2C3, QH2C4, QH2C5]);
    }, [QH2C1, QH2C2, QH2C3, QH2C4, QH2C5]);

    useEffect(() => {
        setQH3([QH3C1, QH3C2, QH3C3, QH3C4, QH3C5]);
    }, [QH3C1, QH3C2, QH3C3, QH3C4, QH3C5]);

    useEffect(() => {
        setQH4([QH4C1, QH4C2, QH4C3, QH4C4, QH4C5]);
    }, [QH4C1, QH4C2, QH4C3, QH4C4, QH4C5]);
    
    useEffect(() => {
        setQH5([QH5C1, QH5C2, QH5C3, QH5C4, QH5C5]);
    }, [QH5C1, QH5C2, QH5C3, QH5C4, QH5C5]);

    //QueTopicDetails
    const [inputValues, setInputValues] = useState(Array(18).fill(''));
    const [checkboxValues, setCheckboxValues] = useState(Array(18).fill(false));
  
    const handleInputChange = (index, value) => {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);
    };
  
    const handleCheckboxChange = (index) => {
      const newCheckboxValues = [...checkboxValues];
      newCheckboxValues[index] = !newCheckboxValues[index];
      setCheckboxValues(newCheckboxValues);
    };
    // read data
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);
   
    const fetchDataUpdatequesheet = async () => {
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
                    setQueSheetName(result.quesheetname)
                    setQueSheetTopicName(result.quesheettopicname)
                    setDetailsLineOne(result.detailslineone)
                    setDetailsLinetwo(result.detailslinetwo)
                }
            )
        }catch (err) {
            setStartError(1);
           
        }
    };
    const fetchDataUpdatequeheaddetails = async () => {
        try{
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
                        const quehead1 = result.quehead1.split(',');
                        const quehead2 = result.quehead2.split(',');
                        const quehead3 = result.quehead3.split(',');
                        const quehead4 = result.quehead4.split(',');
                        const quehead5 = result.quehead5.split(',');
                        setQH1C1(quehead1[0])
                        setQH1C2(quehead1[1])
                        setQH1C3(quehead1[2])
                        setQH1C4(quehead1[3])
                        setQH1C5(quehead1[4])
                        setQH2C1(quehead2[0])
                        setQH2C2(quehead2[1])
                        setQH2C3(quehead2[2])
                        setQH2C4(quehead2[3])
                        setQH2C5(quehead2[4])
                        setQH3C1(quehead3[0])
                        setQH3C2(quehead3[1])
                        setQH3C3(quehead3[2])
                        setQH3C4(quehead3[3])
                        setQH3C5(quehead3[4])
                        setQH4C1(quehead4[0])
                        setQH4C2(quehead4[1])
                        setQH4C3(quehead4[2])
                        setQH4C4(quehead4[3])
                        setQH4C5(quehead4[4])
                        setQH5C1(quehead5[0])
                        setQH5C2(quehead5[1])
                        setQH5C3(quehead5[2])
                        setQH5C4(quehead5[3])
                        setQH5C5(quehead5[4])
                    }
                    
                }
            )
        }catch (err) {
            setStartError(1);
        }
    };
    const fetchDataUpdatequetopicdetails = async () => {
        try{
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
                        setInputValues(result.quetopicdetails.split(','))
                        const array = result.quetopicformat.split(',');
                        const booleanArray = array.map(item => item === '1');
                        setCheckboxValues(booleanArray)
                    }
                  
                }
            )
        }catch (err) {
            setStartError(1);
           
        }
    };
    if(Start === 0){
        fetchDataUpdatequesheet();
        fetchDataUpdatequeheaddetails();
        fetchDataUpdatequetopicdetails();
        setStart(1);
    }
    useEffect(() => {
        setTimeout(() => {
          setStartError(2);
        }, 800); 
    }, []);
    const ResetQue = (e) =>{
        Swal.fire({
            title: "",
            text: "ต้องการรีเซ็ทเป็นค่าเริ่มต้นใช่หรือไม่",
            icon: "question",//error,question,warning,success
            showCancelButton: true,
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then((result) => {
            fetchDataUpdatequesheet();
        });
      
    }
    const Resetdetails = (e) =>{
        Swal.fire({
            title: "",
            text: "ต้องการรีเซ็ทเป็นค่าเริ่มต้นใช่หรือไม่",
            icon: "question",//error,question,warning,success
            showCancelButton: true,
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then((result) => {
            fetchDataUpdatequeheaddetails();
            fetchDataUpdatequetopicdetails();
        });
    }
    function checkPath1(array){
        if(array[0] === '' || array[1] === ''){
            return true; 
        }else{
            return false; 
        }
    }
    function checkConsecutiveTrue(array) {
        for (let i = 0; i < array.length - 1; i++) {
          if (array[i] && array[i + 1]) {
            return true; 
          }
        }
        return false; 
    }
    function checkConsecutiveStrings(array) {
        let count = 0;
        for (let i = 0; i < array.length - 1; i++) {
          if (array[i] === "อื่นๆ") {
            count++
            if(count >= 2){
                return true;
            }
          }
        }
        return false; 
    }
    // FORM Submit
    async function handleSubmit(e) {
        e.preventDefault();
        if(checkPath1(QH1) === false){
           
            if(
                checkConsecutiveStrings(QH1) === false &&
                checkConsecutiveStrings(QH2) === false &&
                checkConsecutiveStrings(QH3) === false &&
                checkConsecutiveStrings(QH4) === false &&
                checkConsecutiveStrings(QH5) === false){
                if(checkConsecutiveTrue(checkboxValues) === false){
                    loading()
                }else{
                    Swal.fire({
                        title: "",
                        text: "ส่วนที่ 2 ไม่สามารถกำหนดหัวข้อใหญ่ติดกันได้",
                        icon: "error",
                        confirmButtonColor: "#341699",
                        confirmButtonText: "ยืนยัน",  
                    })
                }

            }else{
                Swal.fire({
                    title: "",
                    text: "ส่วนที่ 1 ในแต่ละหัวข้อสามารถมี อื่นๆ ได้เพียงแค่อันเดียว",
                    icon: "error",
                    confirmButtonColor: "#341699",
                    confirmButtonText: "ยืนยัน",  
                })
            }
        }else{
            Swal.fire({
                title: "",
                text: "ส่วนที่ 1 ต้องมีหัวข้ออย่างน้อย 1 หัวข้อและตัวเลือกอย่างน้อย 1 ตัวเลือก โดยเริ่มจากหัวข้อบนลงล่าง และตัวเลือกจากซ้ายไปขวา",
                icon: "error",
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",  
            })
        }
        
        
    };
    async function loading(){
        try {
            const loadingSwal = Swal.fire({
                title: 'กำลังประมวลผล...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: async () => { 
                    Swal.showLoading();
                    try {
                        const check = await UpdateQue()
                       if(check === true){
                            Swal.close();
                            Swal.fire({
                                title: "",
                                text: "แก้ไขแบบสอบถามเสร็จสิ้น",
                                icon: "success",
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ยืนยัน",  
                            }).then((result) => {
                                window.location.href = '/Questionnaire/QuestionnaireNo/ShowQuestionnaire/'+id;
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
    async function UpdateQue() {
        const formData = new FormData();
        const quesheet_data = {
            userid : Cookies.get('userid'),
            quesheetname : QueSheetName,
            quesheettopicname : QueSheetTopicName,
            detailslineone : DetailsLineOne,
            detailslinetwo : DetailsLinetwo,
            sequencesteps : 1,

        }
        const queheaddetails_data = {
            quehead1 : QH1.join(','),
            quehead2 : QH2.join(','),
            quehead3 : QH3.join(','),
            quehead4 : QH4.join(','),
            quehead5 : QH5.join(','),
        }
        const quetopicdetails_data = {
            quetopicdetails : inputValues.join(','),
            quetopicformat : checkboxValues.map(value => value ? 1 : 0).join(','),
        }
        formData.append("logo", File);
        formData.append("userid", Cookies.get('userid'));
        formData.append("quesheet", JSON.stringify(quesheet_data))
        formData.append("queheaddetails", JSON.stringify(queheaddetails_data))
        formData.append("quetopicdetails", JSON.stringify(quetopicdetails_data))
        formData.append("nonelogo",checknonelogo === false ? false : true)

        try{
            const quecreate = await fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                method: "PUT",
                body: formData,
            });
            const result = await quecreate.json()
            if (result) {
                if(result.err === undefined){
                    return true
                }else{
                    return result.err
                }
                
            }else{
                return result.err
            }
        }
        catch (err) {
            return false
        }
    }
    // DropZone
    const [File, setFile] = useState(''); // สำหรับเก็บไฟล์
    const [FileShow, setFileShow] = useState(''); // สำหรับเก็บไฟล์
    const [statusitem, setStatusItem] = useState(false); // สำหรับเปิด box แสดงชื่อไฟล์และลบลบไฟล์ box item
    const [namefileupload, setNameFileUpload] = useState(''); // สำหรับชื่อไฟล์อัปโหลด

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
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFileShow(reader.result);
        }
        setFile(file)
        setStatusItem(true);
        setNameFileUpload(file.path);

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
            setFileShow('')
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
                            <p><Link to="/Questionnaire">จัดการแบบสอบถาม</Link> / แก้ไขแบบสอบถาม</p>
                            <h2>แก้ไขแบบสอบถาม</h2>  
                        </div>
                        <div className='bx-details light'>
                            <form onSubmit={handleSubmit}>
                                {step ?
                                    <div className="">
                                        <div className="fb">กรอกรายละเอียดส่วนหัวแบบสอบถาม</div>
                                        <div className="bx-input-fix">
                                            <label htmlFor="QueSheetName" className="w150px">ชื่อแบบสอบถาม</label>
                                            <input className="mw300px"
                                                type="text"
                                                id="QueSheetName"
                                                name="QueSheetName"
                                                value={QueSheetName}
                                                onChange={handleInputQueSheetName}
                                                placeholder="กรอกชื่อแบบสอบถาม"
                                       
                                            />
                                        </div>
                                        <div className="bx-input-fix">
                                            <label htmlFor="QueSheetTopicName" className="w150px">ชื่อหัวข้อแบบสอบถาม</label>
                                            <input className="mw300px"
                                                type="text"
                                                id="QueSheetTopicName"
                                                name="QueSheetTopicName"
                                                value={QueSheetTopicName}
                                                onChange={handleInputQueSheetTopicName}
                                                placeholder="กรอกชื่อหัวข้อแบบสอบถาม"
                                                maxLength={60}
                                            />
                                        </div>
                                        <div className="bx-input-fix">
                                            <label htmlFor="DetailsLineOne" className="w150px">รายละเอียดบรรทัดที่ 1</label>
                                            <input className="mw300px"
                                                type="text"
                                                id="DetailsLineOne"
                                                name="DetailsLineOne"
                                                value={DetailsLineOne}
                                                onChange={handleInputDetailsLineOne}
                                                placeholder="กรอกรายละเอียดบรรทัดที่ 1"
                                                maxLength={90}
                                            />
                                        </div>
                                        <div className="bx-input-fix">
                                        <label htmlFor="DetailsLinetwo" className="w150px">รายละเอียดบรรทัดที่ 2</label>
                                            <input className="mw300px"
                                                type="text"
                                                id="DetailsLinetwo"
                                                name="DetailsLinetwo"
                                                value={DetailsLinetwo}
                                                onChange={handleInputDetailsLinetwo}
                                                placeholder="กรอกรายละเอียดบรรทัดที่ 2"
                                                maxLength={90}
                                            />
                                        </div>
                                        <div className="space5"></div>
                                        <div className="bx-input-fix">
                                            <span className="flex">
                                                <input className="mgR10"
                                                    type="checkbox"
                                                    id="myCheckbox"
                                                    checked={checknonelogo}
                                                    onChange={handlenonelogo}
                                                />
                                                <label htmlFor="myCheckbox">เอาตราสัญลักษณ์ออก</label>
                                            </span>
                                        </div>
                                        <div className="fb">ปรับแต่งตราสัญลักษณ์ <span className="fs12" style={{ fontWeight: "normal" }}>(ขนาดรูปภาพที่แนะนำ 300 x 135 Pixels)</span></div>
                                        <div className={checknonelogo === true ?"mw300px wait":"mw300px"}>
                                            <div className="dropzone">
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
                                        </div>
                                        <div className="space5"></div>
                                        <div className="fb">แสดงตัวอย่างส่วนหัวแบบสอบถาม</div>
                                        <div className="showTopicQue center">
                                            <div className="showsizeQue">
                                                <div className="showimg">
                                                    <div>{FileShow === '' ? <p className="emblem">รูปตราสัญลักษณ์ (ถ้ามี)</p>:<img src={FileShow} alt=""/>}</div>
                                                    <div><img src="/img/logoKMITL.png" alt=""/></div>
                                                </div>
                                                <div className="showtext">
                                                    <div>{QueSheetTopicName === ''? "ชื่อหัวข้อแบบสอบถาม":QueSheetTopicName}</div>
                                                    <div>{DetailsLineOne === ''? "รายละเอียดบรรทัดที่ 1":DetailsLineOne}</div>
                                                    <div>{DetailsLinetwo === ''? "รายละเอียดบรรทัดที่ 2":DetailsLinetwo}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bx-button'>
                                            <div className='button-reset'  onClick={ResetQue}>รีเซ็ท</div>
                                            <div className='button-submit' onClick={handstep}>ถัดไป</div>
                                        </div>
                                    </div>
                                :
                                <div>
                                    <div>
                                        <p>ส่วนที่ 1 : ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม </p>
                                        <p className="danger-font fs12">*หากพิมพ์ตัวเลือกเป็น "อื่นๆ" เพื่อต้องการให้มีการระบุได้ ไม่ต้องพิมพ์ ... หรือ ___ ตามหลัง</p>
                                        <div className="tableQue ">
                                        <table className="">
                                                <thead>
                                                    <tr>
                                                        <th className="grey">หัวข้อ</th>
                                                        <th className="grey">ตัวเลือกที่ 1</th>
                                                        <th className="grey">ตัวเลือกที่ 2</th>
                                                        <th className="grey">ตัวเลือกที่ 3</th>
                                                        <th className="grey">ตัวเลือกที่ 4</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <tr >
                                                        <td className="w150px"><input type="text" id="" name="" value={QH1C1} onChange={handleQH1C1} placeholder="" maxLength={20}/></td>
                                                        <td className="w150px"><input type="text" id="" name="" value={QH1C2} onChange={handleQH1C2} placeholder="" maxLength={15}/></td>
                                                        <td className="w150px"><input type="text" id="" name="" value={QH1C3} onChange={handleQH1C3} placeholder="" maxLength={15}/></td>
                                                        <td className="w150px"><input type="text" id="" name="" value={QH1C4} onChange={handleQH1C4} placeholder="" maxLength={15}/></td>
                                                        <td className="w150px"><input type="text" id="" name="" value={QH1C5} onChange={handleQH1C5} placeholder="" maxLength={15}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="text" id="" name="" value={QH2C1} onChange={handleQH2C1} placeholder="" maxLength={20}/></td>
                                                        <td><input type="text" id="" name="" value={QH2C2} onChange={handleQH2C2} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH2C3} onChange={handleQH2C3} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH2C4} onChange={handleQH2C4} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH2C5} onChange={handleQH2C5} placeholder="" maxLength={15}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="text" id="" name="" value={QH3C1} onChange={handleQH3C1} placeholder="" maxLength={20}/></td>
                                                        <td><input type="text" id="" name="" value={QH3C2} onChange={handleQH3C2} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH3C3} onChange={handleQH3C3} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH3C4} onChange={handleQH3C4} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH3C5} onChange={handleQH3C5} placeholder="" maxLength={15}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="text" id="" name="" value={QH4C1} onChange={handleQH4C1} placeholder="" maxLength={20}/></td>
                                                        <td><input type="text" id="" name="" value={QH4C2} onChange={handleQH4C2} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH4C3} onChange={handleQH4C3} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH4C4} onChange={handleQH4C4} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH4C5} onChange={handleQH4C5} placeholder="" maxLength={15}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="text" id="" name="" value={QH5C1} onChange={handleQH5C1} placeholder="" maxLength={20}/></td>
                                                        <td><input type="text" id="" name="" value={QH5C2} onChange={handleQH5C2} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH5C3} onChange={handleQH5C3} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH5C4} onChange={handleQH5C4} placeholder="" maxLength={15}/></td>
                                                        <td><input type="text" id="" name="" value={QH5C5} onChange={handleQH5C5} placeholder="" maxLength={15}/></td>
                                                    </tr>
                                                
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* display: grid;
                                        width: fit-content;
                                        overflow: auto;
                                        min-width: 790px; */}
                                        <p>ส่วนที่ 2: ความคิดเห็นเกี่ยวกับแบบสอบถาม (5: มากที่สุด, 4: มาก, 3: ปานกลาง, 2: น้อย, 1: น้อยที่สุด, 0: ไม่ประเมิน)</p>
                                        <p className="danger-font fs12">*หากเลือก "หัวข้อใหญ่" หัวข้อนั้นจะไม่มีชอยซ์สำหรับฝนระดับความคิดเห็น</p>
                                        <div className="tableQue">
                                            <table className="">
                                                <thead>
                                                    <tr>
                                                        <th>หัวข้อ</th>
                                                        <th>หัวข้อใหญ่</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* <tr>
                                                        <td><div><input type="text" id="" name="" value={this} onChange={null} placeholder="" /></div></td>
                                                        <td><div className="flexCenter"><input className="mgR10" value = "two" type = "checkbox" onChange = {null} /></div></td>
                                                    </tr>
                                                    <tr>
                                                        <td><div><input type="text" id="" name="" value={this} onChange={null} placeholder="" /></div></td>
                                                        <td><div className="flexCenter"><input className="mgR10" value = "two" type = "checkbox" onChange = {null} /></div></td>
                                                    </tr> */}
                                                        {Array.from({ length: 18 }, (_, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div>
                                                                        <input className={checkboxValues[index] ?"light-blue":""}
                                                                        type="text"
                                                                        id={`input-${index}`}
                                                                        name={`input-${index}`}
                                                                        value={inputValues[index]}
                                                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                                                        placeholder=""
                                                                        maxLength={100}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="flexCenter">
                                                                        <input
                                                                        className="mgR10"
                                                                        type="checkbox"
                                                                        checked={checkboxValues[index]}
                                                                        onChange={() => handleCheckboxChange(index)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            
                                            </table>
                                            <div className='bx-button'>
                                                <div className='button-cancel' onClick={handstep}>ย้อนกลับ</div>
                                                <div className='button-reset' onClick={Resetdetails}>รีเซ็ท</div>
                                                <button type="submit" className='button-submit'>บันทึก</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppUpdateQuetionaire;