import "./railProfile.css";
import { useEffect, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
import LeftProfile from "../../assets/left_profile.png"; 
import RightProfile from "../../assets/right_profile.png"; 
import Slider from '@mui/material/Slider';
import axios from 'axios';
import qs from 'qs';
import DemoImg1 from "../../assets/demo/그림2.png";
import DemoImg2 from "../../assets/demo/그림3.png";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import faker from 'faker';
import { DOWN_TRACK, RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE, STRING_DOWN_TRACK, STRING_UP_TRACK, UP_TRACK } from "../../constant";
import { Input, DatePicker, Radio, Select } from "antd";
import ImgSlider from "../../component/imgSlider/imgSlider";
import { convertToCustomFormat, dateFormat, findRange, getRailroadSection, nonData, numberWithCommas } from "../../util";
const { RangePicker } = DatePicker;

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

let dataExistKPs = {t1 : [], t2 : []};
let profilesMap = new Map();
function RailProfile( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [leftTrackProfile, setLeftTrackProfile] = useState(null);
  const [rightTrackProfile, setRightTrackProfile] = useState(null);
  const [selectLeftProfileDate, setSelectLeftProfileDate ] = useState("");
  const [selectRightProfileDate, setSelectRightProfileDate ] = useState("");
  const [selectTrack, setSelectTrack] = useState(STRING_UP_TRACK);
  const [dataExits, setDataExits] = useState([]);
  const [kpOptions, setKpOptions] = useState([]);
  const [selectKP, setSelectKP] = useState("");
  const [profiles, setProfiles] = useState([]);
/*   const [leftProfileImages, setLeftProfileImages] = useState([]); 
  const [rightProfileImages, setRightProfileImages] = useState([]); */

  const [profileDetails, setProfileDetails] = useState([]);

  const [leftImgView, setLeftImgView] = useState(false);
  const [rightImgView, setRightImgView] = useState(false);

  const [sliderMin, setSliderMin] = useState(new Date()); 
  const [sliderMax, setSliderMax] = useState(new Date());
  const [marks, setMarks] = useState([]);
  const [railroadSection, setRailroadSection] = useState([]);

  const [leftAcc, setLeftAcc] = useState(0);
  const [rightAcc, setRightAcc] = useState(0);
  
  const [trackGeo, setTrackGeo] = useState({});
  
  const pathClick = (select) => {
    console.log(select);
    setSelectedPath(select);
    let startKP = select.beginKp;
    let endKP = select.endKp;
    let kpOptions_ = [];
    if( selectTrack === STRING_UP_TRACK ){
      for( let kp of dataExistKPs.t1 ){
        if( (kp * 1000) >= startKP &&
            (kp * 1000) <= endKP
        ){
          let options = {
            'label' : convertToCustomFormat(kp * 1000),
            'value' : kp
          }
          kpOptions_.push(
            options
          );
        }
      }
    }else if( selectTrack === STRING_DOWN_TRACK ){
      for( let kp of dataExistKPs.t2 ){
        if( (kp * 1000) >= startKP &&
            (kp * 1000) <= endKP
        ){
          let options = {
            'label' : convertToCustomFormat(kp * 1000),
            'value' : kp
          }
          kpOptions_.push(
            options
          );
        }
      }
    }
    setKpOptions(kpOptions_);
  }

  const valueLabelFormat = (value) => {
    let etst = dateFormat(new Date(value));
    return etst;
  }

  useEffect(() => {
    getRailroadSection(setRailroadSection);
  }, []);

  const upTrackHandleChange = (val) => {
    setSelectLeftProfileDate(val);
    setSelectRightProfileDate(val);
    if( profilesMap.get(val) ){
      let profile = profilesMap.get(val);
      axios.get(`https://raildoctor.suredatalab.kr/api/railprofiles/pictures/${profile.profileId}`,{
        paramsSerializer: params => {
          return qs.stringify(params, { format: 'RFC3986' })
        }
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
      setLeftTrackProfile(profile);
    }
  }

  const downTrackHandleChange = (val) => {
    setSelectLeftProfileDate(val);
    setSelectRightProfileDate(val);
    if( profilesMap.get(val) ){
      let profile = profilesMap.get(val);
      axios.get(`https://raildoctor.suredatalab.kr/api/railprofiles/pictures/${profile.profileId}`,{
        paramsSerializer: params => {
          return qs.stringify(params, { format: 'RFC3986' })
        }
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
      setRightTrackProfile(profile);
    }
  }

  const getProfileLeftImg = (profile) => {
    if( !profile ){
      return <div className="profileImg" >
        날짜를 선택해주세요.
      </div>;
    }else if( profile.imageLeft ){
      return <img className="profileImg" src={`https://raildoctor.suredatalab.kr${profile.imageLeft.fileName}`} />;
    }
    return <div className="profileImg" >
      이미지가 준비되지않은 범위입니다.
    </div>;
  } 

  const getProfileRightImg = (profile) => {
    if( !profile ){
      return <div className="profileImg" >
        날짜를 선택해주세요.
      </div>;
    }else if( profile.imageRight ){
      return <img className="profileImg" src={`https://raildoctor.suredatalab.kr${profile.imageRight.fileName}`} />;
    }
    return <div className="profileImg" >
      이미지가 준비되지않은 범위입니다.
    </div>;
  }

  useEffect( () => {
    if( railroadSection.length < 2 ){
      return;
    }
    console.log(railroadSection[0].displayName, railroadSection[railroadSection.length-1].displayName);
    let route = sessionStorage.getItem('route');
    axios.get(`https://raildoctor.suredatalab.kr/api/railprofiles/locations`,{
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
      console.log(response.data);
      dataExistKPs = response.data;
      let dataArr = [];
      let index = -1;
      railroadSection.forEach( data => {
        dataArr.push(0);
      })
      let dataExits_ = [...dataArr];
      console.log(response.data);
      for( let kp of response.data.t1 ){
        index = findRange(railroadSection, kp * 1000);
        dataExits_[index]++;
      }
      for( let kp of response.data.t2 ){
        index = findRange(railroadSection, kp * 1000);
        dataExits_[index]++;
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [railroadSection]);

  useEffect( ()=>{
    let route = sessionStorage.getItem('route');
    axios.get('https://raildoctor.suredatalab.kr/api/railroads/rails',{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : route,
        kp :  parseInt(selectKP) / 1000 
      }
    })
    .then(response => {
      console.log(response.data);
      setTrackGeo(response.data);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [selectKP]);
    
  useEffect( ()=>{
    if( !profiles || profiles === null || profiles === undefined || profiles.length < 1 ){
      return;
    }
    let route = sessionStorage.getItem('route');
    let param  = {
      railroad_name : route,
      measure_ts : profiles[profiles.length -1].measureTs,
      rail_track : selectTrack,
      kp : selectKP
      /* begin_kp: (e.target.value / 1000),
      end_kp : (e.target.value / 1000) + 0.99 */
    }
    console.log(param);
    axios.get(`https://raildoctor.suredatalab.kr/api/accumulateweights/remaining`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : param
    })
    .then(response => {
      console.log(response.data);
      setLeftAcc(response.data.leftRemaining.accumulateweight);
      setRightAcc(response.data.rightRemaining.accumulateweight);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [profiles])
  return (
    <div className="trackDeviation railProfile" >
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
                <div className="title">상하선 </div>
                <div className="date">
                <Radio.Group style={RADIO_STYLE} defaultValue={selectTrack} value={selectTrack} >
                  <Radio value={STRING_UP_TRACK}>상선</Radio>
                  <Radio value={STRING_DOWN_TRACK}>하선</Radio>
                </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">KP </div>
                <div className="date">
                  {/* <Input placeholder="KP"
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <Select
                    defaultValue={selectKP}
                    value={selectKP}
                    style={{
                      width: 200,
                    }}
                    onChange={(val)=>{setSelectKP(val)}}
                    options={kpOptions}
                  />
                </div>
              </div>
              <div className="dataOption" style={{marginLeft:"10px"}}>
              {nonData(trackGeo.shapeDisplay)} /
                R={nonData(trackGeo.direction)} {nonData(trackGeo.radius)} (C={nonData(trackGeo.cant)}, S={nonData(trackGeo.slack)})
              </div>
              <div className="line"></div>
              {/* <div className="dataOption">
                <div className="title">검토일자 </div>
                <div className="date">
                  <RangePicker 
                    style={RANGEPICKERSTYLE}
                  />
                </div>
              </div> */}
              <div className="dataOption">
                <button onClick={()=>{
                  let route = sessionStorage.getItem('route');
                  axios.get(`https://raildoctor.suredatalab.kr/api/railprofiles/profiles`,{
                    paramsSerializer: params => {
                      return qs.stringify(params, { format: 'RFC3986' })
                    },
                    params : {
                      railroad : route,
                      measure_kp : selectKP,
                      /* rail_track : selectTrack */
                    }
                  })
                  .then(response => {
                    console.log(response.data);
                    let sliderMin_ = new Date();
                    let sliderMax_ = new Date(0);
                    let marks_ = [];
                    /* {
                      value: new Date("2023-10-05").getTime(),
                      mamo : 1
                    }, */
                    let dateCnt = {};
                    let profiles = [];
                    for( let profile of response.data.profiles ){
                      if( !profile.imageLeft && !profile.imageRight ){ continue; }
                      profilesMap.set(new Date(profile.measureTs).getTime(), profile);
                      let profileId = profile.profileId;
                      let measureDate = new Date(profile.measureTs);
                      console.log(profile.measureTs);
                      (dateCnt[profile.measureTs]) ? dateCnt[profile.measureTs]++ : dateCnt[profile.measureTs] = 1;
                      if( measureDate.getTime() < sliderMin_.getTime() ){
                        sliderMin_ = measureDate;
                      }
                      if( measureDate.getTime() > sliderMax_.getTime() ){
                        sliderMax_ = measureDate;
                      }
                      marks_.push({
                        value: measureDate.getTime(),
                        profileId : profileId
                      });
                      profiles.push(profile);
                    }

                    marks_.sort((a, b) => {
                      if (a.value < b.value) return -1;
                      if (a.value > b.value) return 1;
                      return 0;
                    });

                    
                    console.log(dateCnt);
                    setSliderMin(sliderMin_);
                    setSliderMax(sliderMax_);
                    setMarks(marks_);
                    setProfiles(profiles);
                    upTrackHandleChange(marks_[marks_.length-1].value);
                    downTrackHandleChange(marks_[marks_.length-1].value);
                  })
                  .catch(error => console.error('Error fetching data:', error));
                }}>조회</button>
              </div>
            </div>
      </div>
      
      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 255px)"}}>
        <div className="containerTitle">프로파일 및 마모 데이터</div>
        <div className="componentBox flex" style={{overflowY:'auto', overflowX:'hidden'}}>
          <div className="profile left">
            <div className="railTitle">좌</div>
            <div className="accData">
              <div className="title">최근누적통과톤수</div>
              <div className="value">{numberWithCommas(leftAcc)}</div>
            </div>
            <div className="profileSlider">
              {(profileDetails.length > 0) ? <div className="imageViewButton" onClick={()=>{setLeftImgView(true)}} >이미지 보기</div> : null}
              {(leftImgView) ? <div className="picture">
                <div className="pictureData regDate">23.03.15</div>
                <div className="pictureData newUpload">Upload</div>
                <div className="pictureData closeImg">이미지 닫기</div>
                <ImgSlider
                  imgUrlList={[DemoImg1,DemoImg2]}
                />
              </div> : null}
              {getProfileLeftImg(leftTrackProfile)}
              <Slider
                value={selectLeftProfileDate}
                defaultValue={selectLeftProfileDate}
                track={false}
                aria-labelledby="track-false-slider"
                marks={marks}
                step={null}
                min={sliderMin.getTime()}
                max={sliderMax.getTime()}
                getAriaValueText={valueLabelFormat}
                valueLabelFormat={valueLabelFormat}
                valueLabelDisplay="on"
                onChange={(e)=>{
                  upTrackHandleChange(e.target.value);
                  downTrackHandleChange(e.target.value);
                }}
                size="medium"
              />
            </div>
            <div className="profileData">
              <div className="table" >
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td measurementDate colspan3"><div className="colspan3">측정일</div></div>
                    {/* <div className="td ton colspan3"><div className="colspan3">누적통과톤수</div></div> */}
                    <div className="td mamo rowspan7"><div className="rowspan7">좌레일</div></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo"></div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate colspan3"></div>
                    {/* <div className="td ton colspan3"></div> */}
                    <div className="td mamo rowspan2"><div className="rowspan2">좌측</div></div>
                    <div className="td mamo rowspan2"></div>
                    <div className="td mamo colspan2"><div className="colspan2">직마모(0º)</div></div>
                    <div className="td mamo rowspan2"><div className="rowspan2">우측</div></div>
                    <div className="td mamo rowspan2 "></div>
                    <div className="td mamo">면적</div>
                    <div className="td mamo">마모율</div>
                  </div>
                  <div className="tr" style={{ height: "45px"}}>
                    <div className="td measurementDate"></div>
                    {/* <div className="td ton colspan3"></div> */}
                    <div className="td mamo">측마모(-90º)</div>
                    <div className="td mamo">편마모(-45º)</div>
                    <div className="td mamo"></div>
                    <div className="td mamo">측마모(+45º)</div>
                    <div className="td mamo">측마모(+90º)</div>
                    <div className="td mamo">AW(㎟)</div>
                    <div className="td mamo">AWP(%)</div>
                  </div>
                </div>
                <div className="tableBody">
                  {
                    profiles.map( (profile, i) => {
                      return <div key={`down${i}`} className="tr">
                      <div className="td measurementDate">{dateFormat(new Date(profile.measureTs))}</div>
                      {/* <div className="td ton ">{"-"}</div> */}
                      <div className="td mamo">{nonData(profile.llSideWear)}</div> 
                      <div className="td mamo">{nonData(profile.llCornerWear)}</div> 
                      <div className="td mamo">{nonData(profile.lVerticalWear)}</div> 
                      <div className="td mamo">{nonData(profile.lrCornerWear)}</div> 
                      <div className="td mamo">{nonData(profile.lrSideWear)}</div> 
                      <div className="td mamo">{nonData(profile.lWearArea)}</div> 
                      <div className="td mamo">{nonData(profile.lWearRate)}</div> 
                    </div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="profile right">
            <div className="railTitle">우</div>
            <div className="accData">
              <div className="title">최근누적통과톤수</div>
              <div className="value">{numberWithCommas(rightAcc)}</div>
            </div>
            <div className="profileSlider">
              {(profileDetails.length > 0) ? <div className="imageViewButton" onClick={()=>{setRightImgView(true)}} >이미지 보기</div> : null}
              {(rightImgView) ? <div className="picture">
                <div className="pictureData regDate">23.03.15</div>
                <div className="pictureData newUpload">Upload</div>
                <div className="pictureData closeImg">이미지 닫기</div>
                <ImgSlider
                  imgUrlList={[DemoImg1,DemoImg2]}
                />
              </div> : null}
              {getProfileRightImg(rightTrackProfile)}
              <Slider
                value={selectRightProfileDate}
                defaultValue={selectRightProfileDate}
                track={false}
                aria-labelledby="track-false-slider"
                marks={marks}
                step={null}
                min={sliderMin.getTime()}
                max={sliderMax.getTime()}
                getAriaValueText={valueLabelFormat}
                valueLabelFormat={valueLabelFormat}
                valueLabelDisplay="on"
                size="medium"
                onChange={(e)=>{
                  upTrackHandleChange(e.target.value);
                  downTrackHandleChange(e.target.value);
                }}
              />
            </div>
            <div className="profileData">
              {/* <div className="picture">
                <div className="pictureData regDate">23.03.15</div>
                <div className="pictureData newUpload">Upload</div>
                <ImgSlider/>
              </div> */}
              <div className="table" >
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td measurementDate colspan3"><div className="colspan3">측정일</div></div>
                    {/* <div className="td ton colspan3"><div className="colspan3">누적통과톤수</div></div> */}
                    <div className="td mamo rowspan7"><div className="rowspan7">우레일</div></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo rowspan7"></div>
                    <div className="td mamo"></div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate colspan3"></div>
                    {/* <div className="td ton colspan3"></div> */}
                    <div className="td mamo rowspan2"><div className="rowspan2">좌측</div></div>
                    <div className="td mamo rowspan2"></div>
                    <div className="td mamo colspan2"><div className="colspan2">직마모(0º)</div></div>
                    <div className="td mamo rowspan2"><div className="rowspan2">우측</div></div>
                    <div className="td mamo rowspan2 "></div>
                    <div className="td mamo">면적</div>
                    <div className="td mamo">마모율</div>
                  </div>
                  <div className="tr" style={{ height: "45px"}}>
                    <div className="td measurementDate"></div>
                    {/* <div className="td ton "></div> */}
                    <div className="td mamo">측마모(-90º)</div>
                    <div className="td mamo">편마모(-45º)</div>
                    <div className="td mamo"></div>
                    <div className="td mamo">측마모(+45º)</div>
                    <div className="td mamo">측마모(+90º)</div>
                    <div className="td mamo">AW(㎟)</div>
                    <div className="td mamo">AWP(%)</div>
                  </div>
                </div>
                <div className="tableBody">
                  {
                    profiles.map( (profile, i) => {
                      return <div key={`up${i}`} className="tr">
                      <div className="td measurementDate">{dateFormat(new Date(profile.measureTs))}</div>
                      {/* <div className="td ton ">{"-"}</div> */}
                      <div className="td mamo">{nonData(profile.rlSideWear)}</div> 
                      <div className="td mamo">{nonData(profile.rlCornerWear)}</div> 
                      <div className="td mamo">{nonData(profile.rVerticalWear)}</div> 
                      <div className="td mamo">{nonData(profile.rrCornerWear)}</div> 
                      <div className="td mamo">{nonData(profile.rrSideWear)}</div> 
                      <div className="td mamo">{nonData(profile.rWearArea)}</div> 
                      <div className="td mamo">{nonData(profile.rWearRate)}</div> 
                    </div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default RailProfile;
