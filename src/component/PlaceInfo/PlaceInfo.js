import React from "react";
import "./PlaceInfo.css";
import classNames from "classnames";
import { DOWN_TRACK, STRING_PATH, UP_TRACK } from "../../constant";
import { convertToCustomFormat } from "../../util";
import isEqual from 'lodash/isEqual';

let pointList = [];
class PlaceInfo extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			id: Math.random().toString(36).substring(2, 11),
			canvas: undefined,
			ctx: undefined,
			hoverPoint : null,
			// user defined properties  
			minX: 0,
			minY: 0,
			maxX: 100,
			maxY: 100,
			unitsPerTickX: 20,
			unitsPerTickY: 20,

			// constants  
			padding: 50,
			topPadding : 10,
			bottomPadding : 25,
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
		} else if(!isEqual(prevProps.upTrackMeasurePoint, this.props.upTrackMeasurePoint)) {
			this.init();
			this.drawPoint();
			this.drawPlace();
		} else if(!isEqual(prevProps.downTrackMeasurePoint, this.props.downTrackMeasurePoint)) {
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

		context.save();

		context.beginPath();
		context.moveTo(this.state.x, this.state.canvas.height / 2 - this.state.padding + this.state.topPadding );
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 - this.state.padding + this.state.topPadding );
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		context.beginPath();
		context.moveTo(this.state.x, this.state.canvas.height / 2 + this.state.padding - this.state.bottomPadding );
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 + this.state.padding - this.state.bottomPadding );
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

		//하선동그라미(양쪽끝)
		context.beginPath();
		context.arc(this.state.x, 
			this.state.canvas.height / 2 + this.state.padding - this.state.bottomPadding ,
			this.state.pointRadius * 1.5, 0, 2 * Math.PI,
			false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width,
			this.state.canvas.height / 2 + this.state.padding - this.state.bottomPadding ,
			this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		//상선동그라미(양쪽끝)
		context.beginPath();
		context.arc(this.state.x,
			this.state.canvas.height / 2 - this.state.padding + this.state.topPadding, 
			this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width,
			this.state.canvas.height / 2 - this.state.padding + this.state.topPadding, 
			this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.restore();
	}

	/* naming(location) {
		let km = 1000;

		let front = parseInt(location / km);
		if(front === 0)	front = "";
		else			front = front + "K";

		let back = location % km;
		if(back === 0)	back = "000";

		return front + back;
	} */

	drawPlace() {
		pointList = [];
		if(this.props.path === undefined)	return;
		if(this.props.instrumentationPoint === undefined)	return;

		let context = this.state.ctx;
		context.save();
		let trackBeginKP = this.props.path.beginKp;
		let trackEndKP = this.props.path.endKp;
		let trackLength = trackEndKP - trackBeginKP;

		/* let tick = (this.props.path.type === STRING_PATH) ? 100 : 20;
		let upTrackNumTick = parseInt(trackLength / tick);
		let downTrackNumTick = parseInt(trackLength / tick); */

		//상선
		let viewUpPointcount = 0;
		// 배열의 각 요소에 대해 반복
		this.props.upTrackMeasurePoint.forEach(obj => {
			let location = obj * 1000;
			if(!( location < trackBeginKP || trackEndKP < location )){
				viewUpPointcount++; // 조건을 만족하면 카운트 증가
			}
		});
		for(let i = 1 ; i < this.props.upTrackMeasurePoint.length; i++) {
			let location = this.props.upTrackMeasurePoint[i] * 1000;
			if( location < trackBeginKP || trackEndKP < location ){continue;}
			let point = {
				x: (location - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: convertToCustomFormat(location)
			}

			let y = this.state.canvas.height / 2 - this.state.padding + this.state.topPadding;
			let fontColor = "rgba(0, 0, 0, 0.25)";
			let strokeColor = "black"
			if( viewUpPointcount > 30 ){
				fontColor = "#00000000";
				strokeColor = "#00000000";
			}
			context.strokeStyle = strokeColor;
			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = (
				point.name === this.props.selectKP.name &&
				this.props.selectKP.trackType === UP_TRACK
			) ? "orange" : "yellow";
			context.fill();
			context.stroke();


			if( this.state.hoverPoint?.name === point.name &&
				this.state.hoverPoint?.trackType === UP_TRACK ){
				fontColor = "black";
			}
			if(point.name === this.props.selectKP.name &&
				this.props.selectKP.trackType === UP_TRACK ){
				fontColor = "orange" ;
			}
			context.fillStyle = fontColor;
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(point.name, point.x * this.state.scaleX + this.state.x, y + (this.state.padding * 0.5));
			context.closePath();

			pointList.push({
				x : point.x * this.state.scaleX + this.state.x,
				y : y,
				radius : this.state.pointRadius + 3,
				name: point.name,
				trackType : UP_TRACK,
				beginKp : location,
				endKp : location + 999
			});
		}

		//하선
		let viewDownPointcount = 0;
		// 배열의 각 요소에 대해 반복
		this.props.downTrackMeasurePoint.forEach(obj => {
		  let location = obj * 1000;
		  if(!( location < trackBeginKP || trackEndKP < location )){
			viewDownPointcount++; // 조건을 만족하면 카운트 증가
		  }
		});

		for(let i = 1 ; i < this.props.downTrackMeasurePoint.length; i++) {
			let location = this.props.downTrackMeasurePoint[i] * 1000;
			if( location < trackBeginKP || trackEndKP < location ){continue;}
			let point = {
				x: (location - trackBeginKP) / trackLength * 100,
				trackType: 1,
				name: convertToCustomFormat(location)
			}

			let y = this.state.canvas.height / 2 + this.state.padding - this.state.bottomPadding;
			let fontColor = "rgba(0, 0, 0, 0.25)";
			if( viewDownPointcount > 30 ){
					fontColor = "#00000000";

			}

			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = (
				point.name === this.props.selectKP.name &&
				this.props.selectKP.trackType === DOWN_TRACK
			) ? "orange" : "yellow";
			context.fill();
			context.stroke();

			

			if( this.state.hoverPoint?.name === point.name &&
				this.state.hoverPoint?.trackType === DOWN_TRACK ){
				fontColor = "black";
			}
			if(point.name === this.props.selectKP.name &&
				this.props.selectKP.trackType === DOWN_TRACK ){
				fontColor = "orange" ;
			}
			context.fillStyle = fontColor;
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(point.name, point.x * this.state.scaleX + this.state.x, y + (this.state.padding * 0.5));
			
			context.closePath();
			pointList.push({
				x : point.x * this.state.scaleX + this.state.x,
				y : y,
				radius : this.state.pointRadius + 3,
				name: point.name,
				trackType : DOWN_TRACK,
				beginKp : location,
				endKp : location + 999
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

		for (let point of data) {
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
							console.log("find");
							this.setState({hoverPoint : circle})
							isInsideCircle = true;
						}
					});
					if( !isInsideCircle ){this.setState({ hoverPoint : null })}
					container.style.cursor = isInsideCircle ? 'pointer' : 'default';
				}}
				onMouseUp={(e)=>{
					if( this.state.hoverPoint ){
						this.props.setSelectKP(this.state.hoverPoint);
					}
					this.setState({
						hoverPoint : null
					})
				}}
			></div>
		);
	}
}

export default PlaceInfo;