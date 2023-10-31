import React, { useEffect, useState } from "react";
import "./dataExistence.css"
import { Box, Modal, Tab } from "@mui/material";
import { BOXSTYLE, CHART_FORMAT_DAILY, CHART_FORMAT_MONTHLY, CHART_FORMAT_TODAY, IncheonKP, STRING_ACC_KEY, STRING_CANT, STRING_DIRECTION, STRING_DISTORTION, STRING_HD_KEY, STRING_HEIGHT, STRING_HUMIDITY, STRING_LATERAL_LOAD_KEY, STRING_RAIL_DISTANCE, STRING_RAIL_TEMPERATURE, STRING_SPEED_KEY, STRING_STRESS_KEY, STRING_TEMPERATURE, STRING_VD_KEY, STRING_WHEEL_LOAD_KEY, colors } from "../../constant";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useNavigate } from "react-router-dom";
import ArrowIcon from "../../assets/icon/arrow.png";
import WearInfo from "../../component/WearInfo/WearInfo";
import { LineChart, Line, XAxis, 
  YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer,
  ScatterChart, Scatter, Bar, BarChart } from 'recharts';
import { convertObjectToArray, convertToCustomFormat, dateFormat, formatDateTime, numberWithCommas, tempDataName, trackDataName, trackToString, transposeObjectToArray } from "../../util";
import axios from 'axios';
import qs from 'qs';

