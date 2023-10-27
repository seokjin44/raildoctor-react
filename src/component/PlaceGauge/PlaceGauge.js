import React from "react";
import "./PlaceGauge.css";
import classNames from "classnames";
import { STRING_DOWN_TRACK_LEFT2, STRING_DOWN_TRACK_RIGHT2, STRING_UP_TRACK_LEFT2, STRING_UP_TRACK_RIGHT2 } from "../../constant";
import { convertToCustomFormat } from "../../util";

let rectList = [];
class PlaceGauge extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			id: Math.random().toString(36).substring(2, 11),
			canvas: undefined,
			ctx: undefined,

			tooltipLeft : 100,
			tooltipTop : 100,
			tooltipOn : false,

			findRects : [],
			// user defined properties  
			minX: 0,
			minY: 0,
			maxX: 100,
			maxY: 100,
			unitsPerTickX: 20,
			unitsPerTickY: 20,
			rightMargin : 50,
			lineSpacing : 25,
			// constants  
			padding: 25,
			tickSize: 10,
			axisColor: "#555",
			pointRadius: 5,
			font: "12pt NEO_R",

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
		this.drawPoint();
		this.drawPlace();
	}

	componentDidUpdate(prevProps) {
		if(prevProps.path == undefined && this.props.path == undefined)	return;
		if(this.props.path != undefined) {
			this.init();
			this.drawPoint();
			this.drawPlace();
		} else if(this.props.path.section_id !== prevProps.path.section_id) {
			this.init();
			this.drawPoint();
			this.drawPlace();
		}
	}

	init = function () {
		document.getElementById("place-info-container-" + this.state.id).innerHTML = "";
		let canvas = document.createElement("canvas");
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		canvas.id = "place-info-canvas-" + this.state.id;
		canvas.width = document.getElementById("place-info-container-" + this.state.id).offsetWidth;
		canvas.height = document.getElementById("place-info-container-" + this.state.id).offsetHeight;
		this.state.canvas = canvas;
		this.state.ctx = canvas.getContext("2d");
		document.getElementById("place-info-container-" + this.state.id).appendChild(canvas);

		// user defined properties  
		this.state.minX = 0;
		this.state.minY = 0;
		this.state.maxX = 100;
		this.state.maxY = 100;
		this.state.unitsPerTickX = 20;
		this.state.unitsPerTickY = 20;

		// constants  
		this.state.padding = 40;
		this.state.tickSize = 10;
		this.state.axisColor = "#555";
		this.state.pointRadius = 5;
		this.state.font = "10pt NEO_R";

		this.state.fontHeight = 12;

		// relationships
		this.state.rangeX = this.state.maxX - this.state.minX;
		this.state.rangeY = this.state.maxY - this.state.minY;
		this.state.numXTicks = Math.round(this.state.rangeX / this.state.unitsPerTickX);
		this.state.numYTicks = Math.round(this.state.rangeY / this.state.unitsPerTickY);
		this.state.x = this.getLongestValueWidth() + this.state.padding * 4;
		this.state.y = this.state.padding;
		this.state.width = this.state.canvas.width - this.state.x - this.state.padding * 2;
		this.state.height = this.state.canvas.height - this.state.y - this.state.padding - this.state.fontHeight;
		this.state.scaleX = this.state.width / this.state.rangeX;
		this.state.scaleY = this.state.height / this.state.rangeY;

		// draw axis and tick marks
		this.drawAxis();
	}

	getLongestValueWidth = function () {
		this.state.ctx.font = this.state.font;
		let longestValueWidth = 0;
		for (let n = 0; n <= this.numYTicks; n++) {
			let value = this.maxY - (n * this.unitsPerTickY);
			longestValueWidth = Math.max(longestValueWidth, this.state.ctx.measureText(value).width);
		}
		return longestValueWidth;
	}

	drawAxis = function () {
		let context = this.state.ctx;
		let rightMargin = this.state.rightMargin;
		let lineSpacing = this.state.lineSpacing;
		context.save();

		context.font = "bold 12px NEO_R";
		context.fillStyle = "black";
		context.textAlign = "left";

		context.fillText("상선", this.state.x - 60, this.state.canvas.height / 2 - this.state.padding + this.state.fontHeight / 2 - 2.5);

		//상선 좌
		context.beginPath();
		context.fillText("좌", this.state.x - 30, this.state.canvas.height / 2 - this.state.padding + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 - this.state.padding);
		context.lineTo(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 - this.state.padding);
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		//상선 우
		context.beginPath();
		context.fillText("우", this.state.x - 30, this.state.canvas.height / 2 - this.state.padding + lineSpacing + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 - this.state.padding + lineSpacing);
		context.lineTo(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 - this.state.padding + lineSpacing);
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		context.fillText("하선", this.state.x - 60, this.state.canvas.height / 2 + this.state.padding - lineSpacing + this.state.fontHeight / 2 - 2.5);

		//하선 우
		context.beginPath();
		context.fillText("우", this.state.x - 30, this.state.canvas.height / 2 + this.state.padding + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 + this.state.padding);
		context.lineTo(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 + this.state.padding);
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		//하선 좌
		context.beginPath();
		context.fillText("좌", this.state.x - 30, this.state.canvas.height / 2 + this.state.padding - lineSpacing + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 + this.state.padding - lineSpacing);
		context.lineTo(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 + this.state.padding - lineSpacing);
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();


		let startName = (this.props.path == undefined) ? "" : this.props.path.start_station_name;
		let endName = (this.props.path == undefined) ? "" : this.props.path.end_station_name;
		context.font = "bold 12pt NEO_R";
		context.textAlign = "left"
		context.fillText(startName, 10, this.state.canvas.height / 2 + this.state.fontHeight / 2);
		context.textAlign = "right"
		context.fillText(endName, this.state.canvas.width - 10, this.state.canvas.height / 2 + this.state.fontHeight / 2);

		//하선 우
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 + this.state.padding, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 + this.state.padding, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		/////////////////////

		//하선 좌
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 + this.state.padding - lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 + this.state.padding - lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		/////////////////////////

		//상선 좌
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 - this.state.padding, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 - this.state.padding, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		///////////////////////

		//상선 우
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 - this.state.padding + lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width - rightMargin, this.state.canvas.height / 2 - this.state.padding + lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.restore();
	}

	naming(location) {
		let km = 1000;

		let front = parseInt(location / km);
		if(front === 0)	front = "";
		else			front = front + "K";

		let back = location % km;
		if(back === 0)	back = "000";

		return front + back;
	}

	drawPlace() {
		rectList = [];
		if(this.props.path === undefined)	return;
		if(this.props.instrumentationPoint === undefined)	return;
		let lineSpacing = this.state.lineSpacing;
		let context = this.state.ctx;
		context.save();
		console.log(this.props.path);
		let trackBeginKP = this.props.path.beginKp;
		let trackEndKP = this.props.path.endKp;
		let trackLength = trackEndKP - trackBeginKP;

		for( let data of this.props.existData ){
			let start = data.beginKp * 1000;
			let end = data.endKp * 1000;
			let railTrack = data.railTrack;
			if( start < trackBeginKP && end > trackEndKP ){
				start = trackBeginKP;
				end = trackEndKP;
			}else if( end < trackBeginKP ){
				continue;
			}else if( start > trackEndKP ){
				continue;
			}
			if( start < trackBeginKP ){
				start = trackBeginKP;
			}
			if( end > trackEndKP ){
				end = trackEndKP;
			}
			context.strokeStyle = 'black';
			context.fillStyle = (this.props.selectedGauge === data.roughnessId) ? 'red' : 'orange';
			let startPoint = {
				x: (start - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: this.naming(start)
			}
			let endPoint = {
				x: (end - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: this.naming(start)
			}
			let boxWidth = (endPoint.x * this.state.scaleX) - (startPoint.x * this.state.scaleX) - this.state.padding - 10;
			if( boxWidth < 0 ){ continue; }
			if( railTrack === STRING_UP_TRACK_RIGHT2 ){
				let y = this.state.canvas.height / 2 - this.state.padding + lineSpacing;
				let rect = {
					beginKp : data.beginKp,
					endKp : data.endKp,
					x : startPoint.x * this.state.scaleX + this.state.x, 
					y : y - 10,
					width : boxWidth,
					height : 20,
					dataFile : data.dataFile,
					railroadId : data.railroadId,
					roughnessId : data.roughnessId
				}
				rectList.push(rect);
				context.fillRect(rect.x, rect.y, rect.width, rect.height);
				context.strokeRect(rect.x, rect.y, rect.width, rect.height);
			}else if( railTrack === STRING_DOWN_TRACK_LEFT2 ){
				let y = this.state.canvas.height / 2 + this.state.padding - lineSpacing;
				let rect = {
					beginKp : data.beginKp,
					endKp : data.endKp,
					x : startPoint.x * this.state.scaleX + this.state.x, 
					y : y - 10,
					width : boxWidth,
					height : 20,
					dataFile : data.dataFile,
					railroadId : data.railroadId,
					roughnessId : data.roughnessId
				}
				rectList.push(rect);
				context.fillRect(rect.x, rect.y, rect.width, rect.height);
				context.strokeRect(rect.x, rect.y, rect.width, rect.height);
			}else if( railTrack === STRING_DOWN_TRACK_RIGHT2 ){
				let y = this.state.canvas.height / 2 + this.state.padding;
				let rect = {
					beginKp : data.beginKp,
					endKp : data.endKp,
					x : startPoint.x * this.state.scaleX + this.state.x, 
					y : y - 10,
					width : boxWidth,
					height : 20,
					dataFile : data.dataFile,
					railroadId : data.railroadId,
					roughnessId : data.roughnessId
				}
				rectList.push(rect);
				context.fillRect(rect.x, rect.y, rect.width, rect.height);
				context.strokeRect(rect.x, rect.y, rect.width, rect.height);
			}else if( railTrack === STRING_UP_TRACK_LEFT2 ){
				let y = this.state.canvas.height / 2 - this.state.padding;
				let rect = {
					beginKp : data.beginKp,
					endKp : data.endKp,
					x : startPoint.x * this.state.scaleX + this.state.x, 
					y : y - 10,
					width : boxWidth,
					height : 20,
					dataFile : data.dataFile,
					railroadId : data.railroadId,
					roughnessId : data.roughnessId
				}
				rectList.push(rect);
				context.fillRect(rect.x, rect.y, rect.width, rect.height);
				context.strokeRect(rect.x, rect.y, rect.width, rect.height);
			}
		}

		context.restore();
	}

	drawPoint() {
		if(this.props.path === undefined)	return;
		if(this.props.instrumentationPoint === undefined)	return;

		let context = this.state.ctx;
		context.save();
		let trackBeginKP = this.props.path.beginKp * 1000;
		let trackEndKP = this.props.path.endKp * 1000;
		let trackLength = trackEndKP - trackBeginKP;

		let x = 0, y = 0;
		let data = this.props.instrumentationPoint;

		for (let point of data ) {
			//상선
			if (point.track_type === 1) {
				x = ((point.location - trackBeginKP) / trackLength) * 100;
				y = this.state.canvas.height / 2 - this.state.padding;
			}
			//하선
			else if (point.track_type === 0) {
				x = ((point.location - trackBeginKP) / trackLength) * 100;
				y = this.state.canvas.height / 2 + this.state.padding;
			}

			let name = this.naming(point.location);

			// draw place  
			context.beginPath();
			context.fillStyle = "blue";
			context.arc(x * this.state.scaleX + this.state.x, y, this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
			context.fill();
			context.textBaseline = "bottom";
			context.textAlign = "center";
			//context.fillText(name, x * this.state.scaleX + this.state.x, y - (this.state.padding / 4));
			context.fillText(point.name, x * this.state.scaleX + this.state.x, y - (this.state.padding / 4));
			context.closePath();
		}

		context.restore();
	}

	isInside(mouseX, mouseY, rect) {
		return (
			mouseX >= rect.x && mouseX <= rect.x + rect.width &&
			mouseY >= rect.y && mouseY <= rect.y + rect.height
		);
	}

	render() {
		return (
			<>
			<div className={classNames("placeInfoBox")} id={"place-info-container-" + this.state.id}
				onMouseMove={(e)=>{
					let container = document.getElementById("place-info-container-" + this.state.id);
					let canvas = document.getElementById("place-info-canvas-" + this.state.id);
					const rect = canvas.getBoundingClientRect();
					const x = e.clientX - rect.left;
					const y = e.clientY - rect.top;

					this.setState({
						tooltipLeft : e.clientX - 50,
						tooltipTop : e.clientY + 30
					})

					let isInsideRect = false;
					const hoveringRects = rectList.filter(r => this.isInside(x, y, r));
					if(hoveringRects.length > 0) {
						console.log('Mouse is inside these rectangles:', hoveringRects);
						isInsideRect = true;
						this.setState({
							tooltipOn : true,
							findRects : hoveringRects,
						})
					}else{
						this.setState({
							tooltipOn : false
						})
					}
					
					container.style.cursor = isInsideRect ? 'pointer' : 'default';
				}}

				onMouseUp={()=>{
					this.props.selectGauge(this.state.findRects);
				}}
			>
			</div>
			<div className="placeGaugeTooltip" style={{
					display : (this.state.tooltipOn) ? "flex" : "none",
					left : this.state.tooltipLeft, 
					top : this.state.tooltipTop
				}} >
					{
						this.state.findRects.map( (rect,i) => {
							return <div className="kp" key={i}>
								{`${convertToCustomFormat(rect.beginKp*1000)}~${convertToCustomFormat(rect.endKp*1000)}`}
							</div>
						})
					}
			</div>
			</>
		);
	}
}

export default PlaceGauge;