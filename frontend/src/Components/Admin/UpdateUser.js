import React, { useState, useMemo, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import { variables } from "../../Variables";
import Swal from "sweetalert2";

function AppUpdateUser() {
    const { id } = useParams();

    const [emailshow, setemailshow] = useState("");
    const [email, setemail] = useState("");
    const [tel, settel] = useState("");
    const [fullname, setfullname] = useState("");
    const [Department, setDepartment] = useState("");
    const [Faculty, setFaculty] = useState("");
    const [Workplace, setWorkplace] = useState("");

    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(true);
  
    const [errortext, seterrortext] = useState("");

    const [selectedRole, setSelectedRole] = useState('');
    const [otherRole, setOtherRole] = useState('');

    const [e_kyc,sete_kyc] = useState('')

    const [type,settype] = useState('')
    const [datatype, setdatatype] = useState([]);

    const [Start, setStart] = useState(0);
    const [StartError, setStartError] = useState(0);

    const handletype = (event) => {
        settype(event.target.value);
    };
    const handleInputemail = (e) => {
      setemail(e.target.value);
    };
    const handleInputfullname = (e) => {
      setfullname(e.target.value);
    };
    const handleInputtel = (e) => {
      settel(e.target.value.replace(/\D/g, ""));
    };
    const handleInputDepartment = (e) => {
      setDepartment(e.target.value);
    };
    const handleInputFaculty = (e) => {
      setFaculty(e.target.value);
    };
    const handleInputWorkplace = (e) => {
      setWorkplace(e.target.value);
    };
    const handleCheckbox1 = (e) => {
      setCheckbox1(!checkbox1);
    };
    const handleCheckbox2 = (e) => {
      setCheckbox2(!checkbox2);
    };
    const handleRoleChange = (e) => {
        if(e.target.value === "นักเรียน" ){
            setCheckbox1(false)
        }
        if(e.target.value !== "other" ){
            setOtherRole('')
        }
        setSelectedRole(e.target.value);
    };
    const handleOtherRoleChange = (e) => {
        setOtherRole(e.target.value);
    };
    const fetchDataUser = async () => {
        try {
          fetch(variables.API_URL + "user/detail/" + id + "/", {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.err !== undefined) {
                setStartError(1);
              } else {
                setemail(result.email);
                setemailshow(result.email);
                settel(result.tel);
                setfullname(result.fullname);
                setDepartment(result.department);
                setFaculty(result.faculty);
                setWorkplace(result.workplace);
                if(result.job === "ครู" || result.job === "นักเรียน"){
                    setSelectedRole(result.job)
                }else{
                    setSelectedRole("other")
                    setOtherRole(result.job)
                }
                
                settype(result.typesid)
                sete_kyc(result.e_kyc)
                const usage_list = eval(result.usageformat)
                setCheckbox1(usage_list[0])
                // setCheckbox1(parseInt(Cookies.get("usageformat1")));
                // setCheckbox2(parseInt(Cookies.get("usageformat2")));
              }
            });
        } catch (err) {
          setStartError(1);
        }
    };
    const fetchDataType = async () => {
        try{
            fetch(variables.API_URL+"type/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    setdatatype(result)
                }
            )
        }catch (err) {
            setdatatype([])
        }
        
    };
    if (Start === 0) {
        fetchDataUser();
        fetchDataType();
        setStart(1);
        setTimeout(() => {
            setStartError(2);
        }, 500);
    }

    useEffect(() => {
        let errorMessage = "กรุณากรอก";
    
        if (fullname === "") {
          if (errorMessage === "กรุณากรอก") {
            errorMessage += " ชื่อ นามสกุล\n";
          } else {
            errorMessage += ", ชื่อ นามสกุล\n";
          }
        }
        if (tel === "") {
          if (errorMessage === "กรุณากรอก") {
            errorMessage += " เบอร์โทรศัพท์\n";
          } else {
            errorMessage += ", เบอร์โทรศัพท์\n";
          }
        }
        if (Department === "") {
          if (errorMessage === "กรุณากรอก") {
            errorMessage += " ภาค\n";
          } else {
            errorMessage += ", ภาค\n";
          }
        }
        if (Faculty === "") {
          if (errorMessage === "กรุณากรอก") {
            errorMessage += " คณะ\n";
          } else {
            errorMessage += ", คณะ\n";
          }
        }
        if (Workplace === "") {
          if (errorMessage === "กรุณากรอก") {
            errorMessage += " สถานที่ทำงาน\n";
          } else {
            errorMessage += ", สถานที่ทำงาน\n";
          }
        }
        if (selectedRole === '' || (selectedRole === 'other' && otherRole === '')) {
            if(errorMessage === 'กรุณากรอก'){
                errorMessage += ' อาชีพ\n'
            }else{
                errorMessage += ', อาชีพ\n'
            }
        }
        if (type === "") {
            if (errorMessage === "กรุณากรอก") {
              errorMessage += " ประเภทผู้ใช้งาน\n";
            } else {
              errorMessage += ", ประเภทผู้ใช้งาน\n";
            }
        }
        seterrortext(errorMessage);
    }, [email, tel, fullname, Department, Faculty, Workplace , selectedRole, otherRole, type]);

    async function handleUpdateUser(e) {
        e.preventDefault();
  
  

        if (errortext === "กรุณากรอก") {
          try {
            const response = await fetch(
              variables.API_URL + "user/update/" + id + "/",
              {
                method: "PUT",
                headers: {
                  Accept: "application/json, text/plain",
                  "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    email: email,
                    fullname: fullname,
                    tel: tel,
                    job: selectedRole === "other" ? otherRole : selectedRole,
                    department: Department,
                    faculty: Faculty,
                    workplace: Workplace,
                    usageformat : checkbox1 === true || checkbox1 === 1 ? "[1,1]":"[0,1]",
                    e_kyc : e_kyc,
                    typesid:type
                }),
              }
            );
    
            const result = await response.json();
    
            if (result.err === undefined) {
              fetchDataUser();
              Swal.fire({
                title: "แก้ไขข้อมูลผู้ใช้เสร็จสิ้น",
                icon: "success", //error,question,warning,success
                confirmButtonColor: "#341699",
              });
            } else {
              Swal.fire({
                title: "เกิดข้อผิดพลาด" + result.err,
                icon: "error", //error,question,warning,success
                confirmButtonColor: "#341699",
              });
            }
          } catch (err) {
            Swal.fire({
              title: "เกิดข้อผิดพลาด" + err,
              icon: "error", //error,question,warning,success
              confirmButtonColor: "#341699",
            });
          }
        } else {
          Swal.fire({
            title: errortext,
            icon: "warning", //error,question,warning,success
            confirmButtonColor: "#341699",
          });
        }
    }
    return (
        <div className="content">
        <main>
            <div className="box-content">
            {StartError === 0 || StartError === 1 ? (
                StartError === 0 ? (
                <div className="box-content-view">
                    <div className="bx-topic light ">
                    <div className="skeleton-loading">
                        <div className="skeleton-loading-topic"></div>
                    </div>
                    </div>
                    <div className="bx-details light ">
                    <div className="skeleton-loading">
                        <div className="skeleton-loading-content"></div>
                    </div>
                    </div>
                </div>
                ) : (
                <div className="box-content-view">
                    <div className="bx-topic light">
                    เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง
                    </div>
                    <div className="bx-details light">
                    <h2>Not Found</h2>
                    </div>
                </div>
                )
            ) : null}
            <div className={StartError === 2 ? "box-content-view" : "box-content-view none"}>
                <div className="bx-topic light">
                <p><Link to="/Admin/User">ผู้ใช้ทั้งหมด</Link> / {emailshow} /แก้ไขผู้ใช้งาน</p>
                        <div className='bx-grid-topicAdmin'>
                        <h2>แก้ไขผู้ใช้งาน</h2>
                    </div> 
                </div>
                <div className="bx-details light">
                    <div style={{maxWidth:340,minWidth:200}}>
                        <div> ID ผู้ใช้งาน : {id}</div>
                        <div className="bx-input-fix">
                            <label htmlFor="Email">อีเมล <span className="danger-font">* </span></label>
                            <input
                                type="email"
                                id="Email"
                                name="Email"
                                value={email}
                                onChange={handleInputemail}
                                placeholder="username@gmail.com"
                            />
                        </div>
                        
                        <div className="bx-input-fix">
                            <label htmlFor="FullName">ชื่อ นามสกุล <span className="danger-font">*</span></label>
                            <input
                                type="text"
                                id="FullName"
                                name="FullName"
                                value={fullname}
                                onChange={handleInputfullname}
                                placeholder="กรอกชื่อ นามสกุล"
                            />
                        </div>
                        <div className="bx-input-fix">
                            <label htmlFor="Tel">เบอร์โทรศัพท์ <span className="danger-font">*</span></label>
                            <input
                                type="tel"
                                id="Tel"
                                name="Tel"
                                value={tel}
                                onChange={handleInputtel}
                                placeholder="กรอกเบอร์โทรศัพท์"
                                maxLength="10"
                            />
                        </div>
                        <div className="bx-input-fix">
                            <label htmlFor="role">อาชีพ <span className="danger-font">*</span></label>
                            <select id="role" value={selectedRole} onChange={handleRoleChange}>
                                <option value="">กรุณาเลือกอาชีพ</option>
                                <option value="ครู">ครู</option>
                                <option value="นักเรียน">นักเรียน</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                            {selectedRole === 'other' && (
                                <div>
                                    <div className="space10"></div>
                                    <input
                                        type="text"
                                        id="otherRole"
                                        value={otherRole}
                                        onChange={handleOtherRoleChange}
                                        placeholder="กรุณากรอกอาชีพ"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="bx-input-fix">
                            <span className="flex"><input className="mgR10 wait" value = "1" type = "checkbox" checked={checkbox2} onChange={handleCheckbox2} />จัดการแบบสอบถาม </span>
                        </div>
                        {selectedRole === 'นักเรียน' ? '':
                            <div className="bx-input-fix">
                                <span className="flex"><input className="mgR10" value = "0" type = "checkbox" checked={checkbox1} onChange={handleCheckbox1} />จัดการรายวิชา </span>
                            </div>
                        } 
                        <div className="bx-input-fix">
                            <label htmlFor="Faculty">สังกัด/คณะ <span className="danger-font">*</span></label>
                            <input
                                type="text"
                                id="Faculty"
                                name="Faculty"
                                value={Faculty}
                                onChange={handleInputFaculty}
                                placeholder="กรอกสังกัด/คณะ"
                            />
                        </div>
                        <div className="bx-input-fix">
                            <label htmlFor="Department">ภาค/สาขา/สาย <span className="danger-font">*</span></label>
                            <input
                                type="text"
                                id="Department"
                                name="Department"
                                value={Department}
                                onChange={handleInputDepartment}
                                placeholder="กรอกภาค/สาขา"
                            />
                        </div>
                        
                        <div className="bx-input-fix">
                            <label htmlFor="Workplace">องค์กรการศึกษา/สถานที่ทำงาน <span className="danger-font">*</span></label>
                            <input
                                type="text"
                                id="Workplace"
                                name="Workplace"
                                value={Workplace}
                                onChange={handleInputWorkplace}
                                placeholder="กรอกสถานที่ทำงาน"
                            />
                        </div>
                        {/* <div className="bx-input-fix">
                            <label htmlFor="type">ประเภทการใช้งาน <span className="danger-font">*</span></label>
                            <select id="type" value={type} onChange={handletype}>
                                <option value="">กรุณาเลือกประเภทผู้ใช้งาน</option>
                                {datatype.map((data, index) => (
                                <option key={index} value={data.typesid}>
                                    {data.typesname}
                                </option>
                                ))}
                            </select>
                        </div> */}
                        <div className="bx-input-fix">
                            <label htmlFor="type">ประเภทการใช้งาน <span className="danger-font">*</span></label>
                            <select id="type" value={type} onChange={handletype}>
                                <option value="">กรุณาเลือกประเภทผู้ใช้งาน</option>
                                {datatype.map((data, index) => (
                                <option key={index} value={data.typesid}>
                                    {data.typesname}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className='bx-button width100 flex-end'>
                            <div className='button-submit' onClick={handleUpdateUser}>บันทึก</div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </main>
        </div>
    );
}

export default AppUpdateUser;
