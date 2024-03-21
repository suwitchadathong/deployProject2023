import AppHeaderOutSide from "./HeaderOutSide";
import { useState} from "react";
import {
    Link
} from "react-router-dom";
import {variables} from "../Variables";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";


function Appverify(){
    const { id } = useParams(); 

    const [msg, setmsg] = useState("ข้อมูลผิดพลาดกรุณารองใหม่อีกครั้ง");

    const [Start, setStart] = useState(0);

    const fetchUpdateverify = async () => {
        try{
            // Fetch API verify/email ยืนยีนตัวตน
            fetch(variables.API_URL+"verify/email/"+id+"/", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                  if(result.err !== undefined){
                      setmsg("ข้อมูลผิดพลาดกรุณารองใหม่อีกครั้ง")
                  }
                  else{
                    setmsg(result.msg)
                  }
                }
            )
        }catch (err) {

        }
    };
    
    if(Start === 0){
        fetchUpdateverify();
        setStart(1);
    }
    return(
        <div>
        <AppHeaderOutSide />
        <div>
            <div className="box-contents-SingIn">
                <div className="box-contents-form">
                    <div className="box-contents-form-view light">
                    <h3 className="center">
                    {msg === "ยืนยันอีเมลสำเร็จ" ? 
                        <FontAwesomeIcon icon={faCircleCheck} className="green-font" /> 
                        : null
                    }
                    {" "+msg}
                    {msg === "ยืนยันอีเมลสำเร็จ" ? 
                        <div style={{paddingTop: '10px'}}>
                            {/* <p>เข้าสู่ระบบเพื่อใช้งาน</p> */}
                            <Link to="/SingIn"><div className="button-submit">คลิก เข้าสู่ระบบ</div></Link>
                        </div>
                        : null
                    }
                    </h3>
                    
                    <div className='light'>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );

}

export default Appverify;