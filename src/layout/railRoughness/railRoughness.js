import "./railRoughness.css"
import { useEffect, useRef, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import Position from "../../assets/zodo2.png";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";
import AlertIcon from "../../assets/icon/decision/3876149_alert_emergency_light_protection_security_icon.png";

import Papa from 'papaparse';
import Box from '@mui/material/Box';
import { Modal } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import { BOXSTYLE, DOWN_TRACK, DUMMY_RANGE, INSTRUMENTATIONPOINT, RAILROADSECTION, RAILTRACKALIGNMENTDUMMYDATA1, RANGEPICKERSTYLE, STRING_DOWN_TRACK2, STRING_DOWN_TRACK_LEFT2, STRING_DOWN_TRACK_RIGHT2, STRING_UP_TRACK2, STRING_UP_TRACK_LEFT2, STRING_UP_TRACK_RIGHT2, UP_TRACK } from "../../constant";
import { DatePicker, Input, Select } from "antd";
import PlaceGauge from "../../component/PlaceGauge/PlaceGauge";
import axios from 'axios';
import qs from 'qs';
import { findRange, intervalSample, roundNumber } from "../../util";


function RailRoughness( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectRange, setSelectRange] = useState("");
  const [dataExits, setDataExits] = useState([]);
  const [gaugeData, setGaugeData] = useState([]);
  const [roughnessChartData, setRoughnessChartData] = useState([]);
  const [selectedGauge, setSelectedGauge] = useState("");

  const selectChange = (val) => {
    setSelectRange(val);
    let range = DUMMY_RANGE[val];
    axios.get('https://raildoctor.suredatalab.kr/api/railroughnesses/locations',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : "인천 1호선",
        begin : "계양",
        end : "송도달빛축제공원",
        begin_ts : new Date(range.start).toISOString(),
        end_ts : new Date(range.end).toISOString()
      }
    })
    .then(response => {
      console.log(response.data);
      let dataArr = [];
      let index = -1;
      RAILROADSECTION.forEach( data => {
        dataArr.push(0);
      })
      let dataExits_ = [...dataArr];
      console.log(response.data);
      let dataList = response.data.entities;
      setGaugeData(dataList);
      for( let data of dataList ){
        if( data.railTrack === STRING_UP_TRACK2 ||
            data.railTrack === STRING_UP_TRACK_LEFT2 ||
            data.railTrack === STRING_UP_TRACK_RIGHT2 ){
          index = findRange(RAILROADSECTION, data.beginKp * 1000, UP_TRACK);
          dataExits_[index]++;
        }
        if( data.railTrack === STRING_DOWN_TRACK2 ||
            data.railTrack === STRING_DOWN_TRACK_LEFT2 ||
            data.railTrack === STRING_DOWN_TRACK_RIGHT2 ){
          index = findRange(RAILROADSECTION, data.beginKp * 1000, DOWN_TRACK);
          dataExits_[index]++;
        }
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }
  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
  }, []);
  
  return (
    <div className="trackDeviation railTrackAlignment" >
      <div className="railStatusContainer">
        <RailStatus 
          railroadSection={RAILROADSECTION} 
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
                <div className="title">측정분기 </div>
                <div className="date">
                <Select
                    style={{...{ width : 170 },...RANGEPICKERSTYLE}}
                    onChange={selectChange}
                    options={[
                      { value: '2021_1', label: '2021 1분기' },
                      { value: '2021_2', label: '2021 2분기' },
                      { value: '2021_3', label: '2021 3분기' },
                      { value: '2021_4', label: '2021 4분기' },
                      { value: '2022_1', label: '2022 1분기' },
                      { value: '2022_2', label: '2022 2분기' },
                      { value: '2022_3', label: '2022 3분기' },
                      { value: '2022_4', label: '2022 4분기' },
                      { value: '2023_1', label: '2023 1분기' },
                      { value: '2023_2', label: '2023 2분기' },
                      { value: '2023_3', label: '2023 3분기' },
                      { value: '2023_4', label: '2023 4분기' },
                    ]}
                  />
                </div>
              </div>
              <div className="line"></div>
              {/* <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div> */}
              <div className="dataOption">
                <div className="title">선택구간 </div>
                <div className="date">
                  <Input placeholder="KP" value={"간석오거리 - 인천시청"}
                    style={RANGEPICKERSTYLE}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
      </div>
      <div className="contentBox" >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section " style={{ height: "130px"}} >

          <div className="position optionBox borderColorGreen" style={{width: "100%"}} >
            <div className="optionTitle">위치</div>
            <div className="optionValue">
              {/* <img src={Position} /> */}
              <PlaceGauge 
                path={selectedPath} 
                instrumentationPoint={INSTRUMENTATIONPOINT}
                /* existData={[{
                  type:"LeftTop",
                  start : 200,
                  end : 900
                }]} */
                selectedGauge={selectedGauge}
                existData={gaugeData}
                selectGauge={( findRects )=>{
                  console.log("findRects::::::::",findRects[0].roughnessId );
                  setSelectedGauge( findRects[0].roughnessId );
                  let roughnessChartData_ = [];
                  /* for( let rect of findRects  ){ */
                    axios.get("https://raildoctor.suredatalab.kr/"+findRects[0].dataFile, { responseType: 'text' })
                    .then(response => {
                      const csvData = response.data;
                      let results = [];
                      Papa.parse(csvData, {
                        header: true,  // 첫 번째 행을 헤더로 사용
                        step: (result) => {
                          /* results.push(result.data); */
                            // 각 데이터 항목을 반복하며 숫자 값에 대한 소수점을 제한
                            let roundedData = {};
                            for (const key in result.data) {
                              let value = result.data[key];
                              if (key === 'Roughness(mm)') {  // 값이 숫자인 경우
                                let round = value * 1000;
                                roundedData[key] = round;  // 소수점 두 자리까지만 반올림
                              } else {
                                roundedData[key] = value;
                              }
                            }
                            results.push(roundedData);
                        }
                      });
                      console.log(results);
                      /* results = intervalSample(results, 100); */
                      roughnessChartData_.push(...results);
                      setRoughnessChartData(roughnessChartData_);
                    })
                    .catch(error => console.error('Error fetching data:', error));  // responseType을 'text'로 설정
                  /* } */
                }}
            ></PlaceGauge>
            </div>
          </div>
        </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 440px)" }}>
        <div className="containerTitle">Chart
          <div className="modalButton highlight orange" onClick={()=>{
              console.log("예측데이터 상세보기");
              setOpen(true);
            }} >유지보수지침</div>
        </div>
        <div className="componentBox chartBox flex">
          {/* <div id="trackCanvas" className="trackBox">
            <div className="curLine"></div>
            <canvas id="trackDetailCanvas"
                  ref={trackDetailCanvasRef}
                  onMouseDown={(e)=>{trackDetailHandleMouseDown(e)}}
                  onMouseUp={(e)=>{trackDetailHandleMouseUp()}}
                  onMouseMove={(e)=>{trackDetailHandleMouseMove(e)}}
                  //onWheel={trackDetailHandleWheel}
              />
          </div> */}
          <div className="chartBox">
            {/* <div className="curLine"></div> */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={roughnessChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="KP(m)" />
                <YAxis tickFormatter={(tick) => (tick / 1000).toFixed(3)} />
                <Tooltip formatter={(value) => (value / 1000).toFixed(3)} />
                <Legend />
                <Line dataKey="Roughness(mm)" stroke="#82ca9d" dot={false} />
                <Brush dataKey="KP(m)" height={30} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={BOXSTYLE} >
            <div className="decisionPopupTitle">
              <img src={AlertIcon} />유지보수 지침등록 
              <div className="closeBtn" onClick={()=>{setOpen(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="decisionPopupContent">
              <div className="chartConatiner">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={roughnessChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="km" fontSize={12} />
                    <YAxis  fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mm" stroke="#82ca9d" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="comment" style={{ marginTop: "50px"}} >
                <div className="commentTitle">유지보수 지침</div>
                <div className="commentInput">
                  <TextArea rows={6} />
                </div>
              </div>
              <div className="comment" style={{ marginTop: "15px"}} >
                <div className="commentTitle">유지보수 의사결정</div>
                <div className="commentInput">
                  <TextArea rows={6} />
                </div>
              </div>

            </div>
            <div className="decisionButtonContainer">
              <div className="button">유지보수 의사결정 등록</div>
            </div>
          </Box>
        </Modal>


    </div>
  );
}

export default RailRoughness;
