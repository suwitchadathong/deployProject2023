import React, { useState, useMemo, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import TableType from "../Tools/ToolTableType";
import Alertmanual from '../Tools/ToolAlertmanual';

function AppType() {

    const [StartError, setStartError] = useState(0);

    const columns = useMemo(
        () => [
            {Header: 'ID ประเภท',accessor: 'typesid',},
            {Header: 'ชื่อประเภท',accessor: 'typesname', },
            {Header: 'จำนวนรายวิชาที่สร้างได้',accessor: 'limitsubject', },
            {Header: 'จำนวนครั้งการสอบที่สร้างได้',accessor: 'limitexam', },
            {Header: 'จำนวนแบบสอบถามที่สร้างได้',accessor: 'limitque',},
        ],
        []
    );

  useEffect(() => {
    setTimeout(() => {
      setStartError(2);
    }, 500);
  }, []);

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
              <p><Link to="">ประเภทการใช้งาน</Link> / </p>
                    <div className='bx-grid2-topicAdmin'>
                    <h2>ประเภทการใช้งาน <Alertmanual name={"admintype"} status={"1"}/></h2>
                    <div className='flex-end'>
                        <Link to="/Admin/Type/CreateType/">
                            <p className='button-create'><FontAwesomeIcon icon={faSquarePlus} />สร้างประเภทการใช้งาน</p>
                        </Link>
                    </div>
                </div> 
            </div>
            <div className="bx-details light">
                <TableType columns={columns}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppType;
