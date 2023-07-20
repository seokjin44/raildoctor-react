import "./trackDeviation.css";
import { useEffect, useState } from "react";
import PositionTestImage from "../../assets/2023-07-09_21_48_42.png";
import RailStatus from "../../component/railStatus/railStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';
import CloseIcon from "../../assets/icon/decision/211651_close_round_icon.png";

import Box from '@mui/material/Box';
import ChartAuto from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
//import Select, { SelectChangeEvent } from '@mui/material/Select';
/* import {
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
); */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DIRECTWEARINFO, RAILROADSECTION, RANGEPICKERSTYLE } from "../../constant";
import { Checkbox, DatePicker, Input, Radio, Select } from "antd";
import { Modal } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: "5px",
  //p: 4,
  padding : "5px",
  fontFamily : 'NEO_R'
};

const data1 = [
  {"kp":12.05325,"left":-0.72,"right":-1.93,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.111,"value2":2.757,"value3":2.033,"value4":2.08,"value5":2.518},
  {"kp":12.0535,"left":-1.17,"right":-2.15,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.908,"value2":1.933,"value3":0.043,"value4":1.337,"value5":2.168},
  {"kp":12.05375,"left":-1.61,"right":-2.32,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.65,"value2":2.572,"value3":0.445,"value4":1.947,"value5":2.778},
  {"kp":12.054,"left":-2.01,"right":-2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.595,"value2":1.988,"value3":1.643,"value4":1.413,"value5":0.525},
  {"kp":12.05425,"left":-2.35,"right":-2.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.761,"value2":0.286,"value3":0.324,"value4":1.286,"value5":1.08},
  {"kp":12.0545,"left":-2.57,"right":-2.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.961,"value2":2.618,"value3":0.029,"value4":2.356,"value5":0.504},
  {"kp":12.05475,"left":-2.66,"right":-2.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.542,"value2":2.835,"value3":1.249,"value4":1.267,"value5":2.742},
  {"kp":12.055,"left":-2.6,"right":-2.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.326,"value2":0.15,"value3":1.19,"value4":1.469,"value5":1.644},
  {"kp":12.05525,"left":-2.44,"right":-1.9,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.441,"value2":1.592,"value3":2.103,"value4":2.767,"value5":2.684},
  {"kp":12.0555,"left":-2.25,"right":-1.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.862,"value2":2.945,"value3":1.117,"value4":2.266,"value5":0.896},
  {"kp":12.05575,"left":-2.08,"right":-1.51,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.981,"value2":1.669,"value3":1.565,"value4":1.003,"value5":1.442},
  {"kp":12.056,"left":-2,"right":-1.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.583,"value2":0.141,"value3":0.525,"value4":1.943,"value5":0.64},
  {"kp":12.05625,"left":-1.98,"right":-1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.775,"value2":1.19,"value3":2.765,"value4":1.5,"value5":2.4},
  {"kp":12.0565,"left":-1.97,"right":-0.91,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.142,"value2":0.241,"value3":1.159,"value4":2.511,"value5":0.133},
  {"kp":12.05675,"left":-1.92,"right":-0.62,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.583,"value2":1.917,"value3":1.315,"value4":0.943,"value5":2.182},
  {"kp":12.057,"left":-1.79,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.009,"value2":0.554,"value3":0.684,"value4":1.261,"value5":0.56},
  {"kp":12.05725,"left":-1.56,"right":0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.794,"value2":2.97,"value3":1.592,"value4":2.917,"value5":2.035},
  {"kp":12.0575,"left":-1.24,"right":0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.701,"value2":1.674,"value3":1.872,"value4":1.179,"value5":0.654},
  {"kp":12.05775,"left":-0.86,"right":0.94,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.131,"value2":1.189,"value3":2.792,"value4":1.402,"value5":0.225},
  {"kp":12.058,"left":-0.44,"right":1.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.995,"value2":0.815,"value3":0.884,"value4":1.717,"value5":2.451},
  {"kp":12.05825,"left":-0.01,"right":1.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.731,"value2":1.681,"value3":2.666,"value4":0.097,"value5":2.666},
  {"kp":12.0585,"left":0.39,"right":1.75,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.152,"value2":1.865,"value3":0.225,"value4":1.303,"value5":0.609},
  {"kp":12.05875,"left":0.73,"right":1.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.637,"value2":0.954,"value3":0.284,"value4":1.305,"value5":0.381},
  {"kp":12.059,"left":1,"right":1.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.542,"value2":2.835,"value3":1.688,"value4":2.061,"value5":1.619},
  {"kp":12.05925,"left":1.17,"right":1.83,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.239,"value2":1.951,"value3":0.659,"value4":2.073,"value5":0.123},
  {"kp":12.0595,"left":1.26,"right":1.75,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.723,"value2":0.496,"value3":1.249,"value4":0.858,"value5":1.96},
  {"kp":12.05975,"left":1.28,"right":1.64,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.744,"value2":0.29,"value3":2.258,"value4":0.649,"value5":1.15},
  {"kp":12.06,"left":1.23,"right":1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.04,"value2":1.534,"value3":2.71,"value4":2.722,"value5":0.302},
  {"kp":12.06025,"left":1.15,"right":1.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.655,"value2":0.782,"value3":2,"value4":1.518,"value5":0.8},
  {"kp":12.0605,"left":1.07,"right":1.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.311,"value2":0.547,"value3":1.775,"value4":1.146,"value5":2.451},
  {"kp":12.06075,"left":1.01,"right":1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.798,"value2":0.739,"value3":0.293,"value4":1.013,"value5":2.451},
  {"kp":12.061,"left":0.98,"right":1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.681,"value2":0.212,"value3":2.389,"value4":0.359,"value5":2.801},
  {"kp":12.06125,"left":0.95,"right":0.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.406,"value2":2.408,"value3":2.234,"value4":0.035,"value5":1.923},
  {"kp":12.0615,"left":0.91,"right":0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.851,"value2":1.084,"value3":2.17,"value4":1.549,"value5":2.981},
  {"kp":12.06175,"left":0.82,"right":0.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.819,"value2":1.677,"value3":1.13,"value4":1.166,"value5":0.477},
  {"kp":12.062,"left":0.69,"right":0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.172,"value2":0.661,"value3":0.37,"value4":1.834,"value5":2.655},
  {"kp":12.06225,"left":0.55,"right":-0.25,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.642,"value2":1.869,"value3":1.887,"value4":2.214,"value5":0.661},
  {"kp":12.0625,"left":0.43,"right":-0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.678,"value2":2.442,"value3":0.148,"value4":0.273,"value5":0.334},
  {"kp":12.06275,"left":0.33,"right":-0.8,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.247,"value2":2.356,"value3":2.464,"value4":0.45,"value5":0.654},
  {"kp":12.063,"left":0.26,"right":-0.98,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.894,"value2":1.385,"value3":1.311,"value4":2.171,"value5":0.96},
  {"kp":12.06325,"left":0.23,"right":-1.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.619,"value2":1.334,"value3":2.647,"value4":2.32,"value5":0.727},
  {"kp":12.0635,"left":0.23,"right":-1.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.473,"value2":1.314,"value3":2.986,"value4":0.789,"value5":2.718},
  {"kp":12.06375,"left":0.23,"right":-1,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.278,"value2":1.584,"value3":2.128,"value4":0.315,"value5":1.799},
  {"kp":12.064,"left":0.22,"right":-0.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.678,"value2":0.807,"value3":1.753,"value4":2.824,"value5":1.935},
  {"kp":12.06425,"left":0.16,"right":-0.71,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.639,"value2":1.279,"value3":2.816,"value4":0.521,"value5":1.172},
  {"kp":12.0645,"left":0.04,"right":-0.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.207,"value2":2.254,"value3":1.927,"value4":1.358,"value5":0.209},
  {"kp":12.06475,"left":-0.11,"right":-0.43,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.305,"value2":2.594,"value3":2.964,"value4":0.668,"value5":2.736},
  {"kp":12.065,"left":-0.25,"right":-0.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.698,"value2":0.044,"value3":1.733,"value4":0.798,"value5":0.114},
  {"kp":12.06525,"left":-0.34,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.371,"value2":2.97,"value3":1.764,"value4":0.807,"value5":2.974},
  {"kp":12.0655,"left":-0.33,"right":-0.2,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.046,"value2":0.658,"value3":2.627,"value4":1.572,"value5":0.688},
  {"kp":12.06575,"left":-0.2,"right":-0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.214,"value2":1.133,"value3":2.142,"value4":0.196,"value5":0.471},
  {"kp":12.066,"left":0.01,"right":-0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.553,"value2":1.851,"value3":1.032,"value4":2.228,"value5":1.001},
  {"kp":12.06625,"left":0.27,"right":0.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.494,"value2":0.15,"value3":1.16,"value4":2.158,"value5":2.237},
  {"kp":12.0665,"left":0.5,"right":0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.614,"value2":1.364,"value3":1.086,"value4":0.46,"value5":2.247},
  {"kp":12.06675,"left":0.66,"right":0.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.48,"value2":0.135,"value3":0.92,"value4":1.191,"value5":1.712},
  {"kp":12.067,"left":0.7,"right":0.49,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.706,"value2":0.341,"value3":0.18,"value4":1.074,"value5":0.334},
  {"kp":12.06725,"left":0.63,"right":0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.462,"value2":1.288,"value3":1.113,"value4":0.365,"value5":1.77},
  {"kp":12.0675,"left":0.47,"right":0.76,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.249,"value2":2.614,"value3":1.84,"value4":2.853,"value5":0.746},
  {"kp":12.06775,"left":0.28,"right":0.78,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.126,"value2":0.329,"value3":1.889,"value4":0.208,"value5":2.654},
  {"kp":12.068,"left":0.09,"right":0.7,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.246,"value2":0.072,"value3":1.525,"value4":1.328,"value5":2.537},
  {"kp":12.06825,"left":-0.04,"right":0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.207,"value2":2.309,"value3":2.798,"value4":1.517,"value5":1.801},
  {"kp":12.0685,"left":-0.1,"right":0.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.795,"value2":0.388,"value3":2.335,"value4":0.817,"value5":0.942},
  {"kp":12.06875,"left":-0.1,"right":0.04,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.259,"value2":2.752,"value3":2.198,"value4":0.708,"value5":0.23},
  {"kp":12.069,"left":-0.05,"right":-0.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.243,"value2":0.586,"value3":2.912,"value4":1.484,"value5":0.314},
  {"kp":12.06925,"left":0.03,"right":-0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.805,"value2":0.584,"value3":1.846,"value4":1.985,"value5":0.674},
  {"kp":12.0695,"left":0.12,"right":-0.58,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.544,"value2":0.626,"value3":1.489,"value4":0.119,"value5":2.341},
  {"kp":12.06975,"left":0.19,"right":-0.7,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.067,"value2":1.445,"value3":2.774,"value4":0.626,"value5":0.468},
  {"kp":12.07,"left":0.24,"right":-0.79,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.251,"value2":0.505,"value3":1.456,"value4":1.346,"value5":0.855},
  {"kp":12.07025,"left":0.24,"right":-0.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.442,"value2":0.654,"value3":2.133,"value4":0.638,"value5":2.727},
  {"kp":12.0705,"left":0.21,"right":-0.91,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.176,"value2":2.852,"value3":0.948,"value4":0.14,"value5":1.277},
  {"kp":12.07075,"left":0.15,"right":-0.95,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.919,"value2":1.659,"value3":0.374,"value4":1.535,"value5":2.174},
  {"kp":12.071,"left":0.07,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.748,"value2":2.408,"value3":1.602,"value4":0.006,"value5":1.742},
  {"kp":12.07125,"left":-0.01,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.077,"value2":1.214,"value3":0.644,"value4":2.841,"value5":1.241},
  {"kp":12.0715,"left":-0.08,"right":-0.98,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.301,"value2":0.934,"value3":0.913,"value4":0.71,"value5":0.695},
  {"kp":12.07175,"left":-0.13,"right":-1,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.79,"value2":0.263,"value3":1.8,"value4":2.885,"value5":0.393},
  {"kp":12.072,"left":-0.16,"right":-1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.186,"value2":2.486,"value3":0.327,"value4":1.447,"value5":1.571},
  {"kp":12.07225,"left":-0.19,"right":-1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.789,"value2":2.577,"value3":1.437,"value4":2.372,"value5":2.847},
  {"kp":12.0725,"left":-0.22,"right":-0.96,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.999,"value2":1.241,"value3":1.241,"value4":2.379,"value5":1.4},
  {"kp":12.07275,"left":-0.27,"right":-0.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.784,"value2":1.458,"value3":0.475,"value4":1.18,"value5":1.801},
  {"kp":12.073,"left":-0.34,"right":-0.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.314,"value2":0.332,"value3":2.277,"value4":2.395,"value5":0.672},
  {"kp":12.07325,"left":-0.44,"right":-0.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.416,"value2":1.119,"value3":0.515,"value4":2.804,"value5":2.397},
  {"kp":12.0735,"left":-0.54,"right":0.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.696,"value2":0.132,"value3":2.169,"value4":1.67,"value5":1.872},
  {"kp":12.07375,"left":-0.59,"right":0.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.927,"value2":2.081,"value3":0.553,"value4":0.171,"value5":1.343},
  {"kp":12.074,"left":-0.56,"right":0.7,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.295,"value2":1.572,"value3":0.051,"value4":1.761,"value5":2.697},
  {"kp":12.07425,"left":-0.43,"right":0.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.47,"value2":1.269,"value3":0.24,"value4":1.802,"value5":0.05},
  {"kp":12.0745,"left":-0.21,"right":0.96,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.628,"value2":0.289,"value3":2.57,"value4":2.502,"value5":1.281},
  {"kp":12.07475,"left":0.05,"right":1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.922,"value2":0.461,"value3":1.427,"value4":2.926,"value5":0.25},
  {"kp":12.075,"left":0.3,"right":1.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.894,"value2":2.496,"value3":1.807,"value4":1.189,"value5":2.62},
  {"kp":12.07525,"left":0.48,"right":1.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.035,"value2":2.77,"value3":2.06,"value4":0.672,"value5":0.237},
  {"kp":12.0755,"left":0.55,"right":1.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.17,"value2":0.9,"value3":1.45,"value4":0.693,"value5":0.898},
  {"kp":12.07575,"left":0.54,"right":1.32,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.352,"value2":2.821,"value3":1.176,"value4":0.206,"value5":0.289},
  {"kp":12.076,"left":0.46,"right":1.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.855,"value2":2.967,"value3":0.828,"value4":1.095,"value5":1.051},
  {"kp":12.07625,"left":0.37,"right":1.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.318,"value2":0.933,"value3":1.855,"value4":2.465,"value5":2.882},
  {"kp":12.0765,"left":0.3,"right":1.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.537,"value2":1.311,"value3":1.579,"value4":1.411,"value5":1.827},
  {"kp":12.07675,"left":0.28,"right":1.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.436,"value2":0.754,"value3":2.475,"value4":2.773,"value5":1.16},
  {"kp":12.077,"left":0.32,"right":1.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.479,"value2":0.297,"value3":1.324,"value4":1.486,"value5":2.643},
  {"kp":12.07725,"left":0.38,"right":0.88,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.342,"value2":2.849,"value3":0.019,"value4":2.235,"value5":2.116},
  {"kp":12.0775,"left":0.43,"right":0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.231,"value2":2.493,"value3":2.317,"value4":0.717,"value5":0.66},
  {"kp":12.07775,"left":0.43,"right":0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.99,"value2":2.032,"value3":2.805,"value4":2.783,"value5":2.613},
  {"kp":12.078,"left":0.36,"right":0.32,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.636,"value2":0.674,"value3":0.267,"value4":0.847,"value5":0.18},
  {"kp":12.07825,"left":0.22,"right":0.05,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.822,"value2":2,"value3":0.778,"value4":0.596,"value5":1.529},
  {"kp":12.0785,"left":0.01,"right":-0.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.84,"value2":0.667,"value3":0.509,"value4":2.947,"value5":1.462},
  {"kp":12.07875,"left":-0.24,"right":-0.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.47,"value2":0.467,"value3":1.552,"value4":1.77,"value5":1.846},
  {"kp":12.079,"left":-0.51,"right":-0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.243,"value2":0.063,"value3":1.08,"value4":2.019,"value5":1.566},
  {"kp":12.07925,"left":-0.79,"right":-0.84,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.693,"value2":2.998,"value3":2.76,"value4":0.764,"value5":2.151},
  {"kp":12.0795,"left":-1.05,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.778,"value2":2.422,"value3":2.24,"value4":2.831,"value5":2.856},
  {"kp":12.07975,"left":-1.26,"right":-1.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.845,"value2":2.406,"value3":2.652,"value4":1.188,"value5":0.458},
  {"kp":12.08,"left":-1.43,"right":-1.19,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.382,"value2":1.33,"value3":0.431,"value4":0.721,"value5":1.757},
  {"kp":12.08025,"left":-1.54,"right":-1.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.864,"value2":1.47,"value3":1.722,"value4":0.615,"value5":2.479},
  {"kp":12.0805,"left":-1.62,"right":-1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.731,"value2":0.971,"value3":2.393,"value4":0.347,"value5":1.37},
  {"kp":12.08075,"left":-1.68,"right":-1.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.075,"value2":2.926,"value3":1.699,"value4":1.591,"value5":1.153},
  {"kp":12.081,"left":-1.75,"right":-1.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.047,"value2":1.291,"value3":2.562,"value4":0.163,"value5":1.396},
  {"kp":12.08125,"left":-1.82,"right":-1.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.712,"value2":0.848,"value3":1.044,"value4":0.926,"value5":1.332},
  {"kp":12.0815,"left":-1.88,"right":-1.27,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.903,"value2":0.078,"value3":1.853,"value4":0.264,"value5":2.193},
  {"kp":12.08175,"left":-1.91,"right":-1.1,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.503,"value2":0.977,"value3":1.366,"value4":1.156,"value5":1.581},
  {"kp":12.082,"left":-1.87,"right":-0.92,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.274,"value2":0.03,"value3":1.587,"value4":1.307,"value5":0.343},
  {"kp":12.08225,"left":-1.74,"right":-0.74,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.88,"value2":1.3,"value3":2.595,"value4":2.994,"value5":2.052},
  {"kp":12.0825,"left":-1.5,"right":-0.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.322,"value2":1.741,"value3":1.943,"value4":1.238,"value5":2.413},
  {"kp":12.08275,"left":-1.15,"right":-0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.257,"value2":0.025,"value3":0.836,"value4":1.542,"value5":0.845},
  {"kp":12.083,"left":-0.72,"right":-0.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.447,"value2":2.763,"value3":1.991,"value4":1.09,"value5":1.71},
  {"kp":12.08325,"left":-0.26,"right":0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.178,"value2":1.63,"value3":0.32,"value4":0.478,"value5":0.285},
  {"kp":12.0835,"left":0.18,"right":0.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.44,"value2":2.459,"value3":1.951,"value4":2.801,"value5":2.308},
  {"kp":12.08375,"left":0.54,"right":0.58,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.448,"value2":2.027,"value3":2.132,"value4":2.124,"value5":2.391},
  {"kp":12.084,"left":0.8,"right":0.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.425,"value2":1.479,"value3":2.187,"value4":0.416,"value5":1.791},
  {"kp":12.08425,"left":0.97,"right":0.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.2,"value2":0.552,"value3":0.537,"value4":1.567,"value5":1.632},
  {"kp":12.0845,"left":1.1,"right":1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.21,"value2":1.331,"value3":0.551,"value4":0.89,"value5":2.521},
  {"kp":12.08475,"left":1.21,"right":1.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.339,"value2":2.714,"value3":2.542,"value4":1.732,"value5":1.912},
  {"kp":12.085,"left":1.35,"right":1.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.081,"value2":0.757,"value3":1.225,"value4":1.856,"value5":1.492},
  {"kp":12.08525,"left":1.54,"right":1.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.381,"value2":0.346,"value3":2.933,"value4":0.777,"value5":2.05},
  {"kp":12.0855,"left":1.76,"right":1.49,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.338,"value2":2.873,"value3":1.725,"value4":0.419,"value5":0.183},
  {"kp":12.08575,"left":2,"right":1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.936,"value2":1.687,"value3":0.557,"value4":0.883,"value5":1.092},
  {"kp":12.086,"left":2.21,"right":1.5,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.426,"value2":2.412,"value3":0.927,"value4":1.891,"value5":2.988},
  {"kp":12.08625,"left":2.33,"right":1.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.398,"value2":2.819,"value3":2.245,"value4":0.762,"value5":2.639},
  {"kp":12.0865,"left":2.34,"right":1.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.632,"value2":1.994,"value3":1.01,"value4":1.768,"value5":0.353},
  {"kp":12.08675,"left":2.21,"right":1.18,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.897,"value2":0.245,"value3":2.22,"value4":1.884,"value5":2.987},
  {"kp":12.087,"left":1.96,"right":1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.433,"value2":0.705,"value3":0.704,"value4":0.963,"value5":1.297},
  {"kp":12.08725,"left":1.62,"right":0.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.913,"value2":0.108,"value3":0.96,"value4":2.8,"value5":1.379},
  {"kp":12.0875,"left":1.26,"right":0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.562,"value2":2.378,"value3":0.191,"value4":2.44,"value5":2.181},
  {"kp":12.08775,"left":0.91,"right":0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.475,"value2":0.715,"value3":2.079,"value4":1.966,"value5":2.658},
  {"kp":12.088,"left":0.61,"right":0.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.78,"value2":2.146,"value3":0.592,"value4":2.261,"value5":2.437},
  {"kp":12.08825,"left":0.38,"right":0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.092,"value2":1.184,"value3":2.096,"value4":0.538,"value5":0.061},
  {"kp":12.0885,"left":0.22,"right":-0.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.955,"value2":2.842,"value3":1.205,"value4":1.354,"value5":0.296},
  {"kp":12.08875,"left":0.13,"right":-0.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.965,"value2":2.97,"value3":1.65,"value4":2.903,"value5":2.179},
  {"kp":12.089,"left":0.07,"right":-0.43,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.965,"value2":1.864,"value3":0.567,"value4":1.106,"value5":1.866},
  {"kp":12.08925,"left":-0.01,"right":-0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.192,"value2":2.007,"value3":0.637,"value4":1.694,"value5":1.293},
  {"kp":12.0895,"left":-0.12,"right":-0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.08,"value2":0.954,"value3":0.684,"value4":1.216,"value5":0.618},
  {"kp":12.08975,"left":-0.28,"right":-0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.669,"value2":0.49,"value3":2.261,"value4":0.641,"value5":2.726},
  {"kp":12.09,"left":-0.46,"right":-0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.076,"value2":2.873,"value3":0.623,"value4":0.327,"value5":2.425},
  {"kp":12.09025,"left":-0.64,"right":-0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.096,"value2":1.489,"value3":2.359,"value4":1.168,"value5":1.347},
  {"kp":12.0905,"left":-0.77,"right":-0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.057,"value2":1.489,"value3":0.101,"value4":2.352,"value5":0.937},
  {"kp":12.09075,"left":-0.82,"right":-0.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.955,"value2":2.333,"value3":0.59,"value4":2.829,"value5":0.189},
  {"kp":12.091,"left":-0.75,"right":-0.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.653,"value2":2.141,"value3":2.754,"value4":0.642,"value5":0.664},
  {"kp":12.09125,"left":-0.57,"right":-0.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.237,"value2":0.782,"value3":1.441,"value4":1.405,"value5":2.257},
  {"kp":12.0915,"left":-0.26,"right":-0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.403,"value2":1.938,"value3":2.891,"value4":1.732,"value5":2.258},
  {"kp":12.09175,"left":0.13,"right":-0.59,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.754,"value2":2.751,"value3":0.12,"value4":2.53,"value5":0.807},
  {"kp":12.092,"left":0.58,"right":-0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.268,"value2":0.372,"value3":2.753,"value4":1.848,"value5":0.216},
  {"kp":12.09225,"left":0.99,"right":-0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.635,"value2":2.472,"value3":0.9,"value4":1.145,"value5":1.447},
  {"kp":12.0925,"left":1.3,"right":-0.72,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.062,"value2":1.737,"value3":1.648,"value4":1.447,"value5":0.346},
  {"kp":12.09275,"left":1.47,"right":-0.74,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.226,"value2":0.982,"value3":2.997,"value4":2.513,"value5":1.901},
  {"kp":12.093,"left":1.49,"right":-0.72,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.002,"value2":1.353,"value3":1.898,"value4":2.902,"value5":1.587},
  {"kp":12.09325,"left":1.41,"right":-0.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.378,"value2":1.067,"value3":0.823,"value4":0.2,"value5":0.702},
  {"kp":12.0935,"left":1.26,"right":-0.61,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.378,"value2":0.35,"value3":1.386,"value4":2.461,"value5":1.98},
  {"kp":12.09375,"left":1.09,"right":-0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.622,"value2":2.272,"value3":0.58,"value4":0.507,"value5":0.23},
  {"kp":12.094,"left":0.94,"right":-0.43,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.252,"value2":2.633,"value3":0.002,"value4":2.5,"value5":2.76},
  {"kp":12.09425,"left":0.83,"right":-0.38,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.695,"value2":0.951,"value3":2.688,"value4":2.035,"value5":0.234},
  {"kp":12.0945,"left":0.74,"right":-0.35,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.939,"value2":1.591,"value3":0.811,"value4":2.861,"value5":2.647},
  {"kp":12.09475,"left":0.66,"right":-0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.488,"value2":1.562,"value3":2.951,"value4":2.322,"value5":0.781},
  {"kp":12.095,"left":0.55,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.742,"value2":0.096,"value3":0.629,"value4":0.317,"value5":2.537},
  {"kp":12.09525,"left":0.39,"right":-0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.357,"value2":1.018,"value3":2.394,"value4":2.023,"value5":2.303},
  {"kp":12.0955,"left":0.15,"right":-0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.915,"value2":2.199,"value3":2.093,"value4":2.25,"value5":1.712},
  {"kp":12.09575,"left":-0.16,"right":-0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.862,"value2":0.697,"value3":1.619,"value4":2.272,"value5":0.844},
  {"kp":12.096,"left":-0.51,"right":-0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.817,"value2":0.43,"value3":0.66,"value4":1.346,"value5":0.072},
  {"kp":12.09625,"left":-0.88,"right":-0.35,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.112,"value2":2.922,"value3":2.066,"value4":0.567,"value5":0.204},
  {"kp":12.0965,"left":-1.27,"right":-0.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.98,"value2":1.727,"value3":0.918,"value4":0.9,"value5":0.375},
  {"kp":12.09675,"left":-1.67,"right":0.04,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.792,"value2":0.69,"value3":0.947,"value4":1.695,"value5":1.359},
  {"kp":12.097,"left":-2.04,"right":0.24,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.761,"value2":2.647,"value3":1.611,"value4":1.281,"value5":2.999},
  {"kp":12.09725,"left":-2.36,"right":0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.632,"value2":1.957,"value3":0.631,"value4":1.66,"value5":0.35},
  {"kp":12.0975,"left":-2.56,"right":0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.675,"value2":1.347,"value3":1.874,"value4":2.056,"value5":0.237},
  {"kp":12.09775,"left":-2.62,"right":0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.655,"value2":1.698,"value3":2.158,"value4":2.334,"value5":2.08},
  {"kp":12.098,"left":-2.53,"right":0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.871,"value2":0.231,"value3":1.873,"value4":0.361,"value5":2.193},
  {"kp":12.09825,"left":-2.32,"right":0.75,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.695,"value2":2.213,"value3":1.942,"value4":1.222,"value5":2.871},
  {"kp":12.0985,"left":-2.03,"right":0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.389,"value2":2.512,"value3":0.901,"value4":1.119,"value5":0.648},
  {"kp":12.09875,"left":-1.71,"right":0.66,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.941,"value2":1.271,"value3":2.56,"value4":2.889,"value5":0.924},
  {"kp":12.099,"left":-1.38,"right":0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.422,"value2":0.569,"value3":2.534,"value4":1.428,"value5":2.168},
  {"kp":12.09925,"left":-1.07,"right":0.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.022,"value2":1.942,"value3":0.304,"value4":0.547,"value5":1.799},
  {"kp":12.0995,"left":-0.81,"right":0.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.947,"value2":1.634,"value3":0.339,"value4":2.168,"value5":2.691},
  {"kp":12.09975,"left":-0.59,"right":0.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.688,"value2":0.603,"value3":0.962,"value4":0.573,"value5":2.849},
  {"kp":12.1,"left":-0.42,"right":0.2,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.91,"value2":2.274,"value3":1.006,"value4":1.026,"value5":1.718},
  {"kp":12.10025,"left":-0.27,"right":0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.3,"value2":0.495,"value3":1.953,"value4":1.956,"value5":0.611},
  {"kp":12.1005,"left":-0.13,"right":0.1,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.871,"value2":2.393,"value3":1.748,"value4":2.918,"value5":0.279},
  {"kp":12.10075,"left":0.03,"right":0.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.807,"value2":2.424,"value3":0.806,"value4":1.766,"value5":1.706},
  {"kp":12.101,"left":0.21,"right":0.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.363,"value2":2.397,"value3":2.603,"value4":2.628,"value5":1.463},
  {"kp":12.10125,"left":0.39,"right":-0.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.445,"value2":0.476,"value3":0.95,"value4":1.655,"value5":2.569},
  {"kp":12.1015,"left":0.57,"right":-0.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.518,"value2":1.401,"value3":0.638,"value4":1.568,"value5":0.443},
  {"kp":12.10175,"left":0.74,"right":-0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.816,"value2":2.612,"value3":0.674,"value4":2.066,"value5":0.752},
  {"kp":12.102,"left":0.88,"right":-0.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.689,"value2":2.54,"value3":2.584,"value4":1.137,"value5":0.417},
  {"kp":12.10225,"left":0.96,"right":-0.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.82,"value2":2.15,"value3":1.826,"value4":2.361,"value5":1.34},
  {"kp":12.1025,"left":0.96,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.899,"value2":2.595,"value3":1.269,"value4":0.078,"value5":1.045},
  {"kp":12.10275,"left":0.86,"right":-0.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.663,"value2":1.644,"value3":1.484,"value4":1.566,"value5":1.124},
  {"kp":12.103,"left":0.66,"right":-0.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.721,"value2":2.627,"value3":2.153,"value4":2.294,"value5":0.369},
  {"kp":12.10325,"left":0.41,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.55,"value2":0.583,"value3":1.697,"value4":0.438,"value5":2.547},
  {"kp":12.1035,"left":0.12,"right":-0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.557,"value2":2.264,"value3":0.596,"value4":2.061,"value5":0.442},
  {"kp":12.10375,"left":-0.14,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.716,"value2":2.806,"value3":2.615,"value4":0.451,"value5":0.1},
  {"kp":12.104,"left":-0.37,"right":-0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.955,"value2":0.125,"value3":1.507,"value4":1.767,"value5":2.113},
  {"kp":12.10425,"left":-0.53,"right":-0.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.318,"value2":0.592,"value3":2.683,"value4":1.863,"value5":2.951},
  {"kp":12.1045,"left":-0.63,"right":-0.22,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.027,"value2":2.886,"value3":2.21,"value4":0.257,"value5":1.038},
  {"kp":12.10475,"left":-0.67,"right":-0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.185,"value2":1.615,"value3":2.576,"value4":1.338,"value5":2.787},
  {"kp":12.105,"left":-0.68,"right":-0.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.532,"value2":0.131,"value3":2.466,"value4":2.787,"value5":1.472},
  {"kp":12.10525,"left":-0.68,"right":0.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.51,"value2":2.899,"value3":1.467,"value4":2.502,"value5":2.903},
  {"kp":12.1055,"left":-0.7,"right":0.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.683,"value2":2.795,"value3":2.38,"value4":2.599,"value5":2.109},
  {"kp":12.10575,"left":-0.75,"right":0.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.384,"value2":2.195,"value3":0.059,"value4":2.352,"value5":1.511},
  {"kp":12.106,"left":-0.81,"right":0.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.656,"value2":2.255,"value3":2.766,"value4":2.565,"value5":0.865},
  {"kp":12.10625,"left":-0.87,"right":0.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.196,"value2":2.263,"value3":2.437,"value4":1.527,"value5":2.07},
  {"kp":12.1065,"left":-0.9,"right":0.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.047,"value2":1.269,"value3":0.401,"value4":2.447,"value5":1.584},
  {"kp":12.10675,"left":-0.88,"right":0.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.394,"value2":0.879,"value3":1.074,"value4":1.076,"value5":2.694},
  {"kp":12.107,"left":-0.81,"right":0,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.658,"value2":0.117,"value3":1.99,"value4":2.724,"value5":0.799},
  {"kp":12.10725,"left":-0.69,"right":0.04,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.371,"value2":2.295,"value3":0.967,"value4":1.46,"value5":0.163},
  {"kp":12.1075,"left":-0.52,"right":0.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.074,"value2":1.483,"value3":1.54,"value4":0.618,"value5":2.625},
  {"kp":12.10775,"left":-0.33,"right":0.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.261,"value2":2.287,"value3":2.99,"value4":2.491,"value5":0.27},
  {"kp":12.108,"left":-0.13,"right":0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.124,"value2":1.671,"value3":0.388,"value4":2.862,"value5":0.267},
  {"kp":12.10825,"left":0.06,"right":0.5,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.356,"value2":1.791,"value3":1.54,"value4":0.604,"value5":1.453},
  {"kp":12.1085,"left":0.22,"right":0.61,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.563,"value2":1.22,"value3":0.027,"value4":2.147,"value5":0.491},
  {"kp":12.10875,"left":0.37,"right":0.67,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.778,"value2":2.134,"value3":0.071,"value4":2.7,"value5":1.119},
  {"kp":12.109,"left":0.49,"right":0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.009,"value2":0.339,"value3":0.599,"value4":2.656,"value5":0.781},
  {"kp":12.10925,"left":0.62,"right":0.67,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.182,"value2":2.544,"value3":1.803,"value4":2.48,"value5":1.468},
  {"kp":12.1095,"left":0.77,"right":0.61,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.682,"value2":0.324,"value3":2.652,"value4":2.918,"value5":1.555},
  {"kp":12.10975,"left":0.93,"right":0.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.244,"value2":0.832,"value3":0.786,"value4":1.44,"value5":1.936},
  {"kp":12.11,"left":1.12,"right":0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.479,"value2":0.527,"value3":1.897,"value4":2.303,"value5":1.988},
  {"kp":12.11025,"left":1.32,"right":0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.527,"value2":1.968,"value3":0.167,"value4":0.853,"value5":1.473},
  {"kp":12.1105,"left":1.51,"right":0.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.167,"value2":0.158,"value3":0.486,"value4":2.968,"value5":1.818},
  {"kp":12.11075,"left":1.66,"right":0.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.849,"value2":2.309,"value3":1.317,"value4":0.447,"value5":2.506},
  {"kp":12.111,"left":1.73,"right":0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.218,"value2":0.587,"value3":1.396,"value4":1.272,"value5":2.418},
  {"kp":12.11125,"left":1.7,"right":0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.707,"value2":1.548,"value3":0.085,"value4":0.295,"value5":2.489},
  {"kp":12.1115,"left":1.58,"right":0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.675,"value2":1.051,"value3":2.649,"value4":0.864,"value5":0.928},
  {"kp":12.11175,"left":1.41,"right":0.27,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.632,"value2":0.631,"value3":0.057,"value4":1.48,"value5":1.439},
  {"kp":12.112,"left":1.21,"right":0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.889,"value2":2.792,"value3":2.268,"value4":1.586,"value5":1.545},
  {"kp":12.11225,"left":1.03,"right":-0.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.265,"value2":2.148,"value3":1.758,"value4":2.797,"value5":1.291},
  {"kp":12.1125,"left":0.87,"right":-0.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.996,"value2":0.414,"value3":1.738,"value4":0.979,"value5":1.944},
  {"kp":12.11275,"left":0.74,"right":-0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.072,"value2":2.041,"value3":0.795,"value4":2.473,"value5":2.276},
  {"kp":12.113,"left":0.63,"right":-0.95,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.089,"value2":0.776,"value3":2.186,"value4":2.071,"value5":1.752},
  {"kp":12.11325,"left":0.51,"right":-1.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.278,"value2":1.811,"value3":1.989,"value4":1.533,"value5":0.466},
  {"kp":12.1135,"left":0.37,"right":-1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.717,"value2":0.061,"value3":2.253,"value4":2.783,"value5":1.658},
  {"kp":12.11375,"left":0.19,"right":-1.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.465,"value2":0.821,"value3":1.675,"value4":0.86,"value5":2.089},
  {"kp":12.114,"left":-0.03,"right":-1.59,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.793,"value2":0.966,"value3":0.295,"value4":1.694,"value5":0.968},
  {"kp":12.11425,"left":-0.29,"right":-1.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.327,"value2":1.375,"value3":1.79,"value4":2.321,"value5":1.475},
  {"kp":12.1145,"left":-0.55,"right":-1.51,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.878,"value2":0.614,"value3":0.134,"value4":1.525,"value5":2.118},
  {"kp":12.11475,"left":-0.78,"right":-1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.52,"value2":1.33,"value3":0.761,"value4":2.428,"value5":2.049},
  {"kp":12.115,"left":-0.93,"right":-1.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.881,"value2":2.392,"value3":2.559,"value4":1.214,"value5":0.17},
  {"kp":12.11525,"left":-0.99,"right":-1.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.837,"value2":2.345,"value3":1.543,"value4":0.451,"value5":0.75},
  {"kp":12.1155,"left":-0.96,"right":-1.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.622,"value2":1.037,"value3":1.76,"value4":0.482,"value5":0.466},
  {"kp":12.11575,"left":-0.83,"right":-1.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.885,"value2":1.632,"value3":2.085,"value4":1.303,"value5":0.343},
  {"kp":12.116,"left":-0.6,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.157,"value2":1.887,"value3":0.805,"value4":1.368,"value5":1.689},
  {"kp":12.11625,"left":-0.27,"right":-0.83,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.107,"value2":2.073,"value3":0.174,"value4":1.081,"value5":0.515},
  {"kp":12.1165,"left":0.14,"right":-0.6,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.724,"value2":2.884,"value3":0.387,"value4":0.844,"value5":1.069},
  {"kp":12.11675,"left":0.63,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.481,"value2":1.417,"value3":2.998,"value4":2.45,"value5":0.735},
  {"kp":12.117,"left":1.16,"right":0.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.168,"value2":2.621,"value3":0.715,"value4":0.926,"value5":1.518},
  {"kp":12.11725,"left":1.67,"right":0.64,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.656,"value2":1.374,"value3":2.093,"value4":1.887,"value5":2.312},
  {"kp":12.1175,"left":2.11,"right":1.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.156,"value2":0.901,"value3":2.961,"value4":2.901,"value5":2.135},
  {"kp":12.11775,"left":2.43,"right":1.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.681,"value2":2.659,"value3":2.01,"value4":0.384,"value5":2.708},
  {"kp":12.118,"left":2.63,"right":1.88,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.331,"value2":2.539,"value3":0.803,"value4":0.384,"value5":0.279},
  {"kp":12.11825,"left":2.71,"right":2.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.119,"value2":0.883,"value3":0.621,"value4":0.748,"value5":0.203},
  {"kp":12.1185,"left":2.72,"right":2.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.613,"value2":0.224,"value3":1.21,"value4":0.339,"value5":0.331},
  {"kp":12.11875,"left":2.69,"right":2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.728,"value2":1.817,"value3":2.044,"value4":0.564,"value5":1.656},
  {"kp":12.119,"left":2.63,"right":2.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.567,"value2":2.97,"value3":0.666,"value4":2.302,"value5":0.103},
  {"kp":12.11925,"left":2.52,"right":2.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.806,"value2":0.641,"value3":2.449,"value4":2.783,"value5":0.061},
  {"kp":12.1195,"left":2.33,"right":2.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.195,"value2":1.542,"value3":1.55,"value4":1.547,"value5":1.993},
  {"kp":12.11975,"left":2.03,"right":2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.147,"value2":0.558,"value3":2.062,"value4":0.819,"value5":0.118},
  {"kp":12.12,"left":1.61,"right":2.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.779,"value2":1.793,"value3":1.473,"value4":0.755,"value5":1.565},
  {"kp":12.12025,"left":1.1,"right":2.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.502,"value2":0.331,"value3":0.684,"value4":0.295,"value5":1.451},
  {"kp":12.1205,"left":0.54,"right":2.22,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.04,"value2":1.884,"value3":2.14,"value4":1.347,"value5":0.323},
  {"kp":12.12075,"left":-0.01,"right":2.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.114,"value2":2.007,"value3":1.579,"value4":2.216,"value5":1.445},
  {"kp":12.121,"left":-0.56,"right":2.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.921,"value2":2.384,"value3":1.788,"value4":0.3,"value5":0.98},
  {"kp":12.12125,"left":-1.11,"right":1.82,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.241,"value2":2.373,"value3":0.179,"value4":0.93,"value5":1.326},
  {"kp":12.1215,"left":-1.73,"right":1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.063,"value2":0.276,"value3":2.597,"value4":2.382,"value5":2.054},
  {"kp":12.12175,"left":-2.46,"right":1.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.586,"value2":2.443,"value3":1.267,"value4":2.587,"value5":0.753},
  {"kp":12.122,"left":-3.31,"right":0.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.938,"value2":1.057,"value3":1.264,"value4":2.348,"value5":2.154},
  {"kp":12.12225,"left":-4.2,"right":-0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.644,"value2":2.591,"value3":2.339,"value4":2.348,"value5":2.901},
  {"kp":12.1225,"left":-5.02,"right":-0.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.527,"value2":0.647,"value3":2.161,"value4":0.374,"value5":0.529},
  {"kp":12.12275,"left":-5.63,"right":-1.18,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.117,"value2":1.573,"value3":2.913,"value4":0.168,"value5":0.649},
  {"kp":12.123,"left":-5.95,"right":-1.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.872,"value2":2.528,"value3":1.596,"value4":2.44,"value5":1.806},
  {"kp":12.12325,"left":-5.97,"right":-1.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.308,"value2":2.489,"value3":2.815,"value4":2.113,"value5":1.355},
  {"kp":12.1235,"left":-5.76,"right":-1.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.099,"value2":2.224,"value3":2.366,"value4":1.954,"value5":1.013},
  {"kp":12.12375,"left":-5.38,"right":-2.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.974,"value2":0.118,"value3":2.318,"value4":2.845,"value5":1.851},
  {"kp":12.124,"left":-4.92,"right":-2.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.223,"value2":1.048,"value3":1.448,"value4":0.906,"value5":2.517},
  {"kp":12.12425,"left":-4.4,"right":-2.38,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.447,"value2":2.097,"value3":0.235,"value4":2.281,"value5":2.052},
  {"kp":12.1245,"left":-3.85,"right":-2.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.563,"value2":0.984,"value3":1.246,"value4":0.128,"value5":1.758},
  {"kp":12.12475,"left":-3.27,"right":-2.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.459,"value2":1.858,"value3":2.424,"value4":2.295,"value5":1.202},
  {"kp":12.125,"left":-2.68,"right":-2.62,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.205,"value2":0.787,"value3":1.347,"value4":1.189,"value5":0.359},
  {"kp":12.12525,"left":-2.09,"right":-2.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.227,"value2":1.116,"value3":1.614,"value4":1.087,"value5":0.809},
  {"kp":12.1255,"left":-1.52,"right":-2.74,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.538,"value2":2.209,"value3":0.687,"value4":0.186,"value5":1.696},
  {"kp":12.12575,"left":-0.99,"right":-2.8,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.835,"value2":1.674,"value3":1.456,"value4":2.775,"value5":2.79},
  {"kp":12.126,"left":-0.49,"right":-2.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.08,"value2":1.948,"value3":1.284,"value4":2.641,"value5":2.538},
  {"kp":12.12625,"left":0,"right":-2.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.334,"value2":0.018,"value3":0.593,"value4":1.734,"value5":2.883},
  {"kp":12.1265,"left":0.51,"right":-2.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.693,"value2":0.278,"value3":0.226,"value4":1.649,"value5":2.276},
  {"kp":12.12675,"left":1.07,"right":-2.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.175,"value2":2.533,"value3":1.348,"value4":2.469,"value5":0.628},
  {"kp":12.127,"left":1.7,"right":-2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.831,"value2":1.996,"value3":0.993,"value4":0.531,"value5":2.362},
  {"kp":12.12725,"left":2.35,"right":-2.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.711,"value2":2.117,"value3":0.192,"value4":1.566,"value5":0.125},
  {"kp":12.1275,"left":2.95,"right":-1.63,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.387,"value2":1.178,"value3":2.011,"value4":0.197,"value5":0.417},
  {"kp":12.12775,"left":3.42,"right":-1.22,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.059,"value2":2.925,"value3":1.958,"value4":2.084,"value5":2.19},
  {"kp":12.128,"left":3.71,"right":-0.84,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.196,"value2":2.732,"value3":1.768,"value4":0.202,"value5":0.428},
  {"kp":12.12825,"left":3.81,"right":-0.51,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.352,"value2":2.551,"value3":2.425,"value4":2.013,"value5":1.67},
  {"kp":12.1285,"left":3.75,"right":-0.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.902,"value2":0.907,"value3":1.056,"value4":1.945,"value5":0.14},
  {"kp":12.12875,"left":3.59,"right":0.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.219,"value2":1.069,"value3":2.293,"value4":1.598,"value5":2.682},
  {"kp":12.129,"left":3.37,"right":0.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.543,"value2":0.525,"value3":0.978,"value4":0.567,"value5":1.792},
  {"kp":12.12925,"left":3.15,"right":0.5,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.138,"value2":2.425,"value3":2.586,"value4":2.407,"value5":1.951},
  {"kp":12.1295,"left":2.95,"right":0.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.801,"value2":1.033,"value3":1.202,"value4":0.237,"value5":1.564},
  {"kp":12.12975,"left":2.78,"right":0.84,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.862,"value2":0.402,"value3":2.595,"value4":2.899,"value5":1.668},
  {"kp":12.13,"left":2.62,"right":0.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.951,"value2":1.261,"value3":1.248,"value4":0.395,"value5":2.16},
  {"kp":12.13025,"left":2.46,"right":1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.953,"value2":0.324,"value3":2.949,"value4":0.948,"value5":0.915},
  {"kp":12.1305,"left":2.27,"right":1.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.183,"value2":1.893,"value3":2.047,"value4":2.091,"value5":2.545},
  {"kp":12.13075,"left":2.06,"right":1.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.786,"value2":0.724,"value3":0.931,"value4":0.478,"value5":2.028},
  {"kp":12.131,"left":1.81,"right":1.64,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.425,"value2":0.732,"value3":0.279,"value4":1.115,"value5":2.369},
  {"kp":12.13125,"left":1.55,"right":1.82,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.028,"value2":2.564,"value3":1.601,"value4":1.403,"value5":0.874},
  {"kp":12.1315,"left":1.28,"right":2,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.484,"value2":0.239,"value3":2.163,"value4":1.084,"value5":1.061},
  {"kp":12.13175,"left":1.03,"right":2.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.924,"value2":2.901,"value3":2.858,"value4":2.148,"value5":2.309},
  {"kp":12.132,"left":0.79,"right":2.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.012,"value2":1.355,"value3":1.822,"value4":0.443,"value5":1.318},
  {"kp":12.13225,"left":0.57,"right":2.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.397,"value2":1.663,"value3":0.514,"value4":2.301,"value5":1.607},
  {"kp":12.1325,"left":0.39,"right":2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.913,"value2":2.083,"value3":2.408,"value4":2.516,"value5":1.457},
  {"kp":12.13275,"left":0.23,"right":2.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.208,"value2":1.478,"value3":0.498,"value4":0.035,"value5":1.005},
  {"kp":12.133,"left":0.1,"right":2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.339,"value2":1.276,"value3":0.806,"value4":0.378,"value5":2.685},
  {"kp":12.13325,"left":-0.02,"right":2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.021,"value2":2.807,"value3":1.854,"value4":2.85,"value5":2.829},
  {"kp":12.1335,"left":-0.13,"right":2.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.046,"value2":1.955,"value3":1.238,"value4":2.055,"value5":2.436},
  {"kp":12.13375,"left":-0.23,"right":2.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.068,"value2":1.962,"value3":2.576,"value4":1.25,"value5":2.074},
  {"kp":12.134,"left":-0.32,"right":2.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.973,"value2":0.275,"value3":2.598,"value4":2.496,"value5":1.117},
  {"kp":12.13425,"left":-0.4,"right":2.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.698,"value2":2.701,"value3":0.756,"value4":1.06,"value5":2.37},
  {"kp":12.1345,"left":-0.48,"right":2.1,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.409,"value2":2.151,"value3":0.555,"value4":1.365,"value5":2.391},
  {"kp":12.13475,"left":-0.56,"right":2.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.803,"value2":0.945,"value3":0.346,"value4":2.517,"value5":2.878},
  {"kp":12.135,"left":-0.61,"right":1.9,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.418,"value2":2.798,"value3":2.753,"value4":2.529,"value5":1.945},
  {"kp":12.13525,"left":-0.62,"right":1.78,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.066,"value2":1.233,"value3":1.685,"value4":2.397,"value5":2.754},
  {"kp":12.1355,"left":-0.57,"right":1.66,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.019,"value2":1.726,"value3":2.11,"value4":2.418,"value5":2.948},
  {"kp":12.13575,"left":-0.49,"right":1.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.363,"value2":2.049,"value3":1.947,"value4":2.082,"value5":0.736},
  {"kp":12.136,"left":-0.39,"right":1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.226,"value2":1.132,"value3":0.836,"value4":1.429,"value5":1.574},
  {"kp":12.13625,"left":-0.3,"right":1.27,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.478,"value2":2.212,"value3":0.051,"value4":0.529,"value5":2.29},
  {"kp":12.1365,"left":-0.25,"right":1.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.901,"value2":1.977,"value3":2.991,"value4":1.493,"value5":2.591},
  {"kp":12.13675,"left":-0.23,"right":0.92,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.918,"value2":1.605,"value3":0.744,"value4":2.321,"value5":0.208},
  {"kp":12.137,"left":-0.25,"right":0.71,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.392,"value2":0.388,"value3":2.23,"value4":2.727,"value5":1.545},
  {"kp":12.13725,"left":-0.3,"right":0.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.726,"value2":1.489,"value3":0.076,"value4":1.954,"value5":1.1},
  {"kp":12.1375,"left":-0.37,"right":0.18,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.634,"value2":1.619,"value3":1.986,"value4":2.251,"value5":1.817},
  {"kp":12.13775,"left":-0.48,"right":-0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.462,"value2":0.836,"value3":1.799,"value4":1.297,"value5":1.591},
  {"kp":12.138,"left":-0.59,"right":-0.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.218,"value2":1.628,"value3":0.9,"value4":1.102,"value5":2.255},
  {"kp":12.13825,"left":-0.71,"right":-0.82,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.633,"value2":0.274,"value3":1.237,"value4":0.675,"value5":0.138},
  {"kp":12.1385,"left":-0.82,"right":-1.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.892,"value2":2.975,"value3":1.084,"value4":1.838,"value5":2.025},
  {"kp":12.13875,"left":-0.94,"right":-1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.346,"value2":2.055,"value3":1.784,"value4":1.418,"value5":1.734},
  {"kp":12.139,"left":-1.07,"right":-1.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.89,"value2":0.804,"value3":1.807,"value4":1.88,"value5":0.115},
  {"kp":12.13925,"left":-1.22,"right":-2.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.651,"value2":2.922,"value3":0.408,"value4":0.559,"value5":2.514},
  {"kp":12.1395,"left":-1.39,"right":-2.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.025,"value2":2.505,"value3":2.359,"value4":0.913,"value5":2.004},
  {"kp":12.13975,"left":-1.55,"right":-2.88,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.785,"value2":2.52,"value3":2.779,"value4":1.902,"value5":2.669},
  {"kp":12.14,"left":-1.71,"right":-3.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.659,"value2":2.752,"value3":1.888,"value4":1.388,"value5":1.689},
  {"kp":12.14025,"left":-1.86,"right":-3.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.095,"value2":2.442,"value3":0.141,"value4":0.112,"value5":0.488},
  {"kp":12.1405,"left":-2.02,"right":-3.49,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.513,"value2":1.967,"value3":1.24,"value4":1.297,"value5":0.96},
  {"kp":12.14075,"left":-2.15,"right":-3.62,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.514,"value2":1.504,"value3":0.348,"value4":1.764,"value5":0.779},
  {"kp":12.141,"left":-2.24,"right":-3.72,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.55,"value2":0.893,"value3":2.332,"value4":1.19,"value5":0.461},
  {"kp":12.14125,"left":-2.27,"right":-3.8,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.613,"value2":1.735,"value3":2.393,"value4":0.506,"value5":2.004},
  {"kp":12.1415,"left":-2.25,"right":-3.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.636,"value2":1.567,"value3":0.006,"value4":1.377,"value5":0.497},
  {"kp":12.14175,"left":-2.19,"right":-3.9,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.341,"value2":2.234,"value3":2.917,"value4":1.866,"value5":0.143},
  {"kp":12.142,"left":-2.12,"right":-3.92,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.184,"value2":0.623,"value3":2.62,"value4":0.146,"value5":2.503},
  {"kp":12.14225,"left":-2.05,"right":-3.89,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.584,"value2":0.374,"value3":2.432,"value4":1.085,"value5":1.52},
  {"kp":12.1425,"left":-1.97,"right":-3.77,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.976,"value2":1.235,"value3":2.339,"value4":1.733,"value5":1.467},
  {"kp":12.14275,"left":-1.86,"right":-3.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.628,"value2":0.332,"value3":2.783,"value4":1.057,"value5":0.006},
  {"kp":12.143,"left":-1.71,"right":-3.24,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.279,"value2":1.373,"value3":2.743,"value4":2.053,"value5":0.559},
  {"kp":12.14325,"left":-1.49,"right":-2.83,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.296,"value2":1.569,"value3":0.588,"value4":1.834,"value5":0.828},
  {"kp":12.1435,"left":-1.22,"right":-2.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.429,"value2":1.865,"value3":0.167,"value4":2.435,"value5":0.653},
  {"kp":12.14375,"left":-0.9,"right":-1.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.669,"value2":2.762,"value3":2.755,"value4":0.519,"value5":0.287},
  {"kp":12.144,"left":-0.53,"right":-1.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.801,"value2":2.32,"value3":0.958,"value4":1.821,"value5":2.513},
  {"kp":12.14425,"left":-0.14,"right":-0.63,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.257,"value2":0.325,"value3":2.199,"value4":2.597,"value5":1.175},
  {"kp":12.1445,"left":0.24,"right":-0.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.263,"value2":1.548,"value3":2.625,"value4":1.262,"value5":2.255},
  {"kp":12.14475,"left":0.6,"right":0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.481,"value2":2.05,"value3":1.821,"value4":0.699,"value5":1.676},
  {"kp":12.145,"left":0.91,"right":1.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.98,"value2":0.547,"value3":2.702,"value4":1.987,"value5":0.704},
  {"kp":12.14525,"left":1.17,"right":1.6,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.444,"value2":1.333,"value3":0.514,"value4":2.319,"value5":2.491},
  {"kp":12.1455,"left":1.4,"right":2.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.215,"value2":0.747,"value3":1.733,"value4":1.403,"value5":1.421},
  {"kp":12.14575,"left":1.59,"right":2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.535,"value2":1.549,"value3":1.135,"value4":1.032,"value5":1.92},
  {"kp":12.146,"left":1.74,"right":2.71,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.035,"value2":0.17,"value3":0.146,"value4":0.811,"value5":1.563},
  {"kp":12.14625,"left":1.87,"right":2.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.049,"value2":0.653,"value3":2.664,"value4":2.989,"value5":0.734},
  {"kp":12.1465,"left":1.98,"right":3.24,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.231,"value2":0.205,"value3":0.215,"value4":0.537,"value5":1.932},
  {"kp":12.14675,"left":2.11,"right":3.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.704,"value2":2.517,"value3":0.666,"value4":2.465,"value5":1.033},
  {"kp":12.147,"left":2.29,"right":3.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.91,"value2":0.456,"value3":1.776,"value4":0.706,"value5":2.616},
  {"kp":12.14725,"left":2.51,"right":3.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.219,"value2":2.145,"value3":0.401,"value4":0.69,"value5":1.822},
  {"kp":12.1475,"left":2.76,"right":3.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.758,"value2":0.338,"value3":2.109,"value4":1.58,"value5":0.12},
  {"kp":12.14775,"left":3,"right":3.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.88,"value2":0.158,"value3":0.943,"value4":2.912,"value5":2.605},
  {"kp":12.148,"left":3.18,"right":3.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.627,"value2":0.194,"value3":2.632,"value4":2.723,"value5":1.063},
  {"kp":12.14825,"left":3.27,"right":3.67,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.996,"value2":2.902,"value3":1.903,"value4":2.463,"value5":2.204},
  {"kp":12.1485,"left":3.25,"right":3.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.566,"value2":0.713,"value3":2.475,"value4":2.976,"value5":0.974},
  {"kp":12.14875,"left":3.14,"right":3.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.277,"value2":1.834,"value3":0.106,"value4":0.257,"value5":2.034},
  {"kp":12.149,"left":2.96,"right":2.76,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.042,"value2":1.851,"value3":0.508,"value4":1.382,"value5":2.658},
  {"kp":12.14925,"left":2.75,"right":2.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.18,"value2":0.204,"value3":0.072,"value4":2.751,"value5":0.848},
  {"kp":12.1495,"left":2.53,"right":2.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.853,"value2":2.285,"value3":0.77,"value4":2.629,"value5":2.131},
  {"kp":12.14975,"left":2.33,"right":1.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.414,"value2":1.269,"value3":2.864,"value4":0.821,"value5":2.202},
  {"kp":12.15,"left":2.14,"right":1.58,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.133,"value2":1.692,"value3":2.649,"value4":2.623,"value5":0.978},
  {"kp":12.15025,"left":1.96,"right":1.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.834,"value2":2.207,"value3":0.15,"value4":0.257,"value5":2.312},
  {"kp":12.1505,"left":1.78,"right":1.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.694,"value2":0.492,"value3":1.746,"value4":1,"value5":1.747},
  {"kp":12.15075,"left":1.59,"right":0.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.913,"value2":0.753,"value3":2.634,"value4":0.976,"value5":0.52},
  {"kp":12.151,"left":1.38,"right":0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.346,"value2":1.378,"value3":2.646,"value4":1.292,"value5":0.703},
  {"kp":12.15125,"left":1.15,"right":0.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.834,"value2":1.242,"value3":1.744,"value4":1.777,"value5":0.4},
  {"kp":12.1515,"left":0.9,"right":0.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.98,"value2":0.818,"value3":2.665,"value4":0.784,"value5":2.8},
  {"kp":12.15175,"left":0.62,"right":-0.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.451,"value2":2.364,"value3":2.789,"value4":2.674,"value5":1.505},
  {"kp":12.152,"left":0.3,"right":-0.25,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.175,"value2":1.265,"value3":0.334,"value4":2.074,"value5":2.936},
  {"kp":12.15225,"left":-0.05,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.099,"value2":1.461,"value3":1.157,"value4":0.623,"value5":1.965},
  {"kp":12.1525,"left":-0.43,"right":-0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":1.912,"value2":0.898,"value3":2.637,"value4":2.881,"value5":0.449},
  {"kp":12.15275,"left":-0.82,"right":-0.66,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":0.88,"value2":2.066,"value3":2.399,"value4":0.411,"value5":2.513},
  {"kp":12.153,"left":-1.19,"right":-0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11,"value1":2.052,"value2":0.633,"value3":1.252,"value4":2.008,"value5":2.907}  
];

const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
/* 
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
}; */

function TrackDeviation( props ) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [open, setOpen] = useState(false);
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }
  const handleClose = () => {
    setOpen(false);
  }
  const dataOption = [
    { label: '고저틀림', value: '고저틀림' },
    { label: '방향틀림', value: '방향틀림' },
    { label: '궤간틀림', value: '궤간틀림' },
    { label: '수평틀림', value: '수평틀림' },
    { label: '비틀림', value: '비틀림' },
  ];

  useEffect(() => {
  }, []);
  
  return (
    <div className="trackDeviation" >
      <div className="railStatusContainer">
        <RailStatus railroadSection={RAILROADSECTION} pathClick={pathClick}></RailStatus>
      </div>
      {/* <div className="contentBox" >
        <div className="containerTitle">검토구간</div>
        <div className="componentBox flex section ">

          <div className="position optionBox h75">
            <div className="optionTitle">측정분기</div>
            <div className="optionValue">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">측정분기</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  //value={age}
                  label="데이터 선택"
                  //onChange={handleChange}
                >
                  <MenuItem>2022.1분기</MenuItem>
                  <MenuItem>2022.2분기</MenuItem>
                  <MenuItem>2022.3분기</MenuItem>
                  <MenuItem>2022.4분기</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="position optionBox h75">
            <div className="optionTitle">측정일자</div>
            <div className="optionValue">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DatePicker label="측정일"  />
              </LocalizationProvider>
            </div>
          </div>

          <div className="position optionBox borderColorGreen">
            <div className="optionTitle">위치</div>
            <div className="optionValue">인천터미널 - 문학경기장</div>
          </div>

        </div>
      </div> */}
      <div className="contentBox searchNavigate" style={{marginLeft : 0, height: "95px", marginBottom:"10px"}}>
            <div className="containerTitle bothEnds">
              <div>Search Navigate</div>
            </div>
            <div className="componentBox" style={{overflow: "hidden"}}>
              <div className="dataOption">
                <div className="title">측정분기 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  {/* <DatePicker style={RANGEPICKERSTYLE} /> */}
                  <Select
                    /* defaultValue="lucy" */
                    style={{...{ width : 120 },...RANGEPICKERSTYLE}}
                    /* onChange={handleChange} */
                    options={[
                      { value: '2022 1분기', label: '2022 1분기' },
                      { value: '2022 2분기', label: '2022 2분기' },
                      { value: '2022 3분기', label: '2022 3분기' },
                      { value: '2022 4분기', label: '2022 4분기' },
                    ]}
                  />
                </div>
              </div>
              <div className="line"></div>
              <div className="dataOption">
                <div className="title">측정일자 </div>
                <div className="date">
                  {/* <RangePicker 
                    style={RANGEPICKERSTYLE}
                  /> */}
                  <DatePicker style={RANGEPICKERSTYLE} />
                </div>
              </div>
              <div className="line"></div>
              {/* <div className="dataOption">
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
              </div> */}
              <div className="dataOption">
                <div className="title">선택구간 </div>
                <div className="date">
                  <Input placeholder="KP" value={"간석오거리 - 인천시청"}
                    style={RANGEPICKERSTYLE}
                    readOnly={true}
                  />
                </div>
              </div>
              {/* <div className="dataOption" style={{marginLeft:"10px"}}>
                완화곡선 /
                R=우곡선 400 (C=55, S=0) /
                체감 C=40, S=0 /
                종구배=+10‰ /
                V=+40km/h
              </div> */}
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
            </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 250px)"}}>
        <div className="containerTitle">Chart
          <div className="flex">
            <div className="modalButton highlight orange" onClick={()=>{
              setOpen(true);
            }} >Report</div>
          </div>
        </div>
        <div className="componentBox chartBox flex">
          {/* <Chart type='bar' data={data} /> */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="kp" interval={15} tickFormatter={(value) => value.toFixed(4)} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" name="좌레일" dataKey="left" stroke="#4371C4" dot={false} />
              <Line type="monotone" name="우레일" dataKey="right" stroke="#4371C4" dot={false} />

              {/* <Line type="monotone" name="고저틀림" dataKey="value1" stroke="#4371C4" dot={false} />
              <Line type="monotone" name="방향틀림" dataKey="value2" stroke="#4371C4" dot={false} />
              <Line type="monotone" name="궤간틀림" dataKey="value3" stroke="#4371C4" dot={false} />
              <Line type="monotone" name="수평틀림" dataKey="value4" stroke="#4371C4" dot={false} />
              <Line type="monotone" name="비틀림" dataKey="value5" stroke="#4371C4" dot={false} /> */}

              <Line type="monotone" name="목표기준" dataKey="target1" stroke="#4BC784" dot={false} />
              <Line type="monotone" name="목표기준" dataKey="target2" stroke="#4BC784" dot={false} />
              <Line type="monotone" name="보수기준" dataKey="repair1" stroke="#FF0606" dot={false} />
              <Line type="monotone" name="보수기준" dataKey="repair2" stroke="#FF0606" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Modal
          open={open}
          onClose={(e)=>{handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} >
            <div className="trackReportPopupTitle">
              궤도틀림 Report
              <div className="closeBtn" onClick={()=>{setOpen(false)}} ><img src={CloseIcon} /></div>
            </div>
            <div className="trackReportPopupContent">
              <div className="table" style={{marginTop:"10px", width:"400px"}}>
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td">측정분기</div>
                    <div className="td">측정일자</div>
                    <div className="td">구간</div>
                  </div>
                </div>
                <div className="tableBody">
                  <div className="tr">
                    <div className="td">2022 1분기</div>
                    <div className="td">2022/03/12</div>
                    <div className="td">간석오거리 - 인천시청</div>
                  </div>
                </div>
              </div>
              <div className="table" style={{marginTop:"10px"}}>
                <div className="tableHeader">
                  <div className="tr">
                    <div className="td colspan2"><div className="colspan2">Rail</div></div>
                    <div className="td rowspan2"><div className="rowspan2">Position</div></div>
                    <div className="td rowspan2"></div>
                    <div className="td colspan2"><div className="colspan2">Length</div></div>
                    <div className="td rowspan2"><div className="rowspan2">Worst Defect</div></div>
                    <div className="td rowspan2"></div>
                    <div className="td colspan2"><div className="colspan2">Threshold Value</div></div>
                    <div className="td colspan2"><div className="colspan2">Excess</div></div>
                    <div className="td colspan2"><div className="colspan2">Alarm</div></div>
                    <div className="td rowspan2"><div className="rowspan2">게이지 마모량</div></div>
                    <div className="td rowspan2"></div>
                  </div>
                  <div className="tr">
                    <div className="td colspan2"></div>
                    <div className="td">Begin</div>
                    <div className="td">End</div>
                    <div className="td colspan2"></div>
                    <div className="td">Postion</div>
                    <div className="td">Value</div>
                    <div className="td colspan2"></div>
                    <div className="td colspan2"></div>
                    <div className="td colspan2"></div>
                    <div className="td">Max</div>
                    <div className="td">Min</div>
                  </div>
                </div>
                <div className="tableBody">
                  <div className="tr">
                    <div className="td">Long</div>
                    <div className="td">15785.25</div>
                    <div className="td">18784</div>
                    <div className="td">1.25</div>
                    <div className="td">15785</div>
                    <div className="td">16.5</div>
                    <div className="td">15</div>
                    <div className="td">1.5</div>
                    <div className="td">T1</div>
                    <div className="td">5.3</div>
                    <div className="td">5.26</div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>

    </div>
  );
}

export default TrackDeviation;
