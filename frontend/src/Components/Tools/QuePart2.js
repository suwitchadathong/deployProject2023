import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import {Bar} from "react-chartjs-2";
const QuePart2 = ({ url , showChart}) => {
    const [csvData, setCsvData] = useState([]);
    const [values, setvalues] = useState([]);
    const [selectedValue, setSelectedValue] = useState('2');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setvalues(csvData[event.target.value])
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const csvText = await response.text();
                Papa.parse(csvText, {
                    header: false,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: function (result) {
                        setCsvData(result.data)
                        setvalues(result.data[2])
                    },
                });
            } catch (error) {
            }
        };

        fetchData();
    }, [url]);

    return (
        <div>
            <div className=''>
                <div className={showChart === true ?"":"none"}>
                    <div className="bx-input-fix">
                        <select value={selectedValue} onChange={handleChange} style={{ width: '230px' }}>
                            {csvData.map((value, rowIndex) => (
                                rowIndex === 0 ? null :(
                                    value.length === 1 ? 
                                        <option key={rowIndex} value={rowIndex} disabled={true}>{value[0]}</option>
                                    : 
                                    (
                                        value[0] === "รวม" ? null:
                                        <option key={rowIndex} value={rowIndex}>{value[0]}</option>
                                    )
                                )
                            ))}
                        </select>
                    </div>
                    <Bar 
                        data={{
                            labels: ["มากที่สุด","มาก","ปานกลาง","น้อย","น้อยที่สุด","ไม่ประเมิน"],
                            datasets: [
                                {
                                    label: "จำนวนผู้ประเมินในแต่ละหัวข้อ",
                                    data: [values[1],values[2],values[3],values[4],values[5],values[6]],
                                    backgroundColor: 'rgba(255, 205, 86, 0.8)',
                                    yAxisID: 'y-axis-0' // This specifies the y-axis for the dataset
                                },
                            ],  
                        }}
                        options={{
                            indexAxis: 'y', // Setting indexAxis to 'y' for horizontal bar chart
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    display: false // This hides the y-axis labels
                                }
                            }
                        }}
                    />
                </div>
                <div className="tableAnalyze">
                    <table>
                        <thead>
                            <tr >
                                <th>หัวข้อ</th>
                                <th>มากที่สุด</th>
                                <th>มาก</th>
                                <th>ปานกลาง</th>
                                <th>น้อย</th>
                                <th>น้อยที่สุด</th>
                                <th>ไม่ประเมิน</th>
                                <th>จำนวนผู้ประเมิน</th>
                                <th>ค่าเฉลี่ย</th>
                                <th>ค่าเฉลี่ย(%)</th>
                                <th>ส่วนเบี่ยงเบนมาตรฐาน</th>
                                <th>ระดับความพึงพอใจ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((value, rowIndex) => (
                                rowIndex === 0 ?null :(
                                    value.length === 1 ? 
                                        <tr key={rowIndex}>
                                            <td align="" colSpan={12}><b>{value[0]}</b></td>
                                        </tr>
                                    : 
                                    (
                                        <tr key={rowIndex}>
                                            {value[0] === "รวม" ?
                                                    <td align="center"><b>{value[0]}</b></td>
                                                :
                                                    <td align="">{value[0]}</td>
                                            }
                                            <td align="center">{value[1]}</td>
                                            <td align="center">{value[2]}</td>
                                            <td align="center">{value[3]}</td>
                                            <td align="center">{value[4]}</td>
                                            <td align="center">{value[5]}</td>
                                            <td align="center">{value[6]}</td>
                                            <td align="center">{value[7]}</td>
                                            <td align="center">{value[8]}</td>
                                            <td align="center">{parseFloat(value[9]).toFixed(2)}</td>
                                            <td align="center">{value[10]}</td>
                                            <td align="center">{value[11]}</td>
                                        </tr>
                                    )
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuePart2;
