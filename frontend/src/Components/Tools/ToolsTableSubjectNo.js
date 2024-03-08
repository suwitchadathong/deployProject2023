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

const TableSubjectNo = ({ columns }) => {
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
     // const [selectedColumn,setSelectedColumn] = useState('all'); // Default to search all columns
 
     const handleDelCours = async (examid,examno) => {
         // console.log(subid)
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
                             console.log(result)
                             Swal.fire({
                                 title: result.msg+"\n"+removeTZ(result.deletetime),
                                 icon: "success",//error,question,warning,success
                                 confirmButtonColor: "#341699",
                             });
                             fetchDataExam();
                         }
                     )
                 }catch (err) {
                     // console.error('เกิดข้อผิดพลาดในการลบ:', err);
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
                     // console.error('เกิดข้อผิดพลาดในการลบ:', err);
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
                             <th>ลำดับ</th>
                             {headerGroup.headers.map((column) => (
                                 (column.id !== 'examid' && column.id !== 'answersheetformat' && column.id !== 'imganswersheetformat_path' && column.id !== 'std_csv_path' && column.id !== 'sequencesteps' && column.id !== 'showscores' && column.id !== 'sendemail' && column.id !== 'statusexam' && column.id !== 'deletetimeexam' && column.id !== 'createtimeexam' && column.id !== 'subid') ? (
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
                                         <td className={row.cells[5].value === null || row.cells[5].value === '' || row.cells[5].value === "null"?"center":"center wait"}><Link to={"/Subject/SubjectNo/"+row.cells[0].value}>{Number(row.id)+1}</Link></td>
                                         <td className={row.cells[5].value === null || row.cells[5].value === '' || row.cells[5].value === "null"?"":"wait"}><Link to={"/Subject/SubjectNo/Exam/"+row.cells[0].value}>{row.cells[1].value}</Link></td>
                                         <td className={row.cells[5].value === null || row.cells[5].value === '' || row.cells[5].value === "null"?"":"wait"}><Link to={"/Subject/SubjectNo/Exam/"+row.cells[0].value}>{row.cells[2].value}</Link></td>
                                         <td className={row.cells[5].value === null || row.cells[5].value === '' || row.cells[5].value === "null"?"":"wait"}><Link to={"/Subject/SubjectNo/Exam/"+row.cells[0].value}>{row.cells[3].value}</Link></td>
                                         <td className={row.cells[5].value === null || row.cells[5].value === '' || row.cells[5].value === "null"?"":"wait"}><Link to={"/Subject/SubjectNo/Exam/"+row.cells[0].value}>{row.cells[4].value}</Link></td>
                                         {row.cells[5].value === null || row.cells[5].value === '' || row.cells[5].value === "null"?
                                             <td className='center mw80px' ><Link to={"/Subject/SubjectNo/UpdateExam/"+row.cells[0].value} className='' style={{ display: 'contents' }}><span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span></Link><span className='danger light-font' onClick={() => handleDelCours(row.cells[0].value,row.cells[2].value)}><FontAwesomeIcon icon={faTrashCan} /></span> </td>
                                         :
                                             <td className='center mw80px' ><Link to="#"><p className='danger light-font' onClick={() => handlecancelDel(row.cells[0].value,row.cells[2].value,removeTZ(row.cells[5].value))}>ยกเลิกการลบ</p> </Link></td>
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
                     Page{' '}
                     {pageIndex + 1} of {pageOptions.length}
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
 
                {/* <td><Link to={"/Subject/SubjectNo/Exam/"+row.cells[0].value}>{row.cells[0].value}</Link></td> */}
             </div>
         </div>
     );
 };
 

export default TableSubjectNo;                                     


