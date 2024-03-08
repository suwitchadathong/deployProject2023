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

const TableType = ({ columns }) => {
    const [data, setdata] = useState([]);

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
                    console.log(result)
                    setdata(result)
                }
            )
        }catch (err) {
            // console.error('ไม่พบข้อมูล:', err);
            setdata([])
        }
        
    };
    
    useEffect(() => {
        fetchDataType();
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

    const handleDelCours = async (typesid,typesname) => {
        // console.log(subid)
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
                    fetch(variables.API_URL+"type/delete/"+typesid+"/", {
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
                            fetchDataType();
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
                            {/* <th>ลำดับ</th> */}
                            {headerGroup.headers.map((column) => (
                                (column.id !== 'null' && column.id !== 'null') ? (
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
                                        <td className={"center"}><Link to={""}>{row.values.typesid}</Link></td>
                                        <td className={""}><Link to={""}>{row.values.typesname}</Link></td>
                                        <td className={""}><Link to={""}>{row.values.limitsubject}</Link></td>
                                        <td className={""}><Link to={""}>{row.values.limitexam}</Link></td> 
                                        <td className={""}><Link to={""}>{row.values.limitque}</Link></td>
                                        {row.values.typesid === 1 || row.values.typesid === 2 || row.values.typesid === 3?
                                            <td className='center mw80px' ><Link to={'/Admin/Type/UpdateType/'+row.values.typesid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link></td>
                                        :                 
                                            <td className='center mw80px' ><Link to={'/Admin/Type/UpdateType/'+row.values.typesid} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link><span className='danger light-font' onClick={() => handleDelCours(row.values.typesid,row.values.typesname)}><FontAwesomeIcon icon={faTrashCan} /></span> </td>
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

export default TableType;