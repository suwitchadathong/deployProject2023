import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";

const Alertmanual = ({ name , status}) => {
    
    const [isHovered, setIsHovered] = useState(false);

    const showAlert = () => {
        const subject = ['/manual/subject1.png'];
        const createsubject = ['/manual/createsubject1.png'];
        const subjectno = ['/manual/subjectno1.png'];
        const exam = ['/manual/exam1.png','/manual/exam2.png'];
        const uploadstudent = ['/manual/uploadstudent1.png'];
        const createanswersheet = ['/manual/createanswersheet1.png'];
        const examanswers = ['/manual/examanswers1.png'];
        const createexamanswer = ['/manual/createexamanswer1.png','/manual/createexamanswer1_1.png','/manual/createexamanswer2.png','/manual/createexamanswer3.png','/manual/createexamanswer4.png'];
        const uploadanswersheet = ['/manual/uploadanswersheet1.png','/manual/uploadanswersheet2.png','/manual/uploadanswersheet3.png'];
        const checkanswersheet = ['/manual/checkanswersheet1.png','/manual/checkanswersheet2.png','/manual/checkanswersheet3.png','/manual/checkanswersheet4.png','/manual/checkanswersheet5.png','/manual/checkanswersheet6.png'];
        const scoreresults = ['/manual/scoreresults1.png','/manual/scoreresults2.png','/manual/scoreresults3.png'];
        const analyzeresults = ['/manual/analyzeresults1.png','/manual/analyzeresults2.png','/manual/analyzeresults3.png',,'/manual/analyzeresults4.png','/manual/analyzeresults5.png','/manual/analyzeresults6.png'];

        const scores = ['/manual/scores1.png','/manual/scores2.png'];

        const questionnaire = ['/manual/questionnaire1.png','/manual/questionnaire2.png'];
        const questionnaireno = ['/manual/questionnaireno1.png','/manual/questionnaireno2.png'];
        const uploadquestionnaire = ['/manual/uploadquestionnaire1.png','/manual/uploadquestionnaire2.png','/manual/uploadquestionnaire3.png'];
        const checkquestionaire = ['/manual/checkquestionaire1.png','/manual/checkquestionaire2.png','/manual/checkquestionaire3.png','/manual/checkquestionaire4.png',];
        const analyzeresultsque = ['/manual/analyzeresultsque1.png'];

        
        const admintype = ['/manual/admin/admintype1.png','/manual/admin/admintype2.png','/manual/admin/admintype3.png'];
        const adminuser = ['/manual/admin/adminuser1.png','/manual/admin/adminuser2.png','/manual/admin/adminuser3.png','/manual/admin/adminuser4.png'];
        const adminsubject = ['/manual/admin/adminsubject1.png','/manual/admin/adminsubject2.png','/manual/admin/adminsubject3.png'];
        const adminquestionnaire = ['/manual/admin/adminquestionnaire1.png','/manual/admin/adminquestionnaire2.png'];
        const adminrequest = ['/manual/admin/adminrequest1.png','/manual/admin/adminrequest2.png'];
        
        
        

        let text = '';
        let imagesHtml = '';
       
        if(name === 'subject' && status === '1'){
            text = "รายละเอียด รายวิชา"
            subject.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'createsubject' && status === '1'){
            text = "รายละเอียด สร้างรายวิชา"
            createsubject.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'subjectno' && status === '1'){
            text = "รายละเอียด การสอบ"
            subjectno.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'exam' && status === '1'){
            text = "รายละเอียด การสอบ"
            exam.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'uploadstudent' && status === '1'){
            text = "รายละเอียด การอัปโหลดรายชื่อนักศึกษา"
            uploadstudent.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'createanswersheet' && status === '1'){
            text = "รายละเอียด สร้างกระดาษคำตอบ"
            createanswersheet.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'examanswers' && status === '1'){
            text = "รายละเอียด เฉลยคำตอบ"
            examanswers.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'createexamanswer' && status === '1'){
            text = "รายละเอียด สร้างเฉลย"
            createexamanswer.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'uploadanswersheet' && status === '1'){
            text = "รายละเอียด อัปโหลดกระดาษคำตอบ"
            uploadanswersheet.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'checkanswersheet' && status === '1'){
            text = "รายละเอียด ตรวจความถูกต้องกระดาษคำตอบ"
            checkanswersheet.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }else if(name === 'scoreresults' && status === '1'){
            text = "รายละเอียด แสดงผลลัพธ์คะแนน"
            scoreresults.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'analyzeresults' && status === '1'){
            text = "รายละเอียด แสดงผลการวิเคราะห์"
            analyzeresults.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'questionnaire' && status === '1'){
            text = "รายละเอียด แบบสอบถาม"
            questionnaire.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'questionnaireno' && status === '1'){
            text = "รายละเอียด แบบสอบถาม"
            questionnaireno.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'uploadquestionnaire' && status === '1'){
            text = "รายละเอียด อัปโหลดแบบสอบถาม"
            uploadquestionnaire.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'checkquestionaire' && status === '1'){
            text = "รายละเอียด ตรวจสอบความถูกต้องของแบบสอบถาม"
            checkquestionaire.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'analyzeresultsque' && status === '1'){
            text = "รายละเอียด ตรวจสอบความถูกต้องของแบบสอบถาม"
            analyzeresultsque.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        // scores
        else if(name === 'scores' && status === '1'){
            text = "รายละเอียด ดูคะแนนสอบ"
            scores.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        
        // admin
        else if(name === 'admintype' && status === '1'){
            text = "รายละเอียด ประเภทการใช้งาน"
            admintype.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'adminuser' && status === '1'){
            text = "รายละเอียด ประเภทการใช้งาน"
            adminuser.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'adminsubject' && status === '1'){
            text = "รายละเอียด รายวิชาทั้งหมด"
            adminsubject.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'adminquestionnaire' && status === '1'){
            text = "รายละเอียด แบบสอบถามทั้งหมด"
            adminquestionnaire.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        else if(name === 'adminrequest' && status === '1'){
            text = "รายละเอียด การร้องขอ"
            adminrequest.forEach(image => {
                imagesHtml += `<img src="${image}" alt="Your Image" style="width: 100%; height: auto;">`;
            });
        }
        
        Swal.fire({
            html: `
            <div>
                <p>${text}</p>
                <div style="display:grid; max-width: 100%;">
                ${imagesHtml} <!-- Insert the HTML for images here -->
                </div>
            </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
            popup: 'custom-alert-popup',
            },
        });
    };


    return (
        <>
            <FontAwesomeIcon 
            icon={faCircleInfo} 
            style={{ fontSize: "16px", paddingLeft: "5px", cursor: "pointer", opacity: isHovered ? 0.8 : 1 }} 
            onClick={showAlert} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            /> 
        </>
    );
};

export default Alertmanual;
