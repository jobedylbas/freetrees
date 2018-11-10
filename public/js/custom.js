// Global constants and variables

const dafaultCenter = [-30.03, -51.19],
	defaultZoom = 13;

// Function to markers events
const onMarkerClick = function(e){
    let popup = e.target.getPopup();
    console.log(popup);
    $.ajax({
        url: '/get_info',
        method: 'POST',
        datatype: 'json',
        data: {'lat': popup.getLatLng().lat, 'long': popup.getLatLng().lng},
        success: function(result){
            popup.setContent(result);
        },
        error: function(){
            popup.closePopup();
        }
    })
}

// Function that add the trees on map
const putTrees = function(map){
    $.ajax({
        url: '/get_trees',
        method: 'GET',
        success: function(data){
            for(tree in data.trees){
                let c = L.circle([data.trees[tree].lat, data.trees[tree].long],{
                    color: 'red',
                    radius: 5
                }).addTo(map);

                c.bindPopup().on('click', onMarkerClick);

            }
        }
    });
}


$(document).ready(function (){

    // Add navbar highlight by url
    switch(window.location.pathname){
        case '/download':
            $('#download-link').addClass('active');
            $('#download-link').siblings().removeClass('active');
            break;
        case '/about':
            $('#about-link').addClass('active');
            $('#about-link').siblings().removeClass('active');
            break;
        case '/contact':
            $('#contact-link').addClass('active');
            $('#contact-link').siblings().removeClass('active');
            break;
        default:
        break;
    }

    // Home
	if(window.location.pathname === '/'){
        $('#home-link').addClass('active');
        $('#home-link').siblings().removeClass('active');
		
        let mymap = L.map('map');
			setTimeout(function(){mymap.setView([-30.03, -51.19], 13)}, 2000);
		
		L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	    	subdomains: ['a','b','c']
		}).addTo( mymap );

        // Resize the map on screen resize
		$(window).on("resize", function () { $("#map").height($(window).height()-$("#navbar").height());}).trigger("resize");

        // Add the trees on map
        putTrees(mymap);
	}

	$(window).on("resize", function () { $("#main").height($(window).height()-$("#navbar").height());}).trigger("resize");


    // Stats
	if(window.location.pathname == '/stats'){
        $('#stats-link').addClass('active');
        $('#stats-link').siblings().removeClass('active');

        const colors = ['rgb(5, 140, 50)']

        let canvas = document.getElementById('plant-chart'); 
		let ctx = canvas.getContext('2d');
        
        // Create the chart with plants
        $.ajax({
            url: '/chart_data',
            method: 'GET',
            success: function(data){
                let chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'doughnut',
                    
                    // The data for our dataset
                    data: {
                        labels: data.list.map(item => item['_id']),
                        datasets: [{
                            backgroundColor: colors.slice(0, data.list.length),
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
                        $.ajax({
                            url: '/get_info',
                            method: 'POST',
                            dataType: 'json',
                            data: {'key': key},
                            success: function(data){
                                console.log(data);
                                getElementById('plant-title').textContent = key;
                            }
                        })
                    }
                }
            }
        });

	}
});