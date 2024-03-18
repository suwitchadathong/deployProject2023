
import { useState } from 'react';
import {variables} from "../../Variables";
import {
    Link
} from "react-router-dom";
import Swal from 'sweetalert2'

function AppCreateType(){

    const [typesname, setTypesName] = useState("");
    const [limitsubject, setLimitSubject] = useState(5);
    const [limitexam, setLimitExam] = useState(5);
    const [limitque, setLimitQue] = useState(5);

    const handleTypesName = (e) => { setTypesName(e.target.value); };
    const handleLimitSubject = (e) => { setLimitSubject(e.target.value); };
    const handleLimitExam = (e) => { setLimitExam(e.target.value); };
    const handleLimitQue = (e) => { setLimitQue(e.target.value); };

    async function handleSubmit(e) {
        e.preventDefault();
        if(typesname !== '' && limitsubject !== '' && limitexam !== '' && limitque !== ''){

            try {
                const response = await fetch(variables.API_URL + "type/create/", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        typesname: typesname,
                        limitsubject: limitsubject,
                        limitexam: limitexam,
                        limitque: limitque,
                    }),
                });

                const result = await response.json();

                if (response.ok) {

                    Swal.fire({
                        title: "สร้างการสอบเสร็จสิ้น",
                        icon: "success",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    }).then((result) => {
                        setTypesName("")
                        setLimitSubject("")
                        setLimitExam("")
                        setLimitQue("")
                        window.location.href = '/Admin/Type';
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
        }else{
            Swal.fire({
                title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                icon: "warning",//error,question,warning,success
                confirmButtonColor: "#341699",
            });
        }
    }
    return (
        <div className='content'>
            <main>
                <div className='box-content'>
                    <div className='box-content-view'>
                        <div className='bx-topic light'>
                            <p><Link to="/Admin/Type">ประเภทการใช้งาน</Link> / สร้างประเภทการใช้งาน</p>
                            <h2>ประเภทการใช้งาน</h2>
                        </div>
                        <div className='bx-details light'>
                            <form onSubmit={handleSubmit}>
                                <div className="bx-input-fix">
                                    <label htmlFor="NameExam" className="w140px">ชื่อประเภทของผู้ใช้</label>
                                    <input className="mw300px"
                                        type="text"
                                        id="typesname"
                                        name="typesname"
                                        value={typesname}
                                        onChange={handleTypesName}
                                        placeholder="ชื่อประเภทของผู้ใช้"
                                    />
                                </div>
                                <div className="bx-input-fix">
                                    <label htmlFor="NameExam" className="w140px">จำนวนรายวิชา</label>
                                    <input className="mw300px"
                                        type="number"
                                        id="limitsubject"
                                        name="limitsubject"
                                        value={limitsubject}
                                        onChange={handleLimitSubject}
                                        placeholder="จำนวนรายวิชา เป็นตัวเลข เช่น 1 หรือ 20"
                                        min={0}
                                    />
                                </div>
                                <div className="bx-input-fix">
                                    <label htmlFor="NameExam" className="w140px">จำนวนการสอบ</label>
                                    <input className="mw300px"
                                        type="number"
                                        id="limitexam"
                                        name="limitexam"
                                        value={limitexam}
                                        onChange={handleLimitExam}
                                        placeholder="จำนวนการสอบครั้งที่ เป็นตัวเลข เช่น 1 หรือ 20"
                                        min={0}
                                    />
                                </div>
                                <div className="bx-input-fix">
                                    <label htmlFor="NameExam" className="w140px">จำนวนแบบสอบถาม</label>
                                    <input className="mw300px"
                                        type="number"
                                        id="limitque"
                                        name="limitque"
                                        value={limitque}
                                        onChange={handleLimitQue}
                                        placeholder="จำนวนแบบสอบถาม เป็นตัวเลข เช่น 1 หรือ 20"
                                        min={0}
                                    />
                                </div>
                                <div className='bx-button'>
                                    {/* <button type="reset" className='button-reset'>รีเซ็ท</button> */}
                                    <button type="submit"  className='button-submit'>บันทึก</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AppCreateType;