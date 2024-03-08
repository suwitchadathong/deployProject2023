import {
    Link
} from "react-router-dom";
import { useState , useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Swal from 'sweetalert2'
// import Cookies from 'js-cookie';

function AppUpdateSubject(){
    const { id } = useParams(); 

    const [SubjectID, setSubjectID] = useState('');
    const [SubjectName, setSubjectName] = useState('');
    const [Semester, setSemester] = useState('');
    const [currentYear] = useState(new Date().getFullYear()+543);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const handleInputSubjectID = (e) => { setSubjectID(e.target.value); };
    const handleInputSubjectName = (e) => {setSubjectName(e.target.value);};
    const handleInputSemester = (e) => {setSemester(e.target.value);};
    const handleYearChange = (e) => {setSelectedYear(parseInt(e.target.value, 10));};

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);
   
    const fetchDataUpdateSubject = async () => {
        try{
            fetch(variables.API_URL+"subject/detail/"+id+"/", {
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
                        setSubjectID(result.subjectid)
                        setSubjectName(result.subjectname)
                        setSemester(result.semester)
                        setSelectedYear(result.year)
                        
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
        fetchDataUpdateSubject();
        setStart(1);
        setTimeout(function() {
            setStartError2()
        }, 800);
    }

    useEffect(() => {
        const yearInput = document.getElementById('yearInput');
        if (yearInput) {
            yearInput.setAttribute('min', currentYear - 5);
            yearInput.setAttribute('max', currentYear + 5);
        }
    }, [currentYear]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: ``,
            text: `คุณต้องการแก้ไขรายวิชา ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor:"#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                if(SubjectID !== '' && SubjectName !== '' && selectedYear !== '' && Semester !== ''){
                    try{
                        fetch(variables.API_URL+"subject/update/"+id+"/", {
                            method: "PUT",
                            headers: {
                                'Accept': 'application/json, text/plain',
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify({
                                subjectid: SubjectID,
                                subjectname: SubjectName,
                                year: selectedYear,
                                semester: Semester
                            }),
                            })
                            .then(response => response.json())
                            .then(result => {
                                fetchDataUpdateSubject();
                                Swal.fire({
                                    title: "ทำการแก้ไขรายวิชาเสร็จสิ้น",
                                    icon: "success",//error,question,warning,success
                                    confirmButtonColor: "#341699",
                                });
                            }
                        )
                    }catch (err) {
                        // console.error('เกิดข้อผิดพลาดในการลบ:', err);
                        Swal.fire({
                            title: "เกิดข้อผิดพลาดในการลบรายวิชา",
                            icon: "error",//error,question,warning,success
                            confirmButtonColor:"#341699",
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
        });
    };

    const handlereset = async (e) => {
        fetchDataUpdateSubject();
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
                            <p><Link to="/Subject"> จัดการรายวิชา</Link> / แก้ไขรายวิชา</p>
                            <h2>แก้ไขรายวิชา</h2>  
                        </div>
                    
                        <div className='bx-details light'>
                            <form onSubmit={handleSubmit}>
                                <div>
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
                                        <button type="reset" onClick={handlereset} className='button-reset'>รีเซ็ท</button>
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

export default AppUpdateSubject;