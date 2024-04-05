import {
    Link
} from "react-router-dom";
import React, { useState, useMemo } from 'react';
import TableExamAnswer from "../Tools/ToolsTableExamAnswer";
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Alertmanual from "../Tools/ToolAlertmanual";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCircle} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
// import Swal from 'sweetalert2'
function AppExamAnswer(){
    const { id } = useParams();
    const [NameExam, setNameExam] = useState('');
    const [ExamNo, setExamNo] = useState('');
    const [ExamNoShow, setExamNoShow] = useState('');
    const [NumExam, setNumExam] = useState('');
    const [SetExam, setSetExam] = useState('');
    const [subid, setsubid] = useState('');
    const [subjectname, setsubjectname] = useState('');

    const [data, setdata] = useState([]);
    const [dataduplicate, setdataduplicate] = useState([]);

    const [selectedOption, setSelectedOption] = useState('1');
    const [inputValue1, setInputValue1] = useState('1');
    const [inputValue2, setInputValue2] = useState('0');

    const [dataanswer, setdataanswer] = useState([]);

    const handleInputChange1 = (event) => {setInputValue1(event.target.value);};
    const handleInputChange2 = (event) => {setInputValue2(event.target.value);};

    const [ClickUpdate, setClickUpdate] = useState(false);
    const handClickUpdate = () => {setClickUpdate(!ClickUpdate);};
    const handClickUpdateButton = () => {fetchDataExamAnswer();setClickUpdate(!ClickUpdate);};

    
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const handleOptionChange = (event) => {setSelectedOption(event.target.value);};

    const fetchDataExam = async () => {
        try{
            //Fetch API เพื่อทำการดึกข้อมูล exam/detail ขอข้อมูล exam
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
                    setExamNoShow(result.examid)
                    setNumExam(result.numberofexams)
                    setSetExam(result.numberofexamsets)
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
                            setsubjectname(result.subjectname)
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
                    getType(sortedExamAnswers)
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
    const setStartError2 = (e) => {
        setStartError(2);
    }
    if(Start === 0){
        fetchDataExam();
        fetchDataExamInfo();
        fetchDataExamAnswer();
        setStart(1);
        setTimeout(function() {
            setStartError2()
        }, 800);
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

    function incrementSecondNumber(scoringcriteria,numformat) {
        let sets = scoringcriteria.split(",");
        let dataFormat2 = sets.map(set => {
            let numbers = set.split(":");
            numbers[1] = parseInt(numformat);
            return numbers.join(":");
        }).join(",");
        let dataFormat = dataFormat2;
        
        if (parseInt(numformat) !== 1) {
            let dataFormat4 = dataFormat2.split(",").map(set => {
                let numbers = set.split(":");
                numbers[3] = "0"; 
                return numbers.join(":");
            }).join(",");
            dataFormat = dataFormat4;
        }

        return dataFormat;
    }

    const Updatescoringcriteria = async (dataanswers) => {
        Swal.fire({
            title: "แก้ไข",
            text: `คุณต้องการแก้ไขเงื่อนไขการให้คะแนนและเกณฑ์การให้คะแนนใช่หรือไม่`,
            icon: "question",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( async (result) => {
            if (result.isConfirmed) { // กดยืนยัน
                try{
                    for (let i = 0; i < dataanswers.length ; i++) {
                        const response = await fetch(variables.API_URL + "examanswers/update/"+dataanswers[i].examanswersid+"/", {
                            method: "PUT",
                            headers: {
                                'Accept': 'application/json, text/plain',
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify({
                                scoringcriteria : incrementSecondNumber(dataanswers[i].scoringcriteria,selectedOption),
                            }),
                        });
                    }
                    fetchDataExam();
                    fetchDataExamAnswer();
                    setClickUpdate(false);
                    Swal.fire({
                        title: "แก้ไขเงื่อนไขการให้คะแนนและเกณฑ์การให้คะแนนเสร็จสิ้น",
                        icon: "success",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    }).then((result) => {
                        
                    });

                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในแก้ไขเงื่อนไขการให้คะแนนและเกณฑ์การให้คะแนน",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };    
    const columns = useMemo(
        () => [
            {Header: 'examanswersid',accessor: 'examanswersid',},
            {Header: 'ชุดข้อสอบ', accessor: 'examnoanswers', },
            {Header: 'scoringcriteria',accessor: 'scoringcriteria', },
            {Header: 'choiceanswers',accessor: 'choiceanswers', },
            {Header: 'papeans_path',accessor: 'papeans_path', }
        ],
    []
    );

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
                    ''
                }
                <div className={StartError === 2 ?'box-content-view ' : 'box-content-view none'} >
                    <div className='bx-topic light'>
                        <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / <Link to={"/Subject/SubjectNo/"+subid}> {subjectname} </Link> / <Link to={"/Subject/SubjectNo/Exam/"+ExamNoShow}> การสอบครั้งที่ {ExamNo} </Link> / เฉลยคำตอบ</p>
                        <div className='bx-grid2-topic'>
                            <h2>เฉลยคำตอบ<Alertmanual name={"examanswers"} status={"1"}/></h2>                           
                        </div> 
                    </div>
                    <div className='bx-details light'>
                    <div className="bx-grid-detail-topic">
                        <div className="bx-details-items">
                            <div className="bx-bx-topic">
                                ข้อมูลการสอบ
                            </div>
                            <div className="bx-bx-details">
                                <div className="bx-details-box inline-grid"><p className="text-overflow">การสอบครั้งที่ : {ExamNo}</p></div>
                                <div className="bx-details-box inline-grid "><p className="text-overflow">ชื่อการสอบ : {NameExam}</p></div>
                                <div className="bx-details-box inline-grid"><p className="text-overflow">จำนวนข้อสอบ : {NumExam}</p></div>
                                <div className="bx-details-box inline-grid"><p className="text-overflow">จำนวนชุดข้อสอบ : {SetExam}</p></div>
                            </div>
                        </div> 

                    </div>
                        <div className="space5"></div>
                        <div className={ClickUpdate ? "none":""}>
                            <div className="fb">
                               เงื่อนไขการให้คะแนน
                                <span onClick={handClickUpdate} style={{ marginLeft: '5px',padding: '5px 9px', borderRadius: '50%', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid' }}>
                                    <FontAwesomeIcon icon={faPen} />
                                </span>
                            </div> 
                            <div>
                                <div>{selectedOption === '1' || selectedOption === 1 ? <div><span className="green-font"><FontAwesomeIcon icon={faCircle} /></span> ต้องตอบถูกทุกข้อ </div>: <div><span className="grey-font"><FontAwesomeIcon icon={faCircle} /></span> ต้องตอบถูกทุกข้อ </div>}</div>
                                <div>{selectedOption === '2' || selectedOption === 2 ? <div><span className="green-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อได้คะแนนตามสัดส่วน (ห้ามตอบเกิน) </div> : <div><span className="grey-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อได้คะแนนตามสัดส่วน (ห้ามตอบเกิน)</div>}</div>
                                <div>{selectedOption === '3' || selectedOption === 3 ? <div><span className="green-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อลบคะแนนตามสัดส่วน (ห้ามตอบเกิน) </div> : <div><span className="grey-font"><FontAwesomeIcon icon={faCircle} /></span> ตอบถูกบางข้อลบคะแนนตามสัดส่วน (ห้ามตอบเกิน)</div>}</div>
                            </div>
                            {/* <div className="fb">เกณฑ์การให้คะแนน</div>
                            <div>คะแนนตอบถูก : 1</div>
                            <div>{selectedOption === "1"? 'คะแนนตอบผิด : 0':''}</div> */}

                        </div>
                        <div className={!ClickUpdate ? "none":""}>
                            <div className="fb">เงื่อนไขการให้คะแนน</div>
                            <div>
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
                            </div>
                            {/* <div className="fb">เกณฑ์การให้คะแนน</div>
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
                            } */}
                            <div className='bx-button'>
                                <div className={dataduplicate.length === 0 && data.length === 0 ? 'button-submit':'wait button-submit'} onClick={() => Updatescoringcriteria(dataanswer)}>บันทึก</div>
                                <div className="button-cancel" onClick={handClickUpdateButton}>ยกเลิก</div>
                            </div>
                        </div>
                        <div className="space5"></div>
                        <div className="fb">ตารางสร้างเฉลย</div>
                        <TableExamAnswer columns={columns} examnoanswers={SetExam} />
                    </div>
                </div>
            </div>
        </main>
    </div>

    );

}

export default AppExamAnswer;