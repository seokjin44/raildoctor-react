import React from "react";
import "./Wear3D.css";
/* import 'antd/dist/antd.css'; */
import { Checkbox, Slider } from 'antd';
import Plot from 'react-plotly.js'
import { mgtToM, textToNumber } from "../../util";
import { STRING_CORNER_WEAR, STRING_VERTICAL_WEAR } from "../../constant";


class Wear3D extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marks: undefined,
            data: [],
            checkValue : [STRING_VERTICAL_WEAR, STRING_CORNER_WEAR]
        }
    }

    marks = [];

    componentDidMount() {
        console.log(this.props);
        this.initSlider();
    }

    componentDidUpdate(prevProps) {
        //this.init();
        console.log(this.state);
        if(JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
            
        }
    }

    initSlider = function () {
        let maxMgt = 0, minMgt = 0;
        for(let data_ of this.props.data) {
            for (let d of data_.x) {
                if (maxMgt < d) maxMgt = d;
            }
        }

        maxMgt = Math.ceil(maxMgt / 10) * 10;
        let tickNum = 10;
        let tick = (maxMgt - minMgt) / tickNum;
        let marks = { 0: minMgt, 100: mgtToM(maxMgt) };
        for (let i = 1; i < tickNum; i++) {
            marks[i * tickNum] = mgtToM(parseInt( minMgt + i * tick ));
        }

        console.log(marks);
        this.setState({marks: marks});
        console.log(this.marks);
    }

    checkboxOption = [
        { label: '직마모', value: STRING_VERTICAL_WEAR },
        { label: '편마모', value: STRING_CORNER_WEAR }
    ]

    render() {
        return (
            <div className="wear3DContainer">
                <div className="wear3DChekboxContainer">
                    {/* <div class="checkboxContainer">
                        <input type="checkbox" id="directWearCheck" /> <label for="directWearCheck">직마모</label></div>
                    <div class="checkboxContainer">
                        <input type="checkbox" id="sideWearCheck" /> <label for="sideWearCheck">편마모</label></div> */}
                    <Checkbox.Group 
                        options={this.checkboxOption} 
                        onChange={(e)=>{
                            console.log(e);
                            this.props.changeCheckBox(e);
                            this.setState({
                                checkValue : e
                            })
                        }}
                        value={this.state.checkValue}
                        defaultValue={this.state.checkValue}
                    />
                </div>
                <div className="wear3DRangeContainer">
                    <Slider range 
                        marks={this.state.marks} 
                        tooltip={{ formatter: null }} 
                        defaultValue={[0, 100]} 
                        step={null}
                        onChange={(e)=>{
                            console.log(e);
                            let min = this.state.marks[e[0]];
                            let max = this.state.marks[e[1]];
                            this.props.dataSliderSort([textToNumber(min), textToNumber(max)]);
                        }}
                    />

                </div>
                <div className="Wear3DChartContainer">
                    <Plot
                        data={this.props.data}
                        layout={{
                            responsive: true,
                            useResizeHandler: true,
                            autosize: true,
                            margin: {
                                l: 0,
                                r: 0,
                                b: 0,
                                t: 0
                            },
                            legend: {
                                x: 0,
                                y: -0.01,
                                traceorder: 'normal',
                                font: {
                                    family: 'sans-serif',
                                    size: 12,
                                    color: '#000'
                                },
                                bgcolor: '#ffffff',
                                bordercolor: '#E2E2E2',
                                borderwidth: 1,
                            },
                            scene: {
                                xaxis:{ title: 'MGT'},
                                yaxis:{ title: 'KP'},
                                zaxis:{ title: 'Wear'}
                            }
                        }}
                        config={{
                            displayModeBar: false,
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
            </div>
        );
    }
}

export default Wear3D;