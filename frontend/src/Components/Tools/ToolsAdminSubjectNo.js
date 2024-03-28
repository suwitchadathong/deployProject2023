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
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronRight, faChevronLeft, faAnglesRight, faAnglesLeft, faTrashCan, faPen, faSortDown, faSortUp, faSort} from "@fortawesome/free-solid-svg-icons";

const TableAdminSubjectNo = ({ columns }) => {
    const { id } = useParams(); 
    const [data, setdata] = useState([]);

    const fetchDataExam = async () => {
        try{
            fetch(variables.API_URL+"exam/detail/subject/"+id+"/", {
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
     
    useEffect(() => {
        fetchDataExam();
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
 
    const handleDelCours = async (examid,examno) => {
        Swal.fire({
            title: "ลบการสอบ",
            text: `คุณต้องการการสอบครั้งที่ ${examno} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"exam/delete/"+examid+"/", {
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
                            fetchDataExam();
                        }
                    )
                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบการสอบ",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };
    const handlecancelDel = async (examid,examno,datetime) => {
        Swal.fire({
            title: `การสอบจะถูกลบในวันที่และเวลา \n${datetime}`,
            text: `คุณต้องการยกเลิกการลบการสอบครั้งที่ ${examno} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"exam/update/"+examid+"/", {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                        deletetimeexam : null
                        }),
                        })
                        .then(response => response.json())
                        .then(result => {
                            Swal.fire({
                                title: "ทำการยกเลิกการลบเสร็จสิ้น",
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            fetchDataExam();
                        }
                    )
                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบการสอบ",
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
    const findSeq = (Seq) => {
        if(Seq === 1 || Seq === "1" ){
            return "ค่าเริ่มต้น"
        }else if(Seq === 2 || Seq === "2" ){
            return "สร้างกระดาษคำตอบเสร็จสิ้น"
        }else if(Seq === 3 || Seq === "3" ){
            return "กำลังอัปโหลดกระดาษคำตอบ"
        }else if(Seq === 4 || Seq === "4" ){
            return "รอการแก้ไขข้อผิดพลาด"
        }else if(Seq === 5 || Seq === "5" ){
            return "กำลังวิเคราะห์ผลลัพธ์"
        }else if(Seq === 6 || Seq === "6" ){
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
                                 (column.id !== 'null' && column.id !== 'answersheetformat' && column.id !== 'imganswersheetformat_path' && column.id !== 'std_csv_path' && column.id !== 'showscores' && column.id !== 'sendemail' && column.id !== 'statusexam' && column.id !== 'deletetimeexam' && column.id !== 'createtimeexam' && column.id !== 'subid') ? (
                                     <th {...column.getHeaderProps()}>
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
                                         <td className={"center"}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปผลการสอบได้ เนื่องจากยังไม่มีการสรุปผลการสอบ")} >{row.values.examid}</Link>:<Link to={'/Admin/AdminSubject/SubjectExam/Exam/'+row.values.examid} >{row.values.examid}</Link>}</td>
                                         <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปผลการสอบได้ เนื่องจากยังไม่มีการสรุปผลการสอบ")} >{row.values.examname}</Link>:<Link to={'/Admin/AdminSubject/SubjectExam/Exam/'+row.values.examid} >{row.values.examname}</Link>}</td>
                                         <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปผลการสอบได้ เนื่องจากยังไม่มีการสรุปผลการสอบ")} >{row.values.examno}</Link>:<Link to={'/Admin/AdminSubject/SubjectExam/Exam/'+row.values.examid} >{row.values.examno}</Link>}</td>
                                         <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปผลการสอบได้ เนื่องจากยังไม่มีการสรุปผลการสอบ")} >{row.values.numberofexams}</Link>:<Link to={'/Admin/AdminSubject/SubjectExam/Exam/'+row.values.examid} >{row.values.numberofexams}</Link>}</td>
                                         <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปผลการสอบได้ เนื่องจากยังไม่มีการสรุปผลการสอบ")} >{row.values.numberofexamsets}</Link>:<Link to={'/Admin/AdminSubject/SubjectExam/Exam/'+row.values.examid} >{row.values.numberofexamsets}</Link>}</td>
                                         <td className={""}>{parseInt(row.values.sequencesteps,10) < 5 ? <Link to={''} onClick={() =>showalert("ไม่สามารถดูข้อมูลสรุปผลการสอบได้ เนื่องจากยังไม่มีการสรุปผลการสอบ")} >{row.values.sequencesteps}</Link>:<Link to={'/Admin/AdminSubject/SubjectExam/Exam/'+row.values.examid} >{row.values.sequencesteps}</Link>}</td>

                                         {row.values.deletetimeexam === null || row.values.deletetimeexam === '' || row.values.deletetimeexam === "null"?
                                             <td className='center mw80px' ><Link to={'/Admin/AdminSubject/SubjectExam/AppAdminUpdateExam/'+row.values.examid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link><span className='danger light-font' onClick={() => handleDelCours(row.values.examid,row.values.examname)}><FontAwesomeIcon icon={faTrashCan} /></span> </td>
                                         :
                                             <td className='center mw80px' ><Link to="#"><p className='danger light-font' onClick={() => handlecancelDel(row.values.examid,row.values.examname,removeTZ(row.values.deletetimeexam))}>ยกเลิกการลบ</p> </Link></td>
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
                     หน้า {' '}
                     {pageIndex + 1} ของ {pageOptions.length}
                     
                 </span>
                
             </div>
         </div>
     );
 };
 

export default TableAdminSubjectNo;                                     


