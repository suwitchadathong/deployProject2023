import AppHeaderOutSide from "./HeaderOutSide";
import React, { useState, useEffect, useCallback} from "react";
import {variables} from "../Variables";
import { GoogleLogin } from 'react-google-login'
import { gapi } from 'gapi-script'
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudArrowUp,faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';


function AppSingUp(){

    const [step,setstep] = useState(false);
    
    const [Email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [Confirmpassword, setConfirmpassword] = useState('');

    const [errorpassword, setErrorpassword] = useState('');
    const [errorConfirmpassword, seterrorConfirmpassword] = useState('');
    const [errorpasswordMatch, seterrorpasswordMatch] = useState('');

    const [GoogleID, setGoogleID] = useState("");
    const [FullName, setFullName] = useState('');
    const [Tel, setTel] = useState('');
    const [Department, setDepartment] = useState('');
    const [Faculty, setFaculty] = useState('');
    const [Workplace, setWorkplace] = useState('');

    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(true);

    const [usageformat] = useState([0,1]);
    const [type,settype] = useState('')

    const [errortext,seterrortext] = useState('')

    const handleInputEmail = (e) => { setEmail(e.target.value); };
    const handleInputpassword = (e) => { setpassword(e.target.value);if(e.target.value.length < 10){setErrorpassword('ต้องไม่น้อยกว่า 10 ตัวอักษร');}else{setErrorpassword('');}};
    const handleInputConfirmpassword = (e) => { setConfirmpassword(e.target.value);if(e.target.value.length < 10){seterrorConfirmpassword('ต้องไม่น้อยกว่า 10 ตัวอักษร');}else{seterrorConfirmpassword('');}};
    const handleInputTel = (e) => { setTel(e.target.value.replace(/\D/g, '')) };
    const handleInputFullName = (e) => { setFullName(e.target.value);};
    const handleInputDepartment = (e) => { setDepartment(e.target.value); };
    const handleInputFaculty = (e) => { setFaculty(e.target.value);};
    const handleInputWorkplace = (e) => { setWorkplace(e.target.value);};
    const handleCheckbox1 = (e) => { setCheckbox1(!checkbox1);};
    const handleCheckbox2 = (e) => { setCheckbox2(!checkbox2);};

    const [agree, setagree] = useState(false);
    const handleChangeagree = (e) => {
        setagree(!agree);
        console.log(agree)
    }
    // checkbox สำหรับเลือกสิทธิ์การใช้งาน
    const handstep = (e) => {
        e.preventDefault();
        if(step === true){
            if(GoogleID !== ''){
                setEmail('')
                setGoogleID('')
                setpassword('')
                setConfirmpassword('')
            }else{}
            setstep(false)
            
        }else{
            // setstep(true)
            if(Email !== ''){
                if(validateEmail(Email) === false){
                    handSwal("รูปแบบ email ไม่ถูกต้อง")
                }else{
                    if(password === Confirmpassword && password !== "" && Confirmpassword !== ""){
                        if(password.length <= 9 || Confirmpassword <= 9){
                            handSwal("รหัสผ่านต้องไม่ต่ำกว่า 10 ตัวอักษร")
                        }else{
                       
                            try{
                                fetch(variables.API_URL+"user/duplicate/email/"+Email+"/", {
                                    method: "GET",
                                    headers: {
                                        'Accept': 'application/json, text/plain',
                                        'Content-Type': 'application/json;charset=UTF-8'
                                    },
                                    })
                                    .then(response => response.json())
                                    .then(result => {
                                        console.log(result)
                                        if(result.err !== undefined){
                                            handSwal(result.err)
                                        }
                                        else{
                                            if (Email.includes('@kmitl.ac.th')) {settype(2)} 
                                            else {settype(3)}
                                            setstep(true)
                                        }
                                    }
                                )
                            }catch (err) {
                    
                            }
                        }
                        // if(password.length <= 10 || Confirmpassword <= 10){
                        //     handSwal("รหัสผ่านต้องไม่ต่ำกว่า 10 ตัวอักษร")
                        // }else{
                        //     if (Email.includes('@kmitl.ac.th')) {settype(2)} 
                        //     else {settype(3)}
                        //     setstep(true)
                        // }
                        
                    }else{
                        if(password === '' || Confirmpassword === ''){
                            handSwal("กรุณากรอกรหัสผ่าน")
                        }else{
                            handSwal("รหัสผ่านไม่ตรงกัน")
                        }
                        
                    }
                }
            }else{
                handSwal("กรุณากรอก email")
            }
            
        } 
    }
    // checkbox
    const [selectedRole, setSelectedRole] = useState('');
    const [otherRole, setOtherRole] = useState('');
  
    const handleRoleChange = (e) => {
        console.log(e.target.value)
        if(e.target.value === "นักเรียน" ){
            setCheckbox1(false)
            setFile('')
        }
        if(e.target.value !== "other" ){
            setOtherRole('')
        }
        setSelectedRole(e.target.value);
    };
  
    const handleOtherRoleChange = (e) => {
        setOtherRole(e.target.value);
    };
    // กด submit
    async function handleSubmit (e) {
        e.preventDefault();
        if(agree === true){
            if(errortext === 'กรุณากรอก'){
               
                // console.log("ยินยอม")
                // console.log('Email :', Email);
                // console.log('FullName :', FullName);
                // console.log('password :', password);
                // console.log('GoogleID :', GoogleID);
                // console.log('job :',selectedRole+otherRole);
                // console.log('File :',File);
                // console.log('Department :', Department);
                // console.log('Faculty :', Faculty);
                // console.log('Workplace :', Workplace);
                // console.log('Tel :', Tel);
                // console.log('usageformat :',usageformat)
                // console.log(Math.floor(Math.random() * 900000) + 100000)
                // console.log('type :',type)
                // console.log('checkbox1 :',checkbox1);
                // console.log('checkbox2 :',checkbox2);
                loading()
            }else{
                handSwal(errortext)
            }
            
        }else{
            handSwal("กรุณากดยอมรับข้อกำหนด")
        }

    };

    async function loading(){
        try {
            const loadingSwal = Swal.fire({
                title: 'กำลังประมวลผล...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: async () => { 
                    Swal.showLoading();
                    try {
                        const check = await CreateUser()
                       if(check === true){
                            Swal.close();
                            Swal.fire({
                                title: "",
                                text: GoogleID === '' ? "สร้างบัญชีเสร็จสิ้น โปรดยืนยันตัวตนผ่านที่ Email ที่ใช้ในการสมัครสมาชิก" : "สร้างบัญชีเสร็จสิ้น เข้าสู่ระบบเพื่อใช้งาน",
                                icon: "success",
                                confirmButtonColor: "#341699",
                                confirmButtonText: "ยืนยัน",  
                            }).then((result) => {
                                // window.location.reload();
                                window.location.href = '/SingIn';
                            });
                        }else{
                            Swal.close();
                            Swal.fire('เกิดข้อผิดพลาด '+check);
                        }
                    } catch (error) {
                        Swal.close();
                        Swal.fire('เกิดข้อผิดพลาด '+error);
                    }
                }
            });
            await loadingSwal;
        } catch (error) {
            console.error(error);
            Swal.fire('เกิดข้อผิดพลาด');
        }
    }
    async function CreateUser() {
        try {
            const getekyc = Math.floor(Math.random() * 900000) + 100000
            const response = await fetch(variables.API_URL + "user/create/", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    userid: "",
                    email: Email,
                    fullname: FullName,
                    password: password,
                    googleid: GoogleID,
                    job: selectedRole === "other" ? otherRole : selectedRole,
                    department: Department,
                    faculty: Faculty,
                    workplace: Workplace,
                    tel: Tel,
                    url: window.location.host+"/",
                    usageformat: "["+ usageformat+"]",
                    imge_kyc_path: null,
                    e_kyc: GoogleID === '' ? getekyc : "1",
                    typesid: type
                }),
            });

            const result = await response.json();
            // console.log(result)
            if (response.ok) {
                console.log(result)
                if(checkbox1 === true && (File !== '' || File != null)){
                    console.log("file : ",File)
                    console.log("userid : ",result.userid)
                    const formDataRequest = new FormData();
                    formDataRequest.append("userid", result.userid);
                    formDataRequest.append("file", File);
                    formDataRequest.append("status_request", "1");
                    
                    const responseRequest = await fetch(variables.API_URL + "request/create/", {
                        method: "POST",
                        body: formDataRequest,
                    });
        
                    const resultRequest = await responseRequest.json();
                    console.log("resultRequest : ",resultRequest)
                    return true
                }
                return true
            } else {
                return result.err
            }
        } catch (err) {
            return err
           
        }
    }
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    // const clientId ="608918814563-geifv2f4mg3c1rqivvnok1lhcphdfnlf.apps.googleusercontent.com" // pst121243@gmail.com
    const clientId ="289302695651-pngfh1sob9anv945q7fl3d6krvp0aqom.apps.googleusercontent.com"
 
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            })
        }
        gapi.load("client:auth2", initClient)
    }, [])

    const onSuccess = (res) => {
        console.log('success', res)
        setEmail(res.profileObj.email)
        setGoogleID(res.profileObj.googleId)
        try{
            fetch(variables.API_URL+"user/duplicate/email/"+res.profileObj.email+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if(result.err !== undefined){
                       handSwal("มีบัญชีอยู่ในระบบแล้ว")
                       setEmail('')
                       setGoogleID('')
                    }
                    else{
                        setstep(true)
                    }
                }
            )
        }catch (err) {

        }  
    }
    const onFailure = (res) => {
        console.log('failed', res)
    }
    // Dropzone
    const [File, setFile] = useState(''); // สำหรับเก็บไฟล์
    const [statusitem, setStatusItem] = useState(false); // สำหรับเปิด box แสดงชื่อไฟล์และลบลบไฟล์ box item
    const [namefileupload, setNameFileUpload] = useState(''); // สำหรับชื่อไฟล์อัปโหลด

    const onDrop = useCallback((acceptedFiles) => {
        console.log("OnDrop");
        console.log(acceptedFiles);
        console.log(acceptedFiles[0].type);
        if(acceptedFiles[0].type === "image/png" ||acceptedFiles[0].type === "image/jpeg" ||acceptedFiles[0].type === "image/jpg"){
            handleFileInputChange(acceptedFiles[0]);
        }else{
            console.log("รองรับเฉพาะไฟล์ .PNG .JPG และ .JPGE");
            Swal.fire({
                title: "",
                text: `รองรับเฉพาะไฟล์ .PNG .JPG และ .JPGE`,
                icon: "error",//error,question,warning,success
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
            }).then((result) => {
            });
        }
       
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accepts: "image/*",
        multiple: false,
    })

    const handleFileInputChange = (e) => {
        const file = e;
        setFile(file)
        setStatusItem(true);
        setNameFileUpload(file.path);

    }
    const handleDelFileUpload = (e) => {
        Swal.fire({
            title: "",
            text: `คุณต้องการลบไฟล์ออกใช่หรือไม่`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
            cancelButtonColor: "#d33",
            cancelButtonText:"ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                setNameFileUpload('');
                setFile('');
                setStatusItem(false);
            }
        });
    }

    const handSwal = (e) => {
        Swal.fire({
            title: "",
            text: e,
            icon: "error",//error,question,warning,success
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
        }).then((result) => {
        });
    }

    useEffect(() => {
        let errorMessage = 'กรุณากรอก';
        if(password !== '' && password !== Confirmpassword){
            seterrorpasswordMatch("รหัสผ่านไม่ตรงกัน")
        }else{
            seterrorpasswordMatch('')
        }
        if(Confirmpassword !== '' && password !== Confirmpassword){
            seterrorpasswordMatch("รหัสผ่านไม่ตรงกัน")
        }else{
            seterrorpasswordMatch('')
        }
        if (FullName === '') {
          if(errorMessage === 'กรุณากรอก'){errorMessage += ' ชื่อ นามสกุล\n'}else{errorMessage += ', ชื่อ นามสกุล\n'}
        }
        if (Tel === '') {
          if(errorMessage === 'กรุณากรอก'){errorMessage += ' เบอร์โทรศัพท์\n'}else{errorMessage += ', เบอร์โทรศัพท์\n'}
        }
        if (selectedRole === '' || (selectedRole === 'other' && otherRole === '')) {
            if(errorMessage === 'กรุณากรอก'){
                errorMessage += ' อาชีพ\n'
            }else{
                errorMessage += ', อาชีพ\n'
            }
        }
        if (checkbox1 === true) {
            if(File === ''){
                if(errorMessage === 'กรุณากรอก'){errorMessage += ' รูปยืนยันตัวตนการใช้งานรายวิชา\n'}else{errorMessage += ', รูปยืนยันตัวตนการใช้งานรายวิชา\n'}
            }
        }
        if (Department === '') {
          if(errorMessage === 'กรุณากรอก'){errorMessage += ' ภาค\n'}else{errorMessage += ', ภาค\n'}
        }
        if (Faculty === '') {
          if(errorMessage === 'กรุณากรอก'){errorMessage += ' คณะ\n'}else{errorMessage += ', คณะ\n'}
        }
        if (Workplace === '') {
          if(errorMessage === 'กรุณากรอก'){errorMessage += ' สถานที่ทำงาน\n'}else{errorMessage += ', สถานที่ทำงาน\n'}
        }
    
        seterrortext(errorMessage);

        if (Email.includes('@kmitl.ac.th') || Email.includes('@KMITL.AC.TH')) {settype(2)} 
        else {settype(3)}
      }, [Email,password,Confirmpassword,FullName, Tel, selectedRole, Department, Faculty, Workplace, otherRole, type, checkbox1, File]);
      
    return(
        <div>
        <AppHeaderOutSide />
        <div>
            <div className="box-contents-SingUp">
                <div className={Cookies.get('email') !== undefined || Cookies.get('email') === "undefined" ? "box-contents-form wait" :"box-contents-form"}>
                {/* <div className= "box-contents-form"> */}

                    <div className="box-contents-form-view light">
                        <h3 className="center">ลงทะเบียน</h3>
                        <div>
                            <ul className="progress-bar">
                                <li id="step1" className={step ? "active":""}>บัญชี</li>
                                <li id="step2" className="">ข้อมูลผู้ใช้</li>
                            </ul>   
                        </div>
                          
                        <div className='light'>
                            <form onSubmit={handleSubmit}>
                                <div className={step ? "SingUp1 none":"SingUp1"}>
                                    <div className='center'>
                                        <GoogleLogin 
                                        clientId={clientId}
                                        buttonText="Sing in with Google"
                                        onSuccess={onSuccess}
                                        onFailure={onFailure}
                                        cookiePolicy={"single_host_origin"}
                                        isSignedIn={false}
                                        />
                                    </div>
                                    <div className="bx-input-fix">
                                        <label htmlFor="Email">อีเมล <span className="danger-font">* </span></label>
                                        <input
                                            type="email"
                                            id="Email"
                                            name="Email"
                                            value={Email}
                                            onChange={handleInputEmail}
                                            placeholder="username@gmail.com"
                                        />
                                    </div>
                                    <div className="bx-input-fix">
                                        <label htmlFor="password">รหัสผ่าน <span className="danger-font">* </span><span className="danger-font">{errorpassword}</span></label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={handleInputpassword}
                                            placeholder="กรอกรหัสผ่าน"
                                        />
                                    </div>
                                    <div className="bx-input-fix">
                                        <label htmlFor="Confirmpassword">ยืนยันรหัสผ่าน <span className="danger-font">* </span><span className="danger-font">{errorConfirmpassword}</span></label>
                                        <input
                                            type="password"
                                            id="Confirmpassword"
                                            name="Confirmpassword"
                                            value={Confirmpassword}
                                            onChange={handleInputConfirmpassword}
                                            placeholder="กรอกรหัสผ่าน"
                                        />
                                    </div>
                                    <span className="danger-font">{errorpasswordMatch}</span>
                                    <div className='bx-button width100 flex-end'>
                                        <div className='button-submit' onClick={handstep}>ถัดไป</div>
                                    </div>
                                </div>
                                <div className={step ? "SingUp2":"SingUp2 none"}>
                                    
                                    <div className="bx-input-fix">
                                        <label htmlFor="FullName">ชื่อ นามสกุล <span className="danger-font">*</span></label>
                                        <input
                                            type="text"
                                            id="FullName"
                                            name="FullName"
                                            value={FullName}
                                            onChange={handleInputFullName}
                                            placeholder="กรอกชื่อ นามสกุล"
                                        />
                                    </div>
                                    <div className="bx-input-fix">
                                        <label htmlFor="Tel">เบอร์โทรศัพท์ <span className="danger-font">*</span></label>
                                        <input
                                            type="tel"
                                            id="Tel"
                                            name="Tel"
                                            value={Tel}
                                            onChange={handleInputTel}
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
                                    {checkbox1 ? 
                                    <div className="mw300px">
                                        <div className="dropzone">
                                            <div className="dz-box"{...getRootProps()}>
                                                <input className="test" {...getInputProps()} />
                                                <div className="dz-icon blue-font"><FontAwesomeIcon icon={faCloudArrowUp} /></div>
                                                { isDragActive ?
                                                        <div>วางไฟล์ที่นี่ ...</div>:
                                                        <div>ลากไฟล์มาที่นี่หรืออัปโหลด<p className="">รองรับ .PNG .JPG และ JPEG</p></div>  
                                                }
                                            </div>
                                        </div>
                                        {
                                            statusitem?
                                            <div className="box-item-name-trash space-between">
                                                <div>{namefileupload}</div>
                                                <div onClick={handleDelFileUpload} className="icon-Trash danger-font"><FontAwesomeIcon icon={faTrashCan} /></div>
                                            </div>
                                            :
                                            ''
                                        }
                                    </div>
                                    :""}
                                    
                                  
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
                                    <div className="bx-input-fix">
                                        <span className="flex fs10"><div><input className="mgR10" value = "agree" type = "checkbox" onChange = {handleChangeagree} /></div>ยินยอมให้เว็บไซต์ใช้ข้อมูลทั้งหมดที่ได้ให้ไว้ ซึ่งรวมถึงข้อมูลส่วนบุคคล และข้อมูลการใช้บริการ </span>
                                    </div>
                                    <div className='bx-button width100 flex-end'>
                                        <div className='button-reset' onClick={handstep}>ย้อนกลับ</div>
                                        <div className='button-submit' onClick={handleSubmit}>ลงทะเบียน</div>
                                        {/* <button  type="submit"  className='button-submit'>ลงทะเบียน</button> */}
                                    </div>
                                
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );

}

export default AppSingUp;