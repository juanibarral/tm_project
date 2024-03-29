tm_app.controller('controller_twitter', ['$scope', 'Service_socket',function($scope, Service_socket){
	
	
	$scope.tweets = {
		text : [],
		interval : {
			from : "",
			to : "",
			counter : 0
		},
		users : []
	};
	
	$scope.wordCounter = {};
	
	$scope.updateTweets = function(tweets)
	{
		console.log(tweets);
		
		var data = tweets.data;
		var statuses = data.statuses;
		var dateFormatter = d3.time.format("%c");
		var tempUsers = {};
		for(d in statuses)
		{
			var date = new Date(statuses[d].created_at);
			$scope.tweets.text.push(dateFormatter(date) + " --- "+ statuses[d].text);
			$scope.countWords(statuses[d].text);
			
			if(!tempUsers[statuses[d].user.name])
			{
				tempUsers[statuses[d].user.name] = 0;
			}
			tempUsers[statuses[d].user.name]++;
		}
		var dateFrom = new Date(statuses[statuses.length - 1].created_at);
		var dateTo = new Date(statuses[0].created_at);
		$scope.tweets.interval.to = dateFormatter(dateTo);
		$scope.tweets.interval.from = dateFormatter(dateFrom);
		$scope.tweets.interval.counter = statuses.length;
		
		var tempUsersArray = [];
		for(u in tempUsers)
		{
			tempUsersArray.push(u + " : " + tempUsers[u]);
		}
		$scope.tweets.users = tempUsersArray.sort(function(a,b){
			var x = parseInt(a.substring(a.indexOf(":") + 2));
			var y = parseInt(b.substring(b.indexOf(":") + 2));
			if(x == y)
				return 0;
			if(x > y)
				return -1;
			if(x < y)
				return 1;
		});
		
		$scope.$apply();
		//console.log($scope.wordCounter);
		$scope.renderWordCloud();
	}
	
	$scope.getTweets = function()
	{
		Service_socket.getTweets({
			callback : $scope.updateTweets,
			restparams : {
				q : '@Transmilenio',
				count : 100
			}
		});	
	}
	
	
	$scope.countWords = function(phrase)
	{
		var words = phrase.trim().split(/\s+/);
		for(i in words)
		{
			if(!$scope.wordCounter[words[i]])
			{
				$scope.wordCounter[words[i]] = 0;
			}
			$scope.wordCounter[words[i]]++;
		}
	}
	
	// Service_socket.getTweetsStream({
		// callback : $scope.updateTweets,
		// streamparams : {
			// track: '@transmilenio'
		// }
	// });
	
	$scope.renderWordCloud = function()
	{
		d3.select("#word_cloud").remove();
		d3.select("#div_word_cloud").append("div").attr("id", "word_cloud");
		
		//var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10},{"text":"electricity","size":15},{"text":"movement","size":10},{"text":"relation","size":5},{"text":"things","size":10},{"text":"force","size":5},{"text":"ad","size":5},{"text":"energy","size":85},{"text":"living","size":5},{"text":"nonliving","size":5},{"text":"laws","size":15},{"text":"speed","size":45},{"text":"velocity","size":30},{"text":"define","size":5},{"text":"constraints","size":5},{"text":"universe","size":10},{"text":"physics","size":120},{"text":"describing","size":5},{"text":"matter","size":90},{"text":"physics-the","size":5},{"text":"world","size":10},{"text":"works","size":10},{"text":"science","size":70},{"text":"interactions","size":30},{"text":"studies","size":5},{"text":"properties","size":45},{"text":"nature","size":40},{"text":"branch","size":30},{"text":"concerned","size":25},{"text":"source","size":40},{"text":"google","size":10},{"text":"defintions","size":5},{"text":"two","size":15},{"text":"grouped","size":15},{"text":"traditional","size":15},{"text":"fields","size":15},{"text":"acoustics","size":15},{"text":"optics","size":15},{"text":"mechanics","size":20},{"text":"thermodynamics","size":15},{"text":"electromagnetism","size":15},{"text":"modern","size":15},{"text":"extensions","size":15},{"text":"thefreedictionary","size":15},{"text":"interaction","size":15},{"text":"org","size":25},{"text":"answers","size":5},{"text":"natural","size":15},{"text":"objects","size":5},{"text":"treats","size":10},{"text":"acting","size":5},{"text":"department","size":5},{"text":"gravitation","size":5},{"text":"heat","size":10},{"text":"light","size":10},{"text":"magnetism","size":10},{"text":"modify","size":5},{"text":"general","size":10},{"text":"bodies","size":5},{"text":"philosophy","size":5},{"text":"brainyquote","size":5},{"text":"words","size":5},{"text":"ph","size":5},{"text":"html","size":5},{"text":"lrl","size":5},{"text":"zgzmeylfwuy","size":5},{"text":"subject","size":5},{"text":"distinguished","size":5},{"text":"chemistry","size":5},{"text":"biology","size":5},{"text":"includes","size":5},{"text":"radiation","size":5},{"text":"sound","size":5},{"text":"structure","size":5},{"text":"atoms","size":5},{"text":"including","size":10},{"text":"atomic","size":10},{"text":"nuclear","size":10},{"text":"cryogenics","size":10},{"text":"solid-state","size":10},{"text":"particle","size":10},{"text":"plasma","size":10},{"text":"deals","size":5},{"text":"merriam-webster","size":5},{"text":"dictionary","size":10},{"text":"analysis","size":5},{"text":"conducted","size":5},{"text":"order","size":5},{"text":"understand","size":5},{"text":"behaves","size":5},{"text":"en","size":5},{"text":"wikipedia","size":5},{"text":"wiki","size":5},{"text":"physics-","size":5},{"text":"physical","size":5},{"text":"behaviour","size":5},{"text":"collinsdictionary","size":5},{"text":"english","size":5},{"text":"time","size":35},{"text":"distance","size":35},{"text":"wheels","size":5},{"text":"revelations","size":5},{"text":"minute","size":5},{"text":"acceleration","size":20},{"text":"torque","size":5},{"text":"wheel","size":5},{"text":"rotations","size":5},{"text":"resistance","size":5},{"text":"momentum","size":5},{"text":"measure","size":10},{"text":"direction","size":10},{"text":"car","size":5},{"text":"add","size":5},{"text":"traveled","size":5},{"text":"weight","size":5},{"text":"electrical","size":5},{"text":"power","size":5}];
		var frequency_list = [];
		for(i in $scope.wordCounter)
		{
			if(i.length > 2 && $scope.wordCounter[i] > 3)
				frequency_list.push({
					'text' : i,
					'counter' : $scope.wordCounter[i]
				})
		}
		
		
	    var color = d3.scale.linear()
	            .domain([0,1,2,3,4,5,6,10,15,20,100])
	            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);
	
		var fill = d3.scale.category20();
	    var layout = d3.layout.cloud().size([800, 300])
	            .words(frequency_list)
	            .rotate(function() { return ~~(Math.random() * 2) * 90; })
	            .fontSize(function(d) { return d.counter * 3; })
	            .on("end", draw)
	            
	    layout.start();
	    
	   var divTooltip = d3.select("body")
		.append("div")  // declare the tooltip div 
		.attr("class", "tooltip")              // apply the 'tooltip' class
		.style("opacity", 0);  
// 	
	    function draw(words) {
	        d3.select("#word_cloud").append("svg")
	                // .attr("width", "100%")
	                // .attr("height", 350)
	                // .attr("class", "wordcloud")
	                // .append("g")
	                // // without the transform, words words would get cutoff to the left and top, they would
	                // // appear outside of the SVG area
	                // .attr("transform", "translate(320,200)")
	                // .selectAll("text")
	                // .data(words)
	                // .enter().append("text")
	                // .style("font-size", function(d) { return d.size + "px"; })
	                // .style("fill", function(d, i) { return color(i); })
	                // .attr("transform", function(d) {
	                    // return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	                // })
	                // .text(function(d) { return d.text; });
	                .attr("width", layout.size()[0])
				    .attr("height", layout.size()[1])
				    .append("g")
				    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
				    .selectAll("text")
				    .data(words)
				    .enter().append("text")
				    .style("font-size", function(d) { return d.size + "px"; })
				    .style("font-family", "Impact")
				    .style("fill", function(d, i) { return fill(i); })
				    .attr("text-anchor", "middle")
				    .attr("transform", function(d) {
				    	return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				     })
				     .on("mouseover", function(d){
				     	//console.log(d);
				     	divTooltip.style("opacity", .9);
				     	divTooltip.html("<b>" + d.text + "</b><br>counter: "+ d.counter);
				     	divTooltip.style("left", (d3.event.pageX) + "px");
				     	divTooltip.style("top", (d3.event.pageY - 28) + "px");
				     })
				     .on("mouseout", function(d){
				     	//console.log(d);
				     	divTooltip.style("opacity", 0);
				     })
				     .text(function(d) { return d.text; });
	    }
	    
	    // d3.layout.cloud().size([960, 500])
    		// .canvas(function() { return document.getElementById("myCanvas"); })
    		// .words(frequency_list)
		    // .padding(5)
		    // .rotate(function() { return ~~(Math.random() * 2) * 90; })
		    // .font("Impact")
		    // .fontSize(function(d) { return d.size; })
		    // .on("end", end)
		    // .start();
// 
		// function end(words) { console.log(JSON.stringify(words)); } 

	}
}]);
