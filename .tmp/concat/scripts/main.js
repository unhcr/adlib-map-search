//**************************
// responsive div resizing
//**************************


//**************************
// define variables
//**************************
var viewboxWidth = 1500;
var minYear = 1920;
var maxYear = 2016;
var yearArray = [];
var leftYear = minYear;
var rightYear = maxYear;
var countryArray = [];
var selectedCountry = '';

$(document).ready(function() {
	
	var svg = d3.select('#mapsvg');

	$('#mapsvg').show();
	$('#mapsvg').height($('#mapsvg').width()/2.7);
	$('#chartsvg').height($('#mapsvg').width()/22);

	window.onresize = function(event){
		$('#chartsvg').height($('#mapsvg').width()/22);
	}


	//**************************
	// svg map zoom and pan
	//**************************
	window.zoomMap = svgPanZoom('#mapsvg', {
		zoomEnabled: true,
		controlIconsEnabled: true,
		fit: false,
		center: true,
		reset: false,
		zoomScaleSensitivity: 0.3,
		minZoom: 1,
		maxZoom: 6
	});

	//**************************
	// dropdown
	//**************************
	var select2 = $("#map_search_dropdown").select2({
		placeholder: "Select a country",
		width: 250
	});

	select2.on("change", function(){
		selectCountry(this.value);
	});

	var select = d3.select('#map_search_dropdown');
	var options = select.selectAll('option');

	//**************************
	// tooltip
	//**************************
	var hoverTooltip = svg.append('g')
	.attr('class', 'hoverTooltip')
	.attr('opacity',1)
	.attr('transform','translate(0,0)');

	var hoverTooltipBg = hoverTooltip.append('rect')
	.attr('x',5)
	.attr('y',-9)
	.attr('width',50)
	.attr('height',18)
	.style('opacity',1)
	.style('stroke', '#FFF')
	.style('stroke-opacity', 0.6)
	.style('fill','#006AB4')
	// .style('stroke','#D9D9D9')
	// .style('stroke-width',1);

	var hoverTooltipText = hoverTooltip.append('g');

	var hoverTooltipVal = hoverTooltipText.append('text')
	.attr('x',9)
	.attr('y',4)
	.style('font-size',12)
	.style('font-weight', 'normal')
	.style('fill', '#FFF')
	.text('countryname');

	hoverTooltip.style('display','none');

	svg.on('mousemove', function(){
		var mouse = d3.mouse(this);
		var mx = mouse[0];
		var my = mouse[1];
		var x0 = x.invert(mx)+0;
		var y0 = my-15;
		hoverTooltip.attr('transform', function(){
			return 'translate('+x(x0)+','+y0+')';
		});
	});


	d3.selectAll('.country')
	.style('cursor', 'pointer')
	.style('fill-opacity', function(){ 
		var id = d3.select(this).attr('id');
		var name = d3.select(this).attr('name');
		if((id)&&(name)){
			countryArray.push({'id': id, 'name': name});
		}
		return 1;
	}).on('mouseover', function(d,i){
		var id = d3.select(this).attr('id');
		// show tooltip
		hoverTooltipVal.text(d3.select(this).attr('name'));
		var textW = hoverTooltipText.node().getBBox().width;
		hoverTooltipBg.attr('width',textW+10);
		hoverTooltip.style('display','block');
		// shade country polygons
		d3.selectAll('.country').style('fill', function(d,i){
			var thisId = d3.select(this).attr('id');
			if (thisId==selectedCountry){
				return '#006AB4';
			} else if(id==thisId){
				return '#0E75C8';
			} else {
				return 'rgb(210, 208, 206)';
			}

		});
	}).on('mouseout', function(d,i){
		hoverTooltip.style('display','none');
		d3.selectAll('.country').style('fill', function(d,i){
			var thisId = d3.select(this).attr('id');
				if (thisId==selectedCountry){
					return '#006AB4';
				} else {
					return 'rgb(210, 208, 206)';
				}
		});
	}).on('mousedown', function(d,i){
		var id = d3.select(this).attr('id');
		if(id)selectCountry(id);
	});

	countryArray.sort(function(x, y){
	   return d3.ascending(x.name, y.name);
	});

	d3.select('#map_search_dropdown').selectAll('option').data(countryArray).enter().append('option')
	.attr('value', function(d,i){
		return d.id;
	})
	.text(function(d,i){ return d.name; });

	//**************************
	// reset country selection when click on map background
	//**************************
	d3.select('#mapbg').on('mousedown', function(d,i){
		selectCountry('');
	});

	$('#fromYear').val(minYear);
	$('#toYear').val(maxYear);

	$('#fromYear, #toYear').on('change', function(){
		getResults();	
	});

	$('#map_search_results img').css('opacity', 1);
	$('#map_search_results_table').css('opacity', 0);

	var x = d3.scale.linear()
	    .domain([minYear, maxYear])
	    .nice(d3.time.year)
	    .range([0, viewboxWidth-40]);

	var chartsvg = d3.select('#chartsvg');

	chartsvg.append('rect')
	.attr('x', function(){ return x(leftYear); })
	.attr('width', function(){ return x(rightYear)-x(leftYear)})
	.attr('y', 11)
	.attr('height', 50)
	.attr('transform', 'translate(20,0)')
	.style('fill', 'transparent')
	.style('stroke', '#919090');

	var chartBg = chartsvg.append('rect')
	.attr('x', function(){ return x(leftYear); })
	.attr('width', function(){ return x(rightYear)-x(leftYear)})
	.attr('y', 12)
	.attr('height', 48)
	.attr('transform', 'translate(20,0)')
	.style('fill', '#D6DCEB')
	.style('stroke', 'transparent');

	chartsvg.append("g")
	    .attr("class", "x axis")
	    .attr('transform', 'translate(20,60)')
	    .call(d3.svg.axis().scale(x).orient("bottom")
	    	.ticks(10)
	    	.tickSubdivide(1)
	    	.tickFormat(d3.format("d"))
	    	.tickSize(-50, 20, 0));

	d3.selectAll('.tick text')
	        .attr('transform', 'translate(18,-47)');

	var brushLeft = d3.svg.brush()
	.x(x)
	.extent([0, 0])
	.on("brush", brushLeft)
	.on('brushend', function(){
		getResults();
	});

	var brushRight = d3.svg.brush()
	.x(x)
	.extent([0, 0])
	.on("brush", brushRight)
	.on('brushend', function(){
		getResults();
	});

	// left slider handle
	var leftTab = chartsvg.append("g")
	    .attr("class", "tab")
	    .attr('id', 'left_tab')
	    .call(brushLeft);
	    
	var leftTabGrp = leftTab.append('g')
		.attr('id', 'leftTabGrp')
		.attr('transform', 'translate(12,20)')
		.style('cursor', 'pointer').on('mouseover', function(){
			d3.select('#leftTabBg').style('fill', '#CAC9CB');
		}).on('mouseout', function(){
			d3.select('#leftTabBg').style('fill', '#E1DFE0');
		});

	var leftTabLabel = leftTabGrp.append('text')
		.attr('class', 'tabLabel')
		.attr('x', -11)
		.attr('y', -12)
		.text(minYear)

	leftTabGrp.append('rect')
		.attr('id', 'leftTabBg')
	    .attr('x', 0)
	    .attr('y', 0)
	    .attr('width', 16)
	    .attr('height', 30)
	    .style('fill', '#E1DFE0')
	    .style('stroke', '#919090')

	leftTabGrp.append('line')
	    .attr('x1', 5)
	    .attr('x2', 5)
	    .attr('y1', 5)
	    .attr('y2', 25)
	    .style('stroke', '#919090');

	leftTabGrp.append('line')
	    .attr('x1', 10)
	    .attr('x2', 10)
	    .attr('y1', 5)
	    .attr('y2', 25)
	    .style('stroke', '#919090');

	// right slider handle
	var rightTab = chartsvg.append("g")
	    .attr("class", "tab")
	    .attr('id', 'right_tab')
	    .call(brushRight);

	var rightTabGrp = rightTab.append('g')
	    .attr('transform', function(){ return 'translate('+(x(maxYear)-x(minYear)+11)+',20)'}) 
	    .style('cursor', 'pointer').on('mouseover', function(){
			d3.select('#rightTabBg').style('fill', '#CAC9CB');
		}).on('mouseout', function(){
			d3.select('#rightTabBg').style('fill', '#E1DFE0');
		});

	var rightTabLabel = rightTabGrp.append('text')
		.attr('class', 'tabLabel')
		.attr('x', 3)
		.attr('y', -12)
		.text(maxYear)

	rightTabGrp.append('rect')
		.attr('id', 'rightTabBg')
	    .attr('x', 0)
	    .attr('y', 0)
	    .attr('width', 16)
	    .attr('height', 30)
	    .style('fill', '#E1DFE0')
	    .style('stroke', '#919090')

	rightTabGrp.append('line')
	    .attr('x1', 5)
	    .attr('x2', 5)
	    .attr('y1', 5)
	    .attr('y2', 25)
	    .style('stroke', '#919090');

	rightTabGrp.append('line')
	    .attr('x1', 10)
	    .attr('x2', 10)
	    .attr('y1', 5)
	    .attr('y2', 25)
	    .style('stroke', '#919090');

	function brushLeft(){

		value = x.invert(d3.mouse(this)[0]-18);
		value = Math.round(value);
		if(value>=rightYear) value = rightYear - 1;
		if(value<=minYear) value = minYear;
		leftTabGrp.attr('transform', function(){ return 'translate('+(x(value)+12)+',20)'});			
		leftYear = value;
		chartBg.attr('x', function(){ return x(leftYear); })
		.attr('width', function(){ return x(rightYear)-x(leftYear)});
		leftTabLabel.text(value);
		$('#fromYear').val(value);
	}

	function brushRight(){
		value = x.invert(d3.mouse(this)[0]-5);
		value = Math.round(value);
		if(value<=leftYear) value = leftYear + 1;
		if(value>=maxYear) value = maxYear;
		rightTabGrp.attr('transform', function(){ return 'translate('+(x(value)+11)+',20)'});	
		rightYear = value;
		chartBg.attr('x', function(){ return x(leftYear); })
		.attr('width', function(){ return x(rightYear)-x(leftYear)});
		rightTabLabel.text(value);	
		$('#toYear').val(value);
	}

	function selectCountry(iso){
		// reset search results text
		$('#map_search_message').hide();	
		selectedCountry = iso;
		// if selected a valid country
		if(selectedCountry!=''){
			d3.selectAll('.country').style('fill', function(d,i){
				var id = d3.select(this).attr('id');
				if(id==iso){ 
					return '#006AB4';
				} else {
					return 'rgb(210, 208, 206)';
				}
			});
			$('#map_search_dropdown').val(iso).trigger('change.select2');
			//**************************
			// QUERY DATABASE AND UPDATE RESULTS
			//**************************
			$('#map_search_results_name').text($('#map_search_dropdown  option:selected').text());
			$('#map_search_results').show();
			getResults(); 
		} else {
			// reset selection
			d3.selectAll('.country').style('fill', 'rgb(210, 208, 206)');
			$('#map_search_dropdown').val(0).trigger('change.select2');
			$('#map_search_results').hide();
		}
	}

	$('#map_button_search').on('click', function(){
		if(selectedCountry==''){
			$('#map_search_message').text('No country selected');
		} else {
			$('#map_search_message').text('Search for '+selectedCountry+' from '+leftYear+ ' to '+rightYear);
		}
		$('#map_search_message').show();
	});

	$('#map_button_clear').on('click', function(){
		leftYear = minYear;
		rightYear = maxYear;
		selectCountry('');	
		window.zoomMap.reset();		
	});

});

function getResults(){

	// console.log({selectedCountry: selectedCountry, minYear: minYear, maxYear: maxYear});

	//**************************
	// QUERY DATABASE AND UPDATE RESULTS
	//**************************
	// show spinner gif and hide results
	$('#map_search_results img').css('opacity', 1);
	$('#map_search_results_table').css('opacity', 0);

	// set number of files found (random)
	$('#map_search_results_files').text(addCommas(Math.floor(Math.random() * 10000) + 1));  
	$('#map_search_results_fonds').text(addCommas(Math.floor(Math.random() * 10000) + 1));  

	// on complete, show results and hide spinner
	setTimeout(function(){
		$('#map_search_results img').delay(300).css('opacity', 0);
		$('#map_search_results_table').delay(300).css('opacity', 1);
	}, 500);




}


function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}