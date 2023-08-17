import React from "react";
import "./TrackSpeed.css";

class TrackSpeed extends React.Component {
	IncheonKP = {
		start : 589,
		end : 30814
	}
	KP1toPixel1Width = 0.15;
	constructor( props ) {
		super(props);
		this.state = {
			id: Math.random().toString(36).substring(2, 11),
			canvas: undefined,
			ctx: undefined,

			// user defined properties  
			minX: 0,  
			minY: 0,  
			maxX: 140,  
			maxY: 80,  
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

	componentDidMount(){
		this.init();
		this.drawLine();
	}

	init() {
		/* this.setXY(); */
		document.getElementById("track-speed-container-" + this.state.id).innerHTML = "";
		let canvas = document.createElement("canvas");
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		canvas.id = "track-speed-canvas-" + this.state.id;
		canvas.width = document.getElementById("track-speed-container-" + this.state.id).offsetWidth;
		canvas.height = document.getElementById("track-speed-container-" + this.state.id).offsetHeight;
		this.state.canvas = canvas;
		this.state.ctx = canvas.getContext("2d");
		document.getElementById("track-speed-container-" + this.state.id).appendChild(canvas);
		
		let rangeX = canvas.width / this.KP1toPixel1Width;
		console.log(rangeX);

		// user defined properties    
		this.state.unitsPerTickX = 20;  
		this.state.unitsPerTickY = 20;  
	
		// constants  
		this.state.padding = 20;  //x,y축의 공간
		this.state.tickSize = 10;  
		this.state.axisColor = "#555";  
		this.state.pointRadius = 4;  
		this.state.font = "12pt Calibri";  
	
		this.state.fontHeight = 12;  
	
		// relationships
		this.state.rangeX = rangeX/* this.state.maxX - this.state.minX */;//X축과 Y축 사이의 공간을 말하는 듯(그래프상의 X축)
		this.state.rangeY = this.state.maxY - this.state.minY;//X축과 Y축 사이의 공간을 말하는 듯(그래프상의 Y축)
		this.state.numXTicks = Math.round(this.state.rangeX / this.state.unitsPerTickX);  
		this.state.numYTicks = Math.round(this.state.rangeY / this.state.unitsPerTickY);

		//x축의 시작점
		this.state.x = this.getLongestValueWidth() + this.state.padding * 2; //x,y축(레이블)의 공간만큼 보정해주는 듯함.
		this.state.y = this.state.padding * 2; //x,y축(레이블)의 공간만큼 보정해주는 듯함.

		//아마 HTML의 위치와 캔버스의 위치를 상대적으로 구한 값인듯. 
		//padding도 css에 있는 padding값을 의미하는 듯 함.
		this.state.width = this.state.canvas.width - this.state.x - this.state.padding * 2;  
		this.state.height = this.state.canvas.height - this.state.y - this.state.padding - this.state.fontHeight;  

		this.state.scaleX = this.state.width / this.state.rangeX;  
		this.state.scaleY = this.state.height / this.state.rangeY;  
	
		// draw x y axis and tick marks  
		this.drawYAxis();  
		this.drawLegend();
	}
	
	setXY() {
		let minX = undefined;
		let maxX = undefined;
		let minY = undefined;
		let maxY = undefined;
		for(let track of this.props.data) {
			for(let data of track.data) {
				if(minY == undefined || minY > data.y)	minY = data.y;
				if(maxY == undefined || maxY < data.y)	maxY = data.y;
				if(minX == undefined || minX > data.x)	minX = data.x;
				if(maxX == undefined || maxX < data.x)	maxX = data.x;
			}
		}

		if(minX != undefined && maxX != undefined && maxX == minX) {
			maxX = maxX + this.state.unitsPerTickX;
		} 

		if(minY != undefined && maxY != undefined && maxY == minY) {
			maxY = maxY + this.state.unitsPerTickY;
		} 

		this.state.maxX = Math.ceil(maxX / this.state.unitsPerTickX) * this.state.unitsPerTickX;
		this.state.minX = Math.floor(minX / this.state.unitsPerTickX) * this.state.unitsPerTickX;
		this.state.maxY = Math.ceil(maxY / this.state.unitsPerTickY) * this.state.unitsPerTickY;
		this.state.minY = Math.floor(minY / this.state.unitsPerTickY) * this.state.unitsPerTickY;
	}

	getLongestValueWidth() {
		this.state.ctx.font = this.state.font;  
		let longestValueWidth = 0;  
		for (let n = 0; n <= this.state.numYTicks; n++) {  
			let value = this.state.maxY - (n * this.state.unitsPerTickY);  
			longestValueWidth = Math.max(longestValueWidth, this.state.ctx.measureText(value).width);  
		}  
		return longestValueWidth;  
	};
	                                                                                                                                                                                                       
	drawYAxis() {  
		let context = this.state.ctx;  
		context.save(); 
		context.beginPath();  
		context.moveTo(this.state.x, this.state.y);  
		context.lineTo(this.state.x, this.state.y + this.state.height);  
		context.strokeStyle = this.axisColor;  
		context.lineWidth = 0.5; 
		context.setLineDash([4]);
		context.stroke();  
		context.restore();  
	
	
		// draw tick marks  
		for (let n = 0; n < this.state.numYTicks; n++) {  
			context.beginPath();  
			context.moveTo(this.state.x, n * this.state.height / this.state.numYTicks + this.state.y);  
			context.lineTo(this.state.x + this.state.width, n * this.state.height / this.state.numYTicks + this.state.y);
			context.setLineDash([4]);
			context.lineWidth = 0.5; 
			context.stroke();  
		}
	
		// draw values  
		for (let n = 0; n < this.state.numYTicks; n++) {  
			let value = Math.round(this.state.maxY - n * this.state.maxY / this.state.numYTicks);  
			context.save();
			
			context.font = "bold 12pt Calibri";  
			context.fillStyle = "black";  
			context.textAlign = "right";  
			context.textBaseline = "middle";  

			context.translate(this.state.x - this.state.padding, n * this.state.height / this.state.numYTicks + this.state.y);  
			context.fillText(value, 0, 0);  
			context.restore();  
		}  
		
		// draw unit
		context.save();

		context.font = "bold 12pt Calibri";  
		context.fillStyle = "black";  
		context.textAlign = "right";  
		context.textBaseline = "middle";  

		context.translate(this.state.x - this.state.padding, this.state.numYTicks * this.state.height / this.state.numYTicks + this.state.y);  
		context.fillText("(km/h)", 15, 0);
		context.restore();  
	};
	
	drawLegend() {  
		let context = this.state.ctx; 
		context.save();

		context.font = "bold 12pt Calibri";  
		context.fillStyle = "black";  
		context.textAlign = "right";  
		context.textBaseline = "middle";  

		context.fillText(": 상본선", this.state.x + this.state.padding * 4, this.state.padding);
		context.fillText(": 하본선", this.state.x + this.state.padding * 8.5, this.state.padding);
		
		//상본선
		context.beginPath();
		context.strokeStyle = "red";  
		context.fillStyle = "red"; 
		context.moveTo(this.state.x, this.state.padding); 
		context.lineTo(this.state.x + this.state.padding, this.state.padding); 
		context.setLineDash([0]);
		context.lineWidth = 3; 
		context.stroke();
		context.closePath();	
		
		//하본선
		context.beginPath();
		context.strokeStyle = "blue";  
		context.fillStyle = "blue"; 
		context.moveTo(this.state.x + this.state.padding * 4.5, this.state.padding); 
		context.lineTo(this.state.x + this.state.padding * 5.5, this.state.padding); 
		context.setLineDash([0]);
		context.lineWidth = 3; 
		context.stroke();
		context.closePath();	

		context.restore();
	}
	
	drawLine () {  
		let context = this.state.ctx;  
		context.save();  
		console.log("drawLine");
		let trackData = [...this.props.data]
		for(let track of trackData) {
			let arrowCoordinates = [];

			let color = "blue";
			//상본선 1, 하본선 -1
			if(track.trackType == -1) {
				color = "blue";
			} else {
				color = "red";
			}

			context.strokeStyle = color;  
			context.fillStyle = color;  
			context.setLineDash([0]);
			context.lineWidth = 1.5; 

			for (let n = 0; n < track.data.length; n++) {
				let point = track.data[n];  
				let pointX = point.x - this.IncheonKP.start;
				//draw line
				if(n > 0) {
					let _point = track.data[n-1];
					let _pointX = _point.x - this.IncheonKP.start;
					context.beginPath(); 
					context.moveTo(_pointX * this.state.scaleX + this.state.x, this.state.y + this.state.height - _point.y * this.state.scaleY);  
					
					//rise in value
					if(_point.y < point.y) {
						context.lineTo(
							/* _pointX * this.state.scaleX + this.state.x,                     // start X
							this.state.y + this.state.height - point.y * this.state.scaleY, */ // start Y
							/* pointX * this.state.scaleX + this.state.x,
							this.state.y + this.state.height - point.y * this.state.scaleY, */
							pointX * this.state.scaleX + this.state.x, // End X
							this.state.y + this.state.height - point.y * this.state.scaleY // End Y
						);
					
						if(Math.abs(_point.y - point.y) >= this.state.unitsPerTickY) {
							let p0 = {x: _pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - _point.y * this.state.scaleY};
							let p1 = {x: _pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - point.y * this.state.scaleY};
							let p2 = {x: pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - point.y * this.state.scaleY};
							let p3 = {x: pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - point.y * this.state.scaleY};
							let p = [];
							p.push(p0); p.push(p1); p.push(p2); p.push(p3);
		
							let rateA = 0.5, rateB = 0.4;
							if(track.trackType == -1)	{ rateA = 0.5; rateB = 0.4; }
							else 				{ rateA = 0.4; rateB = 0.5; }
							let _p = this.calcBezierAtT(p, rateA);
							let __p = this.calcBezierAtT(p, rateB);
							arrowCoordinates.push({x0: __p.x, y0: __p.y, x1: _p.x, y1: _p.y});
						}
					} 
					//fall in value
					else {
						context.lineTo(
							/* _pointX * this.state.scaleX + this.state.x,
							this.state.y + this.state.height - _point.y * this.state.scaleY,
							pointX * this.state.scaleX + this.state.x,
							this.state.y + this.state.height - _point.y * this.state.scaleY, */
							pointX * this.state.scaleX + this.state.x,
							this.state.y + this.state.height - point.y * this.state.scaleY);
					
						if(Math.abs(_point.y - point.y) >= this.state.unitsPerTickY) {
							let p0 = {x: _pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - _point.y * this.state.scaleY};
							let p1 = {x: _pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - _point.y * this.state.scaleY};
							let p2 = {x: pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - _point.y * this.state.scaleY};
							let p3 = {x: pointX * this.state.scaleX + this.state.x, y: this.state.y + this.state.height - point.y * this.state.scaleY};
							let p = [];
							p.push(p0); p.push(p1); p.push(p2); p.push(p3);
							
							let rateA = 0.6, rateB = 0.5;
							if(track.trackType == -1)	{ rateA = 0.6; rateB = 0.5; }
							else 						{ rateA = 0.5; rateB = 0.6; }
							
							let _p = this.calcBezierAtT(p, rateA);
							let __p = this.calcBezierAtT(p, rateB);
							arrowCoordinates.push({x0: __p.x, y0: __p.y, x1: _p.x, y1: _p.y});
						}
					}
					
					context.stroke();  
					context.closePath();
				}

				// draw point  
				/* context.beginPath();  
				context.arc(pointX * this.state.scaleX + this.state.x, this.state.y + this.state.height - point.y * this.state.scaleY, this.state.pointRadius, 0, 2 * Math.PI, false);  
				context.fill();
				context.textBaseline = "top";
				context.textAlign = "center";
				context.fillText(point.name, pointX * this.state.scaleX + this.state.x, this.state.y + this.state.height - point.y * this.state.scaleY + this.state.fontHeight * 0.5);
				context.closePath();   */
			}

			for (let n = 0; n < arrowCoordinates.length; n++) { 
				let p = arrowCoordinates[n];
				this.drawArrow(p, track.trackType);
			}

			context.restore();  
		}
	}; 
	
	//https://joshondesign.com/2018/07/11/bezier-curves
	calcBezierAtT (p, t) {  
		const x = (1-t)*(1-t)*(1-t)*p[0].x 
			  + 3*(1-t)*(1-t)*t*p[1].x 
			  + 3*(1-t)*t*t*p[2].x 
			  + t*t*t*p[3].x;
		const y = (1-t)*(1-t)*(1-t)*p[0].y
			  + 3*(1-t)*(1-t)*t*p[1].y
			  + 3*(1-t)*t*t*p[2].y
			  + t*t*t*p[3].y;
		return {x, y}
	};
	
	getAngle(x1,y1,x2,y2) {
	  let a;
	  let rad = 0;
	  if(y1 == y2) {
		  if(x2<x1) {
			  a = -90;
		  } else {
			  a = 90;
		  }
	  } else if(x1==x2 && y2>y1) {
		  a = 180;
	  } else {
		  rad = Math.atan((x2-x1)/(y1-y2));
		  a = rad * 180 / Math.PI;
		  
		  if(y2>y1 && x2>x1) {
			  a = 180 + a;
		  } else if(y2>y1 && x2<x1) {
			  a = -180 + a;
		  }
	  }
	
		
	  return rad;
	}
	
	drawArrow (p, dataType) {  
		let radian = Math.atan2((p.y1 - p.y0), (p.x1 - p.x0));
		let sizex = 12, sizey = 12;
		let hx = sizex / 2;
		let hy = sizey / 2;
		
		let context = this.state.ctx;
		context.translate((p.x0), (p.y0));
		context.rotate(radian);
		context.translate(-hx,-hy);
	
		context.beginPath();
		context.moveTo(0,1*sizey); 
		context.stroke();	
		context.lineTo(1*sizex,1*hy);
		context.stroke();
		context.lineTo(0,0); 
		context.stroke();
		context.closePath();
	
		context.translate(hx,hy);
		context.rotate(-radian);
		context.translate(-p.x0,-p.y0);
	}

	render() {
		return (
			<div className="trackSpeedBox" id={"track-speed-container-" + this.state.id}></div>
		);
	}
}

export default TrackSpeed;