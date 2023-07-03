import React from "react";
import "./DailyInstrumentation.css";
import Chart from "react-apexcharts";

class DailyInstrumentation extends React.Component {
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
                    size: 4,
                },
                xaxis: {
                    type: 'datetime',
                    categories: this.props.xData,
                    labels: {
                        show: false,
                    }
                },
                yaxis: {
                    labels: {
                        show: false,
                    }
                },
                colors: ['#008FFB', '#FF8FFB'],
                stroke: {
                    width: 2
                },
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
                    show: false,
                },
                title: {
                    text: this.props.title,
                    align: 'left',
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: '#263238'
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            series: [
                {
                    name: "series-1",
                    data: this.props.yData0
                },
                {
                    name: "series-2",
                    data: this.props.yData1
                }
            ]
        };
    }

    init() {

    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.xData == undefined && prevProps.yData0 == undefined && prevProps.yData1 == undefined && 
            this.props.xData == undefined && this.props.yData0 == undefined && this.props.yData1 == undefined)	return;
        if(prevProps.xData.length == 0 && this.props.xData.length == 0 && 
            prevProps.yData0.length == 0 && this.props.yData0.length == 0 && 
            prevProps.yData1.length == 0 && this.props.yData1.length == 0)    return;
        if(this.props.xData[0] != prevProps.xData[0] && this.props.yData0[0] != prevProps.yData0[0] && this.props.yData1[0] != prevProps.yData1[0]) {
        
        }
    }

    componentDidUpdate(prevProps) {
		if(prevProps.xData == undefined && prevProps.yData == undefined && this.props.xData == undefined && this.props.yData == undefined)	return;
        if(prevProps.xData.length == 0 && this.props.xData.length == 0 && prevProps.yData0.length == 0 && this.props.yData0.length == 0 && prevProps.yData1.length == 0 && this.props.yData1.length == 0)    return;
        if(this.props.xData[0] != prevProps.xData[0] || this.props.yData0[0] != prevProps.yData0[0] || this.props.yData1[0] != prevProps.yData1[0]) {
            this.setState({
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
                        size: 4,
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: this.props.xData,
                        labels: {
                            show: false,
                        }
                    },
                    yaxis: {
                        labels: {
                            show: false,
                        }
                    },
                    colors: ['#008FFB', '#FF8FFB'],
                    stroke: {
                        width: 2
                    },
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
                        show: false,
                    },
                    title: {
                        text: this.props.title,
                        align: 'left',
                        offsetX: 0,
                        offsetY: 0,
                        floating: false,
                        style: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: undefined,
                            color: '#263238'
                        },
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
                series: [
                    {
                        name: "series-1",
                        data: this.props.yData0
                    },
                    {
                        name: "series-2",
                        data: this.props.yData1
                    }
                ]
            });
        }
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                type="line"
                height="100%"
            />
        );
    }
}

export default DailyInstrumentation;