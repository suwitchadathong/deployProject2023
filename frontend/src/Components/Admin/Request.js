import React, { useState, useMemo, useEffect } from 'react';
import { Link } from "react-router-dom";
import TableRequest from '../Tools/ToolTableRequest';
import Alertmanual from '../Tools/ToolAlertmanual';


function AppRequest() {

  const [StartError, setStartError] = useState(0);

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
              <p><Link to="">การร้องขอ</Link> / </p>
                    <div className='bx-grid-topicAdmin'>
                    <h2>การร้องขอ <Alertmanual name={"adminrequest"} status={"1"}/></h2>
                </div> 
            </div>
            <div className="bx-details light">
                <TableRequest columns={columns}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppRequest;
