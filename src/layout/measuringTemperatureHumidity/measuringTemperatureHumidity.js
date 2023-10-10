import "./measuringTemperatureHumidity.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Checkbox, Input } from "antd";
import { RAILROADSECTION, RANGEPICKERSTYLE, TEMPDATA1 } from "../../constant";
import axios from 'axios';

const dataOption = [
  { label: '레일온도', value: '레일온도' },
  { label: '대기온도', value: '대기온도' },
  { label: '대기습도', value: '대기습도' },
  { label: '(기상청)외부온도', value: '(기상청)외부온도' },
];

function MeasuringTemperatureHumidity( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  useEffect(() => {
    axios.get('https://devel.suredatalab.kr/api/temperatures/locations',{
      params : {
        railroad : "인천 1호선",
        begin : "계양",
        end : "귤현"
      }
    })
    .then(response => console.log(response.data))
    .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  return (
    <div className="trackDeviation measuringTemperatureHumidity" >
      <div className="scroll">
        <div className="railStatusContainer">
          <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
        </div>
        <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  <Input placeholder="KP"
                    style={RANGEPICKERSTYLE}
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
                <div className="title">데이터 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                  <Checkbox.Group options={dataOption} />
                </div>
              </div>


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
          <div className="containerTitle">Chart</div>
          <div className="componentBox chartBox flex">
            {/* <Chart type='bar' data={data} /> */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={TEMPDATA1}
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
                <Line dataKey="temp" stroke="#FF0000" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeasuringTemperatureHumidity;
