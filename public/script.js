$(function() {

	$('.deleteThis').on('click', function(event) {
		event.preventDefault();
		// alert($(this).data('id'));
		var thisDelete = $(this);

		$.ajax({
			url:'/browse/' + thisDelete.data('id'),
			type:"DELETE",
			success:function(result) {
				console.log(result);
				thisDelete.closest('tr').fadeOut('slow', function() {
					// $(this).remove();
				});
			}
		})
	});

	$('.addThis').on('click', function(event) {
		event.preventDefault();
		// alert('yo!');
		var button = $(this);
		var id = $(this).data('id');
		var title = $(this).data('title');
		var year = $(this).data('year');
		// console.log(year);
		var body = {imdb_code: id, title: title, year: year};
		console.log(body);
		$.post('/browse', body, function(data) {
				button.children('span').removeClass('glyphicon-plus').addClass('glyphicon-ok');
				button.toggleClass('disabled');
			}
		)
	})

	$('.comment').on('click', function(event) {
		event.preventDefault();
		// alert('yo!');
		var button = $(this);
		var comment = $('#comment').val();

		console.log(comment);
		console.log(body);
		$.post('/movie:id', body, function(data) {
				alert('yo');
			
		})
	})

})
 
