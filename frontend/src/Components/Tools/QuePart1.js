import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

const QuePart1 = ({ url,showChart }) => {
    const [topicAll, settopicAll] = useState(["","","",""]);
    const [topic1, setTopic1] = useState([]);
    const [topic2, setTopic2] = useState([]);
    const [topic3, setTopic3] = useState([]);
    const [topic4, setTopic4] = useState([]);
    const [data1, setdata1] = useState([]);
    const [data2, setdata2] = useState([]);
    const [data3, setdata3] = useState([]);
    const [data4, setdata4] = useState([]);

    const [datashowtable, setdatadatashowtable] = useState([
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
      ]
    );
    // console.log(datashowtable.length)
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
                        let dataDetail= result.data
                        // console.log("result",result.data)
                        let section = [] // หัวข้อเรื่อง
                        let originalArray = []
                        let topicAndValue = []
                        let topic = [] // หัวข้อ
                        let value = []
                        let checktopic = 1 // เช็คหัวข้อ
                        let check = 1; // แยกหัวข้อ
                        
                        for (let i = 0; i < dataDetail.length; i++) {
                            if(check === 1){
                                section.push(dataDetail[i][0])
                                check = 0;
                            }
                            else if(dataDetail[i][0] === "รวม"){
                                if(checktopic === 1){
                                    setTopic1(topic)
                                    setdata1(value)
                                    originalArray.push(topicAndValue)
                                    topicAndValue = []
                                    topic = []
                                    value = []
                                }else if(checktopic === 2){
                                    setTopic2(topic)
                                    setdata2(value)
                                    originalArray.push(topicAndValue)
                                    topicAndValue = []
                                    topic = []
                                    value = []
                                }else if(checktopic === 3){
                                    setTopic3(topic)
                                    setdata3(value)
                                    originalArray.push(topicAndValue)
                                    topicAndValue = []
                                    topic = []
                                    value = []
                                }else if(checktopic === 4){
                                    setTopic4(topic)
                                    setdata4(value)
                                    originalArray.push(topicAndValue)
                                    topicAndValue = []
                                    topic = []
                                    value = []
                                }
                                check = 1;
                                checktopic += 1;
                            }else{
                                topic.push(dataDetail[i][0])
                                value.push(dataDetail[i][1])
                                topicAndValue.push(dataDetail[i][0] + " (" + dataDetail[i][1]+" คน)")
                                // console.log(dataDetail[i])
                            }
                        }
                        settopicAll(section)

                        const transformedArray = [];

                        for (let i = 0; i < originalArray[0].length; i++) {
                        transformedArray.push([
                            originalArray[0][i],
                            originalArray[1][i] || '',
                            originalArray[2][i] || '',
                            originalArray[3][i] || ''
                        ]);
                        }
                        setdatadatashowtable(transformedArray)

                    },
                });
            } catch (error) {
                console.error('Error fetching or parsing CSV:', error);
            }
        };

        fetchData();
        
        
        
       
    }, [url]);

    return (
        <div>
            <div className=''>
                <div className={showChart === true ?"QuePart1":"none"}>
                    {topic1.length >= 1 ?
                        <div className='QuePart1col'>
                            <div className="center" >{topicAll[0]}</div>
                            <Pie 
                                data={{
                                    labels: topic1,
                                    datasets: [{
                                        label: 'จำนวน',
                                        data: data1,
                                        backgroundColor: [
                                        'rgba(255, 99, 132, 0.6)',
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(255, 206, 86, 0.6)',
                                        'rgba(75, 192, 192, 0.6)'
                                        ],
                                        borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)'
                                        ],
                                        borderWidth: 1
                                    }] 
                                }}
                                options={{}}
                            />
                        </div>
                        :null
                    }
                    {topic2.length >= 1 ?
                        <div className='QuePart1col'>
                            <div className="center" >{topicAll[1]}</div>
                            <Pie 
                                data={{
                                    labels: topic2,
                                    datasets: [{
                                        label: 'จำนวน',
                                        data: data2,
                                        backgroundColor: [
                                        'rgba(255, 99, 132, 0.6)',
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(255, 206, 86, 0.6)',
                                        'rgba(75, 192, 192, 0.6)'
                                        ],
                                        borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)'
                                        ],
                                        borderWidth: 1
                                    }] 
                                }}
                                options={{
                                }}
                            />
                        </div>
                        :null
                    }
                    {topic3.length >= 1 ?
                        <div className='QuePart1col'>
                            <div className="center" >{topicAll[2]}</div>
                            <Pie 
                                data={{
                                    labels: topic3,
                                    datasets: [{
                                        label: 'จำนวน',
                                        data: data3,
                                        backgroundColor: [
                                        'rgba(255, 99, 132, 0.6)',
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(255, 206, 86, 0.6)',
                                        'rgba(75, 192, 192, 0.6)'
                                        ],
                                        borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)'
                                        ],
                                        borderWidth: 1
                                    }] 
                                }}
                                options={{
                                }}
                            />
                        </div>
                        :null
                    }
                    {topic4.length >= 1 ?
                        <div className='QuePart1col'>
                            <div className="center" >{topicAll[3]}</div>
                            <Pie 
                                data={{
                                    labels: topic4,
                                    datasets: [{
                                        label: 'จำนวน',
                                        data: data4,
                                        backgroundColor: [
                                        'rgba(255, 99, 132, 0.6)',
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(255, 206, 86, 0.6)',
                                        'rgba(75, 192, 192, 0.6)'
                                        ],
                                        borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)'
                                        ],
                                        borderWidth: 1
                                    }] 
                                }}
                                options={{
                                }}
                            />
                        </div>
                        :null
                    }
                    
                </div>
                {/* "ส่วน text" */}
                {datashowtable.length >= 1 ?
                    <div className="tableAnalyze">
                        <table className="">
                            <thead>
                                <tr>
                                    <th className="">หัวข้อ</th>
                                    <th className="">ตัวเลือกที่ 1</th>
                                    <th className="">ตัวเลือกที่ 2</th>
                                    <th className="">ตัวเลือกที่ 3</th>
                                    <th className="">ตัวเลือกที่ 4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topicAll.map((value, rowIndex) => (
                                    <tr  key={rowIndex}>
                                        {console.log(datashowtable[0])}
                                        <td>{topicAll[rowIndex]}</td>
                                        <td>{datashowtable[0][rowIndex]}</td>
                                        <td>{datashowtable[1][rowIndex]}</td>
                                        <td>{datashowtable[2][rowIndex]}</td>
                                        <td>{datashowtable[3][rowIndex]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :null
                }
            </div>
        </div>
    );
};

export default QuePart1;
