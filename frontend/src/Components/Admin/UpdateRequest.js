
import { useState } from 'react';
import {variables} from "../../Variables";
import {
    Link
} from "react-router-dom";
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
import { SRLWrapper } from 'simple-react-lightbox';
function AppUpdateRequest(){
    const { id } = useParams();

    const [imgrequest_path, setimgrequest_path] = useState("");
    const [userid, setuserid] = useState("");
    const [status_req, setstatus_req] = useState("");

    const [status_request, setstatus_request] = useState("");
    const [notes,setnotes] = useState("");

    const handlestatus_request = (event) => {
        if(event.target.value === '0'){
            setstatus_request(event.target.value);
            setnotes('')
        }else if(event.target.value === '2'){
            setstatus_request(event.target.value);
        }else{
            setstatus_request(event.target.value);
        }
    };
    const handlenotes = (event) => {
        setnotes(event.target.value);
    };
    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataUpdateRequest = async () => {
        try{
            fetch(variables.API_URL+"request/detail/"+id+"/", {
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
                        setuserid(result.userid)
                        setimgrequest_path(result.imgrequest_path)
                        setstatus_req(result.status_request)
                        setstatus_request(result.status_request)
                        setnotes(result.notes)
                    }
                }
            )
        }catch (err) {
            setStartError(1);
        }
    };

    if(Start === 0){
        
        fetchDataUpdateRequest();
        setStart(1);
        setTimeout(function() {
            setStartError(2);
        }, 800);

    }
    async function handleSubmit(e) {
        e.preventDefault();
        if(status_request !== ''){
            if((status_request === '2' && notes !== '') || status_request === '0'){
                try {
                    Swal.fire({
                        title: ``,
                        text: `คุณต้องการบันทึกคำร้องขอ ใช่หรือไม่ `,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor:"#341699",
                        confirmButtonText: "ยืนยัน",
                        cancelButtonText:"ยกเลิก"
                    }).then(async (result) => {
                        if(result.isConfirmed){
                            const response = await fetch(variables.API_URL + "request/update/"+id+"/", {
                                method: "PUT",
                                headers: {
                                    'Accept': 'application/json, text/plain',
                                    'Content-Type': 'application/json;charset=UTF-8'
                                },
                                body: JSON.stringify({
                                    userid: userid,
                                    notes: notes,
                                    status_request: status_request
                                }),
                            })

                            const result = await response.json();

                            if (response.ok) {
                                if(status_request === '0'){
                                    const UpdateUser = await fetch(variables.API_URL + "user/update/"+userid+"/", {
                                        method: "PUT",
                                        headers: {
                                            'Accept': 'application/json, text/plain',
                                            'Content-Type': 'application/json;charset=UTF-8'
                                        },
                                        body: JSON.stringify({
                                            usageformat: "[1,1]",
                                        }),
                                    })
        
                                    const resultuser = await UpdateUser.json();
                                    if (UpdateUser.ok) {
                                        Swal.fire({
                                            title: "ตอบกลับคำร้องขอเสร็จสิ้น",
                                            icon: "success",//error,question,warning,success
                                            confirmButtonColor: "#341699",
                                        }).then((result) => {
                                            window.location.href = '/Admin/Request';
                                        });
                                    }else{
                                        Swal.fire({
                                            title: "เกิดข้อผิดพลาด"+resultuser.err,
                                            icon: "error",//error,question,warning,success
                                            confirmButtonColor: "#341699",
                                        });
                                    }
                                }else if(status_request === '2'){
                                    const UpdateUser = await fetch(variables.API_URL + "user/update/"+userid+"/", {
                                        method: "PUT",
                                        headers: {
                                            'Accept': 'application/json, text/plain',
                                            'Content-Type': 'application/json;charset=UTF-8'
                                        },
                                        body: JSON.stringify({
                                            usageformat: "[0,1]",
                                        }),
                                    })
        
                                    const resultuser = await UpdateUser.json();
                                    if (UpdateUser.ok) {
                                        Swal.fire({
                                            title: "ตอบกลับคำร้องขอเสร็จสิ้น",
                                            icon: "success",//error,question,warning,success
                                            confirmButtonColor: "#341699",
                                        }).then((result) => {
                                            window.location.href = '/Admin/Request';
                                        });
                                    }else{
                                        Swal.fire({
                                            title: "เกิดข้อผิดพลาด"+resultuser.err,
                                            icon: "error",//error,question,warning,success
                                            confirmButtonColor: "#341699",
                                        });
                                    }
                                }else{
                                    Swal.fire({
                                        title: "ตอบกลับคำร้องขอเสร็จสิ้น",
                                        icon: "success",//error,question,warning,success
                                        confirmButtonColor: "#341699",
                                    }).then((result) => {
                                        window.location.href = '/Admin/Request';
                                    });
                                }
                               
                            } else {
                                Swal.fire({
                                    title: "เกิดข้อผิดพลาด"+result.err,
                                    icon: "error",//error,question,warning,success
                                    confirmButtonColor: "#341699",
                                });
                            }
                        }
                    })
                } catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด"+err,
                        icon: "error",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    });
                }
                
            }else{
                Swal.fire({
                    title: "กรุณากรอกหมายเหตุ",
                    icon: "warning",//error,question,warning,success
                    confirmButtonColor: "#341699",
                });
            }
        }else{
            Swal.fire({
                title: "กรุณาเลือกรูปแบบการอนุมัติ",
                icon: "warning",//error,question,warning,success
                confirmButtonColor: "#341699",
            });
        }
    }
    const options = {}
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
                            <p><Link to="/Admin/Request">การร้องขอ</Link> / แก้ไขตอบกลับการร้องขอ</p>
                            <h2>แก้ไขตอบกลับการร้องขอ</h2>
                        </div>
                        <div className='bx-details light'>
                            <form onSubmit={handleSubmit}>
                               
                                <div className="bx-input-fix" style={{width:150}}>
                                    <select id="status_request" value={status_request} onChange={handlestatus_request}>
                                        <option value="">กรุณาเลือก</option>
                                        <option value="0">ผ่านการอนุมัติ</option>
                                        <option value="2">ไม่ผ่านการอนุมัติ</option>
                                    </select>
                                </div>
                                {status_request === 2 || status_request === '2'?
                                    <div className="bx-input-fix" >
                                        <div><label htmlFor="notes" className="w140px">หมายเหตุ</label></div>
                                        <textarea id="notes" value={notes} onChange={handlenotes} rows={4} cols={50} style={{ minWidth: '200px' ,maxWidth: '400px' }}/>
                                    </div>
                                    :null
                                }
                                
                                <div className='bx-button'>
                                    <button type="submit"  className='button-submit'>บันทึก</button>
                                </div>
                               
                                
                            </form>
                          
                            <SRLWrapper options={options}>
                                <div className="container" style={{ minWidth: '200px' ,maxWidth: '500px' }}>
                                    <div className='center'>รูปภาพที่แนบสำหรับร้องขอ</div>
                                    <div className="image-card">
                                        <a href={imgrequest_path}>
                                            <img className="image" src={imgrequest_path} alt={imgrequest_path} style={{ width:"100%"}}/>
                                        </a>
                                    </div>
                                </div>
                            </SRLWrapper> 
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AppUpdateRequest;