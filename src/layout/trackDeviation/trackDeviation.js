import "./trackDeviation.css";
import { useEffect, useState } from "react";
import PositionTestImage from "../../assets/2023-07-09_21_48_42.png";
import RailStatus from "../../component/railStatus/railStatus";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ko';

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
import { RAILROADSECTION, RANGEPICKERSTYLE } from "../../constant";
import { DatePicker, Input, Radio, Select } from "antd";

const data1 = [{"kp":12.05325,"left":-0.72,"right":-1.93,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0535,"left":-1.17,"right":-2.15,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05375,"left":-1.61,"right":-2.32,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.054,"left":-2.01,"right":-2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05425,"left":-2.35,"right":-2.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0545,"left":-2.57,"right":-2.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05475,"left":-2.66,"right":-2.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.055,"left":-2.6,"right":-2.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05525,"left":-2.44,"right":-1.9,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0555,"left":-2.25,"right":-1.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05575,"left":-2.08,"right":-1.51,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.056,"left":-2,"right":-1.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05625,"left":-1.98,"right":-1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0565,"left":-1.97,"right":-0.91,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05675,"left":-1.92,"right":-0.62,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.057,"left":-1.79,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05725,"left":-1.56,"right":0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0575,"left":-1.24,"right":0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05775,"left":-0.86,"right":0.94,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.058,"left":-0.44,"right":1.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05825,"left":-0.01,"right":1.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0585,"left":0.39,"right":1.75,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05875,"left":0.73,"right":1.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.059,"left":1,"right":1.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05925,"left":1.17,"right":1.83,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0595,"left":1.26,"right":1.75,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.05975,"left":1.28,"right":1.64,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06,"left":1.23,"right":1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06025,"left":1.15,"right":1.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0605,"left":1.07,"right":1.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06075,"left":1.01,"right":1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.061,"left":0.98,"right":1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06125,"left":0.95,"right":0.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0615,"left":0.91,"right":0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06175,"left":0.82,"right":0.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.062,"left":0.69,"right":0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06225,"left":0.55,"right":-0.25,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0625,"left":0.43,"right":-0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06275,"left":0.33,"right":-0.8,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.063,"left":0.26,"right":-0.98,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06325,"left":0.23,"right":-1.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0635,"left":0.23,"right":-1.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06375,"left":0.23,"right":-1,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.064,"left":0.22,"right":-0.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06425,"left":0.16,"right":-0.71,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0645,"left":0.04,"right":-0.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06475,"left":-0.11,"right":-0.43,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.065,"left":-0.25,"right":-0.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06525,"left":-0.34,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0655,"left":-0.33,"right":-0.2,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06575,"left":-0.2,"right":-0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.066,"left":0.01,"right":-0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06625,"left":0.27,"right":0.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0665,"left":0.5,"right":0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06675,"left":0.66,"right":0.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.067,"left":0.7,"right":0.49,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06725,"left":0.63,"right":0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0675,"left":0.47,"right":0.76,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06775,"left":0.28,"right":0.78,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.068,"left":0.09,"right":0.7,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06825,"left":-0.04,"right":0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0685,"left":-0.1,"right":0.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06875,"left":-0.1,"right":0.04,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.069,"left":-0.05,"right":-0.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06925,"left":0.03,"right":-0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0695,"left":0.12,"right":-0.58,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.06975,"left":0.19,"right":-0.7,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07,"left":0.24,"right":-0.79,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07025,"left":0.24,"right":-0.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0705,"left":0.21,"right":-0.91,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07075,"left":0.15,"right":-0.95,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.071,"left":0.07,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07125,"left":-0.01,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0715,"left":-0.08,"right":-0.98,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07175,"left":-0.13,"right":-1,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.072,"left":-0.16,"right":-1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07225,"left":-0.19,"right":-1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0725,"left":-0.22,"right":-0.96,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07275,"left":-0.27,"right":-0.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.073,"left":-0.34,"right":-0.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07325,"left":-0.44,"right":-0.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0735,"left":-0.54,"right":0.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07375,"left":-0.59,"right":0.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.074,"left":-0.56,"right":0.7,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07425,"left":-0.43,"right":0.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0745,"left":-0.21,"right":0.96,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07475,"left":0.05,"right":1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.075,"left":0.3,"right":1.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07525,"left":0.48,"right":1.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0755,"left":0.55,"right":1.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07575,"left":0.54,"right":1.32,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.076,"left":0.46,"right":1.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07625,"left":0.37,"right":1.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0765,"left":0.3,"right":1.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07675,"left":0.28,"right":1.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.077,"left":0.32,"right":1.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07725,"left":0.38,"right":0.88,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0775,"left":0.43,"right":0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07775,"left":0.43,"right":0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.078,"left":0.36,"right":0.32,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07825,"left":0.22,"right":0.05,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0785,"left":0.01,"right":-0.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07875,"left":-0.24,"right":-0.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.079,"left":-0.51,"right":-0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07925,"left":-0.79,"right":-0.84,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0795,"left":-1.05,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.07975,"left":-1.26,"right":-1.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08,"left":-1.43,"right":-1.19,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08025,"left":-1.54,"right":-1.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0805,"left":-1.62,"right":-1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08075,"left":-1.68,"right":-1.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.081,"left":-1.75,"right":-1.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08125,"left":-1.82,"right":-1.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0815,"left":-1.88,"right":-1.27,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08175,"left":-1.91,"right":-1.1,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.082,"left":-1.87,"right":-0.92,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08225,"left":-1.74,"right":-0.74,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0825,"left":-1.5,"right":-0.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08275,"left":-1.15,"right":-0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.083,"left":-0.72,"right":-0.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08325,"left":-0.26,"right":0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0835,"left":0.18,"right":0.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08375,"left":0.54,"right":0.58,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.084,"left":0.8,"right":0.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08425,"left":0.97,"right":0.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0845,"left":1.1,"right":1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08475,"left":1.21,"right":1.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.085,"left":1.35,"right":1.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08525,"left":1.54,"right":1.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0855,"left":1.76,"right":1.49,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08575,"left":2,"right":1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.086,"left":2.21,"right":1.5,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08625,"left":2.33,"right":1.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0865,"left":2.34,"right":1.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08675,"left":2.21,"right":1.18,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.087,"left":1.96,"right":1.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08725,"left":1.62,"right":0.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0875,"left":1.26,"right":0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08775,"left":0.91,"right":0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.088,"left":0.61,"right":0.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08825,"left":0.38,"right":0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0885,"left":0.22,"right":-0.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08875,"left":0.13,"right":-0.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.089,"left":0.07,"right":-0.43,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08925,"left":-0.01,"right":-0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0895,"left":-0.12,"right":-0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.08975,"left":-0.28,"right":-0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09,"left":-0.46,"right":-0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09025,"left":-0.64,"right":-0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0905,"left":-0.77,"right":-0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09075,"left":-0.82,"right":-0.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.091,"left":-0.75,"right":-0.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09125,"left":-0.57,"right":-0.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0915,"left":-0.26,"right":-0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09175,"left":0.13,"right":-0.59,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.092,"left":0.58,"right":-0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09225,"left":0.99,"right":-0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0925,"left":1.3,"right":-0.72,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09275,"left":1.47,"right":-0.74,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.093,"left":1.49,"right":-0.72,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09325,"left":1.41,"right":-0.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0935,"left":1.26,"right":-0.61,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09375,"left":1.09,"right":-0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.094,"left":0.94,"right":-0.43,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09425,"left":0.83,"right":-0.38,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0945,"left":0.74,"right":-0.35,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09475,"left":0.66,"right":-0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.095,"left":0.55,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09525,"left":0.39,"right":-0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0955,"left":0.15,"right":-0.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09575,"left":-0.16,"right":-0.53,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.096,"left":-0.51,"right":-0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09625,"left":-0.88,"right":-0.35,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0965,"left":-1.27,"right":-0.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09675,"left":-1.67,"right":0.04,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.097,"left":-2.04,"right":0.24,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09725,"left":-2.36,"right":0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0975,"left":-2.56,"right":0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09775,"left":-2.62,"right":0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.098,"left":-2.53,"right":0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09825,"left":-2.32,"right":0.75,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0985,"left":-2.03,"right":0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09875,"left":-1.71,"right":0.66,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.099,"left":-1.38,"right":0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09925,"left":-1.07,"right":0.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.0995,"left":-0.81,"right":0.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.09975,"left":-0.59,"right":0.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1,"left":-0.42,"right":0.2,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10025,"left":-0.27,"right":0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1005,"left":-0.13,"right":0.1,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10075,"left":0.03,"right":0.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.101,"left":0.21,"right":0.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10125,"left":0.39,"right":-0.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1015,"left":0.57,"right":-0.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10175,"left":0.74,"right":-0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.102,"left":0.88,"right":-0.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10225,"left":0.96,"right":-0.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1025,"left":0.96,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10275,"left":0.86,"right":-0.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.103,"left":0.66,"right":-0.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10325,"left":0.41,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1035,"left":0.12,"right":-0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10375,"left":-0.14,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.104,"left":-0.37,"right":-0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10425,"left":-0.53,"right":-0.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1045,"left":-0.63,"right":-0.22,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10475,"left":-0.67,"right":-0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.105,"left":-0.68,"right":-0.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10525,"left":-0.68,"right":0.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1055,"left":-0.7,"right":0.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10575,"left":-0.75,"right":0.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.106,"left":-0.81,"right":0.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10625,"left":-0.87,"right":0.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1065,"left":-0.9,"right":0.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10675,"left":-0.88,"right":0.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.107,"left":-0.81,"right":0,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10725,"left":-0.69,"right":0.04,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1075,"left":-0.52,"right":0.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10775,"left":-0.33,"right":0.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.108,"left":-0.13,"right":0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10825,"left":0.06,"right":0.5,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1085,"left":0.22,"right":0.61,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10875,"left":0.37,"right":0.67,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.109,"left":0.49,"right":0.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10925,"left":0.62,"right":0.67,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1095,"left":0.77,"right":0.61,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.10975,"left":0.93,"right":0.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11,"left":1.12,"right":0.47,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11025,"left":1.32,"right":0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1105,"left":1.51,"right":0.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11075,"left":1.66,"right":0.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.111,"left":1.73,"right":0.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11125,"left":1.7,"right":0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1115,"left":1.58,"right":0.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11175,"left":1.41,"right":0.27,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.112,"left":1.21,"right":0.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11225,"left":1.03,"right":-0.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1125,"left":0.87,"right":-0.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11275,"left":0.74,"right":-0.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.113,"left":0.63,"right":-0.95,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11325,"left":0.51,"right":-1.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1135,"left":0.37,"right":-1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11375,"left":0.19,"right":-1.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.114,"left":-0.03,"right":-1.59,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11425,"left":-0.29,"right":-1.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1145,"left":-0.55,"right":-1.51,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11475,"left":-0.78,"right":-1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.115,"left":-0.93,"right":-1.3,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11525,"left":-0.99,"right":-1.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1155,"left":-0.96,"right":-1.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11575,"left":-0.83,"right":-1.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.116,"left":-0.6,"right":-0.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11625,"left":-0.27,"right":-0.83,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1165,"left":0.14,"right":-0.6,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11675,"left":0.63,"right":-0.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.117,"left":1.16,"right":0.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11725,"left":1.67,"right":0.64,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1175,"left":2.11,"right":1.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11775,"left":2.43,"right":1.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.118,"left":2.63,"right":1.88,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11825,"left":2.71,"right":2.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1185,"left":2.72,"right":2.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11875,"left":2.69,"right":2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.119,"left":2.63,"right":2.45,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11925,"left":2.52,"right":2.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1195,"left":2.33,"right":2.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.11975,"left":2.03,"right":2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12,"left":1.61,"right":2.36,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12025,"left":1.1,"right":2.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1205,"left":0.54,"right":2.22,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12075,"left":-0.01,"right":2.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.121,"left":-0.56,"right":2.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12125,"left":-1.11,"right":1.82,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1215,"left":-1.73,"right":1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12175,"left":-2.46,"right":1.09,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.122,"left":-3.31,"right":0.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12225,"left":-4.2,"right":-0.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1225,"left":-5.02,"right":-0.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12275,"left":-5.63,"right":-1.18,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.123,"left":-5.95,"right":-1.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12325,"left":-5.97,"right":-1.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1235,"left":-5.76,"right":-1.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12375,"left":-5.38,"right":-2.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.124,"left":-4.92,"right":-2.26,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12425,"left":-4.4,"right":-2.38,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1245,"left":-3.85,"right":-2.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12475,"left":-3.27,"right":-2.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.125,"left":-2.68,"right":-2.62,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12525,"left":-2.09,"right":-2.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1255,"left":-1.52,"right":-2.74,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12575,"left":-0.99,"right":-2.8,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.126,"left":-0.49,"right":-2.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12625,"left":0,"right":-2.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1265,"left":0.51,"right":-2.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12675,"left":1.07,"right":-2.65,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.127,"left":1.7,"right":-2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12725,"left":2.35,"right":-2.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1275,"left":2.95,"right":-1.63,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12775,"left":3.42,"right":-1.22,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.128,"left":3.71,"right":-0.84,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12825,"left":3.81,"right":-0.51,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1285,"left":3.75,"right":-0.21,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12875,"left":3.59,"right":0.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.129,"left":3.37,"right":0.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12925,"left":3.15,"right":0.5,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1295,"left":2.95,"right":0.68,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.12975,"left":2.78,"right":0.84,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13,"left":2.62,"right":0.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13025,"left":2.46,"right":1.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1305,"left":2.27,"right":1.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13075,"left":2.06,"right":1.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.131,"left":1.81,"right":1.64,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13125,"left":1.55,"right":1.82,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1315,"left":1.28,"right":2,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13175,"left":1.03,"right":2.16,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.132,"left":0.79,"right":2.29,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13225,"left":0.57,"right":2.37,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1325,"left":0.39,"right":2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13275,"left":0.23,"right":2.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.133,"left":0.1,"right":2.42,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13325,"left":-0.02,"right":2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1335,"left":-0.13,"right":2.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13375,"left":-0.23,"right":2.28,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.134,"left":-0.32,"right":2.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13425,"left":-0.4,"right":2.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1345,"left":-0.48,"right":2.1,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13475,"left":-0.56,"right":2.01,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.135,"left":-0.61,"right":1.9,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13525,"left":-0.62,"right":1.78,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1355,"left":-0.57,"right":1.66,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13575,"left":-0.49,"right":1.54,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.136,"left":-0.39,"right":1.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13625,"left":-0.3,"right":1.27,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1365,"left":-0.25,"right":1.11,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13675,"left":-0.23,"right":0.92,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.137,"left":-0.25,"right":0.71,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13725,"left":-0.3,"right":0.46,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1375,"left":-0.37,"right":0.18,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13775,"left":-0.48,"right":-0.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.138,"left":-0.59,"right":-0.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13825,"left":-0.71,"right":-0.82,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1385,"left":-0.82,"right":-1.17,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13875,"left":-0.94,"right":-1.52,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.139,"left":-1.07,"right":-1.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13925,"left":-1.22,"right":-2.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1395,"left":-1.39,"right":-2.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.13975,"left":-1.55,"right":-2.88,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14,"left":-1.71,"right":-3.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14025,"left":-1.86,"right":-3.33,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1405,"left":-2.02,"right":-3.49,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14075,"left":-2.15,"right":-3.62,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.141,"left":-2.24,"right":-3.72,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14125,"left":-2.27,"right":-3.8,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1415,"left":-2.25,"right":-3.86,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14175,"left":-2.19,"right":-3.9,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.142,"left":-2.12,"right":-3.92,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14225,"left":-2.05,"right":-3.89,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1425,"left":-1.97,"right":-3.77,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14275,"left":-1.86,"right":-3.56,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.143,"left":-1.71,"right":-3.24,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14325,"left":-1.49,"right":-2.83,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1435,"left":-1.22,"right":-2.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14375,"left":-0.9,"right":-1.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.144,"left":-0.53,"right":-1.23,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14425,"left":-0.14,"right":-0.63,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1445,"left":0.24,"right":-0.02,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14475,"left":0.6,"right":0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.145,"left":0.91,"right":1.12,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14525,"left":1.17,"right":1.6,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1455,"left":1.4,"right":2.03,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14575,"left":1.59,"right":2.39,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.146,"left":1.74,"right":2.71,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14625,"left":1.87,"right":2.99,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1465,"left":1.98,"right":3.24,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14675,"left":2.11,"right":3.48,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.147,"left":2.29,"right":3.69,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14725,"left":2.51,"right":3.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1475,"left":2.76,"right":3.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14775,"left":3,"right":3.97,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.148,"left":3.18,"right":3.87,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14825,"left":3.27,"right":3.67,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1485,"left":3.25,"right":3.4,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14875,"left":3.14,"right":3.08,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.149,"left":2.96,"right":2.76,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14925,"left":2.75,"right":2.44,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1495,"left":2.53,"right":2.14,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.14975,"left":2.33,"right":1.85,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.15,"left":2.14,"right":1.58,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.15025,"left":1.96,"right":1.31,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1505,"left":1.78,"right":1.06,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.15075,"left":1.59,"right":0.81,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.151,"left":1.38,"right":0.57,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.15125,"left":1.15,"right":0.34,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1515,"left":0.9,"right":0.13,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.15175,"left":0.62,"right":-0.07,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.152,"left":0.3,"right":-0.25,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.15225,"left":-0.05,"right":-0.41,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.1525,"left":-0.43,"right":-0.55,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.15275,"left":-0.82,"right":-0.66,"target1":4,"target2":-4,"repair1":11,"repair2":-11}, 
{"kp":12.153,"left":-1.19,"right":-0.73,"target1":4,"target2":-4,"repair1":11,"repair2":-11}]
;

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
  const pathClick = (select) => {
    console.log(select);
    //getInstrumentationPoint(select);
    setSelectedPath(select);
  }

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
              {/* <div className="line"></div> */}
            </div>
      </div>

      <div className="contentBox" style={{marginTop:"10px", height: "calc(100% - 250px)"}}>
        <div className="containerTitle">Chart</div>
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
              <Line type="monotone" name="목표기준" dataKey="target1" stroke="#4BC784" dot={false} />
              <Line type="monotone" name="목표기준" dataKey="target2" stroke="#4BC784" dot={false} />
              <Line type="monotone" name="보수기준" dataKey="repair1" stroke="#FF0606" dot={false} />
              <Line type="monotone" name="보수기준" dataKey="repair2" stroke="#FF0606" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default TrackDeviation;
