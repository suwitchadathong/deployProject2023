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

const TableAdminSubject = ({ columns }) => {
    // const [DataSubject, setDataSubject] = useState([]);
    const [data, setdata] = useState([]);
    const [user, setuser] = useState([]);

    const fetchDataSubjectUser = async () => {
        try{
            const responseUser= await fetch(variables.API_URL+"user/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });
            const resultUser = await responseUser.json();
           
            const responseSubject = await fetch(variables.API_URL+"subject/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            })
            const resultSubject = await responseSubject.json();

            const user = resultUser;
            const subject = resultSubject;

            
            const userMap = {};

            user.forEach(entry => {
                userMap[entry.userid] = entry.email;
            });

 
            const updatedInput = subject.map(entry => ({
                ...entry,
                useridUpdate: userMap[entry.userid] || 'Unknown'
            }));
            console.log("updatedInput",updatedInput)
            setdata(updatedInput)
        }catch (err) {
            setdata([])
        }
    };

    const fetchDataSubject = async () => {
        try{
            fetch(variables.API_URL+"subject/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    setdata(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
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
                    console.log(result)
                    setuser(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setuser([])
        }
        
    };
    useEffect(() => {
        // fetchDataSubject();
        // fetchDataUser();
        fetchDataSubjectUser();
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

    const handleDelCours = async (subid,subname) => {
        // console.log(subid)
        Swal.fire({
            title: "ลบรายวิชา",
            text: `คุณต้องการลบรายวิชา ${subname} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"subject/delete/"+subid+"/", {
                        method: "DELETE",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        })
                        .then(response => response.json())
                        .then(result => {
                            // console.log(result)
                            Swal.fire({
                                title: result.msg+"\n"+removeTZ(result.deletetime),
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            // fetchDataSubject();
                            fetchDataSubjectUser();
                        }
                    )
                }catch (err) {
                    // console.error('เกิดข้อผิดพลาดในการลบ:', err);
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบรายวิชา",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };
    const handlecancelDel = async (subid,subname,datetime) => {
        Swal.fire({
            title: `วิชาจะถูกลบในวันที่และเวลา \n${datetime}`,
            text: `คุณต้องการยกเลิกการลบวิชา ${subname} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"subject/update/"+subid+"/", {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            deletetimesubject : null
                        }),
                        })
                        .then(response => response.json())
                        .then(result => {
                            Swal.fire({
                                title: "ทำการยกเลิกการลบเสร็จสิ้น",
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            // fetchDataSubject();
                            fetchDataSubjectUser();
                        }
                    )
                }catch (err) {
                    // console.error('เกิดข้อผิดพลาดในการลบ:', err);
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบรายวิชา",
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
                                (column.id !== 'null' && column.id !== 'statussubject' && column.id !== 'createtimesubject' && column.id !== 'deletetimesubject'  && column.id !== 'userid') ? (
                                    <th {...column.getHeaderProps()}>
                                    {/* <th {...column.getHeaderProps(column.getSortByToggleProps())}> */}
                                        {column.render('Header')}
                                        {/* {console.log(column.Header)} */}
                                        <span className='' {...column.getSortByToggleProps()}>
                                            {column.isSorted ? (column.isSortedDesc ?  <FontAwesomeIcon icon={faSortDown} />: <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                                        </span>
                                        {/* <div>
                                            {column.canFilter ? ( // Check if the column can be filtered
                                            <input
                                                type="text"
                                                value={column.filterValue || ''}
                                                onChange={(e) =>
                                                column.setFilter(e.target.value) // Set the filter value for the column
                                                }
                                                placeholder={`ค้นหา ${column.render('Header')}`}
                                            />
                                            ) : null}
                                        </div> */}
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
                                        <td className={"center"}><Link to={"/Admin/AdminSubject/SubjectExam/"+row.values.subid}>{row.values.subid}</Link></td>
                                        {/* <td className={row.values.deletetimesubject === null || row.values.deletetimesubject === '' || row.values.deletetimesubject === "null"?"":"wait"}><Link to={"/Admin/AdminSubject/SubjectExam/"+row.values.subid}>{findUseremailById(row.values.userid)}</Link></td> */}
                                        <td className={""}><Link to={"/Admin/AdminSubject/SubjectExam/"+row.values.subid}>{(row.values.useridUpdate)}</Link></td>

                                        <td className={""}><Link to={"/Admin/AdminSubject/SubjectExam/"+row.values.subid}>{row.values.subjectid}</Link></td>
                                        <td className={""}><Link to={"/Admin/AdminSubject/SubjectExam/"+row.values.subid}>{row.values.subjectname}</Link></td>
                                        <td className={""}><Link to={"/Admin/AdminSubject/SubjectExam/"+row.values.subid}>{row.values.year}</Link></td>
                                        <td className={""}><Link to={"/Admin/AdminSubject/SubjectExam/"+row.values.subid}>{row.values.semester}</Link></td>
                                       
                                        {row.values.deletetimesubject === null || row.values.deletetimesubject === '' || row.values.deletetimesubject === "null"?
                                            <td className='center mw80px' ><span className='danger light-font' onClick={() => handleDelCours(row.values.subid,row.cells[1].value)}><FontAwesomeIcon icon={faTrashCan} /></span> </td>
                                        :
                                            <td className='center mw80px' ><Link to="#"><p className='danger light-font' onClick={() => handlecancelDel(row.values.subid,row.values.subjectname,removeTZ(row.values.deletetimesubject))}>ยกเลิกการลบ</p> </Link></td>
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

export default TableAdminSubject;