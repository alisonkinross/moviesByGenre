var movieApp = {
	init : function() {
		movieApp.grabConfig();
		//listen for a click on our star ratings.
		$('body').on('change', 'input[type=radio]', function(){
			var rating = $(this).val();
			var movieID = $(this).attr('id').split('-')[0].replace('movie', '');
			movieApp.ratingHandler(rating, movieID);
		});
		$('body').on('click','ul.genreList li', function(){
			var genreID = $(this).data('movieid');
			movieApp.getMoviesByGenre(genreID);
		});
	},
	api_key : 'c682390986ec1192dbe3db6833c73564',
	//This function will go to the movie db api and get all the config data that we require. When it finishes, it will put the data it gets onto the movieApp. 
	grabConfig : function() {
		var configURL = 'http://api.themoviedb.org/3/configuration';
		$.ajax(configURL, {
			type : 'GET',
			dataType : 'jsonp',
			data : {
				api_key : movieApp.api_key
			},
			success : function(config) {
				movieApp.config = config;
				 //call the next thing to do
				movieApp.getGenreList(); //call the other next thing to do
			}
		}); //end config ajax
	},
	//This function will go to the movie db api and get all the top rated data that we require. When it finishes, it will put the data it gets onto the movieApp. 
	grabTopRated : function() {
		var topRatedURL = 'http://api.themoviedb.org/3/movie/popular';
		$.ajax(topRatedURL, {
			type : 'GET',
			dataType : 'jsonp',
			data : {
				api_key : movieApp.api_key
			},
			success : function(topRated) {
				//run the displayMovies
				movieApp.displayMovies(topRated.results);
			}
		}); //end top rated ajax
	},
	displayMovies : function(movies) {
		$('.movie').remove();
		for (var i = 0; i < movies.length; i++) {
			var title = $('<h2>').text(movies[i].title);
			var image = $('<img>').attr('src', movieApp.config.images.base_url + "w500" + movies[i].poster_path);
			//grab the existing fieldset and get the html for it
			var rating = $('fieldset.rateMovie')[0].outerHTML;
			rating = rating.replace(/star/g, 'movie'+movies[i].id+'-star');
			rating = rating.replace(/rating/g, 'rating-'+movies[i].id);
			var movieWrap = $('<div>').addClass('movie');
			movieWrap.append(title, image, rating);
			$('body').append(movieWrap);
		};
	},
	getGenreList : function() {
		var genreListURL = 'http://api.themoviedb.org/3/genre/list';
		$.ajax(genreListURL, {
			type : 'GET',
			dataType : 'jsonp',
			data : {
				api_key : movieApp.api_key
			},
			success : function(genreList) {
				movieApp.displayGenreList(genreList.genres);
			}
		}); //end genre list ajax
	},
	displayGenreList : function(genres) {
		var list = $('<ul>').addClass('genreList');
		var listDiv = $('<div>').addClass('genreDiv').append(list);
		$('body').append(listDiv);
		for (var i = 0; i < genres.length; i++) {
			var name = $('<li>').text(genres[i].name);
			var name = name.attr('data-movieid',genres[i].id);
			list.append(name);
		};
		console.log(list);
		movieApp.grabTopRated();
	},
	getMoviesByGenre : function(genreID) {
		var moviesByGenreURL = 'http://api.themoviedb.org/3/genre/'+ genreID + '/movies'
		$.ajax(moviesByGenreURL, {
			type : 'GET',
			dataType : 'jsonp',
			data : {
				api_key : movieApp.api_key
			},
			success : function(moviesByGenre) {
				movieApp.displayMovies(moviesByGenre.results);
			}
		});
	}
};

$(function() {
	movieApp.init();
});



