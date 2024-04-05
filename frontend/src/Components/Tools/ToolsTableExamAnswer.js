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
import {faChevronRight, faChevronLeft, faAnglesRight, faAnglesLeft, faTrashCan, faPen, faSortDown, faSortUp, faSort, faSquarePlus, faCircleCheck, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import { set } from 'js-cookie';

const TableExamAnswer = ({ columns, examnoanswers }) => {
    const { id } = useParams(); 
    const [data, setdata] = useState([]);
    const FullData = useState([]);
    const numbers = parseInt(examnoanswers)
    const [Start, setStart] = useState(0);

    const [datanon, setdatanon] = useState([]);
    const [dataduplicate, setdataduplicate] = useState([]);

    const Simulateddata = Array.from({ length: numbers }, (_, index) => ({
        choiceanswers: null,
        examanswersid: null,
        examid: null,
        examnoanswers: `${index + 1}`,
        papeans_path: null,
        scoringcriteria: null
    }));
    const fetchDataExamInfo = async () => {
        try{
            fetch(variables.API_URL+"examinformation/detail/exam/"+id+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    if(result.err !== undefined){
                    
                    }else{
                        setdatanon(result.non_duplicate_records)
                        setdataduplicate(result.duplicate_records)
                    }
                }
            )
        }catch (err) {
            setdata([])
        }

    };
    const fetchDataExamAnswer = async () => {
        try{
            //Fetch API เพื่อทำการดึกข้อมูล examanswers/detail/exam/ ขอข้อมูล examanswers exam
            fetch(variables.API_URL+"examanswers/detail/exam/"+id+"/", {
                method: "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                })
                .then(response => response.json())
                .then(result => {
                    // กำหนดการแสดงให้อยู่ในรูปแบบที่ต้องการ
                    // const output2Map = result.reduce((map, item) => {
                    //     map[item.examnoanswers] = item;
                    //     return map;
                    // }, {});
                    // const FullData = Simulateddata.map(item => {
                    //     const output2Item = output2Map[item.examnoanswers];
                    //     return output2Item ? output2Item : item;
                    // });
                    // setdata(FullData)
                    const sortedExamAnswers = result.sort((a, b) => {
                        return parseInt(a.examnoanswers) - parseInt(b.examnoanswers);
                    });
                    setdata(sortedExamAnswers)
                    // console.log("sortedExamAnswers : ",sortedExamAnswers)
                }
            )
        }catch (err) {
            setdata([])
        }
     };
     
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

    const handleDelCours = async (examanswersid,examnoanswers) => {
        Swal.fire({
            title: "ลบเฉลยคำตอบ",
            text: `คุณต้องการลบเฉลยข้อสอบชุดที่ ${examnoanswers} ใช่หรือไม่ `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText:"ยกเลิก"
        }).then( async (result) => {
            if (result.isConfirmed) { // กดยืนยัน
                try{
                    const response = await fetch(variables.API_URL + "examanswers/update/"+examanswersid+"/", {
                        method: "PUT",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            choiceanswers : null
                        }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        fetchDataExamAnswer();
                        Swal.fire({
                            title: "ลบเฉลยชุดข้อสอบที่ "+examnoanswers+" เสร็จสิ้น",
                            icon: "success",
                            confirmButtonColor: "#341699",
                        }).then((result) => {
                           
                        });
                        
                    }else{
                        Swal.fire({
                            title: "เกิดข้อผิดพลาดในการลบข้อสอบ",
                            icon: "error",//error,question,warning,success
                            confirmButtonColor:"#341699",
                        });
                    }
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
  
    const showAlertCreate = (id,idsetexam,idexamanswersid) => {
        const isMobile = window.innerWidth < 500;
        Swal.fire({
          title: 'รูปแบบการสร้างเฉลย  ',
          html: `
            <div className="bx-step-content" style="display: ${isMobile ? 'grid' : 'flex'};justify-content: center;" >
                <div style="margin: 20px;">
                    <a href="/Subject/SubjectNo/Exam/ExamAnswer/CreateExamAnswer/${id}/${idsetexam}/1/${idexamanswersid}">
                        <div className="bx-show" style="padding: 20px;border: 1px solid #DDDDDD" >
                            <div className="box">
                                <div className="box-img"><img src='/img/AnsCustomized.png' alt='' />
                                    <p className="grid" style="color: #000;">กำหนดเอง</p>
                                </div>
                            </div>
                        </div> 
                    </a>
                </div>
                <div style="margin: 20px;">
                    <a href="/Subject/SubjectNo/Exam/ExamAnswer/CreateExamAnswer/${id}/${idsetexam}/2/${idexamanswersid}">
                        <div className="bx-show" style="padding: 20px;border: 1px solid #DDDDDD;" >
                            <div className="box">
                                <div className="box-img">
                                    <img src='/img/AnsScan.png' alt='' />
                                    <p className="grid" style="color: #000;">สแกนไฟล์เฉลย</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            `,
            showConfirmButton:false,
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            customClass: {
            popup: 'custom-alert-popup',
            },
            
        });
    };


    useEffect(() => {
  
        if(data.length === 0){
            // fetchDataExamAnswer();
        }
    }, [data,FullData]);

    if(Start === 0){
        fetchDataExamAnswer();
        setStart(1);
    }

    const showcountOccurrences= (data,data1) => {
        const isMobile = window.innerWidth < 780;
        Swal.fire({
            title: 'ข้อมูลเฉลยคำตอบ',
            html: `
            <div class='test' style="display: ${isMobile ? 'grid' : 'flex'}; ${isMobile ? 'grid-template-columns: 1fr;' : 'justify-content: center;'} width: 100%;">
                <div style="flex: 1; text-align: center;">
                    <div>
                        <p><b>คะแนนเต็ม</b></p>
                        คะแนนรวม <span style=''>${sumAns(data)}</span> คะแนน<br>
                        ${countOccurrences(data)}
                    </div> 
                </div>
                <div style="flex: 1; text-align: center;">
                    <div>
                        <p><b>จำนวนชอยซ์</b></p>
                        ${choiceanswerslength(data1)}
                    </div>
                </div>
            </div>
            `,
            showCancelButton: false,
            confirmButtonColor: "#341699",
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'custom-alert-popup-small',
            },
            preCironfm: () => {
            }
        })
    }

    const choiceanswerslength = (inputString) => {
        const groups = inputString.split(',');
        const array = [0,0,0,0,0,0,0,0,0]
        groups.forEach((group, index) => {
            if(group === ''){
                array[0] +=1
            }else{
                const answers = group.split(':');
                const answerCount = answers.length;
                array[answerCount] +=1
            }
            
        });
        let result = '';
        array.forEach((count, index) => {
            if(count === 0){
            }else{
                if(index === 0){
                    const Counts = parseInt(count, 10);
                    result += `ไม่มีคำตอบ = ${Counts} ข้อ<br>`;
                }else{
                    const Counts = parseInt(count, 10);
                    result += `คำตอบ ${index} ชอยซ์ = ${Counts} ข้อ<br>`;
                }
            }
           
        });
        return result;
    };

    const choiceanswerslengthtable = (inputString) => {
        // console.log("inputString",inputString)
        if(inputString === null || inputString === ''){
            return "0"
        }
        const groups = inputString.split(',');
        const array = [0,0,0,0,0,0,0,0,0]
        groups.forEach((group, index) => {
            if(group === ''){
                array[0] +=1
            }else{
                const answers = group.split(':');
                const answerCount = answers.length;
                array[answerCount] +=1
            }
            
        });
        let result = '';
        array.forEach((count, index) => {
            if(count === 0){
                // result += `คำตอบ ${index} ชอยซ์ = ${count} ข้อ<br>`;
            }else{
                if(index === 0){
                    const Counts = parseInt(count, 10);
                    result += `ไม่มีคำตอบ = ${Counts} ข้อ `;
                }else{
                    const Counts = parseInt(count, 10);
                    result += `คำตอบ ${index} ชอยซ์ = ${Counts} ข้อ`;
                }
            }
           
        });
        return result;
    };

    const sumAns = (inputString) => {
        const resultArray = inputString.split(",");
        let sum = 0;
        for (let i = 0; i < resultArray.length; i++) {
            const resultArrayRemove =  resultArray[i].split(":");
            const thirdCharacter = parseInt(resultArrayRemove[2]); 
            sum += thirdCharacter; 
        }
        return sum;
    };
    function countOccurrences(array) {
        const counts = {};
        const arrayelement = [];
        const resultArray = array.split(",");
        for (let i = 0; i < resultArray.length; i++) {
            const resultArrayRemove =  resultArray[i].split(":");
            arrayelement.push(parseInt(resultArrayRemove[2]))
        }
        arrayelement.forEach(element => {
            counts[element] = (counts[element] || 0) + 1;
        });
        return Object.entries(counts).map(([element, count]) => `คำตอบ ${element} คะแนน = ${count} ข้อ`).join('<br>');
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
            <div className="tableSub nLC-bg">
                
                <table {...getTableProps()} className="table width100">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th>ลำดับ</th>
                            {headerGroup.headers.map((column) => (
                                (column.id !== 'examanswersid' && column.id !== 'scoringcriteria' && column.id !== 'choiceanswers' && column.id !== 'papeans_path') ? (
                                    <th {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                        <span className='' {...column.getSortByToggleProps()}>
                                            {column.isSorted ? (column.isSortedDesc ?  <FontAwesomeIcon icon={faSortDown} />: <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                                        </span>
                                    </th>
                                ) : null
                            ))}
                            <th>จำนวนคะแนนเต็ม</th>
                            <th>จำนวนชอยซ์</th>
                            <th>สถานะ</th>
                            <th>การจัดการ</th>
                        </tr>
                    ))}
                    
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.length <= 0 ? (
                    <>
                        <tr className='center'><td colSpan={columns.length + 2}>ไม่พบข้อมูล</td></tr>
                    </>
                    ):(
                        page.map((row) => {
                            prepareRow(row);
                            return (
                                row.values.choiceanswers !== null ?
                                    <tr {...row.getRowProps()} key={row.id} className='LCshow'>
                                        <td className='center' onClick={() =>showcountOccurrences(row.values.scoringcriteria,row.values.choiceanswers)}><Link to={""}>{Number(row.id) + 1}</Link></td>
                                        <td onClick={() =>showcountOccurrences(row.values.scoringcriteria,row.values.choiceanswers)}><Link to={""}>{row.values.examnoanswers}</Link></td>
                                        <td onClick={() =>showcountOccurrences(row.values.scoringcriteria,row.values.choiceanswers)}><Link to={""} ><p>{sumAns(row.values.scoringcriteria) } คะแนน</p></Link></td>
                                        <td onClick={() =>showcountOccurrences(row.values.scoringcriteria,row.values.choiceanswers)}><Link to={""} ><p>{choiceanswerslengthtable(row.values.choiceanswers)}</p></Link></td>

                                        
                                        <td className='statustable' onClick={() =>showcountOccurrences(row.values.scoringcriteria,row.values.choiceanswers)}><Link to={""}><p className='succeed'><FontAwesomeIcon icon={faCircleCheck} />{"สร้างเฉลยเสร็จสิ้น"}</p></Link></td>
                                        <td className='center mw80px '>
                                            <Link to={"/Subject/SubjectNo/Exam/ExamAnswer/UpdateExamAnswer/" + row.values.examanswersid +"/"+ id +"/"+ row.values.examnoanswers} className='' style={{ display: 'contents' }}>
                                                <span className='border-icon-dark'><FontAwesomeIcon icon={faPen} /></span>
                                            </Link>
                                            <span className={dataduplicate.length === 0 && datanon.length === 0 ? 'danger light-font wait':'danger light-font'} onClick={() => handleDelCours(row.values.examanswersid, row.values.examnoanswers)}>
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </span>
                                        </td>
                                    </tr>  
                                    :
                                    <tr {...row.getRowProps()} key={row.id} className='LCnotshow' onClick={() => showAlertCreate(id,Number(row.id) + 1,row.values.examanswersid)}>
                                        <td className='center'><Link to={""}>{Number(row.id) + 1}</Link></td>
                                        <td><Link to={""}>{row.values.examnoanswers}</Link></td>
                                        <td><Link to={""}>-</Link></td>
                                        <td><Link to={""}>-</Link></td>
                                        <td className='statustable'><Link to={""}><p className='warning'><FontAwesomeIcon icon={faTriangleExclamation} />{"รอดำเนินการสร้าง"}</p></Link></td>
                                        <td className='center mw80px'>
                                            <span className='primary-blue light-font' >
                                                <FontAwesomeIcon icon={faSquarePlus} />
                                            </span>
                                        </td>
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
 

export default TableExamAnswer;                                     


