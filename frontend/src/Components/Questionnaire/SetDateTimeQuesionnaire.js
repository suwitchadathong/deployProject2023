import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { variables } from "../../Variables";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
function AppSetDateTimeQuesionnaire() {
  const { id } = useParams();

  const URLOnline = window.location.host + "/OnlineQuestionnaire/" + id;
  const currentDate = new Date();
  const minDateISO = currentDate.toISOString().slice(0, 16);

  const [QueSheetName, setQueSheetName] = useState("");
  const [QueSheetTopicName, setQueSheetTopicName] = useState("");
  const [DetailsLineOne, setDetailsLineOne] = useState("");
  const [DetailsLinetwo, setDetailsLinetwo] = useState("");

  const [quehead1, setquehead1] = useState("");
  const [quehead2, setquehead2] = useState("");
  const [quehead3, setquehead3] = useState("");
  const [quehead4, setquehead4] = useState("");
  const [quehead5, setquehead5] = useState("");

  const [quetopicdetails, setquetopicdetails] = useState("");
  const [quetopicformat, setquetopicformat] = useState("");

  const [dateTimeStart, setDateTimeStart] = useState("");
  const [dateTimeend, setDateTimeend] = useState("");
  const [dateTimeshow, setdateTimeshow] = useState("");

  const [isChecked, setIsChecked] = useState(false);
  const checknonelogo = useState(false);
  const [Start, setStart] = useState(0);
  const [StartError, setStartError] = useState(0);

  const handleChangeDateStart = (event) => {
    setDateTimeStart(event.target.value);
  };
  const handleChangeDateend = (event) => {
    setDateTimeend(event.target.value);
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const fetchDataquesheet = async () => {
    try {
      fetch(variables.API_URL + "quesheet/detail/" + id + "/", {
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
            console.log("quesheet :", result);
            setQueSheetName(result.quesheetname);
            setQueSheetTopicName(result.quesheettopicname);
            setDetailsLineOne(result.detailslineone);
            setDetailsLinetwo(result.detailslinetwo);
            setdateTimeshow(result.datetimestart);
            if (result.datetimestart === null) {
            } else {
              setDateTimeStart(result.datetimestart.replace("+07:00", ""));
              // setDateTimeStart(new Date(result.datetimestart.replace("+07:00", "")))
            }
            if (result.datetimeend === null) {
            } else {
              setDateTimeend(result.datetimeend.replace("+07:00", ""));
              // setDateTimeend(new Date(result.datetimeend.replace("+07:00", "")))
            }
          }
        });
      fetch(variables.API_URL + "queheaddetails/detail/" + id + "/", {
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
            console.log(result);
            setquehead1(result.quehead1);
            setquehead2(result.quehead2);
            setquehead3(result.quehead3);
            setquehead4(result.quehead4);
            setquehead5(result.quehead5);
          }
        });
      fetch(variables.API_URL + "quetopicdetails/detail/" + id + "/", {
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
            console.log(result);
            setquetopicdetails(result.quetopicdetails);
            setquetopicformat(result.quetopicformat);
          }
        });
    } catch (err) {
      console.error(err);
      setStartError(1);
    }
  };
  if (Start === 0) {
    fetchDataquesheet();
    setStart(1);
    setTimeout(() => {
        setStartError(2);
    }, 500);
  }

  useEffect(() => {
    setTimeout(() => {
      if (StartError !== 1) {
        setStartError(2);
      }
    }, 500);
  }, []);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(URLOnline)
      .then(() => {
        Swal.fire({
          title: "",
          text:
            URLOnline +
            "\n คัดลอก LINK สำหรับทำแบบสอบถามออนไลน์แล้ว สามารถส่ง LINK ไปให้ผู้ใช้เพื่อทำแบบสอบถามออนไลน์ได้",
          icon: "success",
          confirmButtonColor: "#341699",
          confirmButtonText: "ยืนยัน",
        }).then((result) => {});
      })
      .catch((error) => {
        Swal.fire("เกิดข้อผิดพลาด");
      });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("dateTimeStart :", dateTimeStart);
    console.log("dateTimeend :", dateTimeend);
    if (isChecked === true) {
      loading();
      // fetchDataquesheet()
      setIsChecked(false);
    } else {
      if (dateTimeend === "" || dateTimeStart === "") {
        Swal.fire({
          title: "",
          text: "กรุณาเลือกวันที่ต้องการเปิดและปิดแบบสอบถามออนไลน์",
          icon: "error",
          confirmButtonColor: "#341699",
          confirmButtonText: "ยืนยัน",
        });
      } else {
        if (dateTimeStart < dateTimeend) {
          loading();
          // fetchDataquesheet()
        } else {
          console.log("วันที่เริ่มต้องไม่น้อยกว่าวันที่ปิด");
          Swal.fire({
            title: "",
            text: "วันที่เริ่มต้องไม่น้อยกว่าวันที่ปิด",
            icon: "error",
            confirmButtonColor: "#341699",
            confirmButtonText: "ยืนยัน",
          });
        }
      }
    }
  }
  async function loading() {
    try {
      const loadingSwal = Swal.fire({
        title: "กำลังประมวลผล...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            const check = await UpdateQue();
            console.log(check);
            if (check === true) {
              Swal.close();
              Swal.fire({
                title: "",
                text:
                  isChecked === true
                    ? "ปิดการใช้งานแบบสอบถามออนไลน์"
                    : "ตั้งค่าการใช้งานแบบสอบถามออนไลน์เสร็จสิ้น สามารถคัดลอกลิงค์ส่งไปให้ผู้ใช้แบบสอบถามได้",
                icon: "success",
                confirmButtonColor: "#341699",
                confirmButtonText: "ยืนยัน",
              }).then((result) => {
                window.location.reload();
                // window.location.href = '/Questionnaire/QuestionnaireNo/ShowQuestionnaire/'+id;
              });
            } else {
              Swal.close();
              Swal.fire("เกิดข้อผิดพลาด" + check);
            }
          } catch (error) {
            Swal.close();
            Swal.fire("เกิดข้อผิดพลาด" + error);
          }
        },
      });
      await loadingSwal;
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด");
    }
  }
  async function UpdateQue() {
    try {
      const queupdateTime = await fetch(
        variables.API_URL + "quesheet/update/" + id + "/",
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            datetimestart: isChecked === true ? null : dateTimeStart,
            datetimeend: isChecked === true ? null : dateTimeend,
            userid: Cookies.get("userid"),
          }),
        }
      );

      const result = await queupdateTime.json();

      if (result) {
        if (result.err === undefined) {
          return true;
        } else {
          return result.err;
        }
      } else {
        return result.err;
      }
    } catch (err) {
      return false;
    }
  }
  const handlereset = async (e) => {
    fetchDataquesheet();
  };

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
          <div
            className={
              StartError === 2 ? "box-content-view" : "box-content-view none"
            }
          >
            <div className="bx-topic light">
              <p>
                <Link to="/Questionnaire">จัดการแบบสอบถาม</Link> /{" "}
                <Link to={"/Questionnaire/"}>แบบสอบถามทั้งหมด</Link> /{" "}
                <Link to={"/Questionnaire/QuestionnaireNo/" + id}>
                  {QueSheetName}
                </Link>{" "}
                / ตั้งค่าแบบสอบถามออนไลน์
              </p>
              <div className="bx-grid-topic">
                <h2>ตั้งค่าแบบสอบถามออนไลน์</h2>
              </div>
            </div>

            <div className="bx-details light">
              <div className="bx-details-items-small">
                <div className="bx-bx-topic">
                  URL สำหรับเข้าทำแบบสอบถาม Online
                </div>
                {dateTimeshow === "" || dateTimeshow === null ? (
                  <div className="bx-bx-details flexCenter">
                    <p className="text-nowrap">
                      ยังไม่ได้เปิดการใช้งานแบบสอบถามออนไลน์
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bx-bx-details flexCenter">
                      <p className="text-nowrap">{URLOnline}</p>
                    </div>
                    <div className="bx-bx-details flexCenter">
                      <div
                        className="button-submit center w250px"
                        onClick={handleCopyClick}
                      >
                        คัดลอกลิงค์แบบสอบถามออนไลน์
                      </div>
                    </div>
                  </>
                )}
              </div>
              <form>
                <div className="">
                  <div
                    className={
                      dateTimeshow === "" || dateTimeshow === null
                        ? "bx-input-fix flex none"
                        : "bx-input-fix flex "
                    }
                  >
                    <label htmlFor="myCheckbox" className="pdr10px">
                      ปิดแบบสอบถามออนไลน์
                    </label>
                    <input
                      className=""
                      type="checkbox"
                      id="myCheckbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="bx-input-fix">
                    <label htmlFor="datetimeStart" className="w100px">
                      เวลาเปิด
                    </label>
                    <input
                      className={isChecked === true ? "wait" : ""}
                      type="datetime-local"
                      id="datetimeStart"
                      name="datetimeStart"
                      min={minDateISO}
                      value={dateTimeStart}
                      placeholder="yyyy-MM-ddThh:mm"
                      onChange={handleChangeDateStart}
                    />
                  </div>
                  <div className="bx-input-fix">
                    <label htmlFor="datetimeend" className="w100px">
                      เวลาปิด
                    </label>
                    <input
                      className={isChecked === true ? "wait" : ""}
                      type="datetime-local"
                      id="datetimeend"
                      name="datetimeend"
                      min={minDateISO} // Set minimum date to current date
                      value={dateTimeend}
                      placeholder="yyyy-MM-ddThh:mm"
                      onChange={handleChangeDateend}
                    />
                  </div>
                  <div className="bx-button">
                    <div onClick={handlereset} className="button-reset">
                      รีเซ็ท
                    </div>
                    <button
                      type="submit"
                      className="button-submit"
                      onClick={handleSubmit}
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppSetDateTimeQuesionnaire;
