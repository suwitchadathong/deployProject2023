import {
    Link
} from "react-router-dom";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
function AppCreateExam(){
    const { id } = useParams();

    const [NameExam, setNameExam] = useState('');
    const [ExamNo, setExamNo] = useState(1);
    const [NumExam, setNumExam] = useState(40);
    const [SetExam, setSetExam] = useState(1);

    const handleInputNameExam = (e) => { setNameExam(e.target.value); };
    const handleInputExamNo = (e) => {setExamNo(e.target.value);};
    const handleInputNumExam = (e) => { setNumExam(e.target.value); };
    const handleInputSetExam = (e) => {setSetExam(e.target.value);};

    function generateOutputexamanswers(num) {
        let output = '';
        for (let i = 1; i <= num; i++) {
          output += `${i}:1:1:0,`;
        }
        return output.slice(0, -1); // Removing the last comma
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(NameExam !== '' && ExamNo !== '' && NumExam !== '' && SetExam !== ''){
            try {
                // Fetch API exam/create ขอข้อมูล สร้างการสอบของรายวิชา
                const response = await fetch(variables.API_URL + "exam/create/", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        subid : id,
                        examname: NameExam,
                        examno: ExamNo,
                        numberofexams: NumExam,
                        numberofexamsets: SetExam,
                        sequencesteps:"1",
                        userid : Cookies.get('userid')
                    }),
                });

                const result = await response.json();
                // console.log("exam/create/"+result.examid,"NumExam:",NumExam)

                if (response.ok) {
                    for (let i = 1; i <= SetExam; i++) {
                        fetch(variables.API_URL + "examanswers/create/", {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json, text/plain',
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify({
                                scoringcriteria : generateOutputexamanswers(NumExam),
                                examnoanswers : i,
                                examid : result.examid
                            }),
                        });
                    }
                    Swal.fire({
                        title: "สร้างการสอบเสร็จสิ้น",
                        icon: "success",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    }).then((result) => {
                        window.location.href = '/Subject/SubjectNo/'+id;
                    });
                } 
                else {
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
        }else{
            Swal.fire({
                title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                icon: "warning",//error,question,warning,success
                confirmButtonColor: "#341699",
            });
        }
    }

    const handleReset = (e) => {
        setNameExam('');
        setExamNo(1);
        setNumExam(40)
        setSetExam(1);
    }
    
    return(
        <div className='content'>
            <main>
                <div className='box-content'>
                    <div className='box-content-view'>
                        <div className='bx-topic light'>
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / <Link to="/Subject">รายวิชาทั้งหมด</Link> / สร้างการสอบ</p>
                            <h2>สร้างการสอบ</h2>  
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
                                    <div onClick={handleReset} className='button-reset'>รีเซ็ท</div>
                                    <button type="submit" className='button-submit'>บันทึก</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppCreateExam;