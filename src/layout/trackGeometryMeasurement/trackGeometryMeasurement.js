import "./trackGeometryMeasurement.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, 
  ScatterChart, Scatter
} from 'recharts';
import { Checkbox, DatePicker, Input } from "antd";
import { DOWN_TRACK, INSTRUMENTATIONPOINT, RAILROADSECTION, RANGEPICKERSTYLE, STRING_DOWN_TRACK_LEFT, STRING_DOWN_TRACK_RIGHT, STRING_UP_TRACK, STRING_UP_TRACK_LEFT, STRING_UP_TRACK_RIGHT, TRACKGEODATA1, TRACKGEODATA2, TRACKGEODATA3, UP_TRACK } from "../../constant";
import PlacePosition from "../../component/PlacePosition/PlacePosition";
import axios from 'axios';
import qs from 'qs';
import { findRange } from "../../util";

function TrackGeometryMeasurement( props ) {
  const [selectedPath, setSelectedPath] = useState({
    start_station_name : "",
    end_station_name : ""
  });
  const [dataExits, setDataExits] = useState([]);

  const [upLeftTrackPoint, setUpLeftTrackPoint] = useState([]); //상선좌포인트
  const [upRightTrackPoint, setUpRightTrackPoint] = useState([]); //상선우포인트
  const [downLeftTrackPoint, setDownLeftTrackPoint] = useState([]); //하선좌포인트
  const [downRightTrackPoint, setDownRightTrackPoint] = useState([]); //하선우포인트

  const [selectPoints, setSelectPoints] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }
  
  const selectPointAdd = ( addPoint ) => {
    let selectPoints_ = [...selectPoints];
    for( let point of selectPoints_ ){
      if( point.sensorId === addPoint.sensorId ){
        return;
      }
    }
    selectPoints_.push(addPoint);
    setSelectPoints(selectPoints_);
  }

  const dataOption = [
    { label: '윤중', value: '윤중' },
    { label: '횡압', value: '횡압' },
    { label: '레일저부응력', value: '레일저부응력' },
    { label: '레일수평변위', value: '레일수평변위' },
    { label: '레일수직변위', value: '레일수직변위' },
    { label: '레일수직가속도', value: '레일수직가속도' },
    { label: '열차속도', value: '열차속도' },
  ];

  useEffect(() => {
    
    let dataArr = [];
    RAILROADSECTION.forEach( data => {
      dataArr.push(0);
    })

    axios.get('https://raildoctor.suredatalab.kr/api/railbehaviors/locations',{
      params : {
        railroad : "인천 1호선",
        begin : "계양",
        end : "송도달빛축제공원"
      },
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      }
    })
    .then(response => {
      let data = response.data.measureSets[0];
      let sensors = response.data.measureSets[0].sensors;
      console.log(data);
      let dataExits_ = [...dataArr];

      let upLeftTrackPoint_ = [...upLeftTrackPoint];
      let upRightTrackPoint_ = [...upRightTrackPoint];
      let downLeftTrackPoint_ = [...downLeftTrackPoint];
      let downRightTrackPoint_ = [...downRightTrackPoint];

      /*
      !sensor Obj!
      accMax : "string"
      accMin : "string"
      displayName : "Point 1"
      hd : "string"
      kp : 0
      lf : "string"
      measureSetId : "0825960e-0755-4e17-99b8-6f78651c35f4"
      railTrack : "T1R"
      sensorId : "9397149e-ba93-4573-b08f-18a417e2c172"
      speed : "string"
      stress : "string"
      stressMin : "string"
      vd : "string"
      wlMax : "string"
      */
      console.log(sensors);
      for( let sensor of sensors ){
        let index = -1;
        if( sensor.railTrack === STRING_UP_TRACK ||
          sensor.railTrack === STRING_UP_TRACK_LEFT ||
          sensor.railTrack === STRING_UP_TRACK_RIGHT ){
          index = findRange(RAILROADSECTION, sensor.kp, UP_TRACK);
        }else{
          index = findRange(RAILROADSECTION, sensor.kp, DOWN_TRACK);
        }

        if( sensor.railTrack === STRING_UP_TRACK_LEFT ){
          upLeftTrackPoint_.push(sensor);
        }else if( sensor.railTrack === STRING_UP_TRACK_RIGHT ){
          upRightTrackPoint_.push(sensor);
        }else if( sensor.railTrack === STRING_DOWN_TRACK_LEFT ){
          downLeftTrackPoint_.push(sensor);
        }else if( sensor.railTrack === STRING_DOWN_TRACK_RIGHT ){
          downRightTrackPoint_.push(sensor);
        }

        dataExits_[index]++;
      }
      setDataExits(dataExits_);
      setUpLeftTrackPoint(upLeftTrackPoint_); 
      setUpRightTrackPoint(upRightTrackPoint_); 
      setDownLeftTrackPoint(downLeftTrackPoint_); 
      setDownRightTrackPoint(downRightTrackPoint_); 

    })
    .catch(error => console.error('Error fetching data:', error));

  }, []);
  
  useEffect( ()=>{
    
  }, [dataExits] )

  return (
    <div className="trackDeviation trackGeometryMeasurement" >
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
                <div className="title">선택구간 </div>
                <div className="date">
                  <Input placeholder="KP" value={
                    selectedPath.start_station_name+
                    " - "+
                    selectedPath.end_station_name}
                    style={RANGEPICKERSTYLE}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">데이터 </div>
                <div className="date">
                  <Checkbox.Group options={dataOption} />
                </div>
              </div>
            </div>
      </div>
      <div className="contentBoxGroup" style={{width: "100%", height: "250px", marginTop:"10px"}}>
        <div className="contentBox" style={{marginRight: "10px", width: "calc((((100% - 20px) - 800px) - 330px) - -93px)", height: "100%"}}>
          <div className="containerTitle">측정위치</div>
          <div className="componentBox">
            <PlacePosition 
              path={selectedPath} 
              instrumentationPoint={INSTRUMENTATIONPOINT}
              upLeftTrackPoint={upLeftTrackPoint}
              upRightTrackPoint={upRightTrackPoint}
              downLeftTrackPoint={downLeftTrackPoint}
              downRightTrackPoint={downRightTrackPoint}
              pointClick={(e)=>{
                console.log(e);
                selectPointAdd(e);
              }}
            ></PlacePosition>
          </div>
        </div>
        <div className="contentBox" style={{width:"700px", height:"100%", marginRight:"10px"}}>
          <div className="containerTitle">장기계측 항목</div>
          <div className="componentBox">
            <div className="table" >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td detail colspan2"><div className="colspan2">세부항목</div></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k526</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k503</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k065</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k110</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k230</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(상)15k290</div></div>
                  <div className="td point"></div>
                  <div className="td point rowspan2"><div className="rowspan2">(하)15k400</div></div>
                  <div className="td point"></div>
                </div>
                <div className="tr">
                  <div className="td detail"></div>
                  <div className="td point">좌 </div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                  <div className="td point">좌</div>
                  <div className="td point">우</div>
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td detail">윤중(V)</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail">횡압(L)</div>
                  <div className="td point">-</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail">레일응력</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>

                <div className="tr">
                  <div className="td detail">레일수평변위</div>
                  <div className="td point" style={{ fontSize: "1px"}} >1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>  
                </div>
                <div className="tr">
                  <div className="td detail">레일수직변위</div>
                  <div className="td point" style={{ fontSize: "1px"}} >1(외측)</div>
                  <div className="td point">-</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail" style={{fontSize: "12px"}}>레일수직가속도</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                  <div className="td point">1</div>
                  <div className="td point">1</div> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contentBox" style={{width:"330px", height:"100%"}}>
          <div className="containerTitle">단기계측 항목</div>
          <div className="componentBox">
          <div className="table table2" style={{justifyContent: "flex-start"}} >
              <div className="tableHeader">
                <div className="tr">
                  <div className="td detail2 colspan2"><div className="colspan2">세부항목</div></div>
                  <div className="td point2 rowspan2"><div className="rowspan2">(하)15k526</div></div>
                  <div className="td point2"></div>
                  <div className="td point2 rowspan2"><div className="rowspan2">(하)15k503</div></div>
                  <div className="td point2"></div>
                </div>
                <div className="tr">
                  <div className="td detail2"></div>
                  <div className="td point2">좌</div>
                  <div className="td point2">우</div>
                  <div className="td point2">좌</div>
                  <div className="td point2">우</div>
                </div>
              </div>
              <div className="tableBody">
                <div className="tr">
                  <div className="td detail2">윤중(V)</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail2">레일응력</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div>
                  <div className="td point2">1</div> 
                </div>
                <div className="tr">
                  <div className="td detail2">트리거용가속도</div>
                  <div className="td point2">-</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div>
                  <div className="td point2">-</div> 
                </div>

                <div className="tr">
                  <div className="td detail2">레일수평변위</div>
                  <div className="td point2">-</div>
                  <div className="td point2">-</div>
                  <div className="td point2">-</div>
                  <div className="td point2">1</div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contentBox" style={{marginTop:"10px", height:"calc(100% - 510px)"}}>
        <div className="containerTitle">Chart</div>
        <div className="componentBox flex flexEnd">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="category" dataKey="time" name="time" fontSize={9}  />
              <YAxis type="number" dataKey="weight" name="weight" fontSize={12}/>
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="A school" data={TRACKGEODATA3} fill="#0041DC" />
            </ScatterChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={TRACKGEODATA2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12}/>
              <YAxis fontSize={12}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" name="윤중" fill="#0041DC" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
          <BarChart
              width={500}
              height={300}
              data={TRACKGEODATA1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12}/>
              <YAxis fontSize={12}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" name="윤중" fill="#0041DC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default TrackGeometryMeasurement;
