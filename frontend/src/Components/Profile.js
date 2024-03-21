import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faTrashCan,
  faTriangleExclamation,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useCallback } from "react";
import { GoogleLogin} from 'react-google-login'
import { gapi } from 'gapi-script'

import Cookies from "js-cookie";
import { variables } from "../Variables";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
function AppProfile() {
  const [ClickUpdate, setClickUpdate] = useState(false);
  const handClickUpdate = () => setClickUpdate(!ClickUpdate);

  const [email, setemail] = useState("");
  const [tel, settel] = useState("");
  const [fullname, setfullname] = useState("");
  const [job, setjob] = useState("");
  const [Department, setDepartment] = useState("");
  const [Faculty, setFaculty] = useState("");
  const [Workplace, setWorkplace] = useState("");

  const [datarequest, setdatarequest] = useState([]);

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  const [errortext, seterrortext] = useState("");

  // const clientId ="608918814563-geifv2f4mg3c1rqivvnok1lhcphdfnlf.apps.googleusercontent.com" // pst121243@gmail.com
  const clientId ="289302695651-pngfh1sob9anv945q7fl3d6krvp0aqom.apps.googleusercontent.com" //mcaqs

  const handleInputemail = (e) => {
    setemail(e.target.value);
  };
  const handleInputfullname = (e) => {
    setfullname(e.target.value);
  };
  const handleInputtel = (e) => {
    settel(e.target.value.replace(/\D/g, ""));
  };
  const handleInputjob = (e) => {
    setjob(e.target.value);
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
  // const handleInputpassword = (e) => { setpassword(e.target.value); };
  // const handleInputConfirmpassword = (e) => {setConfirmpassword(e.target.value);};

  const [Start, setStart] = useState(0);
  const [StartError, setStartError] = useState(0);

  const fetchDataUser = async () => {
    try {
      // Fetch API user/detail ขอข้อมูล user
      fetch(variables.API_URL + "user/detail/" + Cookies.get("userid") + "/", {
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
            // กำหนดค่าตัวแปร
            setemail(result.email);
            settel(result.tel);
            setfullname(result.fullname);
            setjob(result.job);
            setDepartment(result.department);
            setFaculty(result.faculty);
            setWorkplace(result.workplace);
            setCheckbox1(parseInt(Cookies.get("usageformat1")));
            setCheckbox2(parseInt(Cookies.get("usageformat2")));
          }
        });
    } catch (err) {
      setStartError(1);
    }
  };

  const fetchDataRequest = async () => {
    try {
      // Fetch API user/detail ขอข้อมูล user
      fetch(variables.API_URL +"request/detail/user/" +Cookies.get("userid") +"/",{
          method: "GET",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      )
      .then((response) => response.json())
      .then((result) => {
        if (result.err !== undefined) {
          setStartError(1);
        } else {
          setdatarequest(result);
        }
      });
    } catch (err) {
      setStartError(1);
    }
  };

  if (Start === 0) {
    fetchDataUser();
    fetchDataRequest();
    setStart(1);
  }
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      }).then(() => {
        // console.log('Google API client initialized successfully');
      }).catch((error) => {
        // console.error('Error initializing Google API client', error);
      });
    };

    gapi.load("client:auth2", initClient);
    
  }, [clientId]);

  const onSuccess = (res) => {
    if(res.profileObj.email === Cookies.get('email')){
      SingInGoogleID(res.profileObj.googleId)
    }else{
      Swal.fire({
        title: "อีเมลที่ใช้สมัครกับอีเมลที่จะทำการเชื่อมต่อไม่ตรงกัน",
        icon: "error", //error,question,warning,success
        confirmButtonColor: "#341699",
      });
    }
  }

  const onFailure = (res) => {
    // console.log('failed', res)
  }

  async function SingInGoogleID(googleId){
    try {
      const response = await fetch(
        variables.API_URL + "user/update/" + Cookies.get("userid") + "/",
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            googleid: googleId,
          }),
        }
      );
      
      const result = await response.json();

      if (result.err === undefined) {
        Swal.fire({
          title: "ทำการเชื่อมต่อเสร็จสิ้น โปรดเข้าสู่ระบบใหม่อีกครั้ง",
          icon: "success", //error,question,warning,success
          confirmButtonColor: "#341699",
        }).then( (result) => {
          handleGoogleLogout()
        })
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
  }

  const handleGoogleLogout = () => {
    Cookies.remove('userid');
    Cookies.remove('email');
    Cookies.remove('fullname');
    Cookies.remove('googleid');
    Cookies.remove('usageformat1');
    Cookies.remove('usageformat2');
    Cookies.remove('e_kyc');
    Cookies.remove('typesid');
    Cookies.remove('clientId');
    Cookies.remove('userToken');
    window.location.href = '/SingIn';
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
    if (job === "") {
      if (errorMessage === "กรุณากรอก") {
        errorMessage += " อาชีพ\n";
      } else {
        errorMessage += ", อาชีพ\n";
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

    seterrortext(errorMessage);
  }, [email, tel, fullname, Department, Faculty, Workplace, job]);

  async function handleUpdateUser(e) {
    e.preventDefault();
    if (errortext === "กรุณากรอก") {
      try {
        const response = await fetch(
          variables.API_URL + "user/update/" + Cookies.get("userid") + "/",
          {
            method: "PUT",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              fullname: fullname,
              tel: tel,
              job: job,
              department: Department,
              faculty: Faculty,
              workplace: Workplace,
            }),
          }
        );

        const result = await response.json();

        if (result.err === undefined) {
          fetchDataUser();
          setClickUpdate(false);
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
  const handleResetUser = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "",
      text: `คุณต้องการรีเซ็ทเป็นค่าเริ่มต้นหรือไม่`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#341699",
      confirmButtonText: "ยืนยัน",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchDataUser();
      }
    });

    // console.log('Confirmpassword:', Confirmpassword);
  };

  // Dropzone
  const [File, setFile] = useState(""); // สำหรับเก็บไฟล์
  const [statusitem, setStatusItem] = useState(false); // สำหรับเปิด box แสดงชื่อไฟล์และลบลบไฟล์ box item
  const [namefileupload, setNameFileUpload] = useState(""); // สำหรับชื่อไฟล์อัปโหลด

  const onDrop = useCallback((acceptedFiles) => {
    if (
      acceptedFiles[0].type === "image/png" ||
      acceptedFiles[0].type === "image/jpeg" ||
      acceptedFiles[0].type === "image/jpg"
    ) {
      handleFileInputChange(acceptedFiles[0]);
    } else {
      Swal.fire({
        title: "",
        text: `รองรับเฉพาะไฟล์ .PNG .JPG และ .JPGE`,
        icon: "error", //error,question,warning,success
        confirmButtonColor: "#341699",
        confirmButtonText: "ยืนยัน",
      }).then((result) => {});
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: "image/*",
    multiple: false,
  });

  const handleFileInputChange = (e) => {
    const file = e;
    setFile(file);
    setStatusItem(true);
    setNameFileUpload(file.path);
  };
  const handleDelFileUpload = (e) => {
    Swal.fire({
      title: "",
      text: `คุณต้องการลบไฟล์ออกใช่หรือไม่`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#341699",
      confirmButtonText: "ยืนยัน",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setNameFileUpload("");
        setFile("");
        setStatusItem(false);
      }
    });
  };

  function extractFilenameFromURL(url) {
    const parts = url.split("/");
    const filenameWithSpaces = parts[parts.length - 1];
    const decodedFilename = decodeURIComponent(filenameWithSpaces);
    return decodedFilename;
  }

  async function handlesubmitRequest(e) {
    e.preventDefault();
    if (File !== "") {
      Swal.fire({
        title: "",
        text: `คุณต้องการขอใช้งานการจัดการรายวิชาใช่หรือไม่`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#341699",
        confirmButtonText: "ยืนยัน",
        cancelButtonColor: "#d33",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        try {
          if (result.isConfirmed) {
            const formDataRequest = new FormData();
            formDataRequest.append("userid", Cookies.get("userid"));
            formDataRequest.append("file", File);
            formDataRequest.append("status_request", "1");

            const responseRequest = await fetch(
              variables.API_URL + "request/create/",
              {
                method: "POST",
                body: formDataRequest,
              }
            );

            const resultRequest = await responseRequest.json();
            if (resultRequest.err === undefined) {
              fetchDataRequest();
              setNameFileUpload("");
              setFile("");
              setStatusItem(false);
              setCheckbox1(false);
              Swal.fire({
                title: "",
                text: "คุณร้องขอการใช้งานรายวิชาไปยังระบบ รอการตรวจสอบการใช้งานรายวิชา",
                icon: "success", //error,question,warning,success
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
              }).then((result) => {});
            } else {
              Swal.fire({
                title: "",
                text: "เกิดข้อผิดพลาด " + resultRequest.err,
                icon: "error", //error,question,warning,success
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
              }).then((result) => {});
            }
          }
        } catch (err) {
          Swal.fire({
            title: "",
            text: "เกิดข้อผิดพลาด " + err,
            icon: "error", //error,question,warning,success
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
          }).then((result) => {});
        }
      });
    } else {
      Swal.fire({
        title: "",
        text: "กรุณาใส่รูปภาพเพื่อยืนยันตัวตน",
        icon: "error", //error,question,warning,success
        confirmButtonColor: "#341699",
        confirmButtonText: "ยืนยัน",
      }).then((result) => {});
    }
  }
  async function showimgrequest(imgrequest) {
    Swal.fire({
      imageUrl: imgrequest,
      imageAlt: imgrequest,
      customClass: {
        popup: "custom-alert-popup", // Add your custom class here
      },
    });
  }

  return (
    <div className="content">
      <main>
        <div className="box-content">
          <div className="box-content-view">
            <div className="bx-topic light">
              <p>
                <Link to="/Subject">ประวัติส่วนตัว</Link>
              </p>
              <div className="bx-grid-topic">
                <div className="flex">
                  <h2>ประวัติส่วนตัว</h2>
                  {Cookies.get("typesid") === "1" ||
                  Cookies.get("typesid") === 1 ? null : (
                    <div className="hfc pdl10px">
                      {" "}
                      <p
                        className="button-update cursor-p"
                        onClick={handClickUpdate}
                      >
                        แก้ไข
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bx-details light">
              <form>
                <div className="form-set">
                  {
                    Cookies.get('googleid') === ''?
                    <div>
                      <GoogleLogin 
                        clientId={clientId}
                        buttonText="Sing in with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={"single_host_origin"}
                        isSignedIn={false}
                      />
                    </div>
                    // null
                    :
                    null
                  }
                  <h3>ข้อมูลผู้ใช้</h3>
                  <div className="bx-input inline-grid">
                    <label htmlFor="email">อีเมล</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleInputemail}
                      placeholder="e-mail"
                      disabled={"disabled"}
                    />
                  </div>
                  <div className="bx-input inline-grid">
                    <label htmlFor="fullname">ชื่อ-สกุล</label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={fullname}
                      onChange={handleInputfullname}
                      placeholder="ชื่อ"
                      disabled={ClickUpdate ? "" : "disabled"}
                    />
                  </div>
                  <div className="bx-input inline-grid">
                    <label htmlFor="tel">เบอร์โทร</label>
                    <input
                      type="text"
                      id="tel"
                      name="tel"
                      value={tel}
                      onChange={handleInputtel}
                      placeholder="เบอร์โทร"
                      maxLength="10"
                      disabled={ClickUpdate ? "" : "disabled"}
                    />
                  </div>
                  <div className="space10"></div>
                  {Cookies.get("typesid") === "1" ||
                  Cookies.get("typesid") === 1 ? null : (
                    <div>
                      <h3>ข้อมูลอาชีพ</h3>
                      <div className="bx-input inline-grid">
                        <label htmlFor="job">อาชีพ</label>
                        <input
                          type="text"
                          id="job"
                          name="job"
                          value={job}
                          onChange={handleInputjob}
                          placeholder="อาชีพ"
                          disabled={ClickUpdate ? "" : "disabled"}
                        />
                        {/* {ClickUpdate ? <FontAwesomeIcon icon={faPenToSquare} />:''} */}
                      </div>

                      <div className="bx-input inline-grid">
                        <label htmlFor="Faculty">สังกัด/คณะ</label>
                        <input
                          type="text"
                          id="Faculty"
                          name="Faculty"
                          value={Faculty}
                          onChange={handleInputFaculty}
                          placeholder="สังกัด/คณะ"
                          disabled={ClickUpdate ? "" : "disabled"}
                        />
                        {/* {ClickUpdate ? <FontAwesomeIcon icon={faPenToSquare} />:''} */}
                      </div>
                      <div className="bx-input inline-grid">
                        <label htmlFor="Department">ภาค/สาขา/สาย</label>
                        <input
                          type="text"
                          id="Department"
                          name="Department"
                          value={Department}
                          onChange={handleInputDepartment}
                          placeholder="ภาค/สาขา"
                          disabled={ClickUpdate ? "" : "disabled"}
                        />
                        {/* {ClickUpdate ? <FontAwesomeIcon icon={faPenToSquare} />:''} */}
                      </div>
                      <div className="bx-input inline-grid">
                        <label htmlFor="Workplace">
                          องค์กรการศึกษา/สถานที่ทำงาน
                        </label>
                        <input
                          type="text"
                          id="Workplace"
                          name="Workplace"
                          value={Workplace}
                          onChange={handleInputWorkplace}
                          placeholder="สถานที่ทำงาน"
                          disabled={ClickUpdate ? "" : "disabled"}
                        />
                        {/* {ClickUpdate ? <FontAwesomeIcon icon={faPenToSquare} />:''} */}
                      </div>
                    </div>
                  )}
                  {ClickUpdate ? (
                    <div
                      className={ClickUpdate ? "bx-button" : "none bx-button"}
                    >
                      <div onClick={handleResetUser} className="button-reset">
                        รีเซ็ท
                      </div>
                      <div onClick={handleUpdateUser} className="button-submit">
                        บันทึก
                      </div>
                    </div>
                  ) : Cookies.get("typesid") === "1" ||
                    Cookies.get("typesid") === 1 ? null : (
                    <div className="space10"></div>
                  )}
                </div>
              </form>
              {Cookies.get("typesid") === "1" ||
              Cookies.get("typesid") === 1 ? null : (
                <>
                  <hr></hr>
                  <div className="space10"></div>
                  
                  {Cookies.get("typesid") === "1" || Cookies.get("typesid") === 1
                    ? null
                    : "เลือกประเภทสิทธิ์การใช้งานที่ต้องการในระบบ (กรณีเลือกจัดการรายวิชา ต้องทำการยืนยันตัวตน ไม่สามารถเลือกดูคะแนนได้)"}
                  <div className="bx-input-fix">
                    <span className="flex">
                      <input
                        className="mgR10 wait"
                        value="1"
                        type="checkbox"
                        checked={checkbox2}
                        onChange={handleCheckbox2}
                      />
                      จัดการแบบสอบถาม{" "}
                    </span>
                  </div>
                  {Cookies.get("usageformat1") === "1" ? (
                    <div className="bx-input-fix">
                      <span className="flex">
                        <input
                          className="mgR10 wait"
                          value="0"
                          type="checkbox"
                          checked={checkbox1}
                          onChange={handleCheckbox1}
                        />
                        จัดการรายวิชา{" "}
                      </span>
                    </div>
                  ) : (
                    <div className="bx-input-fix">
                      <span className="flex">
                        <input
                          className={
                            Cookies.get("usageformat1") === "0" &&
                            datarequest.length !== 0 &&
                            datarequest.some(
                              (item) => item.status_request === "1"
                            ) === true
                              ? "mgR10 wait"
                              : "mgR10"
                          }
                          value="0"
                          type="checkbox"
                          checked={checkbox1}
                          onChange={handleCheckbox1}
                        />
                        จัดการรายวิชา{" "}
                      </span>
                    </div>
                  )}

                  {checkbox1 &&
                  (Cookies.get("usageformat1") === 0 ||
                    Cookies.get("usageformat1") === "0") ? (
                    <div className="mw300px">
                      <div className="dropzone">
                        <div className="dz-box" {...getRootProps()}>
                          <input className="test" {...getInputProps()} />
                          <div className="dz-icon blue-font">
                            <FontAwesomeIcon icon={faCloudArrowUp} />
                          </div>
                          {isDragActive ? (
                            <div>วางไฟล์ที่นี่ ...</div>
                          ) : (
                            <div>
                              ลากไฟล์มาที่นี่หรืออัปโหลด
                              <p className="">รองรับ .PNG .JPG และ JPEG</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {statusitem ? (
                        <div className="box-item-name-trash space-between">
                          <div>{namefileupload}</div>
                          <div
                            onClick={handleDelFileUpload}
                            className="icon-Trash danger-font"
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="bx-button width100 flex-end">
                        <div
                          className="button-submit"
                          onClick={handlesubmitRequest}
                        >
                          บันทึก
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
              {Cookies.get("usageformat1") === "1" ? null : (
                <div>
                  <div className="fb">
                    ตารางแสดงสถานะการขอใช้งานการจัดการรายวิชา
                  </div>
                  <div className="tableSub">
                    <table className="width100">
                      <thead>
                        <tr>
                          <th>ลำดับ</th>
                          <th>รูปที่แนบ</th>
                          <th>สถานะ</th>
                          <th>หมายเหตุ</th>
                          {/* <th>การจัดการ</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {datarequest.map((item, index) =>
                          item.status_request === "1" ||
                          item.status_request === 1 ? (
                            <tr key={index}>
                              <td className="center">{index + 1} </td>
                              <td className="center">
                                <p
                                  onClick={() =>
                                    showimgrequest(item.imgrequest_path)
                                  }
                                >
                                  {extractFilenameFromURL(item.imgrequest_path)}{" "}
                                </p>
                              </td>
                              <td className="center">
                                {item.status_request === "1" ? (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faTriangleExclamation}
                                      className="warning-font"
                                    />{" "}
                                    อยู่ระหว่างรอดำเนินการให้แอดมินตรวจสอบยืนยันการใช้งานการจัดการรายวิชา
                                  </p>
                                ) : (
                                  ""
                                )}{" "}
                              </td>
                              <td className="center">
                                {item.notes === null || item.notes === ""
                                  ? "-"
                                  : item.notes}
                              </td>
                            </tr>
                          ) : item.status_request === "2" ? (
                            <tr key={index}>
                              <td className="center">{index + 1} </td>
                              <td className="center">
                                {extractFilenameFromURL(item.imgrequest_path)}{" "}
                              </td>
                              <td className="center">
                                {item.status_request === "2" ? (
                                  <p>
                                    <FontAwesomeIcon
                                      className="danger-font"
                                      icon={faCircleXmark}
                                    />{" "}
                                    ไม่ผ่านการตรวจสอบ
                                  </p>
                                ) : (
                                  ""
                                )}{" "}
                              </td>
                              <td className="center">
                                {item.notes === null || item.notes === ""
                                  ? "-"
                                  : item.notes}
                              </td>
                            </tr>
                          ) : null
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppProfile;
