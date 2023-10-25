import "./measuringTemperatureHumidity.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Checkbox, Input, Select, DatePicker } from "antd";
import { CHART_FORMAT_DAILY, CHART_FORMAT_TODAY, RAILROADSECTION, RANGEPICKERSTYLE, STRING_HUMIDITY, STRING_KMA_TEMPERATURE, STRING_RAIL_TEMPERATURE, STRING_TEMPERATURE, TEMPDATA1, UP_TRACK, colors } from "../../constant";
import axios from 'axios';
import qs from 'qs';
import { convertObjectToArray, convertToCustomFormat, findRange, getRailroadSection, tempDataName } from "../../util";
import CloseIcon from "../../assets/icon/211650_close_circled_icon.svg";

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

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setSelectDeviceID(value);
  };

  const setSearchRange = (date) => {
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
  }

  const getColor = (index) => {
    return colors[index % 20];
  }

  const searchTempData = () => {
    console.log(selectDeviceID);
    console.log(searchRangeDate[0].$d.toISOString());
    console.log(searchRangeDate[1].$d.toISOString());
    let chartseries_ = [...chartseries];
    axios.get(`https://raildoctor.suredatalab.kr/api/temperatures/period/${selectDeviceID}?begin=${searchRangeDate[0].$d.toISOString()}&end=${searchRangeDate[1].$d.toISOString()}`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    })
    .then(response => {
      console.log(response.data);
      let sensorName = "";
      for( let sensor of sensorList ){
        if( sensor.deviceId === selectDeviceID ){
          sensorName = convertToCustomFormat(sensor.measureKp * 1000)
        }
      }

      for( let select of checkboxSelects ){
        let dataKey = `${selectDeviceID}_${select}`;
        let tsAry = response.data.measureTs;
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
      setChartData(convertObjectToArray(chartDataObj, CHART_FORMAT_DAILY));
      setChartseries(chartseries_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  useEffect(() => {
    getRailroadSection(setRailroadSection);
  }, []);

  useEffect( ()=> {
    if( railroadSection.length < 2 ){
      return;
    }
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    let route = sessionStorage.getItem('route');
    axios.get('https://raildoctor.suredatalab.kr/api/temperatures/locations',{
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
  
  return (
    <div className="trackDeviation measuringTemperatureHumidity" >
      <div className="scroll">
        <div className="railStatusContainer">
          <RailStatus 
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
                <div className="date">
                  {/* <Input placeholder="KP"
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <Select
                    defaultValue=""
                    style={{
                      width: 200,
                    }}
                    onChange={handleChange}
                    options={selectOptionSensors}
                  />
                </div>
              </div>
              <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">조회기간 </div>
                <div className="date">
                  <RangePicker 
                    style={RANGEPICKERSTYLE}
                    onChange={setSearchRange}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">데이터 </div>
                <div className="date">
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
                <button onClick={()=>{
                  searchTempData();
                }}>조회</button>
              </div>
              {/* <div className="line"></div>
              <div className="dataOption">
                <div className="title">센서목록 </div>
                <div className="date">
                
                </div>
              </div> */}

              {/* <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div> */}
              {/* <div className="line"></div> */}
            </div>
      </div>
        {/* <div className="contentBox" style={{ height: "220px"}} >
          <div className="containerTitle">검토구간</div>
          <div className="componentBox flex section ">

            <div className="position optionBox borderColorGreen" style={{width: "935px"}} >
              <div className="optionTitle">위치</div>
              <div className="optionValue">
                <img src={TempPosition} />
              </div>
            </div>

            <div className="position optionBox h75">
              <div className="optionTitle">데이터</div>
              <div className="optionValue">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">데이터</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //value={age}
                    label="데이터 선택"
                    //onChange={handleChange}
                  >
                    <MenuItem>레일온도</MenuItem>
                    <MenuItem>대기온도</MenuItem>
                    <MenuItem>대기습도</MenuItem>
                    <MenuItem>(기상청)외부온도</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

          </div>
        </div> */}

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
                      }}
                    />
                  </div>
                })
              }
            </div>          
          </div>
          <div className="componentBox chartBox flex">
            {/* <Chart type='bar' data={data} /> */}
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
                {/* <Line dataKey="temp" stroke="#FF0000" dot={false} /> */}
                {
                  chartseries.map( (series, i) => {
                    return <Line key={i} 
                      dataKey={series.dataKey} name={`${series.sensorName}_${series.item}`} 
                      stroke={series.color} dot={false} />;
                  })
                }
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeasuringTemperatureHumidity;
