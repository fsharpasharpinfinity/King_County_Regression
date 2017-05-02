// TODO: ADD CIRCLE/MARKER CLUSTERING TO INCREASE VISUAL STUFF

queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, response) {
  var lgMargin = {top: 10, right: 40, bottom: 20, left: 40};
  var smMargin = {top: 5, right: 40, bottom: 20, left: 40};
  var rowMargin = {top: 10, right: 40, bottom: 20, left: 40};
  var zipMargin = {top: 10, right: 40, bottom: 20, left: 40};
  var waterfrontMargin = {top: 0, right: 10, bottom: 20, left: 40};

  var barColor = "#e34234";

	var data = response;
	var dateFormat = d3.time.format("%Y");

	data.forEach(function(d) {
		d["time"] = dateFormat.parse(d["yr_built"].toString());
    d["time"].setMonth(1);
		d["time"].setDate(1);
		d["time"].setMinutes(0);
		d["time"].setSeconds(0);
		d["long"] = +d["long"];
		d["lat"] = +d["lat"];
	});

	var xf = crossfilter(data);

	var dateDim = xf.dimension(function(d) { return d["time"]; });
  var priceDim = xf.dimension(function(d) { return d["price"]; });
  // var priceSegmentDim = xf.dimension(function(d) { return d["price_segment"]; });
  var livingDim = xf.dimension(function(d) { return d["sqft_living"]; });
  var lotDim = xf.dimension(function(d) { return d["sqft_lot"]; });
  var mainFloorDim = xf.dimension(function(d) { return d["sqft_above"]; });
  var basementDim = xf.dimension(function(d) { return d["sqft_basement"]; });
  var zipDim = xf.dimension(function(d) { return d["zipcode"]; });
  var bedsDim = xf.dimension(function(d) { return d["bedrooms"]; });
  var bathsDim = xf.dimension(function(d) { return d["bathrooms"]; });
  var floorsDim = xf.dimension(function(d) { return d["floors"]; });
  var conditionDim = xf.dimension(function(d) { return d["condition"]; });
  var gradeDim = xf.dimension(function(d) { return d["grade"]; });
  var viewDim = xf.dimension(function(d) { return d["view"]; });
  var waterfrontDim = xf.dimension(function(d) { return d["waterfront"]; });
	var allDim = xf.dimension(function(d) {return d;});

	var numdataByDate = dateDim.group();
  var numdataByPrice = priceDim.group();
  // var numdataByPriceSegment = priceSegmentDim.group();
  var numdataByLiving = livingDim.group();
  var numdataByLot = lotDim.group();
  var numdataByMainFloor = mainFloorDim.group();
  var numdataByBasement = basementDim.group();
  var zipGroup = zipDim.group();
  var bedsGroup = bedsDim.group();
  var bathsGroup = bathsDim.group();
  var floorsGroup = floorsDim.group();
  var conditionGroup = conditionDim.group();
  var gradeGroup = gradeDim.group();
  var viewGroup = viewDim.group();
  var waterfrontGroup = waterfrontDim.group();
	var all = xf.groupAll();

  // Min/max calculations for features with linear scale
	var minDate = dateDim.bottom(1)[0]["time"],
      maxDate = dateDim.top(1)[0]["time"];
  var maxPrice = priceDim.top(1)[0]["price"],
      minPrice = priceDim.bottom(1)[0]["price"];
  var maxLiving = livingDim.top(1)[0]["sqft_living"],
      minLiving = livingDim.bottom(1)[0]["sqft_living"];
  var maxLot = lotDim.top(1)[0]["sqft_lot"],
      minLot = lotDim.bottom(1)[0]["sqft_lot"];
  var maxMainFloor = mainFloorDim.top(1)[0]["sqft_above"],
      minMainFloor = mainFloorDim.bottom(1)[0]["sqft_above"];
  var maxBasement = basementDim.top(1)[0]["sqft_basement"],
      minBasement = basementDim.bottom(1)[0]["sqft_basement"];

  var buildChart = dc.barChart("#build-chart");
  var priceChart = dc.barChart("#price-chart");
  var livingChart = dc.barChart("#living-chart");
  var lotChart = dc.barChart("#lot-chart");
  var mainFloorChart = dc.barChart("#main-floor-chart");
  var basementChart = dc.barChart("#basement-chart");
  var zipChart = dc.rowChart("#zip-chart");
  var bedsChart = dc.rowChart("#beds-chart");
  var bathsChart = dc.rowChart("#baths-chart");
  var floorsChart = dc.rowChart("#floors-chart");
  var conditionChart = dc.rowChart("#condition-chart");
  var gradeChart = dc.rowChart("#grade-chart");
  var viewChart = dc.rowChart("#view-chart");
  var waterfrontChart = dc.rowChart("#waterfront-chart");
  var propertyCount = dc.numberDisplay("#property-count");

  propertyCount
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

  buildChart
		.width(665)
		.height(140)
		.margins(lgMargin)
		.dimension(dateDim)
		.group(numdataByDate)
		.transitionDuration(250)
    .colors([barColor])
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

  priceChart
		.width(665)
		.height(140)
		.margins(lgMargin)
		.dimension(priceDim)
    // .dimension(priceSegmentDim)
		.group(numdataByPrice)
    // .group(numdataByPriceSegment)
		.transitionDuration(250)
    .colors([barColor])
    .x(d3.scale.linear().domain([minPrice, maxPrice]))
    // .x(d3.scale.ordinal().domain([
    //   '200000', '400000', '600000', '800000', '1000000',
    //   '1200000', '1400000', '1400000+'
    // ]))
		// .xUnits(dc.units.ordinal)
		.elasticY(true)
		.yAxis().ticks(4);

  livingChart
  	.width(316)
  	.height(140)
  	.margins(smMargin)
  	.dimension(livingDim)
  	.group(numdataByLiving)
  	.transitionDuration(250)
    .colors([barColor])
  	.x(d3.scale.linear().domain([minLiving, maxLiving]))
  	.elasticY(true)
  	.yAxis().ticks(4);

  lotChart
		.width(316)
		.height(140)
		.margins(smMargin)
		.dimension(lotDim)
		.group(numdataByLot)
		.transitionDuration(250)
    .colors([barColor])
		.x(d3.scale.linear().domain([minLot, maxLot]))
		.elasticY(true)
		.yAxis().ticks(4);

  mainFloorChart
  	.width(316)
  	.height(140)
  	.margins(smMargin)
  	.dimension(mainFloorDim)
  	.group(numdataByMainFloor)
  	.transitionDuration(250)
    .colors([barColor])
  	.x(d3.scale.linear().domain([minMainFloor, maxMainFloor]))
  	.elasticY(true)
  	.yAxis().ticks(4);

  basementChart
  	.width(316)
  	.height(140)
  	.margins(smMargin)
  	.dimension(basementDim)
  	.group(numdataByBasement)
  	.transitionDuration(250)
    .colors([barColor])
  	.x(d3.scale.linear().domain([minBasement, maxBasement]))
  	.elasticY(true)
  	.yAxis().ticks(4);

  zipChart
    .width(150)
		.height(933)
      .dimension(zipDim)
      .group(zipGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(4)
      .xAxis().ticks(2);

  bedsChart
    .width(398)
		.height(200)
      .dimension(bedsDim)
      .group(bedsGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(4)
      .xAxis().ticks(4);

  bathsChart
    .width(398)
		.height(400)
      .dimension(bathsDim)
      .group(bathsGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(4)
      .xAxis().ticks(4);

  floorsChart
    .width(198)
		.height(139)
      .dimension(floorsDim)
      .group(floorsGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(5)
      .xAxis().ticks(4);

  conditionChart
    .width(198)
		.height(139)
      .dimension(conditionDim)
      .group(conditionGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(6)
      .xAxis().ticks(4);

  gradeChart
    .width(198)
		.height(139)
      .dimension(gradeDim)
      .group(gradeGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(2)
      .xAxis().ticks(4);

  viewChart
    .width(254)
    .height(141)
      .dimension(viewDim)
      .group(viewGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(6)
      .xAxis().ticks(2);

  waterfrontChart
    .width(111)
    .height(141)
      .dimension(waterfrontDim)
      .group(waterfrontGroup)
      .transitionDuration(250)
      .ordering(function(d) { return -d.value })
      .colors([barColor])
      .elasticX(true)
      .labelOffsetY(18)
      .xAxis().ticks(2);

  var map = L.map('map');
  map.setView([47.5, -122], 8);
  mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

	var drawMap = function(){
    L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 15,
      }).addTo(map);

    var colorScale = d3.scale.linear()
      .domain([minPrice, 250000, 500000, 750000, 1000000, maxPrice])
      .range(['lime', 'yellow', 'orange', 'red', 'crimson', 'purple']);

		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push({lat: d["lat"], lng: d["long"], color: colorScale(d["price"])});
	  });

    let circles = [];
    geoData.forEach((g, i) => {
      let circle = L.circle(g, {
        color: g.color,
        opacity: 0.8,
        // fillColor: "black",
        // fillOpacity: 0.8,
        radius: 10
      });
      circles.push(circle);
    });
    L.layerGroup(circles)
      .addTo(map);
	};

	//Draw Map
	drawMap();

	//Update the map if any dc chart get filtered
	dcCharts = [buildChart, priceChart, lotChart, livingChart, mainFloorChart,
    zipChart, bedsChart, bathsChart, basementChart, floorsChart, conditionChart,
    gradeChart, viewChart, waterfrontChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			});
			drawMap();
		});
	});

	dc.renderAll();

};
