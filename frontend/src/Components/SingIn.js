import AppHeaderOutSide from "./HeaderOutSide";
import { useState,useEffect} from "react";
import {variables} from "../Variables";
// import { useState, useEffect} from "react";
import { GoogleLogin} from 'react-google-login'
import { gapi } from 'gapi-script'
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'

import {
  Link
} from "react-router-dom";

function AppSingIn(){

  const [Email, SetEmail] = useState('');
  const [password, Setpassword] = useState('');

  const handleInputEmail = (e) => { SetEmail(e.target.value); };
  const handleInputpassword = (e) => { Setpassword(e.target.value);};

  // const clientId ="608918814563-geifv2f4mg3c1rqivvnok1lhcphdfnlf.apps.googleusercontent.com"//pst121243@gmail.com
  const clientId ="289302695651-pngfh1sob9anv945q7fl3d6krvp0aqom.apps.googleusercontent.com" //mcaqs
  
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      }).then(() => {
      }).catch((error) => {
      });
    };

    gapi.load("client:auth2", initClient);
    
  }, [clientId]);
  
  const onSuccess = (res) => {
    SingInGoogleID(res.profileObj.email,res.profileObj.googleId)
  }

  const onFailure = (res) => {
  }

  async function SingInGoogleID(email, googleId){
    try{
      // Fetch API user/login/google/ เข้าสู่ระบบด้วย google
      const response = await fetch(variables.API_URL + "user/login/google/", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            googleid: googleId,
        }),
      });

      const result = await response.json(); 

      if(result.err === undefined){
        // สร้าง Cookies
        Cookies.set('userid', result.userid, { expires: 5 / 24 });
        Cookies.set('email', result.email, { expires: 5 / 24 });
        Cookies.set('fullname', result.fullname, { expires: 5 / 24 });
        Cookies.set('userid', result.userid, { expires: 5 / 24 });
        Cookies.set('email', result.email, { expires: 5 / 24 });
        Cookies.set('fullname', result.fullname, { expires: 5 / 24 });
        Cookies.set('googleid', result.googleid, { expires: 5 / 24 });
        const usage_list = eval(result.usageformat)
        Cookies.set('usageformat1', usage_list[0], { expires: 5 / 24 });
        Cookies.set('usageformat2', usage_list[1], { expires: 5 / 24 });
        Cookies.set('e_kyc', result.e_kyc, { expires: 5 / 24 });
        Cookies.set('typesid', result.typesid, { expires: 5 / 24 });
        Cookies.set('clientId', clientId, { expires: 5 / 24 });
        window.location.href = '/Home';
      }else{
        Swal.fire({
          title: result.err,
          icon: "error",//error,question,warning,success
          confirmButtonColor:"#341699",
        }); 
      }
    }catch(err){
    }
  }

  
  async function handleSubmit(e) {
    e.preventDefault();
    try{
      // Fetch API user/login/ เข้าสู่ระบบด้วย 
      const response = await fetch(variables.API_URL + "user/login/", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            email: Email,
            password: password
        }),
      });

      const result = await response.json(); 
      if(result.err === undefined){
        // สร้าง Cookies
        // UserID,Email,FullName,googleID,Usageformat,E_KYC,TypesID
        Cookies.set('userid', result.userid, { expires: 5 / 24 });
        Cookies.set('email', result.email, { expires: 5 / 24 });
        Cookies.set('fullname', result.fullname, { expires: 5 / 24 });
        Cookies.set('googleid', result.googleid, { expires: 5 / 24 });
        const usage_list = eval(result.usageformat)
        Cookies.set('usageformat1', usage_list[0], { expires: 5 / 24 });
        Cookies.set('usageformat2', usage_list[1], { expires: 5 / 24 });
        Cookies.set('e_kyc', result.e_kyc, { expires: 5 / 24 });
        Cookies.set('typesid', result.typesid, { expires: 5 / 24 });
        Cookies.set('clientId', clientId, { expires: 5 / 24 });

        window.location.href = '/Home';
      }else{
        Swal.fire({
          title: result.err,
          icon: "error",//error,question,warning,success
          confirmButtonColor:"#341699",
        }); 
      }
    }catch(error){
    }
  }

  return(
    <div>
      <AppHeaderOutSide />
      <div className="box-contents-SingIn">
        <div className={Cookies.get('email') !== undefined || Cookies.get('email') === "undefined" ? "box-contents-form wait" :"box-contents-form"}>
          <div className="box-contents-form-view light">
            <h3 className="center">เข้าสู่ระบบ</h3>
            <div className='light'>
              <div className='center'>
                <GoogleLogin 
                  clientId={clientId}
                  buttonText="Sign in with Google"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={"single_host_origin"}
                  isSignedIn={false}
                />
              </div> 
              <form onSubmit={handleSubmit}>
                  <div className="bx-input-fix">
                      <label htmlFor="Email">อีเมล</label>
                      <input
                          type="email"
                          id="Email"
                          name="Email"
                          value={Email}
                          onChange={handleInputEmail}
                          placeholder="example@mail.com"
                      />
                  </div>
                  <div className="bx-input-fix">
                      <label htmlFor="password">รหัสผ่าน</label>
                      <input
                          type="password"
                          id="password"
                          name="password"
                          value={password}
                          onChange={handleInputpassword}
                          placeholder="กรอกรหัสผ่าน"
                      />
                  </div>

                  <div>
                    <div className='width100 bx-button' style={{ width: '100%' }}>
                      {/* <button type="reset" className='button-cancel'>รีเซ็ท</button> */}
                      <button type="submit"  className='button-submit width100'>ยืนยัน</button>
                    </div>
                  </div>
              </form>            
              <div className="center">สร้างบัญชีใหม่ได้ที่นี่ <Link to="/SingUp">สมัครสมาชิก</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default AppSingIn;