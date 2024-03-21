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
import {faChevronRight, faChevronLeft, faAnglesRight, faAnglesLeft, faTrashCan, faPen, faSortDown, faSortUp, faSort, faReply} from "@fortawesome/free-solid-svg-icons";

const TableHomeRequest = ({ columns }) => {
    const [data, setdata] = useState([]);
    const [user, setuser] = useState([]);

    const fetchDataRequest = async () => {
        try{
            // Fetch API request ขอข้อมูล request
            fetch(variables.API_URL+"request/", {
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
            // Fetch API user ขอข้อมูล user
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
        fetchDataUser();
        fetchDataRequest();
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

    const handleDelCours = async (requestid,typesname) => {
        Swal.fire({
            title: "ลบประเภทการใช้งาน",
            text: `คุณต้องการลบประเภทการใช้งาน ${typesname} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"request/delete/"+requestid+"/", {
                        method: "DELETE",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        })
                        .then(response => response.json())
                        .then(result => {
                            Swal.fire({
                                title: "ลบประเภทการใช้งานเสร็จสิ้น",
                                icon: "success",//error,question,warning,success
                                confirmButtonColor: "#341699",
                            });
                            fetchDataRequest();
                        }
                    )
                }catch (err) {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาดในการลบประเภทการใช้งาน",
                        icon: "error",//error,question,warning,success
                        confirmButtonColor:"#341699",
                    });
                }
            }
        });
    };

    function extractFilenameFromURL(url) {
        if(url === null || url === ''){
            return true
        }
        const parts = url.split("/");
        const filenameWithSpaces = parts[parts.length - 1];
        const decodedFilename = decodeURIComponent(filenameWithSpaces);
        return decodedFilename;
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
            <div className="tableAll LC-bg">
                
                <table {...getTableProps()} className="table width100">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th>ลำดับ</th>
                            {headerGroup.headers.map((column) => (
                                (column.id !== 'requestid' && column.id !== 'requestid') ? (
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
                                row.values.status_request === 1 || row.values.status_request === "1" ? (
                                    <tr {...row.getRowProps()} key={row.id}>
                                        <td className={"center"}><Link to={""+row.values.requestid}>{Number(row.id)+1}</Link></td>
                                        {/* <td className={""}><Link to={""}>{extractFilenameFromURL(row.values.imgrequest_path)}</Link></td> */}
                                        <td className={""}><Link to={""}>{(row.values.imgrequest_path)}</Link></td>

                                        {/* <td className={""}><Link to={""}>{findUseremailById(row.values.userid)}</Link></td> */}
                                        <td className={""}><Link to={""}>{row.values.notes === null || row.values.notes === '' ? "-":row.values.notes}</Link></td> 
                                        {/* <td className={""}><Link to={""}>{row.values.status_request === 1 || row.values.status_request === "1" ? 'รอการอนุมัติ' : row.values.status_request === 2 || row.values.status_request === '2' ? 'ไม่ผ่านการอนุมัติ' : 'ผ่านการอนุมัติ'}</Link></td> */}
                                        <td className={""}><Link to={""}>{row.values.status_request}</Link></td>
                                        <td className='center mw80px'><Link to={'/Admin/Request/Respond/'+row.values.requestid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faReply} /></span></Link></td>
                                    </tr>
                                ) : null 
                            );
                        })
                    )}
                    {data.filter(item => item.status_request === '1').length === 0 && (
                        <tr className='center'><td colSpan={6}>ไม่พบข้อมูล</td></tr>
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

export default TableHomeRequest;