var Clock = function() {
	this.width = 60;
	this.height = 60;
	this.strokeWidth = 2;
	this.clockFillColor = "none";
	this.clockBorderColor = "#000";
	this.clockHandColor = "#000";
	this.clockCenterColor = "#000";
	this.transitionEnabled = 1;
	this.radius = this.width / 2;
	this.vis;
	this.clock;
	this.hourPosition;
	this.minutePosition;
	this.clockhand;
	this.hourPositionOffset = 0;

	// Set up Scales
	// Map 60 minutes onto a radial 360 degree range.
	this.scaleMins = d3.scale.linear()
		.domain([0, 59 + 59 / 60])
		.range([0, 2 * Math.PI]);

	// Map 12 hours onto a radial 360 degree range.
	this.scaleHours = d3.scale.linear()
		.domain([0, 11 + 59 / 60])
		.range([0, 2 * Math.PI]);

	this.scaleBetweenHours = d3.scale.linear()
		.domain([0, 59 + 59 / 60])
		.range([0, Math.PI / 6]);

}

Clock.prototype.create = function(div) {
	_this = this;
	this.vis = d3.select(div)
		.append("svg:svg")
		.attr("class", "clock")
		.attr("width", _this.width)
		.attr("height", _this.height);

	this.clock = this.vis.append("svg:g")
		.attr("transform", "translate(" + _this.radius + "," + _this.radius + ")");

	// Clock face
	this.clock.append("svg:circle")
		.attr("class", "clockface")
		.attr("r", _this.radius - _this.strokeWidth)
		.attr("fill", _this.clockFillColor)
		.attr("stroke", _this.clockBorderColor)
		.attr("stroke-width", _this.strokeWidth * 2);
		
	// this.minutePosition = d3.svg.arc()
    	// .innerRadius(0)
    	// .outerRadius((3 / 4) * this.radius)
    	// .startAngle(0)
    	// .endAngle(0);
// 
	// this.hourPosition = d3.svg.arc()
    	// .innerRadius(0)
    	// .outerRadius((1 / 2) * this.radius)
    	// .startAngle(0)
    	// .endAngle(0);
    	
    minutePositionFinal = d3.svg.arc()
    	.innerRadius(0)
    	.outerRadius((2 / 3) * _this.radius)
    	.startAngle(function (d) {
      		return _this.scaleMins(+d.value);
    	})
    	.endAngle(function (d) {
      		return _this.scaleMins(+d.value);
    	});

  	hourPositionFinal = d3.svg.arc()
    	.innerRadius(0)
    	.outerRadius((1 / 2) * _this.radius)
    	.startAngle(function (d) {
      		return (_this.scaleHours(+d.value % 12) + _this.scaleBetweenHours(_this.hourPositionOffset));
    	})
    	.endAngle(function (d) {
      		return (_this.scaleHours(+d.value % 12) + _this.scaleBetweenHours(_this.hourPositionOffset));
    	});
    
   
   
    
    this.clock.append("svg:circle")
    .attr("class", "centerdot")
    .attr("r", _this.strokeWidth)
    .attr("fill", "#fff")
    .attr("stroke", _this.clockCenterColor)
    .attr("stroke-width", _this.strokeWidth);
}

Clock.prototype.update = function(now)
{
	
	var data = [{
		'unit' : 'minutes',
		'value' : now.getMinutes()
	}, {
		'unit' : 'hours',
		'value' : now.getHours()
	}];
	d3.selectAll(".clockhand").remove();
	this.clockhand = null;
	this.clockhand = this.clock.selectAll(".clockhand")
		.data(data)
		.enter()
		.append("svg:path")
		.attr("class", "clockhand")
		.attr("stroke", _this.clockHandColor)
		.attr("stroke-width", function(d){
				if(d.unit == "minutes")
					return _this.strokeWidth;
				else
					return _this.strokeWidth + 2;
			})
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("fill", "none")
		.attr("d", function(d) {
			if (d.unit === "minutes") {
				this.hourPositionOffset = +d.value;
				return minutePositionFinal(d);
			} else if (d.unit === "hours") {
				return hourPositionFinal(d);
			}
		});


}
