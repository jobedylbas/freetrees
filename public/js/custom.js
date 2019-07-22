// Global constants and variables

const defaultCenter = [-30.03, -51.19],
		defaultZoom = 13;
let map = null
// Function that add the trees on map
const putTrees = function(map){
    $.ajax({
        url: '/get-trees',
        method: 'GET',
        success: function(data){
            for(tree in data.trees){
                console.log(data.trees[tree])
                let c = L.circle([data.trees[tree].lat, data.trees[tree].long],{
                    color: data.trees[tree].color,
                    radius: 5
                }).addTo(map);

								// Add event to popups
                c.bindPopup().on('click', function(e){
								    let popup = e.target.getPopup();
										console.log(e.target.getPopup());

								    $.ajax({
								        url: '/g-popup-inf',
								        method: 'GET',
								        datatype: 'json',
								        data: {'lat': popup.getLatLng().lat, 'long': popup.getLatLng().lng},
								        success: function(result){
													if (map.getZoom() < 17) {
															map.flyTo([popup.getLatLng().lat, popup.getLatLng().lng], 18, {
																animate: true, duration: 1.5 });
													}
													popup.setContent(result);
								        },
								        error: function(){
								            popup.closePopup();
								        }
								    })
								});
            }
        }
    });
}

const search = function(e) {
	e.preventDefault();
	if ($("#search-input").val().length > 0) {
		const query = $("#search-input").val();
		console.log(window.location.pathname);
		if (window.location.pathname != '/'){
			window.location.pathname = '/';
		}

		$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(query),
		function(json) {
			if (json[0].type == "city") {
				map.flyTo([json[0].lat, json[0].lon], defaultZoom, {
					 animate: true, duration: 1.5 });
			}
			else {
				map.flyTo([json[0].lat, json[0].lon], 18, {
					 animate: true, duration: 1.5 });
			}
		});
	}
}

$(document).ready(function (){
		$("#search-btn").on('click', search)
    // Add navbar highlight by url
    switch(window.location.pathname){
        case '/about':
            $('#about-link').addClass('active');
            $('#about-link').siblings().removeClass('active');
            break;
        case '/stats':
            $('#stats-link').addClass('active');
            $('#stats-link').siblings().removeClass('active');
            break;
        default:
            break;
    }

    // Home
	if(window.location.pathname === '/'){
		$('#home-link').addClass('active');
    $('#home-link').siblings().removeClass('active');

    map = L.map('map');
		setTimeout(function(){map.setView(defaultCenter, defaultZoom)}, 2000);

		L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	    	subdomains: ['a','b', 'c']
		}).addTo( map );

        // Resize the map on screen resize
		$(window).on("resize", function () { $("#map").height($(window).height()-$("#navbar").height());}).trigger("resize");

        // Add the trees on map
    putTrees(map);


	}


    // Stats
	if(window.location.pathname == '/stats'){
        $('#stats-link').addClass('active');
        $('#stats-link').siblings().removeClass('active');

        const colors = ['rgb(5, 140, 50)']

        let canvas = document.getElementById('plant-chart');
				let ctx = canvas.getContext('2d');

        // Create the chart with plants
        $.ajax({
            url: '/chart-data',
            method: 'GET',
            success: function(data){
                let chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'doughnut',

                    // The data for our dataset
                    data: {
                        labels: data.list.map(item => item['_id'].name),
                        datasets: [{
                            backgroundColor: data.list.map(item => item['_id'].color),
                            data: data.list.map(item => item.count)
                        }]
                    },

                    // Configuration options go here
                    options: {
                        legend: {
                            display: true,
                        },
                        maintainAspectRatio: false,
                        responsive: true
                    }
                });

                // Add chart event
                canvas.onclick = function(e){
                    let activePoint = chart.getElementAtEvent(e);

                    if(activePoint[0]){
                        let key = activePoint[0]['_chart'].config.data.labels[activePoint[0]['_index']];

                        console.log(key);
                        $.ajax({
                            url: '/g-plant-inf',
                            method: 'GET',
                            dataType: 'json',
                            data: {'name': key},
                            success: function(data){
                                document.getElementById('plant-name').textContent = key;
                                document.getElementById('plant-sciname').textContent = data.item.sciname;
                                document.getElementById('plant-url').textContent = data.item.url;
                                document.getElementById('plant-url').href = data.item.url;
                            }
                        });
                    }
                }
            }
        });
	}
});
