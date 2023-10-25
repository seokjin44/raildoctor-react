import "./wearMaintenance.css";
import PlaceInfo from "../../component/PlaceInfo/PlaceInfo";
import RailStatus from "../../component/railStatus/railStatus";
import { useEffect, useState } from "react";
import { Radio, Slider, Input } from "antd";
import ModalCustom from "../../component/Modal/Modal";
import WearInfo from "../../component/WearInfo/WearInfo";
import 'dayjs/locale/ko';
import { Select } from 'antd';
import { Box, Modal } from "@mui/material";
import PopupIcon from "../../assets/icon/9044869_popup_icon.png";
import { BOXSTYLE, DIRECTWEARINFO, INSTRUMENTATIONPOINT, RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE, SIDEWEARINFO, STRING_CORNER_WEAR, STRING_DOWN_TRACK, STRING_ROUTE_INCHON, STRING_ROUTE_SEOUL, STRING_SELECT_WEAR_CORRELATION_MGT, STRING_SELECT_WEAR_CORRELATION_RAILVAL, STRING_UP_TRACK, STRING_VERTICAL_WEAR, STRING_WEAR_MODEL_CAT_BOOST, STRING_WEAR_MODEL_KP, STRING_WEAR_MODEL_LGBM, STRING_WEAR_MODEL_LOGI_LASSO, STRING_WEAR_MODEL_LOGI_STEPWISE, STRING_WEAR_MODEL_LR_LASSO, STRING_WEAR_MODEL_LR_STEPWISE, STRING_WEAR_MODEL_RANDOM_FOREST, STRING_WEAR_MODEL_SVR, STRING_WEAR_MODEL_XGB, TRACKSPEEDDATA, UP_TRACK } from "../../constant";
import AlertIcon from "../../assets/icon/decision/3876149_alert_emergency_light_protection_security_icon.png";
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";
import TrackSpeed from "../../component/TrackSpeed/TrackSpeed";
import axios from 'axios';
import qs from 'qs';
import { convertToCustomFormat, convertToNumber, convertToNumber2, dateFormat, filterArrays, findRange, getInchonSpeedData, getRailroadSection, getSeoulSpeedData, numberWithCommas, trackLeftRightToString, trackNumberToString, trackToString, wearModelTableBody, wearModelTableHeader, wearModelTableHeader1, wearModelTableHeader2 } from "../../util";
import lodash from "lodash";

