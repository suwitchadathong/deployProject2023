import {
    Link
} from "react-router-dom";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
import { faL } from "@fortawesome/free-solid-svg-icons";


function AppUpdateExam(){

    const { id } = useParams();

    const [NameExam, setNameExam] = useState('');
    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [NumExam, setNumExam] = useState(40);
    const [SetExam, setSetExam] = useState(1);
    const [checkNumExam, setcheckNumExam] = useState(40);
    const [checkSetExam, setcheckSetExam] = useState(1);
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');
    
    const [data, setdata] = useState([]);
    const [dataduplicate, setdataduplicate] = useState([]);
    const [dataanswer, setdataanswer] = useState([]);

    const handleInputNameExam = (e) => { setNameExam(e.target.value); };
    const handleInputExamNo = (e) => {setExamNo(e.target.value);};
    const handleInputNumExam = (e) => { setNumExam(e.target.value); };
    const handleInputSetExam = (e) => {setSetExam(e.target.value);};
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataUpdateExam = async () => {
        try{
            //Fetch API เพื่อทำการดึกข้อมูล exam/detail ขอข้อมูล
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
                    setNameExam(result.examname)
                    setExamNo(result.examno)
                    setExamNoShow(result.examno)
                    setNumExam(result.numberofexams)
                    setSetExam(result.numberofexamsets)
                    setcheckNumExam(result.numberofexams)
                    setcheckSetExam(result.numberofexamsets)
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
                            if(result.err !== undefined){
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
                    setdataanswer(sortedExamAnswers)
                }
            )
        }catch (err) {
            setdataanswer([])
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
                    setdata(result.non_duplicate_records)
                    setdataduplicate(result.duplicate_records)
                }
            )
        }catch (err) {
            setdata([])
        }
    };
    if(Start === 0){
        fetchDataUpdateExam();
        fetchDataExamAnswer();
        fetchDataExamInfo();
        setStart(1);
        setTimeout(function() {
            setStartError(2);
        }, 800);

    }
    function checkexamanswers(data) {
  
        for (let i = 0  ; i < data.length; i++) {
            if(data[i].choiceanswers === '' || data[i].choiceanswers === null){
            }else{
                return false
            }
        }
        return true
    }
    function generateOutputexamanswers(num) {
        let output = '';
        for (let i = 1; i <= num; i++) {
          output += `${i}:1:1:0,`;
        }
        return output.slice(0, -1); // Removing the last comma
    }
   
    async function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: ``,
            text: `คุณต้องการแก้ไขการสอบ ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor:"#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then(async (result) => {
            if(result.isConfirmed){ // กดยืนยัน
                if(NameExam !== '' && ExamNo !== '' && NumExam !== '' && SetExam !== ''){ //ตรวจสอบค่าว่าง
                    checkexamanswers(dataanswer)
                    if((NumExam !== checkNumExam || SetExam !== checkSetExam) && checkexamanswers(dataanswer) === false){
                        Swal.fire({
                            title: "การแก้ไขจำนวนข้อสอบและชุดข้อสอบจำเป็นจะต้องลบเฉลยคำตอบทั้งหมดออกก่อน",
                            icon: "error",//error,question,warning,success
                            confirmButtonColor: "#341699",
                        });
                    }else{
                        try {
                            let checkcreateanswers = true
                            //Fetch API เพื่อทำการดึกข้อมูล exam/update แก้ไข
                            if(NumExam !== checkNumExam || SetExam !== checkSetExam){
                                for (let i = 0; i < dataanswer.length; i++) {
                                    const resultdelete = await fetch(variables.API_URL+"examanswers/delete/"+dataanswer[i].examanswersid+"/", {
                                        method: "DELETE",
                                        headers: {
                                            'Accept': 'application/json, text/plain',
                                            'Content-Type': 'application/json;charset=UTF-8'
                                        },
                                    });

                                    const result = await resultdelete.json()
                                        
                                }
                                
                                for (let i = 1; i <= SetExam; i++) {
                                    try{
                                        const resulcreate = await fetch(variables.API_URL + "examanswers/create/", {
                                            method: "POST",
                                            headers: {
                                                'Accept': 'application/json, text/plain',
                                                'Content-Type': 'application/json;charset=UTF-8'
                                            },
                                            body: JSON.stringify({
                                                scoringcriteria : generateOutputexamanswers(NumExam),
                                                examnoanswers : i,
                                                examid : id
                                            }),
                                        });
                                        if (resulcreate.ok) {
                                            const result = await resulcreate.json();
                                        } else {
                                            checkcreateanswers = false
                                        }
                                    }catch(err){
                                        checkcreateanswers = false
                                    }
                                    
                                }
                            }
                            if(checkcreateanswers === false){
                                Swal.fire({
                                    title: "เกิดข้อผิดพลาดในการแก้ไขจำนวนชุดข้อสอบกรุณาตรวจสอบใหม่อีกครั้ง",
                                    icon: "error",//error,question,warning,success
                                    confirmButtonColor: "#341699",
                                }).then((result) => {
                                    window.location.reload();
                                });
                            }else{
                                const response = await fetch(variables.API_URL + "exam/update/"+id+"/", {
                                    method: "PUT",
                                    headers: {
                                        'Accept': 'application/json, text/plain',
                                        'Content-Type': 'application/json;charset=UTF-8'
                                    },
                                    body: JSON.stringify({
                                        examname: NameExam,
                                        examno: ExamNo,
                                        numberofexams: NumExam,
                                        numberofexamsets: SetExam,
                                        userid : Cookies.get('userid')
                                    }),
                                });

                                const result = await response.json();

                                if (response.ok) {
                                
                                    Swal.fire({
                                        title: "แก้ไขการสอบเสร็จสิ้น",
                                        icon: "success",//error,question,warning,success
                                        confirmButtonColor: "#341699",
                                    }).then((result) => {
                                        window.location.href = '/Subject/SubjectNo/'+subid;
                                    });
                                } else {
                                    Swal.fire({
                                        title: "เกิดข้อผิดพลาด"+result.err,
                                        icon: "error",//error,question,warning,success
                                        confirmButtonColor: "#341699",
                                    });
                                }
                            }
                        } catch (err) {
                            Swal.fire({
                                title: "เกิดข้อผิดพลาด"+err,
                                icon: "error",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                        }
                    }
                }else{
                    Swal.fire({
                        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                        icon: "warning",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    });
                }
            }
        });
    }

    const handlereset = async (e) => {
        fetchDataUpdateExam();
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
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด </Link>/ <Link to={"/Subject/SubjectNo/"+subid}>{subjectname}</Link> / การสอบครั้งที่ {ExamNoShow} / แก้ไขการสอบ</p>
                            <h2>แก้ไขการสอบ</h2>  
                        </div>
                    
                        <div className='bx-details light'>
                            <form onSubmit={handleSubmit}>
                                <div className="bx-input-fix">
                                    <label htmlFor="NameExam" className="w120px">ชื่อการสอบ</label>
                                    <input className="mw300px"
                                        type="text"
                                        id="NameExam"
                                        name="NameExam"
                                        value={NameExam}
                                        onChange={handleInputNameExam}
                                        placeholder="ชื่อการสอบ"
                                    />
                                </div>
                                <div className="bx-input-fix">
                                    <label htmlFor="ExamNo" className="w120px">การสอบครั้งที่</label>
                                    <input className="mw300px"
                                        type="number"
                                        id="ExamNo"
                                        name="ExamNo"
                                        value={ExamNo}
                                        onChange={handleInputExamNo}
                                        placeholder="การสอบครั้งที่"
                                        min="1"
                                        max="10"
                                    />
                                </div>
                                <div className="bx-input-fix">
                                    <label htmlFor="setNumExam" className="w120px">จำนวนข้อสอบ</label>
                                    <input className="mw300px"
                                        type="number"
                                        id="setNumExam"
                                        name="setNumExam"
                                        value={NumExam}
                                        onChange={handleInputNumExam}
                                        placeholder="จำนวนข้อสอบ"
                                        min="1"
                                        max="120"
                                    />
                                </div>
                                <div className="bx-input-fix">
                                    <label htmlFor="SetExam" className="w120px">จำนวนชุดข้อสอบ</label>
                                    <input className="mw300px"
                                        type="number"
                                        id="SetExam"
                                        name="SetExam"
                                        value={SetExam}
                                        onChange={handleInputSetExam}
                                        placeholder="จำนวนชุดข้อสอบ"
                                        min="1"
                                        max="30"
                                    />
                                </div>

                                <div className='bx-button'>
                                    <div onClick={handlereset} className='button-reset'>รีเซ็ท</div>
                                    <button type="submit"  className={dataduplicate.length === 0 && data.length === 0 ? 'button-submit':'wait button-submit'}>บันทึก</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppUpdateExam;