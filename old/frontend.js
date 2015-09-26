




function googleMapFrontend(){
	function resize() {
		offsetTop = R.compose(
			R.sum,
			R.pluck('offsetTop')
		)($(mapWrapper).parents().add(mapWrapper).get());

		mapWrapper.style.height = innerHeight - offsetTop + 'px';
	}
	function updateScroll(){
		Ps.update(document.querySelector('.interactive-map-navigation'));
	}
	function changeMapType(e){
		map.changeMapType($(this).data('map-type'));
		$(e.currentTarget).addClass('active').parent().siblings().find('a').removeClass('active');
	}

	with (googleMap) {
		var mapWrapper = document.getElementById('google-map');
		if ( ! mapWrapper) return;
		var markerIcons = JSON.parse(document.getElementById('marker-icons').textContent);

		var map = new GoogleMap(mapWrapper, {
			markerIcons: markerIcons
		});

		document.body.classList.add('interactive-map');

		var nav = $('.interactive-map-navigation');

		$('.under-construction').hide();
		$('#top').addClass('fixed-header').css({position: 'relative'});
		// under-construction


		var mapTypes = {
			roadmap: 'roadmap',
			hybrid: 'satellite',
			terrain: 'terrain'
		};


		var cats = $('.interactive-map-navigation ul');


		$('<ul />').addClass('interactive-map-types')
		.append(
		$('<li />')
			.append(
				$('<a />')
				.attr('href', 'javascript:')
				.text(t('map_types')))
			.append(
				$('<ul />')
				.append($.map(mapTypes, function(val, key){
					return $('<li />').append(
						$('<a />')
						.addClass( ((key == 'roadmap') && 'active') || '' )
						.attr('href', 'javascript:')
						.data('map-type', key)
						.click(changeMapType)
						.text(t(val)));
				}))
			)
		).prependTo('.interactive-map-navigation');



		R.mapObjIndexed(function(value, key, object) {
			nav.find('> ul > li > ul li[data-icon='+ value.id +'] > a')
			.append(
				$('<span />').css({
					backgroundImage: 'url('+ value.thumb +')'
				})
			);
		}, markerIcons);

		resize();
		$(window).resize(resize);

		nav.find('> ul > li > a').click(function(e) {
			e.preventDefault();
			var ul = $(this).parent().find('> ul');
			var a = $(this);
			if (ul.is(':visible')) {
				a.removeClass('active');
				ul.slideUp(updateScroll);
			} else {
				a.addClass('active');
				ul.slideDown(updateScroll);
			}
		});


		var legend = new Legend(
			$('.interactive-map-legend'),
			$('.interactive-map-legend-list'),
			nav,
			$('.interactive-map-legend-toggle-collapse'));




		cats.find('> li > ul > li > a').click(function(e) {
			e.preventDefault();

			$(this).toggleClass('active');
			var catId = $(this).parent().data('id');

			if ($(this).hasClass('active')) {
				$.ajax({
					url: Main.site_url+'ajax/map/'+catId,
					cache: true,
					complete: function(xhr, status){
						var data = JSON.parse(xhr.responseText);
						console.log(data.data);
						map.fromObject({
							overlays: data.data
						});
					}
				});
				legend.showCat(catId);

			} else {
				map.clearShapesByCatId(catId);
				legend.hideCat(catId)
			}
			Ps.update(document.querySelector('.interactive-map-navigation'));
		});


		Ps.initialize(document.querySelector('.interactive-map-navigation'));



	}
}