const { TextArea } = Input;
let wear3DMinMax = [];
let wearFilter = [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR];
function WearMaintenance( props ) {
  const [selectedPath, setSelectedPath] = useState({
    "start_station_name": "",
    "end_station_name": "",
    "beginKp": 0,
    "endKp": 0,
  });
  const [selectKP, setSelectKP] = useState({
    name : "",
    trackType : UP_TRACK
  });
  const [wearSearchCondition, setWearSearchCondition] = useState({
    startDate: new Date().getTime() - (31536000000 * 7),
    endDate: new Date().getTime(),
    startMGT: 0,
    endMGT: 3000
  });
  const [wear3dData, setWear3dData] = useState([]);
  const [viewWear3dData, setViewWear3dData] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  /* const [kp, setKP] = useState("0"); */
  const [dataExits, setDataExits] = useState([]);
  const [cornerWearGraphData, setCornerWearGraphData] = useState([]);
  const [verticalWearGraphData, setVerticalWearGraphData] = useState([]);
  const [selectModel, setSelectModel] = useState("");
  const [tableViewModel, setTableViewModel] = useState("");
  const [modelOptions, setModelOptions] = useState([{value:"",label:""}]);
  const [selectWearCorrelation, setSelectWearCorrelation] = useState("");
  const [tableViewWearCorrelation, setTableViewWearCorrelation] = useState("");
  const [railroadSection, setRailroadSection] = useState([]);
  const [trackSpeedData, setTrackSpeedData] = useState([{trackName:"", data:[]},{trackName:"", data:[]}]);
  const [predictionDetails, setPredictionDetails] = useState([]);
  
  const handleClose = () => {
    setOpen(false);
  }
  const handleClose2 = () => {
    setOpen2(false);
  }

  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }
  
  const timeFormatDate = (milliSeconds) => {
    let d = new Date(milliSeconds); 
    var date1=d.getFullYear()+'/'+((d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1))+'/'+(d.getDate()<10?"0"+d.getDate():d.getDate());
    return date1;
  }

  const onChangeTimeSlider = (newValue) => {
    console.log(timeFormatDate(newValue[0]) + "   ~   " + timeFormatDate(newValue[1]));
    setWearSearchCondition({
        startDate: newValue[0],
        endDate: newValue[1],
        startMGT: parseInt(document.getElementById("startWearMGT").innerText),
        endMGT: parseInt(document.getElementById("endWearMGT").innerText)
      });
    
  };

  const onChangeMgtSlider = (newValue) => {
    console.log(newValue);
    setWearSearchCondition({
        startDate: new Date(document.getElementById("startWearDate").innerText).getTime(),
        endDate: new Date(document.getElementById("endWearDate").innerText).getTime(),
        startMGT: newValue[0],
        endMGT: newValue[1]
      
    });
  };

  const getWearInfo = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("railroad_id", "0");
    urlencoded.append("location", document.getElementById("wearSearchPoint").value);
    urlencoded.append("start_date", document.getElementById("startWearDate").innerText);
    urlencoded.append("end_date", document.getElementById("endWearDate").innerText);
    urlencoded.append("start_mgt", document.getElementById("startWearMGT").innerText);
    urlencoded.append("end_mgt", document.getElementById("endWearMGT").innerText);

    var requestOptions = {
      method: 'POST',
      //redirect: 'follow',
      headers: myHeaders,
      body: urlencoded
    };

    fetch("/RailDoctor/wearInfo/getWearInfo", requestOptions)
      .then(response => {
        return response.json(); //Promise 반환
      }).then(result => {
        console.log(result);
        this.setState({
          wearData: {
            directWearInfo: result.direct_wear,
            sideWearInfo: result.side_wear,
          }
        });
        console.log(this.setState.wearData);
      }).catch(error => {
        console.log('error', error)
      });
  }

  const onClickWearSearch = () => {
    /* getWearInfo(); */
    let startKP = selectKP.beginKp / 1000;
    let endKP = selectKP.endKp / 1000;
    console.log(startKP);
    console.log(endKP);
    let route = sessionStorage.getItem('route');
    let param = {
      begin_kp : [startKP],
      end_kp : [endKP],
      beginMeasureTs : new Date(wearSearchCondition.startDate).toISOString(),
      endMeasureTs : new Date(wearSearchCondition.endDate).toISOString(),
      minAccumulateWeight : 1,
      maxAccumulateWeight : 500000000,
      railTrack : trackNumberToString(selectKP.trackType),
      railroadName : route,
      graphType : "TWO_DIMENTION",
      prediction_method : selectModel
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


    param = {
      begin_kp : [startKP],
      end_kp : [endKP],
      beginMeasureTs : new Date(wearSearchCondition.startDate).toISOString(),
      endMeasureTs : new Date(wearSearchCondition.endDate).toISOString(),
      minAccumulateWeight : 1,
      maxAccumulateWeight : 500000000,
      railTrack : trackNumberToString(selectKP.trackType),
      railroadName : route,
      graphType : "THREE_DIMENTION",
      prediction_method : selectModel
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
      let cornerWearGraph = response.data.cornerWearGraph;
      let verticalWearGraph = response.data.verticalWearGraph;
      setCornerWearGraphData(cornerWearGraph);
      setVerticalWearGraphData(verticalWearGraph);
      let wear3DData = makeWear3dData(cornerWearGraph, verticalWearGraph, [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR], []);
      setWear3dData(wear3DData);
      setViewWear3dData(wear3DData);
    })
    .catch(error => console.error('Error fetching data:', error));

    param = {
      begin_kp : [startKP],
      end_kp : [endKP],
      beginMeasureTs : new Date(wearSearchCondition.startDate).toISOString(),
      endMeasureTs : new Date(wearSearchCondition.endDate).toISOString(),
      railTrack : trackNumberToString(selectKP.trackType),
      railroadName : route,
      prediction_method : selectModel
    }
    console.log(param);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/predictions',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986', arrayFormat: 'repeat'  })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      setPredictionDetails(response.data.predictionDetails);
    })
    .catch(error => console.error('Error fetching data:', error));
    setTableViewModel(lodash.cloneDeep(selectModel));
    setTableViewWearCorrelation(lodash.cloneDeep(selectWearCorrelation));
  }

  const makeWear3dData = (cornerWearGraph, verticalWearGraph, fliter, minmax) => {
    let upTrackMGT = [];
    let upTrackKP = [];
    let upTrackWear = [];

    let downTrackMGT = [];
    let downTrackKP = [];
    let downTrackWear = [];

    if( fliter.indexOf(STRING_CORNER_WEAR) > -1 ){
      for( let data of cornerWearGraph ){
        if( data.railTrack === STRING_UP_TRACK ){
          upTrackMGT.push( data.accumulateWeight );
          upTrackKP.push( data.kp * 1000 );
          upTrackWear.push( data.wear );
        }
        if( data.railTrack === STRING_DOWN_TRACK ){
          downTrackMGT.push( data.accumulateWeight );
          downTrackKP.push( data.kp * 1000 );
          downTrackWear.push( data.wear );
        }else{
          upTrackMGT.push( data.accumulateWeight );
          upTrackKP.push( data.kp * 1000 );
          upTrackWear.push( data.wear );
          downTrackMGT.push( data.accumulateWeight );
          downTrackKP.push( data.kp * 1000 );
          downTrackWear.push( data.wear );
        }
      }
    }

    if( fliter.indexOf(STRING_VERTICAL_WEAR) > -1 ){
      for( let data of verticalWearGraph ){
        if( data.railTrack === STRING_UP_TRACK ){
          upTrackMGT.push( data.accumulateWeight );
          upTrackKP.push( data.kp * 1000 );
          upTrackWear.push( data.wear );
        }
        if( data.railTrack === STRING_DOWN_TRACK ){
          downTrackMGT.push( data.accumulateWeight );
          downTrackKP.push( data.kp * 1000 );
          downTrackWear.push( data.wear );
        }else{
          upTrackMGT.push( data.accumulateWeight );
          upTrackKP.push( data.kp * 1000 );
          upTrackWear.push( data.wear );
          downTrackMGT.push( data.accumulateWeight );
          downTrackKP.push( data.kp * 1000 );
          downTrackWear.push( data.wear );
        }
      }
    }

    let data = [
      {
        x: upTrackMGT, //통과톤수
        y: upTrackKP, //kp
        z: upTrackWear, //마모
        mode: 'markers',
        type: 'scatter3d',
        name: STRING_UP_TRACK,
        marker: {
          size: 3,
          color: "red" //상선
        },
      },
      {
        x: downTrackMGT,
        y: downTrackKP,
        z: downTrackWear,
        mode: 'markers',
        type: 'scatter3d',
        name: STRING_DOWN_TRACK,
        marker: {
          size: 3,
          color: "blue" //하선
        }
      }
    ];

    let min = minmax[0];
    let max = minmax[1];
    if( minmax && minmax.length === 2 ){
      let [x1, y1, z1] = filterArrays(min, max, data[0].x, data[0].y, data[0].z);
      let [x2, y2, z2] = filterArrays(min, max, data[1].x, data[1].y, data[1].z);
      data[0].x = x1; data[0].y = y1; data[0].z = z1;
      data[1].x = x2; data[1].y = y2; data[1].z = z2;
    }

    return data;
  }

  useEffect(() => {
    getRailroadSection(setRailroadSection);
    let route = sessionStorage.getItem('route');
    if( route === STRING_ROUTE_INCHON ){
      getInchonSpeedData(setTrackSpeedData);
    }else if( route === STRING_ROUTE_SEOUL ){
      getSeoulSpeedData(setRailroadSection);
    }
  }, []);
  
  useEffect( ()=> {
    if( railroadSection.length < 2 ){
      return;
    }
    let route = sessionStorage.getItem('route');
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    axios.get('https://raildoctor.suredatalab.kr/api/railwears/kp',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroadName : route,
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

      console.log(response.data);
      for( let data of response.data.t1 ){
        let index = -1;
        index = findRange(railroadSection, data * 1000);
        dataExits_[index]++;        
      }
      for( let data of response.data.t2 ){
        let index = -1;
        index = findRange(railroadSection, data * 1000);
        dataExits_[index]++;
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection])

  return (
    <div className="wearMaintenance" >
      <div className="railStatusContainer">
        <RailStatus 
          railroadSection={railroadSection} 
          pathClick={pathClick}
          dataExits={dataExits}
        ></RailStatus>
      </div>
      <div className="dataContainer">
        <div className="scrollContainer" style={{ width: "calc(100%)", height: "calc(100% - 0px)", overflow: "auto"}}>
          <div className="graphSection">
            {/* <div className="leftContainer">
              <div className="contentBox linearContainer mr10" style={{marginBottom:"10px", height:"calc(100% - 287px)"}}>
                <div className="containerTitle tab">
                  <div className="tab select">선형정보</div>
                  <div className="tab">구배</div>
                </div>
                <div className="componentBox">
                <div className="boxProto track" id="trackDetailContainer">
                </div>
                </div>
              </div>
              <div className="contentBox speedContainer" style={{height:"272px"}}>
                <div className="containerTitle">통과속도 정보</div>
                <div className="componentBox" style={{ marginRight: "10px", width: "calc(100% - 10px)", overflow: "hidden"}}>
                  <div className="demoImgContainer">
                    <TrackSpeed data={TRACKSPEEDDATA} kp={kp} ></TrackSpeed>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="contentBox searchContainer mr10">
              <div className="containerTitle">조회 조건</div>
                <div className="componentBox">
                  <div className="flex flexDirectionColumn margin10" style={{"height": "calc(100% - 20px)", "justify-content": "flex-start"}}>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">계측 위치</div>
                      <div className="flex">
                          <Input placeholder="KP" value={selectKP.name} style={RANGEPICKERSTYLE} />
                      </div>
                    </div>
                    <div className="searchOption" style={{padding: "15px 15px 6px 15px"}}>
                      <div className="flex bothEnds valueBox">
                        <label className="textBold title">계측기간</label>
                        <div className="flex dataText">
                          <div id="startWearDate">{timeFormatDate(wearSearchCondition.startDate)}</div>
                          <div>~</div>
                          <div id="endWearDate">{timeFormatDate(wearSearchCondition.endDate)}</div>
                        </div>
                      </div>
                      <div className="flex" tyle={{height:'30px'}}>
                        <div className="sliderContainer">
                          <Slider 
                            range={{ draggableTrack: true }} 
                            min={new Date().getTime() - (31536000000 * 7)} 
                            max={new Date().getTime()} 
                            defaultValue={[new Date().getTime() - (31536000000 * 7), new Date().getTime()]} tooltip={{ open: false, }} 
                            onChange={onChangeTimeSlider} step={86400000}/>
                        </div>
                      </div>
                    </div>
                    <div  className="searchOption" style={{padding: "15px 15px 6px 15px"}}>
                      <div className="flex bothEnds valueBox">
                        <label className="textBold title">통과톤수</label>
                        <div className="flex dataText">
                          <div id="startWearMGT">{wearSearchCondition.startMGT}</div>
                          <div>~</div>
                          <div id="endWearMGT">{wearSearchCondition.endMGT}</div>
                          <div style={{marginLeft: "5px"}}>MGT</div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="sliderContainer">
                          <Slider 
                            range={{ draggableTrack: true }} 
                            min={0} 
                            max={3000} 
                            defaultValue={[0, 3000]} 
                            tooltip={{ open: false, }} 
                            onChange={onChangeMgtSlider} step={50}/>
                        </div>
                      </div>
                    </div>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">마모예측 상관성</div>
                      <div className="flex">
                          <Select
                            defaultValue={selectWearCorrelation}
                            value={selectWearCorrelation}
                            style={{ width: 190 }}
                            onChange={(val)=>{
                              setSelectWearCorrelation(val);
                              if( val === STRING_SELECT_WEAR_CORRELATION_MGT ){
                                setModelOptions([
                                  {value:STRING_WEAR_MODEL_KP,label:"선형회귀모형"}
                                ])
                                setSelectModel(STRING_WEAR_MODEL_KP);
                              }else if( val === STRING_SELECT_WEAR_CORRELATION_RAILVAL ){
                                setModelOptions([
                                  {value:STRING_WEAR_MODEL_LR_LASSO,label:"선형회귀모형 LASSO"},
                                  {value:STRING_WEAR_MODEL_LR_STEPWISE,label:"선형회귀모형 Stepwise"},
                                  {value:STRING_WEAR_MODEL_LOGI_LASSO,label:"로지스틱 LASSO"},
                                  {value:STRING_WEAR_MODEL_LOGI_STEPWISE,label:"로지스틱 Stepwise"},
                                  {value:STRING_WEAR_MODEL_SVR,label:"SVR"},
                                  {value:STRING_WEAR_MODEL_RANDOM_FOREST,label:"랜덤포레스트"},
                                  {value:STRING_WEAR_MODEL_XGB,label:"XGBoost"},
                                  {value:STRING_WEAR_MODEL_LGBM,label:"Light GBM"},
                                  {value:STRING_WEAR_MODEL_CAT_BOOST,label:"CatBoost"}
                                ]);
                                setSelectModel(STRING_WEAR_MODEL_LR_LASSO);
                              }
                            }}
                            options={
                              [
                                {value:"mgt",label:"누적통과톤수만 고려"},
                                {value:"railVal",label:"레일특성변수 모두고려"}
                              ]
                            }
                          />
                      </div>
                    </div>
                    <div className="searchOption selectBox">
                      <div className="title flex textBold">예측모델</div>
                      <div className="flex">
                          <Select
                            defaultValue={selectModel}
                            value={selectModel}
                            style={{ width: 190 }}
                            onChange={(val)=>{setSelectModel(val)}}
                            options={
                              /* [
                                {value:"선형회귀모형",label:"선형회귀모형"},
                                {value:"로지스틱 회귀모형",label:"로지스틱 회귀모형"},
                                {value:"SVM",label:"SVM"},
                                {value:"랜덤포레스트",label:"랜덤포레스트"},
                                {value:"XGBoost",label:"XGBoost"},
                                {value:"Light GBM",label:"Light GBM"},
                                {value:"CatBoost",label:"CatBoost"}
                              ] */
                              modelOptions
                            }
                          />
                      </div>
                    </div>
                    <div className="flex flexCenter" style={{flexDirection: "row-reverse"}} >
                      <button className="searchButton" onClick={onClickWearSearch}>조회</button>
                    </div>
                  </div>
                    

                </div>
              </div>
            <div className="rightContainer">
              <div className="contentBox pointContainer">
                <div className="containerTitle">지점정보</div>
                <div className="componentBox">
                  <PlaceInfo 
                    selectKP={selectKP}
                    setSelectKP={setSelectKP}
                    path={selectedPath} 
                    instrumentationPoint={INSTRUMENTATIONPOINT}
                  ></PlaceInfo>
                </div>
              </div>
              <div className="mamoGraphContainer">
                <div className="contentBox wearContainer" style={{marginLeft : 0, height:"100%"}}>
                  <div className="containerTitle bothEnds">
                    <div>마모정보</div>
                    <div className="flex">
                      <ModalCustom buttonLabel="상선상세" title="상선 상세보기" 
                        data={viewWear3dData}
                        dataSliderSort={(e)=>{
                          console.log("dataSliderSort");
                          let wear3DData = makeWear3dData(cornerWearGraphData, verticalWearGraphData, wearFilter, [e[0], e[1]]);
                          wear3DMinMax = e;
                          setViewWear3dData(wear3DData);
                        }}
                        changeCheckBox={(e)=>{
                          let wear3DData = makeWear3dData(cornerWearGraphData, verticalWearGraphData, e, wear3DMinMax);
                          wearFilter = e;
                          setViewWear3dData(wear3DData);
                        }}
                        closeModal={()=>{
                          setViewWear3dData(lodash.cloneDeep(wear3dData))
                          wearFilter = [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR];
                          wear3DMinMax = [];
                        }}
                      ></ModalCustom>
                      <ModalCustom buttonLabel="하선상세" title="하선 상세보기" 
                        data={viewWear3dData}
                        dataSliderSort={(e)=>{
                          console.log("dataSliderSort");
                          let wear3DData = makeWear3dData(cornerWearGraphData, verticalWearGraphData, wearFilter, [e[0], e[1]]);
                          wear3DMinMax = e;
                          setViewWear3dData(wear3DData);
                        }}
                        changeCheckBox={(e)=>{
                          let wear3DData = makeWear3dData(cornerWearGraphData, verticalWearGraphData, e, wear3DMinMax);
                          wearFilter = e;
                          setViewWear3dData(wear3DData);
                        }}
                        closeModal={()=>{
                          setViewWear3dData(lodash.cloneDeep(wear3dData))
                          wearFilter = [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR];
                          wear3DMinMax = [];
                        }}
                      ></ModalCustom>
                      <div className="modalButton highlight" onClick={()=>{
                        console.log("예측데이터 상세보기");
                        setOpen(true);
                      }} >예측데이터 상세보기</div>
                      <div className="modalButton highlight orange" onClick={()=>{
                        console.log("예측데이터 상세보기");
                        setOpen2(true);
                      }} >의사결정</div>
                    </div>
                  </div>
                  <div className="componentBox separationBox">
                    <div className="componentBox" id="directWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}} >
                      <WearInfo title="직마모(mm)" 
                        data={verticalWearGraphData} 
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                    <div className="componentBox" id="sideWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}}>
                      <WearInfo title="편마모(mm)" 
                        data={cornerWearGraphData} 
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="leftContainer">
              {/* <div className="contentBox linearContainer mr10" style={{marginBottom:"10px", height:"calc(100% - 287px)"}}>
                <div className="containerTitle tab">
                  <div className="tab select">선형정보</div>
                  <div className="tab">구배</div>
                </div>
                <div className="componentBox">
                <div className="boxProto track" id="trackDetailContainer">
                </div>
                </div>
              </div> */}
              <div className="contentBox speedContainer" style={{height:"165px"}}>
                <div className="containerTitle">통과속도 정보</div>
                <div className="componentBox" style={{ marginRight: "10px", width: "calc(100% - 10px)", overflow: "hidden"}}>
                  <div className="demoImgContainer">
                    <TrackSpeed 
                      data={trackSpeedData} 
                      kp={convertToNumber2(selectKP.name)} 
                    ></TrackSpeed>
                  </div>
                </div>
              </div>
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
            <div className="popupTitle"><img src={PopupIcon} />예측데이터 상세</div>
            <div className="popupContent">
              <div className="contentBox" style={{ height: "700px", marginTop : "10px", width: "1500px", overflow:"auto"}} >
                <div className="containerTitle">예측결과
                  {/* <div className="dataOption">
                    <div className="value">
                      Update : 2023.01.25
                    </div>
                  </div> */}
                </div>
                <div className="componentBox flex section " style={{ paddingTop: "5px",
                      paddingBottom: "5px",
                      height: "calc(100% - 37px)",
                      paddingLeft: "5px",
                      flexDirection: "column",
                      width: "calc( 100% - 12px)" }} >
                  {/* <div className="dataBox" style={{display:"flex"}}>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>예측 누적통과톤수</div>
                      <div class="optionValue">414,953,971</div>
                    </div>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>기준직마모량</div>
                      <div class="optionValue">13mm</div>
                    </div>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>기준편마모량</div>
                      <div class="optionValue">15mm</div>
                    </div>
                    <div class="curDate optionBox borderColorGreen" style={{height:"55px", width: "315px", marginBottom : "10px"}}>
                      <div class="optionTitle" style={{width:"212px"}}>갱환시기</div>
                      <div class="optionValue">6억톤</div>
                    </div>
                  </div> */}
                  <div className={`table ${tableViewWearCorrelation}`} style={{ justifyContent: "flex-start" }}>
                    <div className="tableHeader">
                      <div className="tr">
                        <div className="td driving colspan2"><div className="colspan2">열차운행방향</div></div>
                        <div className="td kp colspan2"><div className="colspan2">KP</div></div>
                        <div className="td rail colspan2"><div className="colspan2">좌우레일</div></div>
                        <div className="td mamo colspan2"><div className="colspan2">마모</div></div>
                        {/* <div className="td date colspan2"><div className="colspan2">예측일자</div></div> */}
                        <div className="td ton colspan2"><div className="colspan2">누적통과톤수</div></div>
                        {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                        <>
                          <div className="td value1"><div className="">레일 예측마모량(mm)</div></div>
                        </>
                        :
                          wearModelTableHeader1(tableViewModel)
                        }

                        {/* <div className="td value2 colspan2"><div className="colspan2">레일 실측마모량</div></div> */}
                        {/* <div className="td value3 colspan2"><div className="colspan2">마모량(예측-실측)</div></div> */}
                        <div className={`td value4 ${tableViewWearCorrelation} rowspan3`}><div className="rowspan3">갱환시기 예측</div></div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                      </div>
                      <div className="tr">
                        <div className="td driving"></div>
                        <div className="td kp"></div>
                        <div className="td rail"></div>
                        <div className="td mamo"></div>
                        {/* <div className="td date "></div> */}
                        <div className="td ton "></div>

                        {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                        <>
                          <div className="td value1 ">선형회귀</div>
                        </>
                        :
                          wearModelTableHeader2(tableViewModel)
                        }
                        {/* <div className="td value2 "></div> */}
                        {/* <div className="td value3 "></div> */}
                        <div className={`td value4 ${tableViewWearCorrelation}`}>로지스틱 마모량 기준</div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}>선형회귀 마모량 기준</div>
                        <div className={`td value5 ${tableViewWearCorrelation}`}>누적통과톤수기준</div>
                      </div>
                    </div>
                    <div className="tableBody" style={{ /* overflow: "auto", */ height: "calc(100% - 48px)", justifyContent: "flex-start"}}>
                      {
                        predictionDetails.map( (detail, i) => {
                          return <><div key={`ver${i}`} className="tr">
                            <div className="td driving">{trackToString(detail.railTrack)}</div>
                            <div className="td kp colspan2"><div className="colspan2">{convertToCustomFormat(detail.kp*1000)}</div></div>
                            <div className="td rail colspan2"><div className="colspan2">{trackLeftRightToString(detail.railTrack)}</div></div>
                            <div className="td mamo">직마모</div>
                            {/* <div className="td date ">{dateFormat(new Date(detail.predictionTs))}</div> */}
                            <div className="td ton colspan2"><div className="colspan2">{numberWithCommas(detail.accumulateWeight)} </div></div>
    
                            {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                            <>
                              <div className="td value1 ">{detail.verticalKpWear}</div>
                            </>
                            :
                              wearModelTableBody(tableViewModel, detail, STRING_VERTICAL_WEAR)
                            }
                            {/* <div className="td value2 ">-</div> */}
                            {/* <div className="td value3 ">10mm</div> */}
                            <div className={`td value4 ${tableViewWearCorrelation} colspan2`}><div className="colspan2">{`${numberWithCommas(detail.logiNextWeightToReplace)} - ${dateFormat(new Date(detail.logiNextTimeToReplace))}`}</div></div>
                            <div className={`td value5 ${tableViewWearCorrelation} colspan2`}><div className="colspan2">{`${numberWithCommas(detail.lrNextWeightToReplace)} - ${dateFormat(new Date(detail.lrNextTimeToReplace))}`}</div></div>
                            <div className={`td value5 ${tableViewWearCorrelation} colspan2`}><div className="colspan2">{`${numberWithCommas(detail.kpNextWeightToReplace)} - ${dateFormat(new Date(detail.kpNextTimeToReplace))}`}</div></div>
                          </div>
                          <div key={`cor${i}`} className="tr">
                            <div className="td driving">{trackToString(detail.railTrack)}</div>
                            <div className="td kp"></div>
                            <div className="td rail"></div>
                            <div className="td mamo">편마모</div>
                            {/* <div className="td date ">{dateFormat(new Date(detail.predictionTs))}</div> */}
                            <div className="td ton "></div>
    
                            {(tableViewWearCorrelation === STRING_SELECT_WEAR_CORRELATION_MGT)? 
                            <>
                              <div className="td value1 ">{detail.cornerKpWear}</div>
                            </>
                            :
                              wearModelTableBody(tableViewModel, detail, STRING_CORNER_WEAR)
                            }
                            {/* <div className="td value2 ">-</div> */}
                            {/* <div className="td value3 ">10mm</div> */}
                            <div className={`td value4 ${tableViewWearCorrelation}`}></div>
                            <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                            <div className={`td value5 ${tableViewWearCorrelation}`}></div>
                          </div>
                          </>
                        })
                      }
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>

        <Modal
          open={open2}
          onClose={(e)=>{handleClose2()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={BOXSTYLE} >
            <div className="decisionPopupTitle">
              <img src={AlertIcon} />선로 마모 심각 
              <div className="closeBtn" onClick={()=>{setOpen2(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="decisionPopupContent">
              <div className="contentBox wearContainer" style={{marginLeft : 0, height:"575px"}}>
                  <div className="containerTitle bothEnds">
                    <div>마모정보</div>
                  </div>
                  <div className="componentBox separationBox">
                    <div className="componentBox" id="directWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}} >
                      <WearInfo title="직마모(mm)" 
                        data={verticalWearGraphData}
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                    <div className="componentBox" id="sideWearInfo" style={{ border: "1px solid #cccccc",
                        borderRadius: "5px",
                        margin: "5px",
                        width: "calc(100% - 12px)"}}>
                      <WearInfo title="편마모(mm)" 
                        data={cornerWearGraphData}
                        selectKP={selectKP}
                      ></WearInfo>
                    </div>
                  </div>
              </div>

              <div className="comment" style={{ marginTop: "50px"}} >
                <div className="commentTitle">유지보수 지침</div>
                <div className="commentInput">
                  <TextArea rows={3} />
                </div>
              </div>
              <div className="comment" style={{ marginTop: "15px"}} >
                <div className="commentTitle">
                  유지보수 의사결정
                  <div className="radioGroup">
                    <Radio.Group style={RADIO_STYLE} >
                      <Radio value={1}>알람무시</Radio>
                      <Radio value={2}>점검 후 조치</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className="commentInput">
                  <TextArea rows={3} />
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

export default WearMaintenance;

