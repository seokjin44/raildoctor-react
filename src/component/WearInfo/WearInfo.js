import React from 'react';
import "./WearInfo.css";
import Chart from "react-apexcharts";

class WearInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                chart: {
                    animations: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                        autoScaleYaxis: false,
                    }
                },
                markers: {
                    size: [4, 4, 4, 4],
                    shape: ["circle", "circle", "circle", "circle"],
                    colors: ["#ffffff", "#0000ff", "#ffffff", "#ff0000"],
                    strokeColor: ["#0000ff", "#ffffff", "#ff0000", "#ffffff"],
                    strokeWidth: [2, 0, 2, 0],
                },

                //colors: ['#0000FF', '#0000FF', '#FF0000', '#FF0000'],
                grid: {
                    row: {
                        colors: ['transparent', 'transparent'],
                        opacity: 0.5
                    },
                    column: {
                        colors: ['transparent', 'transparent'],
                        opacity: 0.5
                    },
                    xaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                legend: {
                    markers: {
                        width: [5, 9, 5, 9],
                        height: [5, 9, 5, 9],
                        strokeWidth: 0.5,
                        strokeColor: ["#0000ff", "#ffffff", "#ff0000", "#ffffff"],
                        fillColors: ["#ffffff", "#0000ff", "#ffffff", "#ff0000"],
                        //radius: 2,
                        customHTML: undefined,
                        onClick: undefined,
                        offsetX: 0,
                        offsetY: 0,
                    }
                },
                tooltip: {
                    enabled: false,
                },
            },
            /*
            series: [
                {
                    name: "하선 좌레일",
                    data: [
                        [16.4, 5.4], [21.7, 2], [25.4, 3], [19, 2], [10.9, 1], [13.6, 3.2], [10.9, 7.4], [10.9, 0], [10.9, 8.2], [16.4, 0], [16.4, 1.8], [13.6, 0.3], [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2], [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19, 0], [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2]]
                }, {
                    name: "상선 좌레일",
                    data: [
                        [36.4, 13.4], [1.7, 11], [5.4, 8], [9, 17], [1.9, 4], [3.6, 12.2], [1.9, 14.4], [1.9, 9], [1.9, 13.2], [1.4, 7], [6.4, 8.8], [3.6, 4.3], [1.6, 10], [9.9, 2], [7.1, 15], [1.4, 0], [3.6, 13.7], [1.9, 15.2], [6.4, 16.5], [0.9, 10], [4.5, 17.1], [10.9, 10], [0.1, 14.7], [9, 10], [12.7, 11.8], [2.1, 10], [2.5, 10], [27.1, 10], [2.9, 11.5], [7.1, 10.8], [2.1, 12]]
                }, {
                    name: "하선 우레일",
                    data: [
                        [21.7, 3], [23.6, 3.5], [24.6, 3], [29.9, 3], [21.7, 20], [23, 2], [10.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [21.7, 6.9], [28.6, 7.7], [15.4, 0], [18.1, 0], [33.4, 0], [16.4, 0]]
                }, {
                    name: "상선 우레일",
                    data: [
                        [12.7, 3], [23.6, 3.5], [12.6, 3], [29.9, 3], [12.7, 20], [23, 2], [11.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [12.7, 6.9], [12.6, 7.7], [11.4, 0], [11.1, 0], [13.4, 0], [11.4, 0]]
                }
            ],
            */
           
           series: [
            {
                name: "하선 좌레일",
                data: []
            }, {
                name: "상선 좌레일",
                data: []
            }, {
                name: "하선 우레일",
                data: []
            }, {
                name: "상선 우레일",
                data: []
            }
           ]
           
        };
    }

    componentDidMount() {
        this.initSeries();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.data === undefined) {
            this.initSeries();
        } else if(this.props.data.length !== prevProps.data.length) {
            this.initSeries();
        } else if(JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
            this.initSeries();
        }


    }

    initSeries() {
        let series = [
            {
                name: "하선 좌레일",
                data: []
            }, {
                name: "상선 좌레일",
                data: []
            }, {
                name: "하선 우레일",
                data: []
            }, {
                name: "상선 우레일",
                data: []
            }
        ];

        for(let i = 0 ; i < this.props.data.length ; i++) {
            let data = this.props.data[i];
            
            if(data.track_type === 0) {
                series[0].data.push([data.mgt, data.w_left]);
                series[2].data.push([data.mgt, data.w_right]);
            } else {
                series[1].data.push([data.mgt, data.w_left]);
                series[3].data.push([data.mgt, data.w_right]);
            }
        }

        this.setState({
            series: series
        });
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="scatter"
                height="100%"
            />
        );
    }
}

export default WearInfo;