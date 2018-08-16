const dafaultCenter = [-30.03, -51.19],
	defaultZoom = 13;

$(document).ready(function (){
	var mymap = L.map('map');
	
	setTimeout(function(){mymap.setView([-30.03, -51.19], 13)}, 2000);
	
	L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    	subdomains: ['a','b','c']
	}).addTo( mymap );

	$(window).on("resize", function () { $("#map").height($(window).height()-$("#navbar").height());}).trigger("resize");

	$(window).on("resize", function () { $("#main").height($(window).height()-$("#navbar").height());}).trigger("resize");
});