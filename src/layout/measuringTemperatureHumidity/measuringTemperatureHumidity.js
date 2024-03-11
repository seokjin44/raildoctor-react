import "./measuringTemperatureHumidity.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Checkbox, Input, Select, DatePicker } from "antd";
import { CHART_FORMAT_RAW, CHART_RENDERING_TEXT, RANGEPICKERSTYLE, STRING_HUMIDITY, STRING_KMA_TEMPERATURE, STRING_RAIL_TEMPERATURE, STRING_TEMPERATURE, URL_ROOT, colors } from "../../constant";
import axios from 'axios';
import qs from 'qs';
import { convertObjectToArray, convertObjectToArray_, convertToCSV, convertToCustomFormat, dateFormat, deleteNonObj, deleteObjData, downloadCSV, findRange, formatTime, getRailroadSection, getRoute, getTrackText, nonData, tempDataName, transformDataKeys } from "../../util";
import CloseIcon from "../../assets/icon/211650_close_circled_icon.svg";
import EmptyImg from "../../assets/icon/empty/empty5.png";
import { isEmpty } from "lodash";
import LoadingImg from "../../assets/icon/loading/loading.png";

const { RangePicker } = DatePicker;
const dataOption = [
  { label: '레일온도', value: STRING_RAIL_TEMPERATURE },
  { label: '대기온도', value: STRING_TEMPERATURE },
  { label: '대기습도', value: STRING_HUMIDITY },
  { label: '(기상청)외부온도', value: STRING_KMA_TEMPERATURE },
];

