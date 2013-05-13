(function($) {

	var projects_url = 'data/projects.html';

	var places_url = 'http://viradacultural.prefeitura.sp.gov.br/programacao?width=470&height=760&em_ajax=true&query=GlobalMapData&callback=?';

	var places_fallback_url = 'data/places.json';

	var projects = [];

	$.ajax({
		url: projects_url,
		dataType: 'text',
		error: function(jqxhr, status, error) {
			console.log(status + ' ' + error);
		},
		success: scrap
	});

	function scrap(data) {

		// get places
		$.ajax({
			url: places_fallback_url,
			dataType: 'json',
			error: function(jqxhr, status, error) {
				console.log(status + ' ' + error);
				$.ajax({
					url: places_fallback_url,
					dataType: 'json',
					error: function() {
						alert('Alguma coisa deu errado, desculpe');
					},
					success: doYourThing
				})
			},
			success: doYourThing
		})

		function doYourThing(places) {

			var $page = $(data);

			$page.find('h2').each(function() {

				var place = $(this).text();

				var placeData = _.find(places, function(p) { return p.location_name.indexOf(place) !== -1; })

				var day, time;

				var $placeData = $(this).nextUntil('br');

				$placeData.each(function(i) {

					if($(this).is('h2')) {
						return false;
					}

					if($(this).is('h3')) {

						day = trim($(this).text());

					} else if($(this).is('dt')) {

						time = trim($(this).text());

					} else {

						var project = {
							name: trim($(this).text()),
							day: day,
							time: time,
							place: place
						}

						_.extend(project, placeData);

						projects.push(project);

					}

				});

			});

			var config = {
				data: projects,
				dataRef: {
					lat: 'location_latitude',
					lng: 'location_longitude'
				},
				map: {
					center: [-23.5369, -46.6478],
					zoom: 11,
					maxZoom: 18,
					markers: {
						cluster: true
					}
				},
				filters: [
					{
						name: 's',
						sourceRef: 'name',
						type: 'text',
						title: 'Busca por nome'
					},
					{
						name: 'dia',
						sourceRef: 'day',
						type: 'multiple-select',
						title: 'Dias'
					},
					{
						name: 'local',
						sourceRef: 'place',
						type: 'multiple-select',
						title: 'Local'
					},
					{
						name: 'horario',
						sourceRef: 'time',
						type: 'multiple-select',
						title: 'Hora'
					}
				],
				templates: {
					marker: '<h4><%= item.name %></h4><%= item.location_balloon %>',
					list: '<p class="category"><%= item.place %></p><h3><%= item.name %></h3><p><%= item.day %>, às <%= item.time %></p>',
					single: '<p class="cat"><%= item.place %></p><h2><%= item.name %></h2><p><%= item.day %>, às <%= item.time %></p><p><%= item.post_content %></p>'
				},
				labels: {
					title: 'VIRADA CULTURAL 2013',
					subtitle: '<strong>//Visualização hackeada. Original <a href="http://viradacultural.prefeitura.sp.gov.br/programacao" target="_blank" rel="external">aqui</a></strong>',
					filters: 'Filtros',
					results: 'Resultados',
					clear_search: 'Limpar busca',
					close: 'Fechar',
					view_map: 'Ver mapa',
					loading: {
						first: 'Carregando eventos...',
						item: 'Carregando...',
						error: 'Ops, parece que o servidor de dados está fora do ar. Tente novamente.'
					}
				}
			}


			carttirail.init('app', config);

		}

	}

	function trim(str) {
		return str.replace(/^\s+|\s+$/g,"");
	}

})(jQuery);