import React, { useState, useMemo, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import TableUser from '../Tools/ToolTableUser';
import Alertmanual from '../Tools/ToolAlertmanual';

function AppUser() {

    const [StartError, setStartError] = useState(0);

    const columns = useMemo(
        () => [
            {Header: 'ID ผู้ใช้',accessor: 'userid',},
            {Header: 'อีเมล์',accessor: 'email', },
            {Header: 'ชื่อผู้ใช้',accessor: 'fullname', },
            {Header: 'อาชีพ',accessor: 'job', },
            {Header: 'สาขา',accessor: 'department',},
            {Header: 'คณะ',accessor: 'faculty',},
            {Header: 'องค์กรการศึกษา',accessor: 'workplace',},
            {Header: 'เบอร์โทรศัพท์',accessor: 'tel',},
            {Header: 'สิทธิ์การใช้งาน',accessor: 'usageformat',},
            {Header: 'การยืนยันตัวตน',accessor: 'e_kyc',},
            {Header: 'ประเภทผู้ใช้',accessor: 'typesid',},
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
          <div className={StartError === 2 ? "box-content-view" : "box-content-view none"}>
            <div className="bx-topic light">
              <p><Link to="">ผู้ใช้ทั้งหมด</Link> / </p>
                    <div className='bx-grid2-topicAdmin'>
                    <h2>ผู้ใช้ทั้งหมด <Alertmanual name={"adminuser"} status={"1"}/></h2>
                    <div className='flex-end'>
                        <Link to="/Admin/User/CreateUser/">
                            <p className='button-create'><FontAwesomeIcon icon={faSquarePlus} />สร้างผู้ใช้งาน</p>
                        </Link>
                    </div>
                </div> 
            </div>
            <div className="bx-details light">
                <TableUser columns={columns}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppUser;
