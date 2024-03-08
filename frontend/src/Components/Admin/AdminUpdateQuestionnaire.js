import {
    Link
} from "react-router-dom";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';


function AppAdminUpdateQuestionnaire(){

    const { id } = useParams();

    const [IDQue, setIDQue] = useState('');
    const [userid, setuserid] = useState('');

    const [QueSheetName, setQueSheetName] = useState('');
    const [QueSheetTopicName, setQueSheetTopicName] = useState('');
    const [DetailsLineOne, setDetailsLineOne] = useState('');
    const [DetailsLinetwo, setDetailsLinetwo] = useState('');


    const [quehead1, setquehead1] = useState('');
    const [quehead2, setquehead2] = useState('');
    const [quehead3, setquehead3] = useState('');
    const [quehead4, setquehead4] = useState('');
    const [quehead5, setquehead5] = useState('');

    const [quetopicdetails, setquetopicdetails] = useState('');
    const [quetopicformat, setquetopicformat] = useState('');

    const [showsequencesteps, setshowsequencesteps] = useState('');
    const [sequencesteps, setsequencesteps] = useState('');
    const handlesequencesteps = (event) => {
        setsequencesteps(event.target.value);
      };
    const handleInputQueSheetName = (e) => { setQueSheetName(e.target.value); };
    const handleInputQueSheetTopicName = (e) => {setQueSheetTopicName(e.target.value);};
    const handleInputDetailsLineOne = (e) => { setDetailsLineOne(e.target.value); };
    const handleInputDetailsLinetwo = (e) => {setDetailsLinetwo(e.target.value);};

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const fetchDataquesheet = async () => {
        try{
            fetch(variables.API_URL+"quesheet/detail/"+id+"/", {
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
                    console.log("quesheet :",result)
                    setQueSheetName(result.quesheetname)
                    setsequencesteps(result.sequencesteps)
                    setshowsequencesteps(result.sequencesteps)
                    setQueSheetTopicName(result.quesheettopicname)
                    setDetailsLineOne(result.detailslineone)
                    setDetailsLinetwo(result.detailslinetwo)
                    setIDQue(result.quesheetid)
                    setuserid(result.userid)
                }
            )
            fetch(variables.API_URL+"queheaddetails/detail/"+id+"/", {
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
                        console.log(result)
                        setquehead1(result.quehead1)
                        setquehead2(result.quehead2)
                        setquehead3(result.quehead3)
                        setquehead4(result.quehead4)
                        setquehead5(result.quehead5)
                    }
                    

                }
            )
            fetch(variables.API_URL+"quetopicdetails/detail/"+id+"/", {
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
                        console.log(result)
                        setquetopicdetails(result.quetopicdetails)
                        setquetopicformat(result.quetopicformat)
                    }
                   
                }
            )
            
        }catch (err) {
            console.error(err)
            setStartError(1);
           
        }
    };

    if(Start === 0){
        fetchDataquesheet();
        setStart(1);
        setTimeout(function() {
            setStartError(2);
        }, 800);
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
            if(result.isConfirmed){
                try{
                    const response = await fetch(variables.API_URL + "quesheet/update/"+id+"/", {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            sequencesteps : sequencesteps,
                            userid : userid
                        }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        Swal.fire({
                            title: "แก้ไขแบบสอบถามเสร็จสิ้น",
                            icon: "success",//error,question,warning,success
                            confirmButtonColor: "#341699",
                        });
                        fetchDataquesheet();
                    } else {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด "+result.err,
                            icon: "error",//error,question,warning,success
                            confirmButtonColor: "#341699",
                        });
                    }
                }catch(err){
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด "+err,
                        icon: "error",//error,question,warning,success
                        confirmButtonColor: "#341699",
                    });
                }
            }
        });
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
                        null
                    }
                    <div className={StartError === 2 ?'box-content-view':'box-content-view none'}>
                        <div className='bx-topic light'>
                            <p><Link to="/Admin/AdminQuestionnaire">จัดการแบบสอบถาม</Link> / <Link to="/Admin/AdminQuestionnaire">แบบสอบถามทั้งหมด </Link>/ {QueSheetName} / Admin แก้ไขแบบสอบถาม</p>
                            <h2>Admin แก้ไขแบบสอบถาม</h2>  
                        </div>
                    
                        <div className='bx-details light'>
                            <form onSubmit={handleSubmit}>
                                <div>ID ของแบบสอบถาม : {IDQue} </div>
                                <div className="bx-input-fix">
                                    <label htmlFor="QueSheetName" className="w150px">ชื่อแบบสอบถาม</label>
                                    <input className="mw300px wait"
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
                                    <input className="mw300px wait"
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
                                    <input className="mw300px wait"
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
                                    <input className="mw300px wait"
                                        type="text"
                                        id="DetailsLinetwo"
                                        name="DetailsLinetwo"
                                        value={DetailsLinetwo}
                                        onChange={handleInputDetailsLinetwo}
                                        placeholder="กรอกรายละเอียดบรรทัดที่ 2"
                                        maxLength={90}
                                    />
                                </div>
                                {showsequencesteps === 1 ||showsequencesteps === "1" ?
                                    <div className="danger-font">ลำดับการทำงาน ณ ปัจจุบัน{}: ค่าเริ่มต้น จัดการแบบสอบถาม ตั้งค่าแบบสอบถามออนไลน์</div>:null

                                }
                                {showsequencesteps === 2 || showsequencesteps === 3 ||showsequencesteps === "2" || showsequencesteps === "3"?
                                    <div className="danger-font">ลำดับการทำงาน ณ ปัจจุบัน{}: อัปโหลดกระดาษแบบสอบถาม</div>:null

                                }
                                {showsequencesteps === 4 || showsequencesteps === 5 ||showsequencesteps === "4" || showsequencesteps === "5"? 
                                    <div className="danger-font">ลำดับการทำงาน ณ ปัจจุบัน {}: สรุปผล</div>:null
                                }
                                <div className="bx-input-fix">
                                    <div htmlFor="sequencesteps">เลือกลำดับการทำงาน</div>
                                    <select id="sequencesteps" value={sequencesteps} onChange={handlesequencesteps} style={{width:250}}>
                                        <option value="">กรุณาเลือก</option>
                                        <option value="1">ขั้นตอนเตรียมการก่อนการประมวลผล</option>
                                        <option value="3">ขั้นตอนการประมวลผล</option>
                                        <option value="5" disabled='true'>สรุปผล</option>
                                    </select>
                                </div>
                              
                                <div className='bx-button'>
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

export default AppAdminUpdateQuestionnaire;