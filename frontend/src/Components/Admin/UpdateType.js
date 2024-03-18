
import { useState } from 'react';
import {variables} from "../../Variables";
import {
    Link
} from "react-router-dom";
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
function AppUpdateType(){
    const { id } = useParams();

    const [typesname, setTypesName] = useState("");
    const [limitsubject, setLimitSubject] = useState("");
    const [limitexam, setLimitExam] = useState("");
    const [limitque, setLimitQue] = useState("");

    const handleTypesName = (e) => { setTypesName(e.target.value); };
    const handleLimitSubject = (e) => { setLimitSubject(e.target.value); };
    const handleLimitExam = (e) => { setLimitExam(e.target.value); };
    const handleLimitQue = (e) => { setLimitQue(e.target.value); };

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataUpdateType = async () => {
        try{
            fetch(variables.API_URL+"type/detail/"+id+"/", {
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
                        console.log("result",result)
                        setTypesName(result.typesname)
                        setLimitSubject(result.limitsubject)
                        setLimitExam(result.limitexam)
                        setLimitQue(result.limitque)
                    }
                    
                }
            )
        }catch (err) {
            console.error("test,",err)
            setStartError(1);
        }
    };
    if(Start === 0){
        
        fetchDataUpdateType();
        setStart(1);
        setTimeout(function() {
            setStartError(2);
        }, 800);

    }
    async function handleSubmit(e) {
        e.preventDefault();
        Swal.fire({
            title: ``,
            text: `คุณต้องการแก้ไขประเภทการใช้งาน ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor:"#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then(async (result) => {
            
            if(result.isConfirmed){

                if(typesname !== '' && limitsubject !== '' && limitexam !== '' && limitque !== ''){
                    try {
                        const response = await fetch(variables.API_URL + "type/update/"+id+"/", {
                            method: "PUT",
                            headers: {
                                'Accept': 'application/json, text/plain',
                                'Content-Type': 'application/json;charset=UTF-8'
                            },
                            body: JSON.stringify({
                                typesname: typesname,
                                limitsubject: limitsubject,
                                limitexam: limitexam,
                                limitque: limitque
                            }),
                        });

                        const result = await response.json();

                        if (response.ok) {
                            Swal.fire({
                                title: "แก้ไขประเภทการใช้งานเสร็จสิ้น",
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            fetchDataUpdateType();
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
        });
    }
    const handlereset = async (e) => {
        fetchDataUpdateType();
    };
    return (
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
                            <p><Link to="/Admin/Type">ประเภทการใช้งาน</Link> / แก้ไขประเภทการใช้งาน</p>
                            <h2>แก้ไขประเภทการใช้งาน</h2>
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
                                    <div onClick={handlereset} className='button-reset'>รีเซ็ท</div>
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

export default AppUpdateType;