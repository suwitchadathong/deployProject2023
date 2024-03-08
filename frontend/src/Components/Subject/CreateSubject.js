import {
    Link
} from "react-router-dom";
import { useState , useEffect } from 'react';
import {variables} from "../../Variables";
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
import Alertmanual from "../Tools/ToolAlertmanual";
function AppCreateSubject(){

    const [SubjectID, setSubjectID] = useState('');
    const [SubjectName, setSubjectName] = useState('');
    const [Semester, setSemester] = useState(1);
    const [currentYear] = useState(new Date().getFullYear()+543);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const handleInputSubjectID = (e) => { setSubjectID(e.target.value); };
    const handleInputSubjectName = (e) => {setSubjectName(e.target.value);};
    const handleInputSemester = (e) => {setSemester(e.target.value);};
    const handleYearChange = (e) => {setSelectedYear(parseInt(e.target.value, 10));};

    useEffect(() => {
        const yearInput = document.getElementById('yearInput');
        if (yearInput) {
            yearInput.setAttribute('min', currentYear - 5);
            yearInput.setAttribute('max', currentYear + 5);
        }
    }, [currentYear]);

    async function handleSubmit(e) {
        e.preventDefault();
        if(SubjectID !== '' && SubjectName !== '' && selectedYear !== '' && Semester !== ''){
            try {
                const response = await fetch(variables.API_URL + "subject/create/", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        userid : Cookies.get('userid'),
                        subjectid: SubjectID,
                        subjectname: SubjectName,
                        year: selectedYear,
                        semester: Semester
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        title: "สร้างรายวิชาเสร็จสิ้น",
                        icon: "success",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    }).then((result) => {
                        setSubjectID([]);
                        setSubjectName([]);
                        setSelectedYear([currentYear])
                        setSemester([]);
                        window.location.href = '/Subject';
                    });
                    
                } else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด"+result.err,
                        icon: "error",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    });
                    console.error(result.msg || response.statusText);
                }
            } catch (err) {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด"+err,
                    icon: "error",//error,question,warning,success
                    confirmButtonColor: "#341699",
                });
                console.error(err);
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
        setSubjectID('')
        setSubjectName('')
        setSemester(1)
        setSelectedYear(new Date().getFullYear()+543)
    }
    return(
        <div className='content'>
            <main>
                <div className='box-content'>
                    <div className='box-content-view'>
                        <div className='bx-topic light'>
                            <p><Link to="/Subject">จัดการรายวิชา</Link> / สร้างรายวิชา</p>
                            <h2>สร้างรายวิชา <Alertmanual name={"createsubject"} status={"1"}/></h2>  
                        </div>
                        <div className='bx-details light'>
                            <form onSubmit={handleSubmit}>
                                <div className="">
                                    <div className="bx-input-fix">
                                        <label htmlFor="SubjectID" className="w100px">รหัสวิชา</label>
                                        <input className="mw300px"
                                            type="text"
                                            id="SubjectID"
                                            name="SubjectID"
                                            value={SubjectID}
                                            onChange={handleInputSubjectID}
                                            placeholder="กรอกรายวิชา"
                                            maxLength={20}
                                        />
                                    </div>
                                    <div className="bx-input-fix">
                                        <label htmlFor="SubjectName" className="w100px">ชื่อวิชา</label>
                                        <input className="mw300px"
                                            type="text"
                                            id="SubjectName"
                                            name="SubjectName"
                                            value={SubjectName}
                                            onChange={handleInputSubjectName}
                                            placeholder="กรอกรหัสวิชา"
                                            max="99"
                                            maxLength={100}
                                        />
                                    </div>
                                    <div className="bx-input-fix">
                                        <label htmlFor="Year" className="w100px">ปีการศึกษา</label>
                                        <input className="mw300px"
                                            type="number"
                                            id="yearInput"
                                            name="yearInput"
                                            value={selectedYear}
                                            onChange={handleYearChange}
                                            placeholder="กรอกปีการศึกษา"
                                        />
                                    </div>
                                    <div className="bx-input-fix">
                                    <label htmlFor="Semester" className="w100px">ภาคเรียน</label>
                                        <input className="mw300px"
                                            type="number"
                                            id="Semester"
                                            name="Semester"
                                            value={Semester}
                                            onChange={handleInputSemester}
                                            placeholder="กรอกภาคเรียน"
                                            min="1"
                                            max="3"
                                        />
                                    </div>

                                    <div className='bx-button'>
                                        <div onClick={handleReset} className='button-reset'>รีเซ็ท</div>
                                        <button type="submit"  className='button-submit'>บันทึก</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}

export default AppCreateSubject;