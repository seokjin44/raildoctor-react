import "./railProfile.css";
import { useEffect, useState } from "react";
import PositionTestImage from "../../assets/2023-07-09_21_48_42.png";
import RailStatus from "../../component/railStatus/railStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import PositionImg from "../../assets/position2.png";
//import Radio from '@mui/joy/Radio';
//import RadioGroup from '@mui/joy/RadioGroup';
import LeftProfile from "../../assets/left_profile.png"; 
import RightProfile from "../../assets/right_profile.png"; 
import Slider from '@mui/material/Slider';

import DemoImg1 from "../../assets/demo/그림2.png";
import DemoImg2 from "../../assets/demo/그림3.png";

import Box from '@mui/material/Box';
import ChartAuto from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
import { Chart } from 'react-chartjs-2';
import faker from 'faker';
import { RADIO_STYLE, RAILROADSECTION, RANGEPICKERSTYLE } from "../../constant";
import { Input, DatePicker, Radio } from "antd";
import { RadioGroup } from "@mui/material";
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

const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];

export const data = {
  labels,
  datasets: [
    {
      type: 'line',
      label: 'Dataset 1',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      fill: false,
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
    {
      type: 'line',
      label: 'Dataset 2',
      backgroundColor: 'rgb(75, 192, 192)',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'white',
      borderWidth: 2,
    },
    {
      type: 'line',
      label: 'Dataset 3',
      backgroundColor: 'rgb(53, 162, 235)',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    },
  ],
};

const marks = [
  {
    value: 0,
    label: '10/05',
  },
  {
    value: 20,
    label: '11/23',
  },
  {
    value: 37,
    label: '12/04',
  },
  {
    value: 100,
    label: '12/26',
  },
];

function RailProfile( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

  useEffect(() => {
  }, []);
  
  return (
    <div className="trackDeviation railProfile" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
      </div>
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>검색</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">상하선 </div>
                <div className="date">
                <Radio.Group style={RADIO_STYLE} >
                  <Radio value={1}>상선</Radio>
                  <Radio value={2}>하선</Radio>
                </Radio.Group>
                </div>
              </div>
              <div className="line"></div>
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
                <div className="title">검토일자 </div>
                <div className="date">
                  <RangePicker 
                    style={RANGEPICKERSTYLE}
                  />
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                </div>
              </div>
            </div>
      </div>
      {/* <div className="contentBox" style={{ height: "220px"}} >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section ">

          <div className="position optionBox borderColorGreen" style={{width: "935px"}} >
            <div className="optionTitle">위치</div>
            <div className="optionValue">
              <img src={PositionImg} />
            </div>
          </div>
          
          <div className="radioButtons optionBox ">
            <RadioGroup defaultValue="outlined" name="radio-buttons-group" 
              orientation="horizontal" 
              size="sm"  
              variant="outlined" style={{border : 0}}
            >
              <Radio value="outlined" label="상선" />
              <Radio value="soft" label="하선" />
            </RadioGroup>

          </div>
          <div className="distanceSearch optionBox">
            <div className="optionTitle">KP</div>
            <input className="local" id="kilometerStart" />
            <div className="textK">K</div>
            <input className="local" id="kilometerEnd"/>
          </div>

          <div className="position optionBox h75">
            <div className="optionTitle">측정일자</div>
            <div className="optionValue">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DatePicker label="측정일"  />
              </LocalizationProvider>
            </div>
          </div>
  
        </div>
      </div> */}

      <div className="contentBox" style={{marginTop:"10px", height: "485px"}}>
        <div className="containerTitle">프로파일 및 마모 데이터</div>
        <div className="componentBox chartBox flex">
          <div className="profile left">
            <div className="profileSlider">
              <img src={LeftProfile} />
              <Slider
                track={false}
                aria-labelledby="track-false-slider"
                /* getAriaValueText={valuetext} */
                defaultValue={30}
                marks={marks}
              />
            </div>
            <div className="profileData">
              <div className="picture">
                <div className="pictureData regDate">23.03.15</div>
                <div className="pictureData newUpload">Upload</div>
                <img src={DemoImg2} />
              </div>
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
                  <div className="tr">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile right">
            <div className="profileSlider">
              <img src={RightProfile} />
              <Slider
                track={false}
                aria-labelledby="track-false-slider"
                /* getAriaValueText={valuetext} */
                defaultValue={30}
                marks={marks}
              />
            </div>
            <div className="profileData">
              <div className="picture">
                <div className="pictureData regDate">23.03.15</div>
                <div className="pictureData newUpload">Upload</div>
                <img src={DemoImg1} />
              </div>
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
                  <div className="tr">
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
                  </div>
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