let sensorList = [];
let chartDataObj = {};
let colorIndex = 1;
let route = getRoute();
function MeasuringTemperatureHumidity( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [searchRangeDate, setSearchRangeDate] = useState([{$d : new Date(), $D : new Date()}]);
  const [selectDeviceID, setSelectDeviceID] = useState("");
  const [selectOptionSensors, setSelectOptionSensors] = useState([]);
  const [dataExits, setDataExits] = useState([]);
  const [chartseries, setChartseries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [checkboxSelects, setCheckboxSelects] = useState([]);
  const [selectPoints, setSelectPoints] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);
  
  const [trackGeo, setTrackGeo] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataExitsDate, setDataExitsDate] = useState({});
  
  const disabledDate = (current) => {
    return !dataExitsDate[dateFormat(current.$d)];
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setSelectDeviceID(value);
    axios.get(URL_ROOT+'/api/temperatures/ts',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        deviceId : value
      }
    })
    .then(response => {
      console.log(response.data);
      let dataExitsDate_ = {};
      for( let ts of response.data.listTs ){
        if( !dataExitsDate_[ dateFormat(new Date(ts)) ] ){
          dataExitsDate_[ dateFormat(new Date(ts)) ] = [];
        }
        dataExitsDate_[ dateFormat(new Date(ts)) ].push(formatTime(new Date(ts)));
      }
      setDataExitsDate(dataExitsDate_);
    })
    .catch(error => console.error('Error fetching data:', error));
  };

  const setSearchRange = (date) => {
    if( date === null ){
      return;
    }
    date[0].$d.setHours(0, 0, 0, 0);
    date[1].$d.setHours(23, 59, 59, 0);
    setSearchRangeDate(date);
  }

  const onCheckboxChange = (values) => {
    setCheckboxSelects(values);
  }

  const pathClick = (select) => {
    console.log(select);
    let selectOptionSensors_ = [];
    let startKP = select.beginKp;
    let endKP = select.endKp;
    for( let sensor of sensorList ){
      if( (sensor.measureKp * 1000) >= startKP &&
          (sensor.measureKp * 1000) <= endKP
      ){
        let options = {
          'label' : convertToCustomFormat(sensor.measureKp * 1000),
          'value' : sensor.deviceId
        }
        selectOptionSensors_.push(
          options
        );
      }
    }
    setSelectOptionSensors(selectOptionSensors_);
    setSelectedPath(select);
    setSelectDeviceID(null);
  }

  const getColor = (index) => {
    return colors[index % 20];
  }

  const searchTempData = () => {
    console.log(selectDeviceID);
    if( !selectDeviceID || selectDeviceID === null || selectDeviceID === undefined ){
      alert("위치를 선택해주세요.");
      return;
    }
    try{
      console.log(searchRangeDate[0].$d.toISOString());
      console.log(searchRangeDate[1].$d.toISOString());
    }catch(e){
      alert("날짜를 선택해주세요.");
      return;
    }
    
    let chartseries_ = [...chartseries];
    axios.get(URL_ROOT+`/api/temperatures/period/${selectDeviceID}?begin=${searchRangeDate[0].$d.toISOString()}&end=${searchRangeDate[1].$d.toISOString()}`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    })
    .then(response => {
      console.log(response.data);
      if( response.data.humidity.length < 1 &&
        response.data.kmaTemperature.length < 1 &&
        response.data.measureTs.length < 1 &&
        response.data.railTemperature.length < 1 &&
        response.data.temperature.length < 1 ){
          alert("데이터가 없습니다.");
          return;
      }
      setLoading(true);
      let sensorName = "";
      for( let sensor of sensorList ){
        if( sensor.deviceId === selectDeviceID ){
          sensorName = convertToCustomFormat(sensor.measureKp * 1000)
        }
      }
      let tsAry = response.data.measureTs;
      for( let select of checkboxSelects ){
        let dataKey = `${selectDeviceID}_${select}`;

        chartseries_ = chartseries_.filter(series => !(series.deviceID === selectDeviceID && series.item === tempDataName(select)));
        deleteObjData(chartDataObj, dataKey);
        deleteNonObj(chartDataObj);

        if( select === STRING_RAIL_TEMPERATURE ){
          let dataAry = response.data.railTemperature;
          for( let i in dataAry ){
            let addData = {};
            addData[dataKey] = dataAry[i];
            chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
          }
          chartseries_.push({
            sensorName : sensorName, dataKey : dataKey, item : tempDataName(STRING_RAIL_TEMPERATURE),
            deviceID : selectDeviceID, color : getColor(colorIndex++)
          });
        }
        if( select === STRING_TEMPERATURE ){
          let dataAry = response.data.temperature
          for( let i in dataAry ){
            let addData = {};
            addData[dataKey] = dataAry[i];
            chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
          }
          chartseries_.push({
            sensorName : sensorName, dataKey : dataKey, item : tempDataName(STRING_TEMPERATURE),
            deviceID : selectDeviceID, color : getColor(colorIndex++)
          });
        }
        if( select === STRING_HUMIDITY ){
          let dataAry = response.data.humidity
          for( let i in dataAry ){
            let addData = {};
            addData[dataKey] = dataAry[i];
            chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
          }
          chartseries_.push({
            sensorName : sensorName, dataKey : dataKey, item : tempDataName(STRING_HUMIDITY),
            deviceID : selectDeviceID, color : getColor(colorIndex++)
          });
        }
        if( select === STRING_KMA_TEMPERATURE ){
          let dataAry = response.data.kmaTemperature
          for( let i in dataAry ){
            let addData = {};
            addData[dataKey] = dataAry[i];
            chartDataObj[tsAry[i]] = {...chartDataObj[tsAry[i]], ...addData};
          }
          chartseries_.push({
            sensorName : sensorName, dataKey : dataKey, item : tempDataName(STRING_KMA_TEMPERATURE),
            deviceID : selectDeviceID, color : getColor(colorIndex++)
          });
        }
      }
      let allData = convertObjectToArray(chartDataObj, CHART_FORMAT_RAW, searchRangeDate[0].$d.toISOString(), searchRangeDate[1].$d.toISOString())
      const allKeys = Array.from(new Set(allData.flatMap(Object.keys))).filter(key => key !== 'time');
      const lastKnownValues = allKeys.reduce((acc, key) => ({ ...acc, [key]: null }), {});
      // 데이터를 순회하며 누락된 값들을 채웁니다.
      const filledData = allData.map(item => {
        // 각 키에 대해 마지막으로 알려진 값을 업데이트하거나 유지합니다.
        allKeys.forEach(key => {
          if (item[key] === undefined) {
            item[key] = lastKnownValues[key]; // 누락된 값을 이전 값으로 채움
          } else {
            lastKnownValues[key] = item[key]; // 새 값을 마지막으로 알려진 값으로 업데이트
          }
        });
        return item;
      });
      setChartData(filledData);
      console.log(convertObjectToArray(chartDataObj, CHART_FORMAT_RAW, searchRangeDate[0].$d.toISOString(), searchRangeDate[1].$d.toISOString()));
      setChartseries(chartseries_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }
  
  const [resizeOn, setResizeOn] = useState(0);
  const resizeChange = () => {
    console.log("resizeChange");
    setResizeOn(prevScales=>{
      return prevScales+1
    });
  }

  useEffect(() => {
    // 이벤트 리스너 추가
    window.addEventListener('resize', resizeChange);
    getRailroadSection(setRailroadSection);
    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {window.removeEventListener('resize', resizeChange )};
  }, []);

  useEffect(()=>{
    for( let sensor of sensorList ){
      if( sensor.deviceId === selectDeviceID ){
        axios.get(URL_ROOT+'/api/railroads/rails',{
          paramsSerializer: params => {
            return qs.stringify(params, { format: 'RFC3986' })
          },
          params : {
            railroad : route,
            kp : sensor.measureKp
          }
        })
        .then(response => {
          console.log(response.data);
          setTrackGeo(response.data);
        })
        .catch(error => console.error('Error fetching data:', error));
      }
    }

  }, [selectDeviceID])

  useEffect( ()=> {
    if( railroadSection.length < 2 ){
      return;
    }
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    axios.get(URL_ROOT+'/api/temperatures/locations',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        begin : railroadSection[0].displayName,
        end : railroadSection[railroadSection.length-1].displayName
      }
    })
    .then(response => {
      let dataArr = [];
      railroadSection.forEach( data => {
        dataArr.push(0);
      });
      let dataExits_ = [...dataArr];

      console.log(response.data)
      sensorList = response.data.sensors;
      for( let sensor of response.data.sensors ){
        let index = -1;
        index = findRange(railroadSection, sensor.measureKp * 1000);
        dataExits_[index]++;
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection])
  
  useEffect( ()=>{
    setLoading(false);
  }, [chartData] )

  return (
    <div className="trackDeviation measuringTemperatureHumidity" >
      <div className="scroll">
        <div className="railStatusContainer">
          <RailStatus 
            resizeOn={resizeOn}
            railroadSection={railroadSection} 
            pathClick={pathClick}
            dataExits={dataExits}
          ></RailStatus>
        </div>
        <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">센서목록 </div>
                <div>
                  <Select
                    value={selectDeviceID}
                    defaultValue={selectDeviceID}
                    style={{
                      width: 150,
                    }}
                    onChange={handleChange}
                    options={selectOptionSensors}
                  />
                </div>
              </div>
              <div className="dataOption linear" style={{marginLeft:"10px"}}>
                <div className="title border">{getTrackText("상선", route)} </div>
                {nonData(trackGeo?.t2?.shapeDisplay)} / R={nonData(trackGeo?.t2?.direction)} <br/>
                {nonData(trackGeo?.t2?.radius)} (C={nonData(trackGeo?.t2?.cant)}, S={nonData(trackGeo?.t2?.slack)})
              </div>
              <div className="dataOption linear" style={{marginLeft:"10px"}}>
                <div className="title border">{getTrackText("하선", route)} </div>
                {nonData(trackGeo?.t1?.shapeDisplay)} / R={nonData(trackGeo?.t1?.direction)} <br/>
                {nonData(trackGeo?.t1?.radius)} (C={nonData(trackGeo?.t1?.cant)}, S={nonData(trackGeo?.t1?.slack)})
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">조회기간 </div>
                <div className="date">
                  <RangePicker 
                    disabledDate={disabledDate}
                    style={RANGEPICKERSTYLE}
                    onChange={setSearchRange}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">데이터 </div>
                <div>
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                  <Checkbox.Group 
                    options={dataOption} 
                    onChange={onCheckboxChange}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <button className="search" onClick={()=>{
                  searchTempData();
                }}>조회</button>
                <button className="search downloadCSV" onClick={()=>{
                  console.log(chartData);
                  console.log(chartseries);
                  let keyMapping = {};
                  chartseries.forEach(( series )=>{
                    keyMapping[series.dataKey] = `${series.sensorName}-${series.item}`;
                  })
                  let transData = transformDataKeys(chartData, keyMapping);
                  if( transData && transData.length > 0 ){
                    let csvData = convertToCSV(transData);
                    downloadCSV(csvData, "Temperature_Data.csv");
                  }
                }}>CSV 다운로드</button>
              </div>
            </div>
      </div>
        <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 250px)"}}>
          <div className="containerTitle">Chart
            <div className="selectPoints">
              {
                chartseries.map( (point, i) => {
                  return <div key={i} className="point">
                    {`${point.sensorName} - ${point.item}`}
                    <img src={CloseIcon} alt="제거" 
                      onClick={()=>{
                        let chartseries_ = [...chartseries];
                        chartseries_ = chartseries_.filter(series => !(series.deviceID === point.deviceID && series.item === point.item));
                        setChartseries(chartseries_);
                        deleteObjData(chartDataObj, point.dataKey);
                        deleteNonObj(chartDataObj);
                        console.log("isEmpty(chartDataObj)",isEmpty(chartDataObj));
                      }}
                    />
                  </div>
                })
              }
            </div>          
          </div>
          <div className="componentBox chartBox flex">
            { (loading) ? <div className="loading"><img src={LoadingImg} alt="로딩" />{CHART_RENDERING_TEXT}</div> : null }
            {
              (chartData.length < 1) ? <div className="emptyBox">
                <img src={EmptyImg} />
                <h1>차트데이터가 없습니다</h1>
                <div>
                차트에 출력할 데이터가 없습니다. <br/>
                구간선택 - 센서목록에서 센서선택 - 조회기간 선택 - 조회할 데이터 선택 - 조회버튼 클릭
                </div>
              </div> : 
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={chartData}
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
                  {
                    chartseries.map( (series, i) => {
                      return <Line key={i} 
                        dataKey={series.dataKey} name={`${series.sensorName}_${series.item}`} 
                        stroke={series.color} dot={false}  />;
                    })
                  }
                </LineChart>
              </ResponsiveContainer>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeasuringTemperatureHumidity;
