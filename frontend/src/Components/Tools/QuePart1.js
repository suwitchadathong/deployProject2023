import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import Swal from 'sweetalert2'
const QuePart1 = ({ url,showChart,data,status }) => {
    const [topicAll, settopicAll] = useState(["","","",""]);
    const [topic1, setTopic1] = useState([]);
    const [topic2, setTopic2] = useState([]);
    const [topic3, setTopic3] = useState([]);
    const [topic4, setTopic4] = useState([]);
    const [data1, setdata1] = useState([]);
    const [data2, setdata2] = useState([]);
    const [data3, setdata3] = useState([]);
    const [data4, setdata4] = useState([]);

    const [Online, setOnline] = useState(["","","","",""]);
    const [Offline, setOffline] = useState(["","","","",""]);

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

                        let dataOffline0 = []
                        let dataOffline1 = []
                        let dataOffline2 = []
                        let dataOffline3 = []
                        let dataOffline4 = []
                        let dataOnline0 = []
                        let dataOnline1 = []
                        let dataOnline2 = []
                        let dataOnline3 = []
                        let dataOnline4 = []
          

                        if(status === "รูปแบบออฟไลน์"){
                            for (let i = 0; i < data.length; i++) {
                                if(data[i].status_queinfo === "Offline"){
                                    const dataofflinesplit = data[i].ansother.split(",");
                                    if(dataofflinesplit[0] !== ''){dataOffline0.push(dataofflinesplit[0])}
                                    if(dataofflinesplit[1] !== ''){dataOffline1.push(dataofflinesplit[1])}
                                    if(dataofflinesplit[2] !== ''){dataOffline2.push(dataofflinesplit[2])}
                                    if(dataofflinesplit[3] !== ''){dataOffline3.push(dataofflinesplit[3])}
                                    if(dataofflinesplit[4] !== ''){dataOffline4.push(dataofflinesplit[4])}
                                }
                            }
                        }
                        else if(status === "รูปแบบออนไลน์"){
                            for (let i = 0; i < data.length; i++) {
                                if(data[i].status_queinfo === "Online"){
                                    const dataonlinesplit = data[i].ansother.split(",");
                                    if(dataonlinesplit[0] !== ''){dataOnline0.push(dataonlinesplit[0])}
                                    if(dataonlinesplit[1] !== ''){dataOnline1.push(dataonlinesplit[1])}
                                    if(dataonlinesplit[2] !== ''){dataOnline2.push(dataonlinesplit[2])}
                                    if(dataonlinesplit[3] !== ''){dataOnline3.push(dataonlinesplit[3])}
                                    if(dataonlinesplit[4] !== ''){dataOnline4.push(dataonlinesplit[4])}
                                }
                            }
                        }
                        else if(status === "สรุปผลรวม"){
                            for (let i = 0; i < data.length; i++) {
                                if(data[i].status_queinfo === "Offline"){
                                    const dataofflinesplit = data[i].ansother.split(",");
                                    if(dataofflinesplit[0] !== ''){dataOffline0.push(dataofflinesplit[0])}
                                    if(dataofflinesplit[1] !== ''){dataOffline1.push(dataofflinesplit[1])}
                                    if(dataofflinesplit[2] !== ''){dataOffline2.push(dataofflinesplit[2])}
                                    if(dataofflinesplit[3] !== ''){dataOffline3.push(dataofflinesplit[3])}
                                    if(dataofflinesplit[4] !== ''){dataOffline4.push(dataofflinesplit[4])}
                                }
                                if(data[i].status_queinfo === "Online"){
                                    const dataonlinesplit = data[i].ansother.split(",");
                                    if(dataonlinesplit[0] !== ''){dataOnline0.push(dataonlinesplit[0])}
                                    if(dataonlinesplit[1] !== ''){dataOnline1.push(dataonlinesplit[1])}
                                    if(dataonlinesplit[2] !== ''){dataOnline2.push(dataonlinesplit[2])}
                                    if(dataonlinesplit[3] !== ''){dataOnline3.push(dataonlinesplit[3])}
                                    if(dataonlinesplit[4] !== ''){dataOnline4.push(dataonlinesplit[4])}
                                }
                            }
                        }
                        else{

                        }
                        setOffline([dataOffline0,dataOffline1,dataOffline2,dataOffline3,dataOffline4])
                        setOnline([dataOnline0,dataOnline1,dataOnline2,dataOnline3,dataOnline4])
                    },
                });
            } catch (error) {
                console.error('Error fetching or parsing CSV:', error);
            }
        };

        fetchData();
    }, [url,status]);

    async function showalertansother(topic,index,statue_format) {
        let htmlContent = `<div style="text-align: left;">`;
        console.log(index)
        console.log(statue_format)
        if (statue_format === "รูปแบบออฟไลน์") {
            htmlContent += "<ul>"; 
            if(Offline[index].length >= 1){
                htmlContent +=` <div>${statue_format}<div>`;
                console.log(Offline[index])
                for (let i = 0; i < Offline[index].length; i++) {
                    htmlContent += `<li><img src="${Offline[index][i]}" alt="Offline Image ${i}" style="width:100%;padding:5px;margin: 5px 0;text-align: center; border: 1px solid #DDDDDD;"></li>`;
                }
            }else{
                htmlContent += "<div>ไม่พบข้อมูลอื่นๆ</div>"; 
            }
            htmlContent += "</ul>"; 
        }
        else if (statue_format === "รูปแบบออนไลน์" ) {
            htmlContent += "<ul>"; 
            if(Online[index].length >= 1){
                htmlContent +=` <div>${statue_format}<div>`;
                console.log(Online[index])
                for (let i = 0; i < Online[index].length; i++) {
                    htmlContent += `<li><p style="padding:5px;margin: 5px 0;text-align: center; border: 1px solid #DDDDDD; ">${Online[index][i]}</p></li>`; 
                }
            }else{
                htmlContent += "<div>ไม่พบข้อมูลอื่นๆ</div>"; 
            }
            htmlContent += "</ul>"; 
        }
        else if (statue_format === "สรุปผลรวม" ) {
            htmlContent += "<ul>"; 
            if(Offline[index].length >= 1){
                htmlContent +=` <div>${statue_format} ออฟไลน์<div>`;
                console.log(Offline[index])
                for (let i = 0; i < Offline[index].length; i++) {
                    htmlContent += `<li><img src="${Offline[index][i]}" alt="Offline Image ${i}" style="width:100%;padding:5px;margin: 5px 0;text-align: center; border: 1px solid #DDDDDD;"></li>`;
                }
            }else{}
            htmlContent += "</ul>"; 

            htmlContent += "<ul>"; 
            if(Online[index].length >= 1){
                htmlContent +=` <div>${statue_format} ออนไลน์<div>`;
                console.log(Online[index])
                for (let i = 0; i < Online[index].length; i++) {
                    htmlContent += `<li><p style="padding:5px;margin: 5px 0;text-align: center; border: 1px solid #DDDDDD; ">${Online[index][i]}</p></li>`; 
                }
            }else{}
            htmlContent += "</ul>"; 
        }
        htmlContent += "</div>"; 
        
        Swal.fire({
            title: 'ข้อมูลอื่นๆของ '+topic,
            html: htmlContent,
            showCancelButton: false,
            confirmButtonColor: "#7066e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง"
        });
    }
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
                                        {/* {console.log(datashowtable[0])} */}
                                        <td><p onClick={() =>showalertansother(topicAll[rowIndex],rowIndex,status)}>{topicAll[rowIndex]}</p></td>
                                        <td><p onClick={() =>showalertansother(topicAll[rowIndex],rowIndex,status)}>{datashowtable[0][rowIndex]}</p></td>
                                        <td><p onClick={() =>showalertansother(topicAll[rowIndex],rowIndex,status)}>{datashowtable[1][rowIndex]}</p></td>
                                        <td><p onClick={() =>showalertansother(topicAll[rowIndex],rowIndex,status)}>{datashowtable[2][rowIndex]}</p></td>
                                        <td><p onClick={() =>showalertansother(topicAll[rowIndex],rowIndex,status)}>{datashowtable[3][rowIndex]}</p></td>
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
