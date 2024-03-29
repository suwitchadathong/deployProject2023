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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronRight, faChevronLeft, faAnglesRight, faAnglesLeft, faTrashCan, faPen, faSortDown, faSortUp, faSort} from "@fortawesome/free-solid-svg-icons";

const TableUser = ({ columns }) => {
    const [datatest, setdatatest] = useState([]);

    const [data, setdata] = useState([]);
    
    const [userTypes, setuserTypes] = useState([]);

    const fetchDataUserType = async () => {
        try{
            const responseType = await fetch(variables.API_URL+"type/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });
            const resultType = await responseType.json();
           
            const responseUser = await fetch(variables.API_URL+"user/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            })
            const resultUser = await responseUser.json();

            const input = resultUser;
            const type = resultType;

            const typeMap = {};

            type.forEach(entry => {
                typeMap[entry.typesid] = entry.typesname;
            });

            const updatedInput = input.map(entry => ({
                ...entry,
                typesid: typeMap[entry.typesid] || 'Unknown'
            }));

            setdata(updatedInput)
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
                    setdata(result)
                }
            )
        }catch (err) {
            setdata([])
        }
    };
    const fetchDataType = async () => {
        try{
            fetch(variables.API_URL+"type/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    setuserTypes(result)
                }
            )
        }catch (err) {
            setdata([])
        }
        
    };
    useEffect(() => {
        fetchDataUserType();
        // fetchDataUser();
        // fetchDataType();
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

    const handleDelCours = async (userid, email) => {
        Swal.fire({
            title: "ลบผู้ใช้งาน",
            text: `คุณต้องการลบผู้ใช้งาน ${email} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(variables.API_URL + "user/delete/" + userid + "/", {
                        method: "DELETE",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        }
                    }); // Missing closing parenthesis here
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                   
                    if (result) {
                        Swal.fire({
                            title: "ลบผู้ใช้งาน",
                            icon: "success", //error,question,warning,success
                            confirmButtonColor: "#341699"
                        });
                        // fetchDataUser();
                        fetchDataUserType();
                    } else {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาดในการลบผู้ใช้งาน " +result,
                            icon: "error", //error,question,warning,success
                            confirmButtonColor: "#341699"
                        });
                    }
                } catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบผู้ใช้งาน " +err,
                        icon: "error", //error,question,warning,success
                        confirmButtonColor: "#341699"
                    });
                }
            }
        });
    };
    
    const findUserTypeById = (id) => {
        const userType = userTypes.find(type => type.typesid === id);
        return userType ? userType.typesname : "User type not found";
    };

    const findusageformat = (usageformat) => {
        if(usageformat === '[1,1]'){
            return "จัดการรายวิชา,จัดการแบบสอบถาม"
        }else if(usageformat === '[0,1]'){
            return "จัดการแบบสอบถาม"
        }else{
            return "ไม่สามารถระบุได้"
        }
    };

    async function showalert(value) {
        Swal.fire({
            title: 'ข้อมูลผู้ใช้',
            html: 
                `<div style="text-align: left;">
                    <b>อีเมล์</b> : ${value.original.email}<br>
                    <b>ชื่อผู้ใช้</b> : ${value.original.fullname}<br>
                    <b>เบอร์โทรศัพท์</b> : ${value.original.tel}<br>
                    <b>อาชีพ</b>  : ${value.original.job}<br>
                    <b>สังกัด/คณะ</b> : ${value.original.faculty}<br>
                    <b>ภาค/สาขา/สาย</b> : ${value.original.department}<br>
                    <b>องค์กรการศึกษา/สถานที่ทำงาน</b> : ${value.original.workplace}<br>
                    <b>การยืนยันตัวตน</b> : ${value.original.e_kyc}<br>
                    <b>สิทธิ์การใช้งาน</b> : ${findusageformat(value.original.usageformat)}<br>
                    <b>ประเภทผู้ใช้</b> : ${value.original.typesid}<br>
                <div>`,
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
                        แสดง {pageSize}
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
            <div className="tableUser LC-bg">
                
                <table {...getTableProps()} className="table width100">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                (column.id !== 'createtimeuser' && column.id !== 'tel' && column.id !== 'faculty' && column.id !== 'department') ? (
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
                                        <td className={"center"}><Link to={""} onClick={() =>showalert(row)}>{row.values.userid}</Link></td>
                                        <td className={""}><Link to={""} onClick={() =>showalert(row)}>{row.values.email}</Link></td>
                                        <td className={""}><Link to={""} onClick={() =>showalert(row)}>{row.values.fullname}</Link></td>
                                        {/* <td className={""}><Link to={""} onClick={() =>showalert("ผู้ใช้งาน")}>{(row.values.usageformat)}</Link></td> */}
                                        {/* <td className={""}><Link to={""} onClick={() =>showalert("ผู้ใช้งาน")}>{row.values.e_kyc === '1' || row.values.e_kyc === 1 ? "1":row.values.e_kyc}</Link></td> */}
                                        <td className={""}><Link to={""} onClick={() =>showalert(row)}>{row.values.typesid}</Link></td>

                                        {row.values.userid === 1 ?
                                            <td className='center mw80px ' ><Link to={''} className='' style={{ display: 'contents' }}><span className='border-icon-dark wait'><FontAwesomeIcon icon={faPen} /></span></Link></td>
                                        :                 
                                            // <td className='center mw80px' ><Link to={'/Admin/User/UpdateUser/'+row.values.userid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link><span className='danger light-font' onClick={() => handleDelCours(row.values.userid,row.values.email)}><FontAwesomeIcon icon={faTrashCan} /></span> </td>
                                            <td className='center mw80px' ><Link to={'/Admin/User/UpdateUser/'+row.values.userid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link></td>

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

export default TableUser;