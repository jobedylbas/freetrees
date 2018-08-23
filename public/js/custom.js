const dafaultCenter = [-30.03, -51.19],
	defaultZoom = 13;

var getTrees = function(map){
    $.ajax({
        url: '/get_trees',
        method: 'GET',
        success: function(data){
            for(tree in data.trees){
                var c = L.circle([data.trees[tree].lat, data.trees[tree].long],{
                    color: 'red',
                    radius: 5
                }).addTo(map);
            }
        }
    });
}

$(document).ready(function (){
	
	if(window.location.pathname == '/'){
		var mymap = L.map('map');
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
        const green = 'rgb(5, 140, 50)',
          black_green = 'rgb(3, 61, 18)',
          blue = 'rgb(153, 221, 255)',
          red = 'rgb(255, 51, 51)',
          orange = 'rgb(255, 153, 0)',
          pink = 'rgb(255, 102, 102)',
          yellow = 'rgb(255, 255, 153)',  
          black = 'rgb(0,0,0)',
          purple = 'rgb(204, 0, 204)';

		var ctx = document.getElementById('plant-chart').getContext('2d');
		var chart = new Chart(ctx, {
		    // The type of chart we want to create
		    type: 'bar',
		    // The data for our dataset
		    data: {
		        labels: ["Cataloged Plants", "Cataloged Fruits", "Cataloged Medicinal", 'Lima', 'blabla', 'blabla2', 'blabla3', 'blabla4'],
		        datasets: [{
		            backgroundColor: [black_green, red, blue, yellow, pink, orange, purple, green],
		            borderColor: '',
		            data: [10, 10, 5, 2, 20, 30, 45, 22],
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