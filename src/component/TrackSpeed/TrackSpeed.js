import React from "react";
import "./TrackSpeed.css";
import { STRING_ROUTE_INCHON } from "../../constant";
import { convertToCustomFormat, findClosestX, getRoute } from "../../util";
import isEqual from 'lodash/isEqual';
import lodash from "lodash";

class TrackSpeed extends React.Component {
	KP1toPixel1Width = 0.125;
	constructor( props ) {
		super(props);
		this.railContainer = React.createRef();
		this.railCanvas = React.createRef();
		this.state = {
			id: Math.random().toString(36).substring(2, 11),
			/* canvas: undefined, */
			/* ctx: undefined, */
			legend : [],
			xaxis : [],

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

	componentDidUpdate(prevProps, prevState){
	  if( !this.railCanvas.current ){ return; }
	  let canvas = this.railCanvas.current;
	  let ctx = this.railCanvas.current.getContext("2d");
	  if (prevProps.kp.kp !== this.props.kp.kp) {
		this.kpChange(ctx, canvas, this.props.kp.kp);
		this.drawYAxis();  
		let legend = this.drawLegend();
		this.drawLine();
		ctx.restore(); // Restore the context to its saved state
		let upTrackCloset = { kp : 0, speed : 0 };
		let downTrackCloset = { kp : 0, speed : 0 };
		let trackData = [...this.props.data];
		for(let track of trackData) {
			//상본선 1, 하본선 -1
			let data = findClosestX(track.data, this.props.kp.kp);
			if(track.trackType === 1) {
				upTrackCloset.kp = data.x;
				upTrackCloset.speed = data.y;
				/* this.kpChange(ctx, canvas, data.x); */
			} else {
				downTrackCloset.kp = data.x;
				downTrackCloset.speed = data.y;
				/* this.kpChange(ctx, canvas, data.x); */
			}
		}
		for( let obj of legend ){
			if( obj.trackType === 1 ){
				obj['speed'] = upTrackCloset.speed;
			}else if( obj.trackType === -1 ){
				obj['speed'] = downTrackCloset.speed;
			}
		}
		this.props.findClosest(legend);
	  }

	  if (!isEqual(prevProps.data, this.props.data)) {
		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
		this.kpChange(ctx, canvas, this.props.kp.kp);
		this.drawYAxis();  
		let legend = this.drawLegend();
		this.drawLine();

		let upTrackCloset = { kp : 0, speed : 0 };
		let downTrackCloset = { kp : 0, speed : 0 };
		let trackData = [...this.props.data];
		for(let track of trackData) {
			//상본선 1, 하본선 -1
			let data = findClosestX(track.data, this.props.kp.kp);
			if(track.trackType === 1) {
				upTrackCloset.kp = data.x;
				upTrackCloset.speed = data.y;
				/* this.kpChange(ctx, canvas, data.x); */
			} else {
				downTrackCloset.kp = data.x;
				downTrackCloset.speed = data.y;
				/* this.kpChange(ctx, canvas, data.x); */
			}
		}
		for( let obj of legend ){
			if( obj.trackType === 1 ){
				obj['speed'] = upTrackCloset.speed;
			}else if( obj.trackType === -1 ){
				obj['speed'] = downTrackCloset.speed;
			}
		}
		this.props.findClosest(legend);
	  }

	  if (!isEqual(prevProps.resizeOn, this.props.resizeOn)) {
		this.init();
		this.kpChange(ctx, canvas);
		this.drawYAxis();  
		this.drawLegend();
		this.drawLine();
		ctx.restore(); // Restore the context to its saved state
	  }
	}

	kpChange(ctx, canvas, kp){

		let cneterKP = ((this.state.x + this.state.width)/2) / this.KP1toPixel1Width;
		let move = (kp - cneterKP) * this.state.scaleX + this.state.x;
		/* let curKP = (( ((this.state.x + this.state.width)/2) + move ) ); */

		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
		ctx.save(); // Save the current state of the context

		if( cneterKP < kp ){	
			ctx.translate( -move, 0); // Apply translation
		}
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.lineWidth = 1; 
		ctx.setLineDash([0]);
		ctx.moveTo( kp * this.state.scaleX + this.state.x, 0 );
		ctx.lineTo( kp * this.state.scaleX + this.state.x, 125 );
		ctx.stroke();

		/* ctx.beginPath();  
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.fillText( this.props.kp, this.props.kp * this.state.scaleX + this.state.x, 125);
		ctx.closePath(); */
	}

	init() {
		if( !this.railCanvas.current ){ return; }
		if( !this.railContainer.current ){ return; }
		/* this.setXY(); */
		/* document.getElementById("track-speed-container-" + this.state.id).innerHTML = ""; */
		/* let canvas = document.createElement("canvas"); */
		this.railCanvas.current.style.width = "100%";
		this.railCanvas.current.style.height = "100%";
		this.railCanvas.current.width = this.railContainer.current.offsetWidth;
		this.railCanvas.current.height = this.railContainer.current.offsetHeight;
/* 		this.state.canvas = canvas;
		this.state.ctx = canvas.getContext("2d");
		document.getElementById("track-speed-container-" + this.state.id).appendChild(canvas); */
		
		let rangeX = this.railCanvas.current.width / this.KP1toPixel1Width;

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
		this.state.x = this.getLongestValueWidth() ; //x,y축(레이블)의 공간만큼 보정해주는 듯함.
		this.state.y = this.state.padding * 2; //x,y축(레이블)의 공간만큼 보정해주는 듯함.

		//아마 HTML의 위치와 캔버스의 위치를 상대적으로 구한 값인듯. 
		//padding도 css에 있는 padding값을 의미하는 듯 함.
		this.state.width = this.railCanvas.current.width - this.state.x - this.state.padding * 2;  
		this.state.height = this.railCanvas.current.height - this.state.y - this.state.padding - this.state.fontHeight;  

		this.state.scaleX = this.state.width / this.state.rangeX;  
		this.state.scaleY = this.state.height / this.state.rangeY;  
	
		// draw x y axis and tick marks  
		this.drawYAxis();  
		this.drawLegend();
	}

	getLongestValueWidth() {
		if( !this.railCanvas.current ){ return };
		let ctx = this.railCanvas.current.getContext("2d");
		ctx.font = this.state.font;  
		let longestValueWidth = 0;  
		for (let n = 0; n <= this.state.numYTicks; n++) {  
			let value = this.state.maxY - (n * this.state.unitsPerTickY);  
			longestValueWidth = Math.max(longestValueWidth, ctx.measureText(value).width);  
		}  
		return longestValueWidth;  
	};
	                                                                                                                                                                                                       
	drawYAxis() {  
		if( !this.railCanvas.current ){ return; }
		let context = this.railCanvas.current.getContext("2d");  
		let xaxis = [];
		let textSize = 7;
		context.save(); 
		context.beginPath();  
		context.moveTo(this.state.x, this.state.y);  
		context.lineTo(this.state.x, this.state.y + this.state.height);  
		context.strokeStyle = "black";  
		context.lineWidth = 0.5; 
		context.setLineDash([4]);
		context.stroke();  
		context.restore();  
		
		let minKP = 99999999;
		let maxKP = 0;
		try{
			for( let track of this.props.data ){
				if( minKP > track.data[0].x ){
					minKP = parseFloat(track.data[0].x);
				}
				if(maxKP < track.data[ track.data.length - 2 ].x) {
					maxKP = parseFloat(track.data[ track.data.length - 2 ].x);
				}
			}
		}catch(e){
			console.log("트랙의 최소값과 최대값을 찾을 수 없음");
			console.log(e);
		}
	
		// draw tick marks  
		for (let n = 0; n < this.state.numYTicks; n++) {  
			if( n === 0 ){
				for( let i = minKP; i < maxKP; i++ ){
					if( i % 1000 === 0 ){
						context.beginPath();  
						context.font = "bold 12px NEO_R";  
						context.textBaseline = "top";
						context.textAlign = "center";
						context.fillStyle = "black";  
						/* this.props.kp * this.state.scaleX + this.state.x */
						
						context.fillText( convertToCustomFormat(i),  i * this.state.scaleX + this.state.x, n * this.state.height / this.state.numYTicks + this.state.y - 16);
						context.closePath();
					}
				}
			}
			context.beginPath();  
			context.moveTo(this.state.x, n * this.state.height / this.state.numYTicks + this.state.y);  
			context.lineTo(this.state.x + maxKP, n * this.state.height / this.state.numYTicks + this.state.y);
			context.setLineDash([4]);
			context.strokeStyle = "black";  
			context.lineWidth = 0.5; 
			context.stroke();  
		}
	
		// draw values  
		for (let n = 0; n < this.state.numYTicks; n++) {  
			let value = Math.round(this.state.maxY - n * this.state.maxY / this.state.numYTicks);  
			/* context.save();
			
			context.font = "bold 12px NEO_R";  
			context.fillStyle = "black";  
			context.textAlign = "right";  
			context.textBaseline = "middle";  

			context.translate(this.state.x - this.state.padding, n * this.state.height / this.state.numYTicks + this.state.y);  
			context.fillText(value, 0, 0);  
			context.restore();   */
			xaxis.push({
				value : value,
				y : n * this.state.height / this.state.numYTicks + this.state.y - textSize,
				type : "value"
			});
		}  
		
		// draw unit
		/* context.save();

		context.font = "bold 12px NEO_R";  
		context.fillStyle = "black";  
		context.textAlign = "right";  
		context.textBaseline = "middle";  

		context.translate(this.state.x - this.state.padding, this.state.numYTicks * this.state.height / this.state.numYTicks + this.state.y);  
		context.fillText("(km/h)", 15, 0);
		context.restore();   */
		xaxis.push({
			value : "(km/h)",
			y : this.state.numYTicks * this.state.height / this.state.numYTicks + this.state.y - textSize,
			type : "unit"
		});

		this.setState({xaxis : xaxis})
	};
	
	drawLegend() {  
		/* let context = this.state.ctx; 
		context.save();

		context.font = "bold 12px NEO_R";  
		context.fillStyle = "black";  
		context.textAlign = "right";  
		context.textBaseline = "middle";  
		context.fillText(`: ${this.props.data[0].trackName}`, this.state.x + this.state.padding * 3.25, this.state.padding);
		context.fillText(`: ${this.props.data[1].trackName}`, this.state.x + this.state.padding * 7.75, this.state.padding);
		
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

		context.restore(); */
		let legend = [
			{
				name : `${this.props.data[0].trackName}`,
				color : "red",
				trackType : this.props.data[0].trackType
			},
			{
				name : `${this.props.data[1].trackName}`,
				color : "blue",
				trackType : this.props.data[1].trackType
			}
		];
		this.setState({legend:legend});
		return legend;
	}
	
	drawLine() {  
		if(!this.railCanvas.current){return}
		let context = this.railCanvas.current.getContext("2d");  
		context.save();  
		let trackData = [...this.props.data];
		for(let track of trackData) {
			let arrowCoordinates = [];

			let color = "blue";
			//상본선 1, 하본선 -1
			if(track.trackType == -1) {
				color = "blue";
			} else {
				color = "red";
			}
 
			context.setLineDash([0]);
			context.lineWidth = 1.5; 

			let route = getRoute();
			/* let minKP = (route === STRING_ROUTE_INCHON) ? IncheonKP.start : seoulKP.start; */
			let minKP = 0;

			/* let kpPrint = 0; */
			for (let n = 0; n < track.data.length; n++) {
				context.strokeStyle = color;  
				context.fillStyle = color; 
				let point = track.data[n];  
				/* if( point.x < minKP || point.x > maxKP ){
					continue;
				} */
				let pointX = point.x - minKP;
				//draw line
				if(n > 0) {
					let _point = track.data[n-1];
					let _pointX = _point.x - minKP;
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
							/* if(track.trackType == -1)	{ rateA = 0.5; rateB = 0.4; }
							else 				{ rateA = 0.4; rateB = 0.5; } */
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
							/* if(track.trackType == -1)	{ rateA = 0.6; rateB = 0.5; }
							else 						{ rateA = 0.5; rateB = 0.6; } */
							
							let _p = this.calcBezierAtT(p, rateA);
							let __p = this.calcBezierAtT(p, rateB);
							arrowCoordinates.push({x0: __p.x, y0: __p.y, x1: _p.x, y1: _p.y});
						}
					}
					context.stroke();  
					context.closePath();
				}

				if( point.name !== "" ){
					context.beginPath();  
					/* context.arc(pointX * this.state.scaleX + this.state.x, this.state.y + this.state.height - point.y * this.state.scaleY, this.state.pointRadius, 0, 2 * Math.PI, false);   */
					context.strokeStyle = "#66C5A5";  
					context.fillStyle = "#66C5A5";  
					context.fillRect(
						pointX * this.state.scaleX + this.state.x - 20, //x
						this.state.y + this.state.height - point.y * this.state.scaleY, //y
						70, //width
						20); //height
					context.fill();
					context.closePath();

					context.beginPath();
					context.textBaseline = "top";
					context.textAlign = "center";
					context.fillStyle = "white";  
					context.font = "12px NEO_R";
					context.fillText(point.name, pointX * this.state.scaleX + this.state.x + 15, this.state.y + this.state.height - point.y * this.state.scaleY + this.state.fontHeight * 0.5);
					context.closePath();
				}

				/* kpPrint++;
				if( kpPrint > 9 ){
					kpPrint = 0;
					context.beginPath();  
					context.arc(pointX * this.state.scaleX + this.state.x, this.state.y + this.state.height - point.y * this.state.scaleY, this.state.pointRadius, 0, 2 * Math.PI, false);  
					context.fill();
					context.textBaseline = "top";
					context.textAlign = "center";
					context.fillText(pointX, pointX * this.state.scaleX + this.state.x, this.state.y + this.state.height - point.y * this.state.scaleY + this.state.fontHeight * 0.5);
					context.closePath();
				} */

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
		
		let context = this.railCanvas.current.getContext("2d");
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
			<div className="speedBoxContainer">
				<div className="legendBox">
				{
					this.state.legend.map( (legend, i) => {
						return <div className="option" key={i}>
							<div className="colorBar" style={{backgroundColor:legend.color}} ></div> : {legend.name}
						</div>
					})
				}
				</div>
				<div className="xaxis" /* style={{height:`calc(100% - ${this.state.y}px)`, paddingTop:`${this.state.y}px`}} */>
					{
						this.state.xaxis.map( (axis, i) => {
							return <div key={i} className={`line ${axis.type}`} style={{top:axis.y}}>{axis.value}</div>
						})
					}
				</div>
				<div className="trackSpeedBox" ref={this.railContainer}>
					<canvas ref={this.railCanvas} ></canvas>
				</div>
			</div>
		);
	}
}

export default TrackSpeed;