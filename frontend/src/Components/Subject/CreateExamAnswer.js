import {
    Link,
} from "react-router-dom";
import React, { useState ,useCallback} from 'react';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudArrowUp,faTrashCan,faCircle} from "@fortawesome/free-solid-svg-icons";

import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
import Alertmanual from "../Tools/ToolAlertmanual";

function AppCreateExamAnswer(){

    const { id } = useParams();
    const { idsetexam } = useParams();
    const { idstatus } = useParams();
    const { idexamanswersid } = useParams();
    

    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [NumExam, setNumExam] = useState(120);
    
    const [answersheetformat, setanswersheetformat] = useState(1);
    
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');

    const [selectedOption, setSelectedOption] = useState('1');
    const [inputValue1, setInputValue1] = useState('1');
    const [inputValue2, setInputValue2] = useState('0');
    
    const handleOptionChange = (event) => {setSelectedOption(event.target.value);};
    const handleInputChange1 = (event) => {setInputValue1(event.target.value);};
    const handleInputChange2 = (event) => {setInputValue2(event.target.value);};

    const [StepCreate, setStepCreate] = useState(0);
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataStart = async () => {
        try{
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
                    setNumExam(result.numberofexams)
                    setanswersheetformat(result.answersheetformat)
                    setsubid(result.subid)
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
                                setStartError(2);
                            }
                            
                        }
                    )
                }
            )
        }catch (err) {
            setStartError(1);
        }
    };
    const fetchDataExamanswersStart = async () => {
        try{
            // Fetch ข้อมูลไปยัง API เพื่อขอข้อมูลเกี่ยวกับ examanswers
            fetch(variables.API_URL+"examanswers/detail/"+id+"/", {
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
                        // จัดการช้อยให้อยู่ในรูปบแบบที่ตรงกับข้อมูลที่ดึงออกมา
                        transformScoringCriteria(result.scoringcriteria)
                    }  
                }
            ) 
        }catch (err) {
            setStartError(2);
        }
    };
    const fetchDataExamAnswer = async () => {
        try{
            //Fetch API เพื่อทำการดึกข้อมูล examanswers/detail/exam/ ขอข้อมูล examanswers exam
            fetch(variables.API_URL+"examanswers/detail/exam/"+id+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    const sortedExamAnswers = result.sort((a, b) => {
                        return parseInt(a.examnoanswers) - parseInt(b.examnoanswers);
                    });
                    getType(sortedExamAnswers)
                }
            )
        }catch (err) {
        }
    };
    if(Start === 0){
        fetchDataStart();
        fetchDataExamanswersStart();
        fetchDataExamAnswer()
        setStart(1);
    }
    function getType(dataExamAnswer) {
        try{
            const input = dataExamAnswer[0].scoringcriteria
            const pairs = input.split(',');
            let typeOption = '1';
            pairs.forEach(pair => {
                const letters = pair.split(':');
                typeOption = letters[1]
            });
            setSelectedOption(typeOption)
        }catch(e){

        }
    }
    // สร้างคำตอบ
    const [checkboxValues1, setCheckboxValues1] = useState(Array(NumExam).fill(false));//ก
    const [checkboxValues2, setCheckboxValues2] = useState(Array(NumExam).fill(false));//ข
    const [checkboxValues3, setCheckboxValues3] = useState(Array(NumExam).fill(false));//ค
    const [checkboxValues4, setCheckboxValues4] = useState(Array(NumExam).fill(false));//ง
    const [checkboxValues5, setCheckboxValues5] = useState(Array(NumExam).fill(false));//จ
    const [checkboxValues6, setCheckboxValues6] = useState(Array(NumExam).fill(false));//ฉ
    const [checkboxValues7, setCheckboxValues7] = useState(Array(NumExam).fill(false));//ช
    const [checkboxValues8, setCheckboxValues8] = useState(Array(NumExam).fill(false));//ซ
    const [inputValues1, setInputValues1] = useState(Array(NumExam).fill('1'));//คะแนนตอบถูก	
    const [inputValues2, setInputValues2] = useState(Array(NumExam).fill('0'));//คะแนนตอบผิด

    const handleCheckbox1Change = (index) => {
      const newCheckboxValues = [...checkboxValues1];
      newCheckboxValues[index] = !newCheckboxValues[index];
      setCheckboxValues1(newCheckboxValues);
    };
    const handleCheckbox2Change = (index) => {
        const newCheckboxValues = [...checkboxValues2];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues2(newCheckboxValues);
    };
    const handleCheckbox3Change = (index) => {
        const newCheckboxValues = [...checkboxValues3];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues3(newCheckboxValues);
    };
    const handleCheckbox4Change = (index) => {
        const newCheckboxValues = [...checkboxValues4];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues4(newCheckboxValues);
    };
    const handleCheckbox5Change = (index) => {
        const newCheckboxValues = [...checkboxValues5];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues5(newCheckboxValues);
    };
    const handleCheckbox6Change = (index) => {
        const newCheckboxValues = [...checkboxValues6];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues6(newCheckboxValues);
    };
    const handleCheckbox7Change = (index) => {
        const newCheckboxValues = [...checkboxValues7];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues7(newCheckboxValues);
    };
    const handleCheckbox8Change = (index) => {
        const newCheckboxValues = [...checkboxValues8];
        newCheckboxValues[index] = !newCheckboxValues[index];
        setCheckboxValues8(newCheckboxValues);
    };

    const handleInput1Change = (index, value) => { //ปรับคะแนนตอบถูก
        const newInputValues = [...inputValues1]; 
        newInputValues[index] = value;
        setInputValues1(newInputValues);
    };
    const handleInput2Change = (index, value) => {//ปรับคะแนนตอบผิด
        const newInputValues = [...inputValues2];
        newInputValues[index] = Math.abs(value);
        setInputValues2(newInputValues);
    };

    // กำหนดรูปแบบคำตอบจาก true ให้เป็น A B C D E F G H 
    const ChangeAnswerFormat = (checkboxValues , index) => {
        if(index === 'A'){
            return checkboxValues.map(value => value ? 'A' : null);
        }
        else if(index === 'B'){
            return checkboxValues.map(value => value ? 'B' : null);
        }
        else if(index === 'C'){
            return checkboxValues.map(value => value ? 'C' : null);
        }
        else if(index === 'D'){
            return checkboxValues.map(value => value ? 'D' : null);
        }
        else if(index === 'E'){
            return checkboxValues.map(value => value ? 'E' : null);
        }
        else if(index === 'F'){
            return checkboxValues.map(value => value ? 'F' : null);
        }
        else if(index === 'G'){
            return checkboxValues.map(value => value ? 'G' : null);
        }
        else if(index === 'H'){
            return checkboxValues.map(value => value ? 'H' : null);
        }
    };

    const setChoiceAnswers = (A, B, C, D, E, F, G, H) => { 
        const indexArray = Array.from({ length: NumExam }, (_, index) => index);
        return indexArray.map(index => {
            const value1 = A[index];
            const value2 = B[index];
            const value3 = C[index];
            const value4 = D[index];
            const value5 = E[index];
            const value6 = F[index];
            const value7 = G[index];
            const value8 = H[index];
            // นำช้อย A-H มาตรวจสอบโดยเอา null ออก
            const nonNullValues = [value1, value2, value3 ,value4, value5, value6, value7, value8].filter(value => value !== null);
            return nonNullValues.join(':');
        });
    }
    // กำหนดรูปแบบข้อมูล ScoringCriteria ให้อยูในรูปแบบที่ต้องการ
    function generateScoringCriteria(Data1, Data2, Data3, Data4) {
        const output = [];

        for (let i = 1; i <= Data1; i++) {
            const tempArray = [];
            tempArray.push(`${i}:${Data2}:${Data3[i-1]}:${Data4[i-1]}`);
            output.push(tempArray);
        }
        return output;
    }
    // ไปยัง step การทำงานถัดไป
    const handleNextStep = (e) => {
        if(StepCreate === 0){
            if(idstatus === '1'){
                setStepCreate(2)
            }else if(idstatus === '2'){
                setStepCreate(1)
            }
        }else if(StepCreate === 1){
            setStepCreate(2)
        }
        setInputValues1(inputValues1.map(value => inputValue1));
        setInputValues2(inputValues2.map(value => inputValue2));
    }
    // ย้อน step การทำงานถัดไป
    const handleReverseStep = (e) => {
        if(StepCreate === 0){
            setStepCreate(0)
        }else if(StepCreate === 1){
            if(idstatus === '1'){setStepCreate(0)}
            else if(idstatus === '2'){setStepCreate(0)}
        }
        else if(StepCreate === 2){
            if(idstatus === '1'){setStepCreate(0)}
            else if(idstatus === '2'){setStepCreate(1)} 
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        // กำหนดช้อยให้อยู่ในรูปแบบที่ต้องการ
        const CAOutput = setChoiceAnswers(
            ChangeAnswerFormat(checkboxValues1,"A"),
            ChangeAnswerFormat(checkboxValues2,"B"),
            ChangeAnswerFormat(checkboxValues3,"C"),
            ChangeAnswerFormat(checkboxValues4,"D"),
            ChangeAnswerFormat(checkboxValues5,"E"),
            ChangeAnswerFormat(checkboxValues6,"F"),
            ChangeAnswerFormat(checkboxValues7,"G"),
            ChangeAnswerFormat(checkboxValues8,"H")
        )
        const nullIndices = CAOutput.map((element, index) => element === '' ? index + 1 : null).filter(index => index !== null);
        const ChoiceAnswersOutput = CAOutput.join(',');

        const ScoringCriteria = generateScoringCriteria(NumExam,selectedOption,inputValues1,inputValues2);
        const ScoringCriteriaOutput = ScoringCriteria.map(arr => arr[0]).join(',');
        if(nullIndices.length <= NumExam/2){ // ตรวจสอบว่าต้องมีการเลือกช้อยมากกว่าครึ่งนึง
            Swal.fire({
                title: `สร้างเฉลยข้อสอบชุดที่ `+idsetexam,
                text: (nullIndices.length === 0 ? "คุณต้องการสร้างเฉลยใช่หรือไม่":'ยังมีข้อ '+nullIndices+" ยังตอบไม่ครบ ยืนยันที่จะสร้างเฉลยใช่หรือไม่"),
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: (nullIndices.length ===0 ? "#341699":"#d33"),
                confirmButtonText: "ยืนยัน",
                cancelButtonText:"ยกเลิก"
            }).then( async (result) => {
                if(result.isConfirmed){
                    try {
                        // const response = await fetch(variables.API_URL + "examanswers/create/", {
                        //     method: "POST",
                        //     headers: {
                        //         'Accept': 'application/json, text/plain',
                        //         'Content-Type': 'application/json;charset=UTF-8'
                        //     },
                        //     body: JSON.stringify({
                        //         // examnoanswers : idsetexam,
                        //         examnoanswers : idsetexam,
                        //         scoringcriteria : ScoringCriteriaOutput,
                        //         choiceanswers : ChoiceAnswersOutput,
                        //         papeans_path : null,
                        //         examid : id
                        //     }),
                        // });

                        const response = await fetch(variables.API_URL + "examanswers/update/"+idexamanswersid+"/", {
                            method: "PUT",
                            headers: {
                                'Accept': 'application/json, text/plain',
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify({
                                scoringcriteria : ScoringCriteriaOutput,
                                choiceanswers : ChoiceAnswersOutput
                            }),
                        });

                        const result = await response.json();

                        if (response.ok) {
                            Swal.fire({
                                title: "สร้างเฉลยข้อสอบเสร็จสิ้น",
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ยืนยัน",
                            }).then((result) => {
                                window.location.href = '/Subject/SubjectNo/Exam/ExamAnswer/'+id+'/';
                            });
                            
                        } else {
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด"+result.err,
                                icon: "error",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                        }
                    } catch (err) {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด"+err,
                            icon: "error",//error,question,warning,success
                            confirmButtonColor: "#341699",
                        });
                    }
                }
            
            });
                        
        }else{
            Swal.fire({
                title: "ต้องกำหนดเฉลยมากกว่าหรือเท่าครึ่งนึงของข้อสอบ",
                icon: "warning",//error,question,warning,success
                confirmButtonColor: "#341699",
            });
        }
    }

    // DropZone
    const [File, setFile] = useState(''); // สำหรับเก็บไฟล์
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
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onloadend = () => {
        //     setFile(reader.result);
        // }
        setFile(file);
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
        }
        });
    }
    function transformScoringCriteria(input) {
        const pairs = input.split(',');
        let typeOption = '1';
        let inputV1 = [];
        let inputV2 = [];
        pairs.forEach(pair => {
            const letters = pair.split(':');
            typeOption = letters[1]
            inputV1.push(letters[2])
            inputV2.push(letters[3])

        });

        setSelectedOption(typeOption)
        setInputValues1(inputV1);
        setInputValues2(inputV2);
    }
    async function handleSubmitFile(e) {
        e.preventDefault();
        if ((File !== '')) {
            Swal.fire({
                title: "",
                text: `กดยืนยันเพื่อทำการสร้างกระดาษคำตอบ`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
                cancelButtonColor: "#d33",
                cancelButtonText: "ยกเลิก"
            }).then(async (result) => {
                if (result.isConfirmed) { // กดยืนยัน
                    try{
                        const formData = new FormData();
                        formData.append("file", File);
                        formData.append("userid", Cookies.get('userid'));
                        formData.append("examid", id);
                        //fetch กระดาษคำตอบไปยัง "examanswers/upload/paper/" เพื่อทำการตรวจกระดาษคำตอบ
                        const upload = await fetch(variables.API_URL + "examanswers/upload/paper/", {
                            method: "POST",
                            body: formData,
                        });
                        const result = await upload.json()
                        if (result.err === undefined) {
                            transformChoice(result.choiceanswers) // จัดรูปแบบไฟล์ให้อยู่ในรูปแบบที่ต้องการ
                            Swal.fire({
                                title: result.msg,
                                text: result.msg,
                                icon: "success", //error,question,warning,success
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ตกลง",
                            }).then((result) => {
                                setStepCreate(2)
                            });
                           
                        }else{
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด",
                                text: ``+result.err,
                                icon: "error", //error,question,warning,success
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ตกลง",
                            }).then((result) => {});
                        }
                    }
                    catch (err) {
                    }
                }
            });
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
    
    function transformChoice(input) {
        const pairs = input.split(',');
        let A = [];
        let B = [];
        let C = [];
        let D = [];
        let E = [];
        let F = [];
        let G = [];
        let H = [];
        let item = [];
        // แยกคำตอบ A-H ให้ข้อที่ตอบเป็น true
        pairs.forEach(pair => {
            const letters = pair.split(':');
            letters.forEach(item => {
                if(item === "A") {A.push(true);}else{}
                if(item === "B") {B.push(true);}else{}
                if(item === "C") {C.push(true);}else{}
                if(item === "D") {D.push(true);}else{}
                if(item === "E") {E.push(true);}else{}
                if(item === "F") {F.push(true);}else{}
                if(item === "G") {G.push(true);}else{}
                if(item === "H") {H.push(true);}else{}
            });
            item.push(true);
            if(item.length > A.length){A.push(false);}
            if(item.length > B.length){B.push(false);}
            if(item.length > C.length){C.push(false);}
            if(item.length > D.length){D.push(false);}
            if(item.length > E.length){E.push(false);}
            if(item.length > F.length){F.push(false);}
            if(item.length > G.length){G.push(false);}
            if(item.length > H.length){H.push(false);}
        });
        // กำหนดช้อยให้อยู่ในรูปแบบที่ถูกต้อง
        setCheckboxValues1(A);
        setCheckboxValues2(B);
        setCheckboxValues3(C);
        setCheckboxValues4(D);
        setCheckboxValues5(E);
        setCheckboxValues6(F);
        setCheckboxValues7(G);
        setCheckboxValues8(H);
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
                    <div className='box-content-view'>
                        <div className='bx-topic light'>
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link> / <Link to={"/Subject/SubjectNo/Exam/ExamAnswer/"+ExamNoShow}> เฉลยคำตอบ </Link> / สร้างเฉลย</p>
                            <div className='bx-grid2-topic'>
                                <h2>{idstatus === "1" ?"สร้างเฉลยด้วยตนเอง":"สร้างเฉลยด้วยการสแกนไฟล์"} <Alertmanual name={"createexamanswer"} status={"1"}/></h2>                           
                            </div> 
                        </div>
                        <div className='bx-details light'>
                            <div className="bx-grid-detail-topic">
                            
                            </div>
                            <div>
                                {/* <div className="fb">ชุดข้อสอบที่ {idsetexam}</div> */}
                                <h3>ชุดข้อสอบที่ {idsetexam}</h3>
                            </div>
                            {StepCreate === 0 ?
                                <div>
                                    <div >
                                        <div className="fb">เงื่อนไขการให้คะแนน</div>
                                        <div>
                                            <div>{selectedOption === '1' || selectedOption === 1 ? <div><span className="green-font"><FontAwesomeIcon icon={faCircle} /></span> ต้องตอบถูกทุกข้อ </div>: <div><span className="grey-font"><FontAwesomeIcon icon={faCircle} /></span> ต้องตอบถูกทุกข้อ </div>}</div>
                                            <div>{selectedOption === '2' || selectedOption === 2 ? <div><span className="green-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อได้คะแนนตามสัดส่วน (ห้ามตอบเกิน) </div> : <div><span className="grey-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อได้คะแนนตามสัดส่วน (ห้ามตอบเกิน)</div>}</div>
                                            <div>{selectedOption === '3' || selectedOption === 3 ? <div><span className="green-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อลบคะแนนตามสัดส่วน (ห้ามตอบเกิน) </div> : <div><span className="grey-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อลบคะแนนตามสัดส่วน (ห้ามตอบเกิน)</div>}</div>
                                        </div>
                                        {/* <div>
                                            <div className="bx-input-fix">
                                                <span className="flex">
                                                    <div className="w30px"><input className="mgR10" type="radio" name="option" value="1" checked={selectedOption === '1'} onChange={handleOptionChange}/></div>ต้องตอบถูกทุกข้อ
                                                </span>
                                            </div>
                                            <div className="bx-input-fix">
                                                <span className="flex">
                                                    <div className="w30px"><input className="mgR10" type="radio" name="option" value="2" checked={selectedOption === '2'} onChange={handleOptionChange}/></div>ตอบถูกบางข้อได้คะแนนตามสัดส่วน (ห้ามตอบเกิน)
                                                </span>
                                            </div>
                                            <div className="bx-input-fix">
                                                <span className="flex">
                                                    <div className="w30px"><input className="mgR10" type="radio" name="option" value="3" checked={selectedOption === '3'} onChange={handleOptionChange}/></div>ตอบถูกบางข้อลบคะแนนตามสัดส่วน (ห้ามตอบเกิน)
                                                </span>
                                            </div>
                                        </div> */}
                                        <div className="fb">เกณฑ์การให้คะแนน</div>
                                        <div className="bx-input-fix">
                                            <label htmlFor="input1" className="w100px">คะแนนตอบถูก</label>
                                            <input className="mw50px"
                                                type="number"
                                                id="input1"
                                                value={inputValue1}
                                                onChange={handleInputChange1}
                                                min={0} // Minimum value
                                                max={100}
                                            />
                                        </div>
                                        {selectedOption === "1"?
                                        <div className="bx-input-fix">
                                            <label htmlFor="input2" className="w100px">คะแนนตอบผิด</label>
                                            <input className="mw50px"
                                                type="number"
                                                id="input2"
                                                value={inputValue2}
                                                onChange={handleInputChange2}
                                                min={0} // Minimum value
                                                max={100}
                                                style={{ color: '#D32F2F' }}
                                            />
                                        </div>
                                        :''
                                        }
                                    </div>
                                    <div className='bx-button'>
                                        <div className="button-submit" onClick={handleNextStep}>ถัดไป</div>
                                    </div>
                                </div>
                            :StepCreate === 1 ?
                                <div>
                                    <div className="fb">อัปโหลดกระดาษเฉลยคำตอบ</div>
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
                                    <div className='bx-button'>
                                        <div className="button-reset" onClick={handleReverseStep}>ย้อนกลับ</div>
                                        {StepCreate ===1 ?<div className="button-submit" onClick={handleSubmitFile}>ถัดไป</div>:""}
                                    </div>
                                </div>
                            :StepCreate === 2 ?
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="tableQue">
                                            <table>
                                                <thead>
                                                    <tr className="grey">
                                                        <th className="w60px" rowSpan="2">หัวข้อ</th>
                                                        <th colSpan="8">คำตอบ</th>
                                                        <th colSpan={selectedOption === "1" ?2:1}>เกณฑ์คะแนน</th>
                                                    </tr>
                                                    <tr className="grey">
                                                        <th className="w60px">{ answersheetformat === "1" ? "1" :answersheetformat === "2" ? "A" : answersheetformat === "3" ? "ก" : ""}</th>
                                                        <th className="w60px">{ answersheetformat === "1" ? "2" :answersheetformat === "2" ? "B" : answersheetformat === "3" ? "ข" : ""}</th>
                                                        <th className="w60px">{ answersheetformat === "1" ? "3" :answersheetformat === "2" ? "C" : answersheetformat === "3" ? "ค" : ""}</th>
                                                        <th className="w60px">{ answersheetformat === "1" ? "4" :answersheetformat === "2" ? "D" : answersheetformat === "3" ? "ง" : ""}</th>
                                                        <th className="w60px">{ answersheetformat === "1" ? "5" :answersheetformat === "2" ? "E" : answersheetformat === "3" ? "จ" : ""}</th>
                                                        <th className="w60px">{ answersheetformat === "1" ? "6" :answersheetformat === "2" ? "F" : answersheetformat === "3" ? "ฉ" : ""}</th>
                                                        <th className="w60px">{ answersheetformat === "1" ? "7" :answersheetformat === "2" ? "G" : answersheetformat === "3" ? "ช" : ""}</th>
                                                        <th className="w60px">{ answersheetformat === "1" ? "8" :answersheetformat === "2" ? "H" : answersheetformat === "3" ? "ซ" : ""}</th>
                                                        <th className="w60px">คะแนนตอบถูก</th>
                                                        {selectedOption === "1" ?<th className="w60px">คะแนนตอบผิด</th>:''}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.from({ length: NumExam }, (_, index) => (
                                                        <tr key={index}>
                                                            <td className="center">{index+1}</td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues1[index]}
                                                                    onChange={() => handleCheckbox1Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues2[index]}
                                                                    onChange={() => handleCheckbox2Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues3[index]}
                                                                    onChange={() => handleCheckbox3Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues4[index]}
                                                                    onChange={() => handleCheckbox4Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues5[index]}
                                                                    onChange={() => handleCheckbox5Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues6[index]}
                                                                    onChange={() => handleCheckbox6Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues7[index]}
                                                                    onChange={() => handleCheckbox7Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flexCenter">
                                                                    <input
                                                                    className=""
                                                                    type="checkbox"
                                                                    checked={checkboxValues8[index]}
                                                                    onChange={() => handleCheckbox8Change(index)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div >
                                                                    <input
                                                                    type="number"
                                                                    id={`input-${index}`}
                                                                    name={`input-${index}`}
                                                                    value={inputValues1[index]}
                                                                    onChange={(e) => handleInput1Change(index, e.target.value)}
                                                                    placeholder=""
                                                                    />
                                                                </div>
                                                            </td>
                                                            {selectedOption === "1" ?
                                                            <td>
                                                                <div >
                                                                    <input
                                                                    type="number"
                                                                    id={`input-${index}`}
                                                                    name={`input-${index}`}
                                                                    value={inputValues2[index]}
                                                                    onChange={(e) => handleInput2Change(index, e.target.value)}
                                                                    placeholder=""
                                                                    style={{ color: '#D32F2F' }}
                                                                    />
                                                                </div>
                                                            </td>
                                                            :''}
                                                            
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className='bx-button'>
                                                {/* <div className='button-reset'>รีเซ็ท</div> */}
                                            
                                                
                                                <div className="button-cancel" onClick={handleReverseStep}>ย้อนกลับ</div>
                                                <div className='button-submit' onClick={handleSubmit}>บันทึก</div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            :""}
                        </div>
                    </div>
                }
            </div>
        </main>
    </div>

    );

}

export default AppCreateExamAnswer;