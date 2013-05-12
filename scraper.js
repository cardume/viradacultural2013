(function($) {

	var full_page = 'projects.html';

	var projects = [];

	$.ajax({
		url: full_page,
		dataType: 'text',
		error: function(jqxhr, status, error) {
			console.log(status + ' ' + error);
		},
		success: scrap
	});

	function scrap(data) {

		var $page = $(data);

		$page.find('h2').each(function() {

			var place = $(this).text();

			var day, time;

			var $placeData = $(this).nextUntil('br');

			$placeData.each(function() {

				if($(this).is('h3')) {

					day = trim($(this).text());

				} else if($(this).is('dt')) {

					time = trim($(this).text());

				} else {

					projects.push({
						name: trim($(this).text()),
						day: day,
						time: time,
						place: place
					});

				}

			});

		});

		var config = {
			data: projects,
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
				list: '<p class="category"><%= item.place %></p><h3><%= item.name %></h3><p><%= item.day %>, às <%= item.time %></p>',
				single: '<p class="cat"><%= item.place %></p><h2><%= item.name %></h2><p><%= item.day %>, às <%= item.time %></p>'
			},
			labels: {
				title: 'VIRADA CULTURAL 2013',
				subtitle: '<strong>//Visualização hackeada</strong>',
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

	function trim(str) {
		return str.replace(/^\s+|\s+$/g,"");
	}

})(jQuery);