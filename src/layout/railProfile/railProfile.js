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
import { convertToCustomFormat, dateFormat, findRange } from "../../util";
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

  const pathClick = (select) => {
    console.log(select);
    setSelectedPath(select);
    let startKP = (select.start_station_up_track_location > select.start_station_down_track_location)? 
    select.start_station_down_track_location : select.start_station_up_track_location;
    let endKP = (select.end_station_up_track_location > select.end_station_down_track_location)? 
    select.end_station_up_track_location : select.end_station_down_track_location;
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
    axios.get(`https://raildoctor.suredatalab.kr/api/railprofiles/locations`,{
      paramsSerializer: params => {
        return qs.stringify(params, { format: 'RFC3986' })
      },
      params : {
        railroad : "인천 1호선",
        begin : "계양",
        end : "송도달빛축제공원",
      }
    })
    .then(response => {
      console.log(response.data);
      dataExistKPs = response.data;
      let dataArr = [];
      let index = -1;
      RAILROADSECTION.forEach( data => {
        dataArr.push(0);
      })
      let dataExits_ = [...dataArr];
      console.log(response.data);
      for( let kp of response.data.t1 ){
        index = findRange(RAILROADSECTION, kp * 1000, UP_TRACK);
        dataExits_[index]++;
      }
      for( let kp of response.data.t2 ){
        index = findRange(RAILROADSECTION, kp * 1000, DOWN_TRACK);
        dataExits_[index]++;
      }
      setDataExits(dataExits_);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  const upTrackHandleChange = (e) => {
    if( profilesMap.get(e.target.value) ){
      let profile = profilesMap.get(e.target.value);
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

  const downTrackHandleChange = (e) => {
    if( profilesMap.get(e.target.value) ){
      let profile = profilesMap.get(e.target.value);
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
  
  
  return (
    <div className="trackDeviation railProfile" >
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
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
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
                  axios.get(`https://raildoctor.suredatalab.kr/api/railprofiles/profiles`,{
                    paramsSerializer: params => {
                      return qs.stringify(params, { format: 'RFC3986' })
                    },
                    params : {
                      railroad : "인천 1호선",
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
                    console.log(dateCnt);
                    setSliderMin(sliderMin_);
                    setSliderMax(sliderMax_);
                    setMarks(marks_);
                    setProfiles(profiles);
                  })
                  .catch(error => console.error('Error fetching data:', error));
                }}>조회</button>
              </div>
            </div>
      </div>
      
      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 255px)"}}>
        <div className="containerTitle">프로파일 및 마모 데이터</div>
        <div className="componentBox chartBox flex" style={{overflow:"hidden"}}>
          <div className="profile left">
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
                track={false}
                aria-labelledby="track-false-slider"
                defaultValue={30}
                marks={marks}
                step={null}
                min={sliderMin.getTime()}
                max={sliderMax.getTime()}
                getAriaValueText={valueLabelFormat}
                valueLabelFormat={valueLabelFormat}
                valueLabelDisplay="on"
                onChange={upTrackHandleChange}
                size="medium"
              />
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
                      return <div key={i} className="tr">
                      <div className="td measurementDate">{dateFormat(new Date(profile.measureTs))}</div>
                      <div className="td ton ">{"-"}</div>
                      <div className="td mamo">{profile.llSideWear}</div> 
                      <div className="td mamo">{profile.llCornerWear}</div> 
                      <div className="td mamo">{profile.lVerticalWear}</div> 
                      <div className="td mamo">{profile.lrCornerWear}</div> 
                      <div className="td mamo">{profile.lrSideWear}</div> 
                      <div className="td mamo">{profile.lWearArea}</div> 
                      <div className="td mamo">{profile.lWearRate}</div> 
                    </div>
                    })
                  }
                  {/* <div className="tr">
                    <div className="td measurementDate">21.09.16</div>
                    <div className="td ton ">413,584,122</div>
                    <div className="td mamo">-0.28</div>
                    <div className="td mamo">6.79</div>
                    <div className="td mamo">8.75</div>
                    <div className="td mamo">9.66</div>
                    <div className="td mamo">-0.36</div>
                    <div className="td mamo">534.46</div>
                    <div className="td mamo">19.19</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">22.04.27</div>
                    <div className="td ton ">413,587,242</div>
                    <div className="td mamo">-0.26</div>
                    <div className="td mamo">7.49</div>
                    <div className="td mamo">9.28</div>
                    <div className="td mamo">10.28</div>
                    <div className="td mamo">-0.29</div>
                    <div className="td mamo">574.87</div>
                    <div className="td mamo">20.64</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">22.06.24</div>
                    <div className="td ton ">413,588,125</div>
                    <div className="td mamo">-0.21</div>
                    <div className="td mamo">7.23</div>
                    <div className="td mamo">8.95</div>
                    <div className="td mamo">9.79</div>
                    <div className="td mamo">-0.38</div>
                    <div className="td mamo">552.44</div>
                    <div className="td mamo">19.83</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">23.01.20</div>
                    <div className="td ton ">413,590,914</div>
                    <div className="td mamo">-0.19</div>
                    <div className="td mamo">8.28</div>
                    <div className="td mamo">9.8</div>
                    <div className="td mamo">10.67</div>
                    <div className="td mamo">-0.32</div>
                    <div className="td mamo">607.96</div>
                    <div className="td mamo">21.81</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">23.03.15</div>
                    <div className="td ton ">413,594,152</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">10.5</div>
                    <div className="td mamo">11.57</div>
                    <div className="td mamo">-0.35</div>
                    <div className="td mamo">608.55</div>
                    <div className="td mamo">22.78</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="profile right">
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
                track={false}
                aria-labelledby="track-false-slider"
                defaultValue={30}
                marks={marks}
                step={null}
                min={sliderMin.getTime()}
                max={sliderMax.getTime()}
                getAriaValueText={valueLabelFormat}
                valueLabelFormat={valueLabelFormat}
                valueLabelDisplay="on"
                size="medium"
                onChange={downTrackHandleChange}
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
                      return <div key={i} className="tr">
                      <div className="td measurementDate">{dateFormat(new Date(profile.measureTs))}</div>
                      <div className="td ton ">{"-"}</div>
                      <div className="td mamo">{profile.rlSideWear}</div> 
                      <div className="td mamo">{profile.rlCornerWear}</div> 
                      <div className="td mamo">{profile.rVerticalWear}</div> 
                      <div className="td mamo">{profile.rrCornerWear}</div> 
                      <div className="td mamo">{profile.rrSideWear}</div> 
                      <div className="td mamo">{profile.rWearArea}</div> 
                      <div className="td mamo">{profile.rWearRate}</div> 
                    </div>
                    })
                  }
                  {/* <div className="tr">
                    <div className="td measurementDate">21.09.16</div>
                    <div className="td ton ">413,584,122</div>
                    <div className="td mamo">2.33</div>
                    <div className="td mamo">9.63</div>
                    <div className="td mamo">6.46</div>
                    <div className="td mamo">3.02</div>
                    <div className="td mamo">-0.46</div>
                    <div className="td mamo">439.62</div>
                    <div className="td mamo">15.78</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">22.04.27</div>
                    <div className="td ton ">413,604,122</div>
                    <div className="td mamo">2.33</div>
                    <div className="td mamo">9.88</div>
                    <div className="td mamo">6.64</div>
                    <div className="td mamo">3.22</div>
                    <div className="td mamo">-0.33</div>
                    <div className="td mamo">455.47</div>
                    <div className="td mamo">16.35</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">22.06.24</div>
                    <div className="td ton ">413,624,122</div>
                    <div className="td mamo">2.76</div>
                    <div className="td mamo">9.9</div>
                    <div className="td mamo">6.44</div>
                    <div className="td mamo">2.91</div>
                    <div className="td mamo">-0.62</div>
                    <div className="td mamo">445.79</div>
                    <div className="td mamo">16</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">23.01.20</div>
                    <div className="td ton ">413,628,653</div>
                    <div className="td mamo">2.64</div>
                    <div className="td mamo">10.32</div>
                    <div className="td mamo">6.89</div>
                    <div className="td mamo">3.63</div>
                    <div className="td mamo">-0.56</div>
                    <div className="td mamo">477.08</div>
                    <div className="td mamo">17.12</div>
                  </div>
                  <div className="tr">
                    <div className="td measurementDate">23.03.15</div>
                    <div className="td ton ">413,630,233</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">-</div>
                    <div className="td mamo">-</div>
                  </div> */}
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
