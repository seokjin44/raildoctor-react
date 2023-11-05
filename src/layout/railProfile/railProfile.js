import "./railProfile.css";
import { useEffect, useRef, useState } from "react";
import RailStatus from "../../component/railStatus/railStatus";
import 'dayjs/locale/ko';
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
import { RADIO_STYLE, STRING_DOWN_TRACK, STRING_UP_TRACK } from "../../constant";
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
  const hiddenFileInput = useRef(null);
  
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
  }

  const getKPOptions = ()=> {
    let startKP = selectedPath.beginKp;
    let endKP = selectedPath.endKp;
    let kpOptions_ = [];
    if( selectTrack === STRING_UP_TRACK ){
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
    }else if( selectTrack === STRING_DOWN_TRACK ){
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
    }
    setKpOptions(kpOptions_);
  }

  const valueLabelFormat = (value) => {
    let etst = dateFormat(new Date(value));
    return etst;
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
      console.log(profile);
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
        kp :  selectKP
      }
    })
    .then(response => {
      console.log(response.data);
      if( selectTrack === STRING_UP_TRACK ){
        setTrackGeo(response.data.t2);
      }else if( selectTrack === STRING_DOWN_TRACK ){
        setTrackGeo(response.data.t1);
      }
      
    })
    .catch(error => console.error('Error fetching data:', error));
  }, [selectKP]);

  useEffect(()=>{
    getKPOptions();
  }, [selectedPath, selectTrack])

  return (
    <div className="trackDeviation railProfile" >
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
                <div className="title">상하선 </div>
                <div className="track">
                <Radio.Group style={RADIO_STYLE} defaultValue={selectTrack} value={selectTrack} 
                  onChange={(e)=>{
                    setSelectTrack(e.target.value);
                  }}
                >
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
              {nonData(trackGeo?.shapeDisplay)} /
                R={nonData(trackGeo?.direction)} {nonData(trackGeo?.radius)} (C={nonData(trackGeo?.cant)}, S={nonData(trackGeo?.slack)})
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
                <button className="search" onClick={()=>{
                  let route = sessionStorage.getItem('route');
                  axios.get(`https://raildoctor.suredatalab.kr/api/railprofiles/profiles`,{
                    paramsSerializer: params => {
                      return qs.stringify(params, { format: 'RFC3986' })
                    },
                    params : {
                      railroad : route,
                      measure_kp : selectKP,
                      rail_track : selectTrack
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
            <div className="pictureContainer">
              <div className="profileSlider">
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
              <div className="detailImgs">
                <div className="title">업로드 이미지</div>
                <div className="uploadBtn" onClick={()=>{ hiddenFileInput.current.click(); }}>Upload
                  <input 
                    ref={hiddenFileInput} 
                    type="file" 
                    style={{display:'none'}} 
                    onChange={(e)=>{
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        const base64String = reader.result;
                        // base64String은 'data:image/png;base64,iVBORw0KGgo...'와 같은 형태일 것입니다.
                        // 서버에 전송하기 위해 필요한 부분만 추출합니다 (예: HTTP 헤더에 맞게 조정).
                        const base64FormattedString = base64String.split(',')[1];
                  
                        // 이제 base64FormattedString을 서버에 업로드합니다.
                        axios.post(`https://raildoctor.suredatalab.kr/api/railprofiles/profiles/images`,{
                          paramsSerializer: params => {
                            return qs.stringify(params, { format: 'RFC3986' })
                          },
                          params : {
                            mate : {
                              profileId:leftTrackProfile.profileId,
                              type:"PROFILE",
                              railSide:"LEFT",
                              fileName: file.name,
                              comment:""
                            },
                            data : base64FormattedString
                          }
                        })
                        .then(response => {
                          console.log(response.data);
                        })
                        .catch(error => console.error('Error fetching data:', error));   
                      };
                      reader.onerror = () => {
                        console.error('FileReader에 문제가 발생했습니다.');
                      };
                    }}
                  />
                </div>
                {(profileDetails.length < 1) ? <div className="emptyText">업로드 된 이미지가 없습니다.</div> : null}
              </div>
            </div>
            <div className="profileData">
              <div className="table" >
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td measurementDate colspan3"><div className="colspan3">측정일</div></div>
                    <div className="td ton colspan3"><div className="colspan3">누적통과톤수</div></div>
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
                    <div className="td ton colspan3"></div>
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
                    <div className="td ton colspan3"></div>
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
                      <div className="td ton ">{numberWithCommas(nonData(profile.accumulateLeft))}</div>
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
            <div className="pictureContainer">
              <div className="profileSlider">
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
              <div className="detailImgs">
                <div className="title">업로드 이미지</div>
                <div className="uploadBtn" onClick={()=>{ hiddenFileInput.current.click(); }}>Upload
                  <input 
                    ref={hiddenFileInput} 
                    type="file" 
                    style={{display:'none'}} 
                    onChange={(e)=>{
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        const base64String = reader.result;
                        // base64String은 'data:image/png;base64,iVBORw0KGgo...'와 같은 형태일 것입니다.
                        // 서버에 전송하기 위해 필요한 부분만 추출합니다 (예: HTTP 헤더에 맞게 조정).
                        const base64FormattedString = base64String.split(',')[1];
                  
                        // 이제 base64FormattedString을 서버에 업로드합니다.
                        axios.post(`https://raildoctor.suredatalab.kr/api/railprofiles/profiles/images`,{
                          paramsSerializer: params => {
                            return qs.stringify(params, { format: 'RFC3986' })
                          },
                          params : {
                            mate : {
                              profileId:rightTrackProfile.profileId,
                              type:"PROFILE",
                              railSide:"RIGHT",
                              fileName: file.name,
                              comment:""
                            },
                            data : base64FormattedString
                          }
                        })
                        .then(response => {
                          console.log(response.data);
                        })
                        .catch(error => console.error('Error fetching data:', error));   
                      };
                      reader.onerror = () => {
                        console.error('FileReader에 문제가 발생했습니다.');
                      };
                    }}
                  />
                </div>
                {(profileDetails.length < 1) ? 
                  <div className="emptyText">업로드 된 이미지가 없습니다.</div> : 
                  null
                }
              </div>
            </div>
            <div className="profileData">
              <div className="table" >
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td measurementDate colspan3"><div className="colspan3">측정일</div></div>
                    <div className="td ton colspan3"><div className="colspan3">누적통과톤수</div></div>
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
                    <div className="td ton colspan3"></div>
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
                    <div className="td ton "></div>
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
                      <div className="td ton ">{numberWithCommas(nonData(profile.accumulateRight))}</div>
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
