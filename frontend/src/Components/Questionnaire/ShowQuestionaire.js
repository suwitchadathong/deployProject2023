import {
    Link
} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {variables} from "../../Variables";
import { SRLWrapper } from 'simple-react-lightbox';
function AppShowQuestionaire(){
    const { id } = useParams();

    const [QueSheetName, setQueSheetName] = useState('');
    const [imgquesheet_path, setimgquesheet_path] = useState('');    

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
                    setQueSheetName(result.quesheetname)
                    setimgquesheet_path(result.imgquesheet_path+"?"+ new Date().getTime())
                   
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
                    }
                }
            )
            
        }catch (err) {
            setStartError(1);
           
        }
    };
    if(Start === 0){
        fetchDataquesheet();
        setStart(1);
    }

    useEffect(() => {
        setTimeout(() => {
            if(StartError !== 1){
                setStartError(2);
            }
        }, 500); 
    }, []);


    const options = {}
    
    const handleDownload = () => {
        const filePath = imgquesheet_path;
        const link = document.createElement('a');
        link.href = process.env.PUBLIC_URL + filePath;
        link.target = "_blank";
        link.download = {QueSheetName};
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        <p><Link to="/Questionnaire">จัดการแบบสอบถาม</Link> / <Link to={"/Questionnaire/"}>แบบสอบถามทั้งหมด</Link> / <Link to={"/Questionnaire/QuestionnaireNo/"+id}>{QueSheetName}</Link> / กระดาษแบบสอบถาม</p>
                        <div className='bx-grid-topic'>
                            <h2>กระดาษแบบสอบถาม</h2>  
                        </div> 
                    </div>
                    <div className='bx-details light'>
                        <div className="space5"></div>
                        <div>
                            <div className="hfc"> 
                                <Link to={"/Questionnaire/QuestionnaireNo/ShowQuestionnaire/UpdateQuestionnaire/"+id}><p className="button-update cursor-p">แก้ไข</p></Link> 
                                <p className="pdl10px"></p>
                                <p onClick={handleDownload} className="button-download cursor-p">ดาวน์โหลด</p>
                            </div>
                            <div className="space10"></div>
                            <div>
                                <div className="TB">
                                    <div className="TB-box">
                                        <h3 className="center">แสดงตัวอย่างกระดาษแบบสอบถาม</h3>
                                        {/* <SRLWrapper options={options}>
                                            <div className="container">
                                                <div key={imgquesheet_path} className="image-card">
                                                    <a href={`${imgquesheet_path}`}>
                                                        <img className="image" src={`${imgquesheet_path}`} alt={`${imgquesheet_path.substring(imgquesheet_path.lastIndexOf('/') + 1)}`} />
                                                    </a>
                                                </div>
                                            </div>
                                        </SRLWrapper>   */}
                                       <div className="container">
                                            <div key={imgquesheet_path} className="image-card">
                                                <a href={`${imgquesheet_path}`} target="_blank">
                                                    <img className="image" src={`${imgquesheet_path}`} alt={`${imgquesheet_path.substring(imgquesheet_path.lastIndexOf('/') + 1)}`} />
                                                </a>
                                            </div>
                                        </div>
  
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    );

}

export default AppShowQuestionaire;