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
function AppCreateQuestionnaire(){
    const [step,setstep] = useState(true);
    const [start,setstart] = useState(0);

    const [QueSheetName, setQueSheetName] = useState('');
    const [QueSheetTopicName, setQueSheetTopicName] = useState('');
    const [DetailsLineOne, setDetailsLineOne] = useState('');
    const [DetailsLinetwo, setDetailsLinetwo] = useState('');
    // const [Symbolposition, setSymbolposition] = useState('');

    const handleInputQueSheetName = (e) => { setQueSheetName(e.target.value); };
    const handleInputQueSheetTopicName = (e) => {setQueSheetTopicName(e.target.value);};
    const handleInputDetailsLineOne = (e) => { setDetailsLineOne(e.target.value); };
    const handleInputDetailsLinetwo = (e) => {setDetailsLinetwo(e.target.value);};
    // const handleInputSymbolposition = (e) => {setSymbolposition(e.target.value);};
    const handstep = (e) => {
        e.preventDefault();
        if(QueSheetName !== ''){
            if(step === true){
                setstep(false)
            }else{
                setstep(true)
            }
        }else{
            Swal.fire({
                title: "",
                text: QueSheetName !== ''? "":"กรุณากรอกชื่อแบบสอบถาม" ,
                icon: "error",
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",  
            })
        }
      
    }

    //QueHeadDetails
    const [QH1C1, setQH1C1] = useState('ช่วงอายุ');
    const [QH1C2, setQH1C2] = useState('ต่ำกว่า 20 ปี');
    const [QH1C3, setQH1C3] = useState('20-30 ปี');
    const [QH1C4, setQH1C4] = useState('31-40 ปี');
    const [QH1C5, setQH1C5] = useState('40 ปีขึ้นไป');
    const handleQH1C1 = (e) => { setQH1C1(e.target.value); };
    const handleQH1C2 = (e) => { setQH1C2(e.target.value); };
    const handleQH1C3 = (e) => { setQH1C3(e.target.value); };
    const handleQH1C4 = (e) => { setQH1C4(e.target.value); };
    const handleQH1C5 = (e) => { setQH1C5(e.target.value); };
    const [QH1, setQH1] = useState([QH1C1,QH1C2,QH1C3,QH1C4,QH1C5]);
    const [QH2C1, setQH2C1] = useState('เพศ');
    const [QH2C2, setQH2C2] = useState('ชาย');
    const [QH2C3, setQH2C3] = useState('หญิง');
    const [QH2C4, setQH2C4] = useState('');
    const [QH2C5, setQH2C5] = useState('');
    const handleQH2C1 = (e) => { setQH2C1(e.target.value); };
    const handleQH2C2 = (e) => { setQH2C2(e.target.value); };
    const handleQH2C3 = (e) => { setQH2C3(e.target.value); };
    const handleQH2C4 = (e) => { setQH2C4(e.target.value); };
    const handleQH2C5 = (e) => { setQH2C5(e.target.value); };
    const [QH2, setQH2] = useState([QH2C1,QH2C2,QH2C3,QH2C4,QH2C5]);
    const [QH3C1, setQH3C1] = useState('ระดับการศึกษา');
    const [QH3C2, setQH3C2] = useState('ปริญญาตรี');
    const [QH3C3, setQH3C3] = useState('ปริญญาโท');
    const [QH3C4, setQH3C4] = useState('ปริญญาเอก');
    const [QH3C5, setQH3C5] = useState('อื่นๆ');
    const handleQH3C1 = (e) => { setQH3C1(e.target.value); };
    const handleQH3C2 = (e) => { setQH3C2(e.target.value); };
    const handleQH3C3 = (e) => { setQH3C3(e.target.value); };
    const handleQH3C4 = (e) => { setQH3C4(e.target.value); };
    const handleQH3C5 = (e) => { setQH3C5(e.target.value); };
    const [QH3, setQH3] = useState([QH3C1,QH3C2,QH3C3,QH3C4,QH3C5]);
    const [QH4C1, setQH4C1] = useState('สถานะ');
    const [QH4C2, setQH4C2] = useState('นักศึกษา');
    const [QH4C3, setQH4C3] = useState('บุคลากร');
    const [QH4C4, setQH4C4] = useState('บุคคลภายนอก');
    const [QH4C5, setQH4C5] = useState('อื่นๆ');
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

    const dataPart2 = [
        { input: 'ความรู้ความเข้าใจของผู้เข้าอบรม', checkbox: true, disabled:true },
        { input: 'ก่อนเข้าอบรม ท่านมีความรู้ความเข้าใจก่อนการฝึกอบรม', checkbox: false, disabled:false },
        { input: 'หลังเข้าอบรม ท่านมีความรู้ความเข้าใจหลังการฝึกอบรม', checkbox: false, disabled:false },
        { input: 'ประโยชน์จากการนำความรู้ความเข้าใจที่ได้จากการฝึก', checkbox: false, disabled:false },
        { input: 'วิทยากร', checkbox: true, disabled:false },
        { input: 'ความรู้เกี่ยวกับหัวข้อหลังการบรรยาย', checkbox: false, disabled:false },
        { input: 'การบรรยายชัดเจน/เข้าใจง่าย', checkbox: false, disabled:false },
        { input: 'วิธีการถ่ายทอดเนื้อหาให้น่าสนใจ', checkbox: false, disabled:false },
        { input: 'เอกสาร/สื่อ ประกอบการบรรยาย', checkbox: false, disabled:false },
        { input: 'การตอบคำถามตรงประเด็น', checkbox: false, disabled:false },
        { input: 'ความเหมาะสมของวิทยากรโดยรวม', checkbox: false, disabled:false },
        { input: 'รูปแบบการดำเนินงาน', checkbox: true, disabled:false },
        { input: 'การรับข่าวประชาสัมพันธ์การจัดอบรม', checkbox: false, disabled:false },
        { input: 'การประสานงาน/การต้อนรับ', checkbox: false, disabled:false },
        { input: 'ระยะเวลาการอบรม', checkbox: false, disabled:false },
        { input: 'ความพร้อมของอุปกรณ์/สื่ออิเล็กทรอนิกส์ต่างๆ', checkbox: false, disabled:false },
        { input: 'ความเหมาะสมของสถานที่', checkbox: false, disabled:false },
        { input: '', checkbox: false, disabled:false },
    ];
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
    function checkPath1(array){
        if(array[0] === '' || array[1] === ''){
            return true; 
        }else{
            return false; 
        }
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
                        const check = await CreateQue()
                       if(check === true){
                            Swal.close();
                            Swal.fire({
                                title: "",
                                text: "สร้างแบบสอบถามเสร็จสิ้น",
                                icon: "success",
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ยืนยัน",  
                            }).then((result) => {
                                window.location.href = '/Questionnaire';
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
    async function CreateQue() {
       

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

        try{
            const quecreate = await fetch(variables.API_URL + "quesheet/create/", {
                method: "POST",
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
            setFileShow('')
            setStatusItem(false);
        }
        });
    }
    function path1(){
        // setQueSheetName("CE SmartCamp")
        // setQueSheetTopicName("CE SmartCamp")
        // setDetailsLineOne("30 พฤษภาคม 2566 - 4 มิถุนายน 2566")
        // setDetailsLinetwo("ภาควิชาคอมพิวเตอร์")
        // setQueSheetName("")
        // setQueSheetTopicName("")
        // setDetailsLineOne("")
        // setDetailsLinetwo("")
        // setFile('')
        // setFileShow('')
        // setStatusItem(false)
        // setNameFileUpload('')
    };
    function processData(data) {
        const newInputValues = [...inputValues];
        const newCheckboxValues = [...checkboxValues];
    
        for (let i = 0; i < data.length; i++) {
            newInputValues[i] = data[i].input;
            newCheckboxValues[i] = data[i].checkbox;
        }
    
        setInputValues(newInputValues);
        setCheckboxValues(newCheckboxValues);
    
    
    }
    if(start === 0){
        path1();
        processData(dataPart2)
        setstart(1)
    }
    const handlereset1 = async (e) => {
        // setQueSheetName("CE SmartCamp")
        // setQueSheetTopicName("CE SmartCamp")
        // setDetailsLineOne("30 พฤษภาคม 2566 - 4 มิถุนายน 2566")
        // setDetailsLinetwo("ภาควิชาคอมพิวเตอร์")
        setQueSheetName("")
        setQueSheetTopicName("")
        setDetailsLineOne("")
        setDetailsLinetwo("")
        setFile('')
        setFileShow('')
        setStatusItem(false)
        setNameFileUpload('')
    };
    const handlereset2 = async (e) => {
        processData(dataPart2)
    };
    return(
        <div className='content'>
            <main>
                <div className='box-content'>
                    <div className='box-content-view'>
                        <div className='bx-topic light'>
                            <p><Link to="/Questionnaire">จัดการแบบสอบถาม</Link> / สร้างแบบสอบถาม</p>
                            <h2>สร้างแบบสอบถาม</h2>  
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
                                        <div className="fb">ปรับแต่งตราสัญลักษณ์ (ขนาดรูปภาพที่แนะนำ 300 x 135 Pixels)</div>
                                        <div className="mw300px">
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
                                                    <div>{QueSheetTopicName === ''? <span className="danger-font">ชื่อหัวข้อแบบสอบถาม</span>:QueSheetTopicName}</div>
                                                    <div>{DetailsLineOne === ''? <span className="danger-font">รายละเอียดบรรทัดที่ 1</span>:DetailsLineOne}</div>
                                                    <div>{DetailsLinetwo === ''? <span className="danger-font">รายละเอียดบรรทัดที่ 2</span>:DetailsLinetwo}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bx-button'>
                                        <button type="reset" onClick={handlereset1} className='button-reset'>รีเซ็ท</button>
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
                                                                            // value={dataPart2[index].checkbox}
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
                                                <button type="reset" onClick={handlereset2} className='button-reset'>รีเซ็ท</button>
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

export default AppCreateQuestionnaire;