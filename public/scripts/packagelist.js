( function ( mod ) {
	define( mod )
})( function () {

	/**
	 * AJAX post request to retieve all packages
	 * ---
	 * the AJAX query for packages and the loading animations happen simultaneously,
	 * so that once the animations have finished, the query has already completed
	 */
	var query = $.ajax({
		method : "GET",
		url : "/api/find"
	});

	return function ( uiPromises ) {

		$.when( query, uiPromises.page ).then( function ( success ) {
			
			for ( var i = 0; i < success.length; i++ ) {

				if ( typeof success[i] == "object" && success[i].status == "200" && success[i].message ) {

					var packages = success[i].message.packages,
						preloads = $(".preload-wrap");

					// loop through the longer of packages or preloads
					while( packages.length || preloads.length ) {

						var pkg = packages.pop(),
							pre = $( [].pop.call( [].reverse.call( preloads ) ) );

						// find the i-th preload element and fade it out
						pre.fadeOut(200);

						// if there's a package, fade it in; otherwise, fade out the preload
						if ( pkg ) {

							// make a new page item if necessary
							if ( ! pre.length ) {
								var pageItem = $('<div class="page-item filled"></div>')
									.appendTo( ".page" )
									.fadeIn();
							}

							// display the package info
							var keywords = "<ul class='keywords'>";

							pkg.keywords.forEach( function ( key ) {
								keywords += "<li>" + key + "</li>";
							});

							( pre.parent().length ? pre.parent() : pageItem )
								.append("<div class='loaded-wrap'>" + 
										"<a data-package='" + pkg.name + "' class='heart fa fa-heart'></a>" +
										"<a class='name' href='/packages/" + pkg.name + "'>" + pkg.name + "</a>" +
										"<p class='author'>" + pkg.author + "</p>" +
										"<p class='description'>" + pkg.description + "</p>" +
										keywords + "</ul></div>" )
								.find(".loaded-wrap")
								.delay(200)
								.fadeIn(200)

							$('.heart').click( window.heart )

						}
						else {
							pre.parent().delay(100).fadeOut(500)
						}
					}
				}
			}

		});
	}
});	