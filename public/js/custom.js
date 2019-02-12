// Global constants and variables

const dafaultCenter = [-30.03, -51.19],
	defaultZoom = 13;

// Function to markers events
const onMarkerClick = function(e){
    let popup = e.target.getPopup();
    //console.log(popup.getLatLng().lat, popup.getLatLng().lng);
    //console.log(popup);
    $.ajax({
        url: '/g-popup-inf',
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
        url: '/get-trees',
        method: 'GET',
        success: function(data){
            for(tree in data.trees){
                console.log(data.trees[tree])
                let c = L.circle([data.trees[tree].lat, data.trees[tree].long],{
                    color: data.trees[tree].color,
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
                            method: 'POST',
                            dataType: 'json',
                            data: {'name': key},
                            success: function(data){
                                console.log(data);
                                document.getElementById('plant-name').textContent = key;
                                document.getElementById('plant-sciname').textContent = data.item.sciname;
                                document.getElementById('plant-url').textContent = data.item.url;
                                document.getElementById('plant-url').href = data.item.url;
                            }
                        })
                    }
                }
            }
        });

	}
});