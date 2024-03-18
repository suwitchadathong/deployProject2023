import React, { useState,useMemo } from 'react';
import Cookies from 'js-cookie';
import {
    Link
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import {variables} from "../Variables";
import TableHomeRequest from './Tools/ToolTableHomeRequest';
const AppHome = () => {

    const [subject, setsubject] = useState([]);
    const [user, setuser] = useState([]);
    const [quesheet, setquesheet] = useState([]);
    const [Request, setRequest] = useState([]);

    const [limitsubject, setlimitsubject] = useState(0);
    const [limitexam, setlimitexam] = useState(0);
    const [limitque, setlimitque] = useState(0);

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);
    const fetchDataQuesheet = async () => {
        try{
            fetch(variables.API_URL+"quesheet/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    setquesheet(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setquesheet([])
        }
        
    };
    const fetchDataSubject = async () => {
        try{
            fetch(variables.API_URL+"subject/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    setsubject(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setsubject([])
        }
        
    };
    const fetchDataUser = async () => {
        try{
            fetch(variables.API_URL+"user/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    setuser(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setuser([])
        }
        
    };
    const fetchDataRequest = async () => {
        try{
            fetch(variables.API_URL+"request/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log("req",result)
                    setRequest(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setRequest([])
        }
        
    };
    const fetchDataType = async () => {
        try{
            fetch(variables.API_URL+"type/detail/"+Cookies.get("typesid")+"/", {
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
                        setlimitsubject(result.limitsubject)
                        setlimitexam(result.limitexam)
                        setlimitque(result.limitque)   
                    }
                }
            )
        }catch (err) {
            console.error(err)
            setStartError(1);
        }
    };
    if(Start === 0){
        fetchDataQuesheet();    
        fetchDataSubject();
        fetchDataUser();
        fetchDataRequest();
        fetchDataType();
        setStart(1);
        setTimeout(function() {
            setStartError(2)
        }, 800);
    }
    const columns = useMemo(
        () => [
            {Header: 'requestid',accessor: 'requestid',},
            {Header: 'รูปที่แนบ',accessor: 'imgrequest_path', },
            // {Header: 'ผู้ใช้',accessor: 'userid',},
            {Header: 'หมายเหตุ',accessor: 'notes', },
            {Header: 'สถานะ',accessor: 'status_request', },
            
        ],
        []
    );
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
                        </div>
                        {   
                            Cookies.get('typesid') === 1 || Cookies.get('typesid') ==="1" ?
                            <div className='bx-details light'>
                                <div className='bx-home-g2'>
                                    <div className='center div1'>
                                        <p className='fs24'>ยินดีต้องรับเข้าสู่</p>
                                        <h1>Multiple Choice</h1>
                                        <h2>and Questionnaire Analysis System</h2>
                                        <div className='space5'></div>
                                        <div className='flexCenter'><p className='button-submit wfc '><Link to='/Usermanual' className='light-font' style={{color:"#FFF"}}>คู่มือการใช้งาน</Link></p></div>
                                    </div>
                                    <div className='center div2'>
                                        <img src={'/img/home1.png'} alt="Logo" />
                                    </div>
                                </div>
                                <div className='bx-adminhome-g4'>
                                    <div className='admindiv1box'>
                                        <h1>{user.length}</h1>
                                        จำนวนผู้ใช้
                                    </div>
                                    <div className='admindiv1box'>
                                        <h1>{subject.length}</h1>
                                        จำนวนรายวิชา
                                    </div>
                                    <div className='admindiv1box'>
                                        <h1>{quesheet.length}</h1>
                                        จำนวนแบบสอบถาม 
                                    </div>
                                    <div className='admindiv1box'>
                                        <h1>{Request.filter(item => item.status_request === '1').length}</h1>
                                        จำนวนการร้องขอ
                                    </div>
                                </div>
                                <div>
                                    <div>ตารางแสดงการรองข้อใช้งานการจัดการรายวิชาของผู้ใช้งาน</div>
                                    <TableHomeRequest columns={columns}/>
                                </div>
                            </div>
                            :
                            <div className='bx-details light'>
                                <div className='bx-home-g2'>
                                    <div className='center div1'>
                                        <p className='fs24'>ยินดีต้องรับเข้าสู่</p>
                                        <h1>Multiple Choice</h1>
                                        <h2>and Questionnaire Analysis System</h2>
                                        <div className='space5'></div>
                                        <div className='flexCenter'><p className='button-submit wfc '><Link to='/Usermanual' className='light-font' style={{color:"#FFF"}}>คู่มือการใช้งาน</Link></p></div>
                                    </div>
                                    <div className='center div2'>
                                        <img src={'/img/home1.png'} alt="Logo" />
                                    </div>
                                    
                                </div>
                                <div className='bx-home-g2'>
                                    <div className= {Cookies.get('usageformat1') === 1 || Cookies.get('usageformat1') === '1'? 'center div1box' :'none'}>
                                        <Link to='/Subject' >
                                            <div>
                                                <p className='fb'>สิทธิ์การใช้งาน "จัดการรายวิชา"</p>
                                                <div className='left'>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> สร้างรายวิชา <span className='danger-font'> (สร้างได้ {limitsubject} รายวิชา)</span></p>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> สร้างการสอบ <span className='danger-font'> (สร้างได้ {limitexam} การสอบ)</span></p>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> ตรวจข้อสอบ</p>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> ดูผลลัพธ์การตรวจข้อสอบ</p>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> ดูผลการวิเคราะห์ข้อสอบ</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className='center div1box'>
                                        <Link to='/Questionnaire' >
                                            <div>
                                                <p className='fb'>สิทธิ์การใช้งาน "จัดการแบบสอบถาม"</p>
                                                <div className='left'>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> สร้างแบบสอบถาม <span className='danger-font'> (สร้างได้ {limitque} แบบสอบถาม)</span></p>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> สร้างแบบสอบถามออนไลน์</p>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> ตรวจสอบแบบสอบถาม</p>
                                                    <p><FontAwesomeIcon icon={faCircleCheck} className='green-font' /> ดูผลลัพธ์การตรวจแบบสอบถาม</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        }
                        {/* <div className='bx-details light'>
                            <p>{Cookies.get('userid')}</p>
                            <p>{Cookies.get('email')}</p>
                            <p>{Cookies.get('fullname')}</p>
                            <p>{Cookies.get('googleid')}</p>
                            <p>{Cookies.get('usageformat1')}</p>
                            <p>{Cookies.get('usageformat2')}</p>
                            <p>{Cookies.get('e_kyc')}</p>
                            <p>{Cookies.get('typesid')}</p>
                            <p>{Cookies.get('clientId')}</p>
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AppHome;