let colorIndex = 1;
function DataExistence( props ) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [railbehaviorOpen, setRailbehaviorOpen] = useState(false);
  const [railtwistOpen, setRailtwistOpen] = useState(false);
  const [railwearOpen, setRailwearOpen] = useState(false);
  const [temperatureOpen, setTemperatureOpen] = useState(false);
  const [pautOpen, setPautOpen] = useState(false);

  //paut
  const [pautData, setPautData] = useState({});
  const [pautImgIndex, setPautImgIndex] = useState(0);

  const [tabValue, setTabValue] = useState('1');
  const [kptoPixel, setKPtoPixel] = useState(15000);
  const LINE_TITLE_WIDTH = 120;
  const kpto1Pixcel = 1;
  const [kpList, setKPList] = useState([]);

  const [railbehaviorData, setRailbehaviorData] = useState({});
  const [railWearData, setRailWearData] = useState({});

  const [toDayChartData, setToDayChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [MonthlyChartData, setMonthlyChartData] = useState([]);

  const [todayChartseries, setTodayChartseries] = useState([]);
  const [dailyChartseries, setDailyChartseries] = useState([]);
  const [monthlyChartseries, setMonthlyChartseries] = useState([]);

  const [cornerWearGraphData, setCornerWearGraphData] = useState([]);
  const [verticalWearGraphData, setVerticalWearGraphData] = useState([]);

  const [remainingData, setRemainingData] = useState({});
  const [remainingCriteria, setRemainingCriteria] = useState({});
  const [leftRemaining, setLeftRemaining] = useState({});
  const [rightRemaining, setRightRemaining] = useState({});

  //궤도틀림
  const [railtwistData, setRailtwistData] = useState({});
  const [heightChartData, setHeightChartData] = useState([]);
  const [directionChartData, setDirectionChartData] = useState([]);
  const [cantChartData, setCantChartData] = useState([]);
  const [raildistanceChartData, setRaildistanceChartData] = useState([]);
  const [distortionChartData, setDistortionChartData] = useState([]);

  //궤도거동계측
  const [ wheelSeries, setWheelSeries] = useState([]);
  const [ lateralSeries, setLateralSeries] = useState([]);
  const [ stressSeries, setStressSeries] = useState([]);
  const [ hdSeries, setHDSeries] = useState([]);
  const [ vdSeries, setVDSeries] = useState([]);
  const [ accSeries, setAccSeries] = useState([]);
  const [ speedSeries, setspeedSeries] = useState([]);

  //온습도
  const [ tempMeasureData, setTempMeasureData] = useState({});
  const [ tempSeries, setTempSeries] = useState([]);
  const [ tempChartData, setTempChartData] = useState([]);

  const getColor = (index) => {
    return colors[index % 20];
  }
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    console.log(document.getElementById("dataExistenceContainer").clientWidth);
    setKPtoPixel(IncheonKP.end * kpto1Pixcel);
    let kpList_ = [];
    for( let i = IncheonKP.start; i < IncheonKP.end; i++ ){
      if( i % 1000 === 0 ){
        kpList_.push(i);
      }
    }
    setKPList(kpList_);
  }, []);

  useEffect(() => {
    console.log(props.kp);
    let left = (
      props.kp > document.getElementById('dataExistenceContainer').clientWidth/2
    ) ? parseFloat(props.kp) - document.getElementById('dataExistenceContainer').clientWidth/2 : 0;
    console.log(left);
    document.getElementById('dataExistenceContainer').scroll({
      top: 0,
      left: left,
      behavior: "smooth",
    });
  },[ props.kp ]);

  return (
    <div className="boxProto datafinder">
      <div className="dataList header">
        <div className="line" >
          <div className="dataName">KP</div>
        </div>
        <div className="line"  >
          <div className="dataName">통과톤수</div>
        </div>
        <div className="line"  >
          <div className="dataName">마모 유지관리</div>
        </div>
        <div className="line"  >
          <div className="dataName">궤도틀림</div>
        </div>
        <div className="line"  >
          <div className="dataName">궤도거동계측</div>
        </div>
        <div className="line"  >
          <div className="dataName">온/습도 측정</div>
        </div>
        <div className="line"  >
          <div className="dataName">PAUT 탐상</div>
        </div>
        <div className="line"  >
          <div className="dataName">DRL</div>
        </div>
        <div className="line"  >
          <div className="dataName">LWD</div>
        </div>
      </div>
      <div className="scroll" id="dataExistenceContainer">
      <div className="dataList">
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">KP</div> */}
          <div className="dataBar kp">
            {
              kpList.map( kp => {
                return <div className="kp" style={{left:kp}} >{convertToCustomFormat(kp)}</div>;
              })
            }
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">통과톤수</div> */}
          <div className="dataBar">
            {props.accumulateWeights.map( (data, i) => {
              return <div key={i} className="detailBtn" style={{left:`${(data.beginKp*1000)}px`}} onClick={()=>{
                setRemainingData(data);
                let route = sessionStorage.getItem('route');
                axios.get(`https://raildoctor.suredatalab.kr/api/accumulateweights/remaining`,{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  },
                  params : {
                    railroad_name : route,
                    rail_track  : data.railTrack,
                    kp : data.beginKp,
                    measure_ts : data.measureTs
                  }
                })
                .then(response => {
                  console.log(response.data);
                  setRemainingCriteria(response.data.criteria);
                  setLeftRemaining(response.data.leftRemaining);
                  setRightRemaining(response.data.rightRemaining);
                  setAccOpen(true);
                })
                .catch(error => console.error('Error fetching data:', error));
              }}>상세보기</div>
            })}
            {/* <div className="detailBtn" style={{left:"0.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"9.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"12.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"81.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"78.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"65.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div> */}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">마모 유지관리</div> */}
          <div className="dataBar">
            {props.railwears.map( (data, i) => {
              let route = sessionStorage.getItem('route');
              return <div key={i} className="detailBtn" style={{left:`${(data.kp*1000)}px`}} onClick={()=>{
                setRailwearOpen(true)
                setRailWearData(data);
                /* 2D Data 상세조회 */
                let param = {
                  begin_kp : [data.kp],
                  end_kp : [data.kp],
                  beginMeasureTs : new Date(data.measureTs).toISOString(),
                  endMeasureTs : new Date(data.measureTs).toISOString(),
                  minAccumulateWeight : data.accumulateWeights,
                  maxAccumulateWeight : data.accumulateWeights,
                  railTrack : data.railTrack,
                  railroadName : route,
                  graphType : "TWO_DIMENTION"
                }
                console.log(param);
                axios.get('https://raildoctor.suredatalab.kr/api/railwears/graph_data',{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
                  },
                  params : param
                })
                .then(response => {
                  console.log(response.data);
                  setCornerWearGraphData(response.data.cornerWearGraph);
                  setVerticalWearGraphData(response.data.verticalWearGraph);
                })
                .catch(error => console.error('Error fetching data:', error));
              }}>상세보기</div>
            })}
            {/* <div className="detailBtn" style={{left:"3%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"35%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"12%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"28%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"59%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"91%"}} onClick={()=>{setOpen(true)}}>상세보기</div> */}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">궤도틀림</div> */}
          <div className="dataBar">
            {props.railtwists.map( (data, i) => {
              let route = sessionStorage.getItem('route');
              return <div key={i} className="detailBtn" style={{left:`${(data.beginKp*1000)}px`}} onClick={()=>{
                setRailtwistData(data);
                setRailtwistOpen(true);
                let dataOption = [
                  STRING_HEIGHT, STRING_DIRECTION, STRING_CANT, STRING_RAIL_DISTANCE, STRING_DISTORTION ];
                for( let option of dataOption ){
                  let param = {
                    begin_kp : [data.beginKp],
                    end_kp : [data.endKp],
                    measure_ts : data.measureTs,
                    rail_track : data.railTrack,
                    data_type : option,
                    railroad_name : route,
                  };
                  console.log(param);
                  axios.get(`https://raildoctor.suredatalab.kr/api/railtwists/graph_data`,{
                    paramsSerializer: params => {
                      return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
                    },
                    params : param
                  })
                  .then(response => {
                    console.log(option);
                    console.log(response.data);
                    let dataAry = transposeObjectToArray(response.data);
                    console.log(dataAry);
                    if( option === STRING_HEIGHT ){
                      setHeightChartData(dataAry);
                    }else if( option === STRING_DIRECTION ){
                      setDirectionChartData(dataAry);
                    }else if( option === STRING_CANT ){
                      setCantChartData(dataAry);
                    }else if( option === STRING_RAIL_DISTANCE ){
                      setRaildistanceChartData(dataAry);
                    }else if( option === STRING_DISTORTION ){
                      setDistortionChartData(dataAry);
                    }
                  })
                  .catch(error => console.error('Error fetching data:', error));
                }
              }}>상세보기</div>
            })}
            {/* <div className="detailBtn" style={{left:"4.5%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"97%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"65%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"71%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"50%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"41%"}} onClick={()=>{setOpen(true)}}>상세보기</div> */}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">궤도거동계측</div> */}
          <div className="dataBar">
            {props.railbehaviors.map( (railbehaviorsData, i) => {
              return <div key={i} className="detailBtn" style={{left:`${(railbehaviorsData.kp*1000)}px`}} onClick={()=>{
                setRailbehaviorOpen(true);
                setRailbehaviorData(railbehaviorsData);
                axios.get(`https://raildoctor.suredatalab.kr/api/railbehaviors/measuresets/${railbehaviorsData.measureId}`,{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  }
                })
                .then(response => {
                  console.log(response.data);
                  let todayChartDataObj = {};
                  let dailyChartDataObj = {};
                  let monthlyChartDataObj = {};

                  let dataOption = [
                    STRING_WHEEL_LOAD_KEY,
                    STRING_LATERAL_LOAD_KEY,
                    STRING_STRESS_KEY,
                    STRING_HD_KEY,
                    STRING_VD_KEY,
                    STRING_ACC_KEY,
                    STRING_SPEED_KEY
                  ];

                  for(let sensor of response.data.entities){
                    let colorCode = getColor(colorIndex++);
                    for( let option of dataOption ){
                      axios.get(`https://raildoctor.suredatalab.kr/api/railbehaviors/data/${sensor.sensorId}`,{
                        paramsSerializer: params => {
                          return qs.stringify(params, { format: 'RFC3986' })
                        },
                        params : {
                          measureDate : railbehaviorsData.measureTs,
                          data : option
                        }
                      })
                      .then(response => {
                        console.log(response.data);
                        let chartseries_ = [];
                        let chartData = (response.data.data) ? response.data.data : response.data.range;
                          let dataKey = `${sensor.sensorId}_${STRING_WHEEL_LOAD_KEY}`;
                          for( let todayData of chartData.today ){
                            let addData = {};
                            addData[dataKey] = (todayData.data) ? todayData.data : todayData.maxValue;
                            todayChartDataObj[todayData.ts] = {...todayChartDataObj[todayData.ts], ...addData};
                          }
                          for( let dailydata of chartData.daily ){
                            let addData = {}
                            addData[dataKey] = (dailydata.data) ? dailydata.data : dailydata.maxValue;
                            dailyChartDataObj[dailydata.ts] = {...dailyChartDataObj[dailydata.ts], ...addData};
                          }
                          for( let monthlyData of chartData.monthly ){
                            let addData = {}
                            addData[dataKey] = (monthlyData.data) ? monthlyData.data : monthlyData.maxValue;
                            monthlyChartDataObj[monthlyData.ts] = {...monthlyChartDataObj[monthlyData.ts], ...addData};
                          }
                          setToDayChartData(convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY));
                          setDailyChartData(convertObjectToArray(dailyChartDataObj, CHART_FORMAT_DAILY));
                          setMonthlyChartData(convertObjectToArray(monthlyChartDataObj, CHART_FORMAT_MONTHLY));
                          console.log(convertObjectToArray(todayChartDataObj, CHART_FORMAT_TODAY));
                          console.log(convertObjectToArray(dailyChartDataObj, CHART_FORMAT_DAILY));
                          console.log(convertObjectToArray(monthlyChartDataObj, CHART_FORMAT_MONTHLY));
                          
                          
                          chartseries_.push({ 
                            sensorId : sensor.sensorId, 
                            datakey : dataKey, 
                            displayName : sensor.displayName, 
                            item : option,
                            colorCode : colorCode
                          });

                          if( option === STRING_WHEEL_LOAD_KEY ){
                            setWheelSeries(chartseries_);
                          }else if( option === STRING_LATERAL_LOAD_KEY ){
                            setLateralSeries(chartseries_);
                          }else if( option === STRING_STRESS_KEY ){
                            setStressSeries(chartseries_);
                          }else if( option === STRING_HD_KEY ){
                            setHDSeries(chartseries_);
                          }else if( option === STRING_VD_KEY ){
                            setVDSeries(chartseries_);
                          }else if( option === STRING_ACC_KEY ){
                            setAccSeries(chartseries_);
                          }else if( option === STRING_SPEED_KEY ){
                            setspeedSeries(chartseries_);
                          }
                      })
                      .catch(error => console.error('Error fetching data:', error));
                    }
                  }
                })
                .catch(error => console.error('Error fetching data:', error));
            }}>상세보기</div>
            })}
            {/* <div className="detailBtn" style={{left:"77%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"6%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"51%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"31%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"39%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"81"}} onClick={()=>{setOpen(true)}}>상세보기</div> */}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">온/습도 측정</div> */}
          <div className="dataBar">
            {props.temperatures.map( (tempData, i) => {
              return <div key={i} className="detailBtn" style={{left:`${(tempData.kp*1000)}px`}} onClick={()=>{
                setTemperatureOpen(true);
                setTempMeasureData(tempData);
                let chartseries_ = [];
                let chartDataObj = {};
                axios.get(`https://raildoctor.suredatalab.kr/api/temperatures/period/${tempData.measureId}?begin=${new Date(tempData.measureTs).toISOString()}&end=${new Date(tempData.measureTs).toISOString()}`,{
                  paramsSerializer: params => {
                    return qs.stringify(params, { format: 'RFC3986' })
                  }
                })
                .then(response => {
                  console.log(response.data);
                    let tsAry = response.data.measureTs;
                    let dataAry = response.data.railTemperature;
                    let dataKey = `${STRING_RAIL_TEMPERATURE}`;
                    for( let i in dataAry ){
                      let addData = {};
                      addData[dataKey] = dataAry[i];
                      chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
                    }
                    let colorCode = getColor(colorIndex++);
                    chartseries_.push({
                      dataKey : dataKey, item : tempDataName(STRING_RAIL_TEMPERATURE), color :colorCode
                    });

                    dataAry = response.data.temperature;
                    dataKey = `${STRING_TEMPERATURE}`;
                    for( let i in dataAry ){
                      let addData = {};
                      addData[dataKey] = dataAry[i];
                      chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
                    }
                    colorCode = getColor(colorIndex++);
                    chartseries_.push({
                      dataKey : dataKey, item : tempDataName(STRING_TEMPERATURE), color :colorCode
                    });

                    dataAry = response.data.humidity
                    dataKey = `${STRING_HUMIDITY}`;
                    for( let i in dataAry ){
                      let addData = {};
                      addData[dataKey] = dataAry[i];
                      chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
                    }
                    colorCode = getColor(colorIndex++);
                    chartseries_.push({
                      dataKey : dataKey, item : tempDataName(STRING_HUMIDITY), color :colorCode
                    });
                  setTempChartData(convertObjectToArray(chartDataObj, CHART_FORMAT_DAILY));
                  setTempSeries(chartseries_);
                })
                .catch(error => console.error('Error fetching data:', error));
              }}>상세보기</div>
            })}
            {/* <div className="detailBtn" style={{left:"8%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"88%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"77%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"66%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"55%"}} onClick={()=>{setOpen(true)}}>상세보기</div>
            <div className="detailBtn" style={{left:"44%"}} onClick={()=>{setOpen(true)}}>상세보기</div> */}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">PAUT 탐상</div> */}
          <div className="dataBar">
          {props.paut.map( (data, i) => {
              let route = sessionStorage.getItem('route');
              return <div key={i} className="detailBtn" style={{left:`${(data.kp*1000)}px`}} onClick={()=>{
                setPautOpen(true);
                setPautData(data);
                setPautImgIndex(0);
              }}>상세보기</div>
            })}
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">DRL</div> */}
          <div className="dataBar">
          </div>
        </div>
        <div className="line" style={{width:kptoPixel}} >
          {/* <div className="dataName">LWD</div> */}
          <div className="dataBar">
          </div>
        </div>
      </div>
      </div>
      <Modal
          open={accOpen}
          onClose={(e)=>{setAccOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />통과톤수 데이터 상세요약</div>
            <div className="tabPanel throughput">
              <div className="contentBox" style={{height: "100px", marginBottom:"10px"}} >
                <div className="containerTitle">현재 누적통과톤수</div>
                <div className="componentBox flex section ">
                  <div className="curDate optionBox borderColorGreen" style={{width:"255px"}}>
                    <div className="optionTitle">현재날짜</div>
                    <div className="optionValue">{dateFormat(new Date(remainingData.measureTs))}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">기준</div>
                    <div className="optionValue">{numberWithCommas(remainingCriteria)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">상하선</div>
                    <div className="optionValue">{trackToString(remainingData.railTrack)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">좌우</div>
                    <div className="optionValue">좌</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">KP</div>
                    <div className="optionValue">{convertToCustomFormat(remainingData.beginKp*1000)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">누적통과톤수</div>
                    <div className="optionValue">{numberWithCommas(leftRemaining.accumulateweight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">잔여통과톤수</div>
                    <div className="optionValue">{numberWithCommas(leftRemaining.remainingWeight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">갱환일</div>
                    <div className="optionValue">{dateFormat(new Date(leftRemaining.nextTimeToReplace))}</div>
                  </div>
                </div>
              </div>
              <div className="contentBox" style={{height: "100px", marginBottom:"10px"}} >
                <div className="containerTitle">현재 누적통과톤수</div>
                <div className="componentBox flex section ">
                  <div className="curDate optionBox borderColorGreen" style={{width:"255px"}}>
                    <div className="optionTitle">현재날짜</div>
                    <div className="optionValue">{dateFormat(new Date(remainingData.measureTs))}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">기준</div>
                    <div className="optionValue">{numberWithCommas(remainingCriteria)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">상하선</div>
                    <div className="optionValue">{trackToString(remainingData.railTrack)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">좌우</div>
                    <div className="optionValue">우</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">KP</div>
                    <div className="optionValue">{convertToCustomFormat(remainingData.beginKp*1000)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen">
                    <div className="optionTitle">누적통과톤수</div>
                    <div className="optionValue">{numberWithCommas(rightRemaining.accumulateweight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">잔여통과톤수</div>
                    <div className="optionValue">{numberWithCommas(rightRemaining.remainingWeight)}</div>
                  </div>
                  <div className="curDate optionBox borderColorGreen" >
                    <div className="optionTitle">갱환일</div>
                    <div className="optionValue">{dateFormat(new Date(rightRemaining.nextTimeToReplace))}</div>
                  </div>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/cumulativeThroughput");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
          
        </Box>
      </Modal>

      <Modal
          open={railwearOpen}
          onClose={(e)=>{setRailwearOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />마모유지관리 상세요약</div>
          <div className="tabPanel"  style={{width: "915px", height: "565px" }}>
            <div className="contentBox" style={{marginLeft : 0, height:"100%"}}>
              <div className="containerTitle bothEnds">
                <div>마모정보</div>
                <div className="dataOption" style={{right: "242px"}}>
                  <div className="value">
                    위치 : {convertToCustomFormat(railWearData.kp*1000)}
                  </div>
                </div>
                <div className="dataOption">
                  <div className="value">
                    측정기간 : {formatDateTime(new Date(railWearData.measureTs))}
                  </div>
                </div>
              </div>
              <div className="componentBox separationBox">
                <div className="componentBox" id="directWearInfo">
                  <WearInfo title="직마모" data={verticalWearGraphData} yTitle="직마모(mm)"></WearInfo>
                </div>
                <div className="componentBox" id="sideWearInfo">
                  <WearInfo title="편마모" data={cornerWearGraphData} yTitle="편마모(mm)"></WearInfo>
                </div>
              </div>
            </div>
            <div className="directBtn" onClick={()=>{navigate("/wearMaintenance");}}>데이터 상세보기<img src={ArrowIcon} /></div>
          </div>
        </Box>
      </Modal>

      <Modal
          open={temperatureOpen}
          onClose={(e)=>{setTemperatureOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />온습도 상세요약</div>
          <div className="tabPanel" style={{width:"763px", height:"336px"}}>
            <div className="contentBox" style={{height: "100%"}}>
              <div className="containerTitle">Chart
                <div className="dataOption" style={{right: "174px"}}>
                  <div className="value">
                      위치 : {convertToCustomFormat(tempMeasureData.kp*1000)}
                  </div>
                </div>
                <div className="dataOption">
                  <div className="value">
                    측정기간 : {formatDateTime(new Date(tempMeasureData.measureTs))}
                  </div>
                </div>
              </div>
              <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={tempChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={9} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* <Line dataKey="temp" stroke="#FF0000" dot={false} /> */}
                    {
                      tempSeries.map( (series, i) => {
                        return <Line key={i} dataKey={series.dataKey} name={`${series.item}`} stroke={series.color} dot={false} />;
                      })
                    }
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="directBtn" onClick={()=>{navigate("/MeasuringTemperatureHumidity");}}>데이터 상세보기<img src={ArrowIcon} /></div>
          </div>
        </Box>
      </Modal>

      <Modal
          open={pautOpen}
          onClose={(e)=>{setPautOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />PAUT 상세요약</div>
          <div className="tabPanel" style={{width:"1450px", height:"1000px"}}>
            <div className="contentBox paut" style={{height: "100px", marginBottom:"10px"}} >
              <div className="containerTitle">탐상 데이터</div>
              <div className="componentBox flex section ">
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">DA</div>
                  <div className="optionValue">{pautData.da}</div>
                </div>
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">PA</div>
                  <div className="optionValue">{pautData.pa}</div>
                </div>
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">SA</div>
                  <div className="optionValue">{pautData.sa}</div>
                </div>
                <div className="curDate optionBox borderColorGreen">
                  <div className="optionTitle">UMR</div>
                  <div className="optionValue">{pautData.umr}</div>
                </div>
              </div>
            </div>
            <div className="contentBox" style={{height: "calc(100% - 110px)"}}>
              <div className="containerTitle">사진
                <div className="dataOption" style={{right: "250px"}}>
                  <div className="value">
                      위치 : {convertToCustomFormat(pautData.kp*1000)}
                  </div>
                </div>
                <div className="dataOption">
                  <div className="value">
                    측정기간 : {formatDateTime(new Date(pautData.measureTs))}
                  </div>
                </div>
              </div>
              <div className="componentBox chartBox flex paut">
                {
                  (pautData.images && pautData.images.length > 0) ? 
                  <>
                    <div className="leftBtn" onClick={()=>{
                      if(pautImgIndex>0){setPautImgIndex(pautImgIndex-1)}
                    }}></div>
                    <img src={`https://raildoctor.suredatalab.kr${pautData.images[pautImgIndex].filePath}`}  />
                    <div className="rightBtn" onClick={()=>{
                      if(pautImgIndex<pautData.images.length-1){
                        setPautImgIndex(pautImgIndex+1)
                      }
                    }}></div>
                  </>
                  : null
                }
              </div>
            </div>
            {/* <div className="directBtn" onClick={()=>{navigate("/MeasuringTemperatureHumidity");}}>데이터 상세보기<img src={ArrowIcon} /></div> */}
          </div>
        </Box>
      </Modal>

      <Modal
          open={railtwistOpen}
          onClose={(e)=>{setRailtwistOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
          <div className="popupTitle"><img src={PopupIcon} />궤도틀림 상세요약</div>
          <TabContext value={tabValue} > 
            <Box sx={{ borderBottom: 1, borderColor: 'divider'  }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" >
                <Tab style={{fontFamily : 'NEO_R'}} label="고저틀림" value="1" />
                <Tab style={{fontFamily : 'NEO_R'}} label="방향틀림" value="2" />
                <Tab style={{fontFamily : 'NEO_R'}} label="캔트틀림" value="3" />
                <Tab style={{fontFamily : 'NEO_R'}} label="궤간틀림" value="4" />
                <Tab style={{fontFamily : 'NEO_R'}} label="비틀림" value="5" />
              </TabList>
            </Box>
            <TabPanel value="1">
            <div className="tabPanel" style={{width:"1000px", height:"500px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={heightChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="좌레일-고저틀림" dataKey="valueLeft" stroke="#4371C4" dot={false} />
                    <Line type="monotone" name="우레일-고저틀림" dataKey="valueRight" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="2">
            <div className="tabPanel" style={{width:"763px", height:"336px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={directionChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="좌레일-방향틀림" dataKey="valueLeft" stroke="#4371C4" dot={false} />
                    <Line type="monotone" name="우레일-방향틀림" dataKey="valueRight" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="3">
            <div className="tabPanel" style={{width:"763px", height:"336px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={cantChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} />
                    <Line type="monotone" name="캔트틀림" dataKey="cantTwist" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="4">
            <div className="tabPanel" style={{width:"763px", height:"336px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={raildistanceChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="궤간틀림" dataKey="value" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
            <TabPanel value="5">
            <div className="tabPanel" style={{width:"763px", height:"336px"}}>
              <div className="contentBox" style={{width:"100%", height: "100%"}}>
                <div className="containerTitle">
                  Chart
                  <div className="dataOption" style={{right: "180px"}}>
                    <div className="value">
                      측정구간 : {`${convertToCustomFormat(railtwistData.beginKp*1000)}~${convertToCustomFormat(railtwistData.endKp*1000)}`}
                    </div>
                  </div>
                  <div className="dataOption">
                    <div className="value">
                      측정기간 : {dateFormat(new Date(railtwistData.measureTs))}
                    </div>
                  </div>
                </div>
                <div className="componentBox chartBox flex">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={distortionChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="kp" interval={200} tickFormatter={(value) => value.toFixed(4)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* <Line type="monotone" name="캔트" dataKey="cant" stroke="#4371C4" dot={false} /> */}
                    <Line type="monotone" name="비틀림" dataKey="value" stroke="#4371C4" dot={false} />
      
                    <Line type="monotone" name="목표기준" dataKey="maxTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="목표기준" dataKey="minTargetCriteria" stroke="#4BC784" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="maxRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="보수기준" dataKey="minRepairCriteria" stroke="#FF0606" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="maxCautionCriteria" stroke="#FFF200" dot={false} />
                    <Line type="monotone" name="주의기준" dataKey="minCautionCriteria" stroke="#FFF200" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="directBtn" onClick={()=>{navigate("/trackDeviation");}}>데이터 상세보기<img src={ArrowIcon} /></div>
            </div>
            </TabPanel>
          </TabContext>
        </Box>
      </Modal>

      <Modal
          open={railbehaviorOpen}
          onClose={(e)=>{setRailbehaviorOpen(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={BOXSTYLE} >
        <div className="popupTitle"><img src={PopupIcon} />궤도거동계측 상세요약</div>
        <TabContext value={tabValue} > 
            <Box sx={{ borderBottom: 1, borderColor: 'divider'  }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" >
                <Tab style={{fontFamily : 'NEO_R'}} label="윤중" value="1" />
                <Tab style={{fontFamily : 'NEO_R'}} label="횡압" value="2" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일저부응력" value="3" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일수평변위" value="4" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일수직변위" value="5" />
                <Tab style={{fontFamily : 'NEO_R'}} label="레일수직가속도" value="6" />
                <Tab style={{fontFamily : 'NEO_R'}} label="열차속도" value="7" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          data={toDayChartData}
                        >
                          <CartesianGrid />
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            wheelSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={i}
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                dataKey={series.datakey} fill={series.colorCode} />
                            })
                          }
                        </ScatterChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={dailyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            wheelSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={i}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`}
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          width={500}
                          height={300}
                          data={MonthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            wheelSeries.map( (series, i) => {
                              return <Bar key={i} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="2">
            <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          data={toDayChartData}
                        >
                          <CartesianGrid />
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            lateralSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={i}
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                dataKey={series.datakey} fill={series.colorCode} />
                            })
                          }
                        </ScatterChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={dailyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            lateralSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={i}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`}
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          width={500}
                          height={300}
                          data={MonthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            lateralSeries.map( (series, i) => {
                              return <Bar key={i} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="3">
            <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          data={toDayChartData}
                        >
                          <CartesianGrid />
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            stressSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={i}
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                dataKey={series.datakey} fill={series.colorCode} />
                            })
                          }
                        </ScatterChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={dailyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            stressSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={i}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`}
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          width={500}
                          height={300}
                          data={MonthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            stressSeries.map( (series, i) => {
                              return <Bar key={i} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="4">
            <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          data={toDayChartData}
                        >
                          <CartesianGrid />
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            hdSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={i}
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                dataKey={series.datakey} fill={series.colorCode} />
                            })
                          }
                        </ScatterChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={dailyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            hdSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={i}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`}
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          width={500}
                          height={300}
                          data={MonthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            hdSeries.map( (series, i) => {
                              return <Bar key={i} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="5">
            <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          data={toDayChartData}
                        >
                          <CartesianGrid />
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            vdSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={i}
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                dataKey={series.datakey} fill={series.colorCode} />
                            })
                          }
                        </ScatterChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={dailyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            vdSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={i}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`}
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          width={500}
                          height={300}
                          data={MonthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            vdSeries.map( (series, i) => {
                              return <Bar key={i} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="6">
            <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          data={toDayChartData}
                        >
                          <CartesianGrid />
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            accSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={i}
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                dataKey={series.datakey} fill={series.colorCode} />
                            })
                          }
                        </ScatterChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={dailyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            accSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={i}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`}
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          width={500}
                          height={300}
                          data={MonthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            accSeries.map( (series, i) => {
                              return <Bar key={i} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
            <TabPanel value="7">
            <div className="tabPanel" style={{width:"1000px", height:"320px"}}>
                <div className="contentBox" style={{height:"100%"}}>
                    <div className="containerTitle">Chart
                    <div className="dataOption" style={{right: "242px"}}>
                      <div className="value">
                          위치 : {convertToCustomFormat(railbehaviorData.beginKp*1000)}
                      </div>
                    </div>
                    <div className="dataOption">
                      <div className="value">
                        측정기간 : {formatDateTime(new Date(railbehaviorData.measureTs))}
                      </div>
                    </div>
                    </div>
                    <div className="componentBox flex flexEnd" style={{paddingTop : "5px", paddingBottom : "5px", height: "calc(100% - 35px)"}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                          data={toDayChartData}
                        >
                          <CartesianGrid />
                          <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
                          <YAxis type="number" dataKey="weight" name="weight" fontSize={10} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          {
                            speedSeries.map( (series, i) => {
                              console.log(series.datakey);
                              return <Scatter key={i}
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                dataKey={series.datakey} fill={series.colorCode} />
                            })
                          }
                        </ScatterChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={dailyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            speedSeries.map( (series, i) => {
                              console.log(series);
                              return <Bar key={i}
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`}
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                          width={500}
                          height={300}
                          data={MonthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" fontSize={9}/>
                          <YAxis fontSize={10}/>
                          <Tooltip />
                          <Legend />
                          {
                            speedSeries.map( (series, i) => {
                              return <Bar key={i} 
                                dataKey={series.datakey} 
                                name={`${series.displayName}_${trackDataName(series.item)}`} 
                                fill={series.colorCode} />
                            })
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                <div className="directBtn" onClick={()=>{navigate("/trackGeometryMeasurement");}}>데이터 상세보기<img src={ArrowIcon} /></div>
              </div>
            </TabPanel>
        </TabContext>            
        
        </Box>
      </Modal>
      
    </div>
  );
}

export default DataExistence;