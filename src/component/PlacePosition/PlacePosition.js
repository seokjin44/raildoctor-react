import React from "react";
import "./PlacePosition.css";
import classNames from "classnames";
import { convertToCustomFormat, getTrackText } from "../../util";
import { STRING_SHORT_MEASURE } from "../../constant";
import { isEqual } from "lodash";

let pointList = [];
let route = sessionStorage.getItem('route');
class PlacePosition extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			id: Math.random().toString(36).substring(2, 11),
			canvas: undefined,
			ctx: undefined,
			hoverPoint : {sensorId : ""},
			lineSpacing : 20,

			// user defined properties  
			minX: 0,
			minY: 0,
			maxX: 100,
			maxY: 100,
			unitsPerTickX: 20,
			unitsPerTickY: 20,

			// constants  
			padding: 50,
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
		} else if( !isEqual(prevProps.selectViewMeasure, this.props.selectViewMeasure) ) {
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
		this.state.padding = 50;
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
		this.state.x = this.getLongestValueWidth() + this.state.padding * 2;
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
		let lineSpacing = this.state.lineSpacing;
		context.save();

		context.font = "bold 12px NEO_R";
		context.fillStyle = "black";
		context.textAlign = "left";

		context.fillText(getTrackText("상선", route), this.state.x - 60, this.state.canvas.height / 2 - this.state.padding - lineSpacing + this.state.fontHeight / 2 - 2.5);

		//상선 좌
		context.beginPath();
		context.fillText("좌", this.state.x - 30, this.state.canvas.height / 2 - this.state.padding - lineSpacing + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 - this.state.padding - lineSpacing);
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 - this.state.padding - lineSpacing);
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		//상선 우
		context.beginPath();
		context.fillText("우", this.state.x - 30, this.state.canvas.height / 2 - this.state.padding + (lineSpacing / 2) + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 - this.state.padding + (lineSpacing / 2));
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 - this.state.padding + (lineSpacing / 2));
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		context.fillText(getTrackText("하선", route), this.state.x - 60, this.state.canvas.height / 2 + this.state.padding - (lineSpacing / 2) + this.state.fontHeight / 2 - 2.5);

		//하선 좌
		context.beginPath();
		context.fillText("좌", this.state.x - 30, this.state.canvas.height / 2 + this.state.padding - (lineSpacing / 2) + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 + this.state.padding - (lineSpacing / 2) );
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 + this.state.padding - (lineSpacing / 2) );
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		//하선 우
		context.beginPath();
		context.fillText("우", this.state.x - 30, this.state.canvas.height / 2 + this.state.padding + lineSpacing + this.state.fontHeight / 2 - 2.5);
		context.moveTo(this.state.x, this.state.canvas.height / 2 + this.state.padding + lineSpacing);
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 + this.state.padding + lineSpacing);
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		context.font = "bold 12pt NEO_R";
		context.fillStyle = "black";
		context.textAlign = "left";

		let startName = (this.props.path == undefined) ? "" : this.props.path.start_station_name;
		let endName = (this.props.path == undefined) ? "" : this.props.path.end_station_name;

		context.textAlign = "left"
		context.fillText(startName, 10, this.state.canvas.height / 2 + this.state.fontHeight / 2);
		context.textAlign = "right"
		context.fillText(endName, this.state.canvas.width - 10, this.state.canvas.height / 2 + this.state.fontHeight / 2);

		//상선 좌
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 - this.state.padding - lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width, this.state.canvas.height / 2 - this.state.padding - lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		//상선 우
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 - this.state.padding + (lineSpacing / 2), this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width, this.state.canvas.height / 2 - this.state.padding + (lineSpacing / 2), this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		//하선 좌
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 + this.state.padding - (lineSpacing / 2), this.state.pointRadius * 1, 0, 2 * Math.PI, false);

		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width, this.state.canvas.height / 2 + this.state.padding - (lineSpacing / 2), this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		//하선 우
		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 + this.state.padding + lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width, this.state.canvas.height / 2 + this.state.padding + lineSpacing, this.state.pointRadius * 1, 0, 2 * Math.PI, false);
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
		let lineSpacing = this.state.lineSpacing;
		pointList = [];
		if(this.props.path === undefined)	return;
		if(this.props.instrumentationPoint === undefined)	return;

		let context = this.state.ctx;
		context.save();

		let trackBeginKP = this.props.path.beginKp;
		let trackEndKP = this.props.path.endKp;
		let trackLength = trackEndKP - trackBeginKP;

		//상선 좌
		for(let trackPoint of this.props.upLeftTrackPoint ) {
			if( this.props.selectViewMeasure.indexOf(trackPoint.measureType) < 0 ){
				continue;
			}
			let location = trackPoint.kp * 1000;
			if( !(location >= trackBeginKP && location <= trackEndKP) ){
				continue;
			}
			let point = {
				x: (location - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: this.naming(location)
			}

			let y = this.state.canvas.height / 2 - this.state.padding - lineSpacing;

			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = (trackPoint.measureType === STRING_SHORT_MEASURE) ? "blue" : "yellow";
			context.fill();
			context.stroke();

			context.fillStyle = (this.state.hoverPoint?.sensorId === trackPoint.sensorId) ? "black" : "rgba(0, 0, 0, 0.25)" ;
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(`${convertToCustomFormat(trackPoint.kp*1000)}(좌)`, point.x * this.state.scaleX + this.state.x, y - 10);
			
			context.closePath();
			pointList.push({
				x : point.x * this.state.scaleX + this.state.x,
				y : y,
				radius : this.state.pointRadius + 3,
				sensorId : trackPoint.sensorId,
				displayName : trackPoint.displayName,
				measureSetId : trackPoint.measureSetId,
			});
		}

		//상선 우
		for(let trackPoint of this.props.upRightTrackPoint ) {
			if( this.props.selectViewMeasure.indexOf(trackPoint.measureType) < 0 ){
				continue;
			}
			let location = trackPoint.kp * 1000;
			if( !(location >= trackBeginKP && location <= trackEndKP) ){
				continue;
			}
			let point = {
				x: (location - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: this.naming(location)
			}

			let y = this.state.canvas.height / 2 - this.state.padding + (lineSpacing / 2);

			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = (trackPoint.measureType === STRING_SHORT_MEASURE) ? "blue" : "yellow";
			context.fill();
			context.stroke();

			context.fillStyle = (this.state.hoverPoint?.sensorId === trackPoint.sensorId) ? "black" : "rgba(0, 0, 0, 0.25)" ;
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(`${convertToCustomFormat(trackPoint.kp*1000)}(우)`, point.x * this.state.scaleX + this.state.x, y - 10);

			context.closePath();
			pointList.push({
				x : point.x * this.state.scaleX + this.state.x,
				y : y,
				radius : this.state.pointRadius + 3,
				sensorId : trackPoint.sensorId,
				displayName : trackPoint.displayName,
				measureSetId : trackPoint.measureSetId,
			});
		}

		//하선 좌
		for(let trackPoint of this.props.downLeftTrackPoint ) {
			if( this.props.selectViewMeasure.indexOf(trackPoint.measureType) < 0 ){
				continue;
			}
			let location = trackPoint.kp * 1000;
			if( !(location >= trackBeginKP && location <= trackEndKP) ){
				continue;
			}
			let point = {
				x: (location - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: this.naming(location)
			}

			let y = this.state.canvas.height / 2 + this.state.padding - (lineSpacing / 2);

			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = (trackPoint.measureType === STRING_SHORT_MEASURE) ? "blue" : "yellow";
			context.fill();
			context.stroke();

			context.fillStyle = (this.state.hoverPoint?.sensorId === trackPoint.sensorId) ? "black" : "rgba(0, 0, 0, 0.25)" ;
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(`${convertToCustomFormat(trackPoint.kp*1000)}(좌)`, point.x * this.state.scaleX + this.state.x, y - 10);

			context.closePath();
			pointList.push({
				x : point.x * this.state.scaleX + this.state.x,
				y : y,
				radius : this.state.pointRadius + 3,
				sensorId : trackPoint.sensorId,
				displayName : trackPoint.displayName,
				measureSetId : trackPoint.measureSetId,
			});
		}

		//하선 우
		for(let trackPoint of this.props.downRightTrackPoint ) {
			if( this.props.selectViewMeasure.indexOf(trackPoint.measureType) < 0 ){
				continue;
			}
			let location = trackPoint.kp * 1000;
			if( !(location >= trackBeginKP && location <= trackEndKP) ){
				continue;
			}
			let point = {
				x: (location - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: this.naming(location)
			}

			let y = this.state.canvas.height / 2 + this.state.padding + lineSpacing;

			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = (trackPoint.measureType === STRING_SHORT_MEASURE) ? "blue" : "yellow";
			context.fill();
			context.stroke();

			context.fillStyle = (this.state.hoverPoint?.sensorId === trackPoint.sensorId) ? "black" : "rgba(0, 0, 0, 0.25)" ;
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(`${convertToCustomFormat(trackPoint.kp*1000)}(우)`, point.x * this.state.scaleX + this.state.x, y - 10);

			context.closePath();
			pointList.push({
				x : point.x * this.state.scaleX + this.state.x,
				y : y,
				radius : this.state.pointRadius + 3,
				sensorId : trackPoint.sensorId,
				displayName : trackPoint.displayName,
				measureSetId : trackPoint.measureSetId,
			});
		}

		context.restore();
	}

	drawPoint() {
		if(this.props.path === undefined)	return;
		if(this.props.instrumentationPoint === undefined)	return;

		let context = this.state.ctx;
		context.save();

		let trackBeginKP = this.props.path.beginKp;
		let trackEndKP = this.props.path.endKp;
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

	render() {
		return (
			<div className={classNames("placeInfoBox")} id={"place-info-container-" + this.state.id}
				onMouseMove={(e)=>{
					let container = document.getElementById("place-info-container-" + this.state.id);
					let canvas = document.getElementById("place-info-canvas-" + this.state.id);
					const rect = canvas.getBoundingClientRect();
					const x = e.clientX - rect.left;
					const y = e.clientY - rect.top;
					
					let isInsideCircle = false;
					
					pointList.forEach(circle => {
						const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
						if (distance < circle.radius) {
							isInsideCircle = true;
							this.setState({hoverPoint : circle})
						}
					});
					if( !isInsideCircle ){ this.setState({hoverPoint : null}) }
					container.style.cursor = isInsideCircle ? 'pointer' : 'default';
				}}
				onMouseUp={()=>{
					if( this.state.hoverPoint ){
						this.props.pointClick(this.state.hoverPoint);
					}
					this.setState({
						hoverPoint : null
					})
				}}
			></div>
		);
	}
}

export default PlacePosition;