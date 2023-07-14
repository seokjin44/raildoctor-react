import React from "react";
import "./PlaceInfo.css";

class PlaceInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: Math.random().toString(36).substring(2, 11),
			canvas: undefined,
			ctx: undefined,

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
		context.moveTo(this.state.x, this.state.canvas.height / 2 - this.state.padding);
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 - this.state.padding);
		context.setLineDash([0]);
		context.lineWidth = 2;
		context.stroke();

		context.beginPath();
		context.moveTo(this.state.x, this.state.canvas.height / 2 + this.state.padding);
		context.lineTo(this.state.x + this.state.width, this.state.canvas.height / 2 + this.state.padding);
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

		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 + this.state.padding, this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width, this.state.canvas.height / 2 + this.state.padding, this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x, this.state.canvas.height / 2 - this.state.padding, this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(this.state.x + this.state.width, this.state.canvas.height / 2 - this.state.padding, this.state.pointRadius * 1.5, 0, 2 * Math.PI, false);
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
		if(this.props.path === undefined)	return;
		if(this.props.instrumentationPoint === undefined)	return;

		let context = this.state.ctx;
		context.save();

		let upTrackLength = this.props.path.end_station_up_track_location - this.props.path.start_station_up_track_location;
		let downTrackLength = this.props.path.end_station_down_track_location - this.props.path.start_station_down_track_location;

		let tick = 100;
		let upTrackNumTick = parseInt(upTrackLength / tick);
		let downTrackNumTick = parseInt(downTrackLength / tick);

		//상선
		for(let i = 1 ; i < upTrackNumTick ; i++) {
			let location = i * tick + this.props.path.start_station_up_track_location;
			let point = {
				x: (location - this.props.path.start_station_up_track_location) / upTrackLength * 100,
				trackType: 1,
				name: this.naming(location)
			}

			let y = this.state.canvas.height / 2 - this.state.padding;

			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = "yellow";
			context.fill();
			context.stroke();

			context.fillStyle = "black";
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(point.name, point.x * this.state.scaleX + this.state.x, y + (this.state.padding * 0.5));
			
			context.closePath();
		}

		//하선
		for(let i = 1 ; i < downTrackNumTick ; i++) {
			let location = i * tick + this.props.path.start_station_down_track_location;
			let point = {
				x: (location - this.props.path.start_station_down_track_location) / downTrackLength * 100,
				trackType: 1,
				name: this.naming(location)
			}

			let y = this.state.canvas.height / 2 + this.state.padding;

			context.beginPath();
			
			context.arc(point.x * this.state.scaleX + this.state.x, y, this.state.pointRadius, 0, 2 * Math.PI, false);
			context.fillStyle = "yellow";
			context.fill();
			context.stroke();

			context.fillStyle = "black";
			context.textBaseline = "bottom";
			context.textAlign = "center";
			context.fillText(point.name, point.x * this.state.scaleX + this.state.x, y + (this.state.padding * 0.5));
			
			context.closePath();
		}

		context.restore();
	}

	drawPoint() {
		if(this.props.path === undefined)	return;
		if(this.props.instrumentationPoint === undefined)	return;

		let context = this.state.ctx;
		context.save();

		let upTrackLength = this.props.path.end_station_up_track_location - this.props.path.start_station_up_track_location;
		let downTrackLength = this.props.path.end_station_down_track_location - this.props.path.start_station_down_track_location;

		let x = 0, y = 0;
		let data = this.props.instrumentationPoint;

		for (let n = 0; n < data.length; n++) {
			let point = data[n];
			//상선
			if (point.track_type == 1) {
				x = ((point.location - this.props.path.start_station_up_track_location) / upTrackLength) * 100;
				y = this.state.canvas.height / 2 - this.state.padding;
			}
			//하선
			else if (point.track_type == 0) {
				x = ((point.location - this.props.path.start_station_down_track_location) / downTrackLength) * 100;
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
			<div className="placeInfoBox" id={"place-info-container-" + this.state.id}></div>
		);
	}
}

export default PlaceInfo;