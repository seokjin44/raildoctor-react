import React from "react";
import "./ShortTermInstrumentation.css";
import Chart from "react-apexcharts";

class ShortTermInstrumentation extends React.Component {
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
                xaxis: {
                    type: 'datetime',
                    categories: this.props.xData,
                    title: {
                        text: "Time(Sec)",
                        style: {
                            fontSize: '10px',
                            fontWeight: 400,
                        }
                    },
                    labels: {
                        formatter: function (value, timestamp) {
                            return new Date(timestamp).getSeconds() // The formatter function overrides format property
                        }, 
                    }
                },
                yaxis: {
                    title: {
                        text: this.props.yLabel,
                        rotate: -90,
                        style: {
                            fontSize: '8px',
                            fontWeight: 800,
                        }
                    },
                },
                colors: ['#ff0000'],
                stroke: {
                    width: 1
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
                    data: this.props.yData
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
		if(prevProps.xData == undefined && prevProps.yData == undefined && this.props.xData == undefined && this.props.yData == undefined)	return;
        if(prevProps.xData.length == 0 && this.props.xData.length == 0 && prevProps.yData.length == 0 && this.props.yData.length == 0)    return;
        if(this.props.xData[0] != prevProps.xData[0] && this.props.yData[0] != prevProps.yData[0]) {
            this.setState({ 
                options: {
                    chart: {
                        animations: {
                            enabled: false,
                        },
                        toolbar: {
                            show: true,
                        },
                        zoom: {
                            enabled: false,
                            autoScaleYaxis: false,
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: this.props.xData,
                        title: {
                            text: "Time(Sec)",
                            style: {
                                fontSize: '10px',
                                fontWeight: 400,
                            }
                        },
                        labels: {
                            formatter: function (value, timestamp) {
                                return new Date(timestamp).getSeconds() // The formatter function overrides format property
                            }, 
                        }
                    },
                    yaxis: {
                        title: {
                            text: this.props.yLabel,
                            rotate: -90,
                            style: {
                                fontSize: '8px',
                                fontWeight: 800,
                            }
                        },
                    },
                    colors: ['#ff0000'],
                    stroke: {
                        width: 1
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
                        data: this.props.yData
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

export default ShortTermInstrumentation;