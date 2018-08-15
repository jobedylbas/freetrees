$(document).ready(function (){
	var mymap = L.map('map').setView([51.505, -0.09], 13);

	L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    	subdomains: ['a','b','c']
	}).addTo( mymap );

	$(window).on("resize", function () { $("#map").height($(window).height()-$("#navbar").height()); map.invalidateSize(); }).trigger("resize");

});