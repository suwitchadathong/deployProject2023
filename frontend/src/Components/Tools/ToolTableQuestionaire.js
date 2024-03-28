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

const ToolTableQuestionaire = ({ columns }) => {
    // const [DataSubject, setDataSubject] = useState([]);
    const [data, setdata] = useState([]);

    const fetchDataQue = async () => {
        try{
            fetch(variables.API_URL+"quesheet/detail/user/"+Cookies.get('userid')+"/", {
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
        fetchDataQue();
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

    const handleDelCours = async (Queid,Quename) => {
        Swal.fire({
            title: "ลบแบบสอบถาม",
            text: `คุณต้องการลบแบบสอบถาม ${Quename} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"quesheet/delete/"+Queid+"/", {
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
                            fetchDataQue();
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
    const handlecancelDel = async (Queid,Quename,datetime) => {
        Swal.fire({
            title: `วิชาจะถูกลบในวันที่และเวลา \n${datetime}`,
            text: `คุณต้องการยกเลิกการลบวิชา ${Quename} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( (result) => {
            if (result.isConfirmed) {
                try{
                    fetch(variables.API_URL+"quesheet/update/"+Queid+"/", {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            userid : Cookies.get('userid'),
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
                            fetchDataQue();
                        }
                    )
                }catch (err) {
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
            <div className="tableSub LC-bg">
                
                <table {...getTableProps()} className="table width100">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th>ลำดับ</th>
                            {headerGroup.headers.map((column) => (
                                (column.id !== 'quesheetid' && column.id !== 'deletetimequesheet') ? (
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
                                        <td className={row.values.deletetimequesheet === null || row.values.deletetimequesheet === '' || row.values.deletetimequesheet === "null"?"center":"center wait"}><Link to={"/Questionnaire/QuestionnaireNo/"+row.values.quesheetid}>{Number(row.id)+1}</Link></td>
                                        <td className={row.values.deletetimequesheet === null || row.values.deletetimequesheet === '' || row.values.deletetimequesheet === "null"?"":"wait"}><Link to={"/Questionnaire/QuestionnaireNo/"+row.values.quesheetid}>{row.values.quesheetname}</Link></td>
                                        <td className={row.values.deletetimequesheet === null || row.values.deletetimequesheet === '' || row.values.deletetimequesheet === "null"?"":"wait"}><Link to={"/Questionnaire/QuestionnaireNo/"+row.values.quesheetid}>{row.values.quesheettopicname}</Link></td>                                       
                                        {row.values.deletetimequesheet === null || row.values.deletetimequesheet === '' || row.values.deletetimequesheet === "null"?
                                            <td className='center mw80px' ><Link to={'/Questionnaire/QuestionnaireNo/ShowQuestionnaire/UpdateQuestionnaire/'+row.values.quesheetid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link><span className='danger light-font' onClick={() => handleDelCours(row.values.quesheetid,row.values.quesheetname)}><FontAwesomeIcon icon={faTrashCan} /></span> </td>
                                        :
                                            <td className='center mw80px' ><Link to="#"><p className='danger light-font' onClick={() => handlecancelDel(row.values.quesheetid,row.values.quesheetname,removeTZ(row.values.deletetimequesheet))}>ยกเลิกการลบ</p> </Link></td>
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
                    {/* <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '} */}
                </span>
                {/* <span>
                | Go to page:{' '}
                <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    gotoPage(page);
                    }}
                />
                </span>{' '} */}

            </div>
        </div>
    );
};

export default ToolTableQuestionaire;