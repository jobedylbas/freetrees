var dafaultCenter = [-30.9000, -51.1899];
var defaultZoom = 13;
$(document).ready(function (){
	var mymap = L.map('map').setView([-30.0016, -51.1899], 13);

	L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    	subdomains: ['a','b','c']
	}).addTo( mymap );

	$(window).on("resize", function () { $("#map").height($(window).height()-$("#navbar").height());}).trigger("resize");

	$(window).on("resize", function () { $("#main").height($(window).height()-$("#navbar").height());}).trigger("resize");
});