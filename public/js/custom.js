const dafaultCenter = [-30.03, -51.19],
	defaultZoom = 13;

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
        }
    })
}

const getTrees = function(map){
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


	if(window.location.pathname === '/'){
        $('#home-link').addClass('active');
        $('#home-link').siblings().removeClass('active');
		
        let mymap = L.map('map');
			setTimeout(function(){mymap.setView([-30.03, -51.19], 13)}, 2000);
		
		L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	    	subdomains: ['a','b','c']
		}).addTo( mymap );

		$(window).on("resize", function () { $("#map").height($(window).height()-$("#navbar").height());}).trigger("resize");

        getTrees(mymap);
	}

	$(window).on("resize", function () { $("#main").height($(window).height()-$("#navbar").height());}).trigger("resize");



	if(window.location.pathname == '/stats'){
        $('#stats-link').addClass('active');
        $('#stats-link').siblings().removeClass('active');

        const colors = ['rgb(5, 140, 50)', 'rgb(3, 61, 18)', 'rgb(153, 221, 255)', 'rgb(255, 51, 51)',
          'rgb(255, 153, 0)', 'rgb(255, 102, 102)', 'rgb(255, 255, 153)', 'rgb(204, 0, 204)'];
        const black = 'rgb(0,0,0)';

		let ctx = document.getElementById('plant-chart').getContext('2d');
        
        $.ajax({
            url: '/chart_data',
            method: 'GET',
            success: function(data){
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'bar',
                    // The data for our dataset
                    data: {
                        labels: ['Total plants'].concat(data.list.slice(0, -1).map(item => item['_id'])),
                        datasets: [{
                            backgroundColor: colors.slice(0, data.list.length),
                            data: [data.list[0].count].concat(data.list.slice(0, -1).map(item => item.count))
                        }]
                    },

                    // Configuration options go here
                    options: {
                        legend: {
                            display: false,
                        },
                        scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Number of plants',
                        fontSize: 18,
                        fontColor: black
                      }
                    }],
                    xAxes: [{
                      barPercentage: 0.5,
                      scaleLabel: {
                        display: true,
                        labelString: 'Plants',
                        fontSize: 18,
                        fontColor: black
                      },
                      ticks:{
                        fontSize: 16
                      }
                    }]
                  },
                        maintainAspectRatio: false,
                  responsive: true
                    }
                });
            }
        });

	}
});