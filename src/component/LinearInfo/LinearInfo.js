import React from "react";
import "./LinearInfo.css";

class LinearInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: Math.random().toString(36).substring(2, 11),
      canvas: undefined,
      ctx: undefined,

      // user defined properties  
      minX: 0,
      minY: 0,
      maxX: 140,
      maxY: 100,
      unitsPerTickX: 20,
      unitsPerTickY: 20,

      // constants  
      padding: 30,
      tickSize: 10,
      axisColor: "#555",
      pointRadius: 5,
      font: "12pt Calibri",          

      fontHeight: 12,

      // relationships
      rangeX: undefined,
      rangeY: undefined,
      numXTicks: undefined,
      numYTicks: undefined,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      scaleX: undefined,
      scaleY: undefined,
    }
  }

  componentDidMount() {
    this.init();
    this.drawLine();
  }

  init = function () {
    document.getElementById("linear-info-container-" + this.state.id).innerHTML = "";
    let canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "linear-info-canvas-" + this.state.id;
    canvas.width = document.getElementById("linear-info-container-" + this.state.id).offsetWidth;
    canvas.height = document.getElementById("linear-info-container-" + this.state.id).offsetHeight;
    this.state.canvas = canvas;
    this.state.ctx = canvas.getContext("2d");
    document.getElementById("linear-info-container-" + this.state.id).appendChild(canvas);

    // user defined properties  
    this.state.minX = 0;
    this.state.minY = 0;
    this.state.maxX = 100;
    this.state.maxY = 100;
    this.state.unitsPerTickX = 10;
    this.state.unitsPerTickY = 10;

    // constants  
    this.state.padding = 10;
    this.state.tickSize = 10;
    this.state.axisColor = "#555";
    this.state.pointRadius = 5;
    this.state.font = "10pt Calibri";

    this.state.fontHeight = 10;

    // relationships
    this.state.rangeX = this.state.maxX - this.state.minX;
    this.state.rangeY = this.state.maxY - this.state.minY;
    this.state.numXTicks = Math.round(this.state.rangeX / this.state.unitsPerTickX);
    this.state.numYTicks = Math.round(this.state.rangeY / this.state.unitsPerTickY);
    this.state.x = this.getLongestValueWidth() + this.state.padding;
    this.state.y = this.state.padding * 2;
    this.state.width = this.state.canvas.width - this.state.x - this.state.padding * 5;
    this.state.height = this.state.canvas.height - this.state.y - this.state.padding * 2;
    this.state.scaleX = this.state.width / this.state.rangeX;
    this.state.scaleY = this.state.height / this.state.rangeY;

    // draw axis and tick marks   
    this.drawAxis();
    this.drawLegend();
  }

  getLongestValueWidth = function () {
    this.state.ctx.font = this.state.font;
    let longestValueWidth = 0;
    for (let n = 0; n <= this.state.numYTicks; n++) {
      let value = this.state.maxY - (n * this.state.unitsPerTickY);
      longestValueWidth = Math.max(longestValueWidth, this.state.ctx.measureText(value).width);
    }
    return longestValueWidth;
  };

  drawAxis = function () {
    let context = this.state.ctx;

    context.save();

    // draw tick marks  
    context.beginPath();

    let n = this.state.numYTicks / 2;
    context.moveTo(this.state.x + this.state.padding * 2, n * this.state.height / this.state.numYTicks + this.state.y);
    context.lineTo(this.state.x + this.state.width, n * this.state.height / this.state.numYTicks + this.state.y);

    context.setLineDash([0]);
    context.lineWidth = 2;
    context.stroke();

    context.restore();
  };

  drawLegend = function () {
    let context = this.state.ctx;

    context.save();

    context.font = "bold 10pt NEO_R";

    let n = this.state.numYTicks / 4;
    context.fillText("선형정보", this.state.padding / 2, n * this.state.height / this.state.numYTicks + this.state.y);
    context.fillText(" 상/하선", this.state.padding / 2, n * this.state.height / this.state.numYTicks + this.state.y + this.state.fontHeight * 1.5);

    context.restore();
  }


  drawLine = function () {
    let color = "red";

    let context = this.state.ctx;
    context.save();

    for (let n = 0; n < this.props.data.length; n++) {
      let point = this.props.data[n];

      //draw line
      if (n > 0) {
        let _point = this.props.data[n - 1];
        context.beginPath();

        context.strokeStyle = color;
        context.fillStyle = color;

        if (_point.type == "line") context.setLineDash([0]);
        else if (_point.type == "dash") context.setLineDash([4]);

        context.lineWidth = 1.5;

        context.moveTo(_point.x * this.state.scaleX + this.state.x, this.state.y + this.state.height - _point.y * this.state.scaleY);
        context.lineTo(point.x * this.state.scaleX + this.state.x, this.state.y + this.state.height - point.y * this.state.scaleY);

        context.stroke();

        context.closePath();
      }

      context.fillText(point.name, point.x * this.state.scaleX + this.state.x, this.state.y + this.state.height - point.y * this.state.scaleY + this.state.fontHeight * 1.5);
    }

    context.restore();
  }
  render() {
    return (
      <div className="linearInfoBox" id={"linear-info-container-" + this.state.id}></div>
    );
  }
}

export default LinearInfo;