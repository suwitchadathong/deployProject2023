import React, { useState, useEffect} from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useFilters, // Import useFilters
} from 'react-table';
import {variables} from "../../Variables";
import Swal from 'sweetalert2'
import {
    Link
} from "react-router-dom";
import Cookies from 'js-cookie';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronRight, faChevronLeft, faAnglesRight, faAnglesLeft, faTrashCan, faPen, faSortDown, faSortUp, faSort} from "@fortawesome/free-solid-svg-icons";

const TableAdminQuestionnaire = ({ columns }) => {
    // const [DataSubject, setDataSubject] = useState([]);
    const [data, setdata] = useState([]);
    const [user, setuser] = useState([]);

    const fetchDataQueUser = async () => {
        try{
            const responseUser= await fetch(variables.API_URL+"user/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });
            const resultUser = await responseUser.json();
           
            const responseQue = await fetch(variables.API_URL+"quesheet/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            })
            const resultQue = await responseQue.json();

            const user = resultUser;
            const Que = resultQue;

            
            const userMap = {};

            user.forEach(entry => {
                userMap[entry.userid] = entry.email;
            });

 
            const updatedInput = Que.map(entry => ({
                ...entry,
                useridUpdate: userMap[entry.userid] || 'Unknown'
            }));
            setdata(updatedInput)
        }catch (err) {
            setdata([])
        }
    };
    const fetchDataQue = async () => {
        try{
            fetch(variables.API_URL+"quesheet/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    setdata(result)
                }
            )
        }catch (err) {
            setdata([])
        }
        
    };
    const fetchDataUser = async () => {
        try{
            fetch(variables.API_URL+"user/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    setuser(result)
                }
            )
        }catch (err) {
            setuser([])
        }
        
    };
    useEffect(() => {
        // fetchDataQue();
        // fetchDataUser();
        fetchDataQueUser();
    }, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        setGlobalFilter,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        gotoPage,
        pageCount,
        setPageSize,
    } = useTable(
        {
        columns,
        data,
        filterTypes: {
            text: (rows, id, filterValue) => {
            return rows.filter((row) => {
                const rowValue = row.values[id];
                return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .includes(String(filterValue).toLowerCase())
                : true;
            });
            },
        },
        },
        useFilters, // Use useFilters before useSortBy
        useGlobalFilter,
        useSortBy,
        usePagination
    );


    const { pageIndex, pageSize, globalFilter } = state;
    const [selectedColumn] = useState('all');
    // const [selectedColumn,setSelectedColumn] = useState('all'); // Default to search all columns

    const handleDelCours = async (queid,quesheetname,) => {
        Swal.fire({
            title: "ลบแบบสอบถาม",
            text: `คุณต้องการลบแบบสอบถาม ${quesheetname} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"quesheet/delete/"+queid+"/", {
                        method: "DELETE",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        })
                        .then(response => response.json())
                        .then(result => {
                            Swal.fire({
                                title: result.msg+"\n"+removeTZ(result.deletetime),
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            // fetchDataQue();
                            fetchDataQueUser();
                        }
                    )
                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบแบบสอบถาม",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };
    const handlecancelDel = async (queid,quesheetname,datetime,userid) => {
        Swal.fire({
            title: `วิชาจะถูกลบในวันที่และเวลา \n${datetime}`,
            text: `คุณต้องการยกเลิกการลบแบบสอบถาม ${quesheetname} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    // fetchDataQue();
                    // fetchDataUser();
                    fetch(variables.API_URL+"quesheet/update/"+queid+"/", {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            userid : userid,
                            deletetimequesheet : null
                        }),
                        })
                        .then(response => response.json())
                        .then(result => {
                            Swal.fire({
                                title: "ทำการยกเลิกการลบเสร็จสิ้น",
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            // fetchDataQue();
                            fetchDataQueUser();
                        }
                    )
                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบแบบสอบถาม",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };

    function removeTZ(dateTimeString) {
        return dateTimeString.replace("T", " ").replace("Z", "").replace("+07:00", "");
    }
    const findUseremailById = (id) => {
        const useremail = user.find(usercol => usercol.userid === id);
        return useremail ? useremail.email : "User email not found";
    };
    const findSeq = (Seq) => {
        if(Seq === 1 || Seq === "1" ){
            return "ค่าเริ่มต้น"
        }else if(Seq === 2 || Seq === "2" ){
            return "กำลังอัปโหลดแบบสอบถาม"
        }else if(Seq === 3 || Seq === "3" ){
            return "รอการแก้ไขข้อผิดพลาด"
        }else if(Seq === 4 || Seq === "4" ){
            return "กำลังวิเคราะห์ผลลัพธ์"
        }else if(Seq === 5 || Seq === "5" ){
            return "สรุปผล"
        }else{
            return "-"
        }
    };
    async function showalert(text) {
        Swal.fire({
            text: text,
            showCancelButton: false,
            confirmButtonColor: "#7066e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง"
        });
    }
    return (
        <div>
            <div className='InputSize space-between'>
                <select className='selectShow'
                    value={pageSize}
                    onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                        </option>
                ))}
                </select>
                <input
                    type="text"
                    value={selectedColumn=== "all"? globalFilter || '':selectedColumn.filterValue || ''}
                    onChange={(e) => selectedColumn === "all" ? setGlobalFilter(e.target.value) : selectedColumn.setFilter(e.target.value)}
                    placeholder="ค้นหาทั้งหมด..."
                />
            </div>   
            <div className="tableSub LC-bg">
                
                <table {...getTableProps()} className="table width100">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {/* <th>ลำดับ</th> */}
                            {headerGroup.headers.map((column) => (
                                (column.id !== 'userid' && column.id !== 'deletetimequesheet' ) ? (
                                    <th {...column.getHeaderProps()}>
                                    {/* <th {...column.getHeaderProps(column.getSortByToggleProps())}> */}
                                        {column.render('Header')}
                                        <span className='' {...column.getSortByToggleProps()}>
                                            {column.isSorted ? (column.isSortedDesc ?  <FontAwesomeIcon icon={faSortDown} />: <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                                        </span>

                                    </th>
                                ) : null
                            ))}
                            <th>การจัดการ</th>
                        </tr>
                    ))}
                    
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.length <= 0 ? (<tr className='center'><td colSpan={columns.length + 2}>ไม่พบข้อมูล</td></tr>):(
                        page.map((row) => {
                            prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={row.id}>
                                        <td className={"center"}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปแบบสอบถามได้ เนื่องจากยังไม่มีการสรุปผลแบบสอบถาม")} >{row.values.quesheetid}</Link>:<Link to={'/Admin/AdminQuestionnaire/QuestionnaireNo/'+row.values.quesheetid} >{row.values.quesheetid}</Link>}</td>
                                        <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปแบบสอบถามได้ เนื่องจากยังไม่มีการสรุปผลแบบสอบถาม")} >{row.values.useridUpdate}</Link>:<Link to={'/Admin/AdminQuestionnaire/QuestionnaireNo/'+row.values.quesheetid} >{row.values.useridUpdate}</Link>}</td>
                                        <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปแบบสอบถามได้ เนื่องจากยังไม่มีการสรุปผลแบบสอบถาม")} >{row.values.quesheetname}</Link>:<Link to={'/Admin/AdminQuestionnaire/QuestionnaireNo/'+row.values.quesheetid} >{row.values.quesheetname}</Link>}</td>
                                        <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปแบบสอบถามได้ เนื่องจากยังไม่มีการสรุปผลแบบสอบถาม")} >{row.values.quesheettopicname}</Link>:<Link to={'/Admin/AdminQuestionnaire/QuestionnaireNo/'+row.values.quesheetid} >{row.values.quesheettopicname}</Link>}</td>
                                        <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปแบบสอบถามได้ เนื่องจากยังไม่มีการสรุปผลแบบสอบถาม")} >{row.values.sequencesteps}</Link>:<Link to={'/Admin/AdminQuestionnaire/QuestionnaireNo/'+row.values.quesheetid} >{row.values.sequencesteps}</Link>}</td>
                          
                                        {row.values.deletetimequesheet === null || row.values.deletetimequesheet === '' || row.values.deletetimequesheet === "null"?
                                            <td className='center mw80px' ><Link to={'/Admin/AdminQuestionnaire/AdminUpdateQuestionnaire/'+row.values.quesheetid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link><span className='danger light-font' onClick={() => handleDelCours(row.values.quesheetid,row.values.quesheetname)}><FontAwesomeIcon icon={faTrashCan} /></span> </td>
                                        :
                                            <td className='center mw80px' ><Link to="#"><p className='danger light-font' onClick={() => handlecancelDel(row.values.quesheetid,row.values.quesheetname,removeTZ(row.values.deletetimequesheet),row.values.userid)}>ยกเลิกการลบ</p> </Link></td>
                                        }
                                    </tr>
                                );
                        })
                    )}
                    </tbody>
                </table>
            </div>
            <div className='InputSize'>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {<FontAwesomeIcon icon={faAnglesLeft} />}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {<FontAwesomeIcon icon={faChevronLeft} />}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                {<FontAwesomeIcon icon={faChevronRight} />}
                </button>{' '}
                <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                >
                {<FontAwesomeIcon icon={faAnglesRight} />}
                </button>{' '}
                <span>
                    หน้า{' '}
                    {pageIndex + 1} ของ {pageOptions.length}
                </span>
            </div>
        </div>
    );
};

export default TableAdminQuestionnaire;