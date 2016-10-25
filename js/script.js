/* Configuration */
var jsonFile = 'database/respond.json';
var jsonSaver = 'json_saver.php';

// Change this buttons, just if is necesary
var buttons = '<button title="delete" class="borrar"></button>' +
          		'<button title="edit" class="editar"></button>' +
          		'<button title="cancel" class="cancelar"></button>' +
          		'<button title="save" class="guardar"></button>';
/* End configuration*/

/* Star the magic XD*/
$.getJSON(jsonFile)
	.done(function(jsonFile) {
		var pageItems = [];
    $.each(jsonFile, function(key,value){
        pageItems.push({key: key, value: value});
    });

    $.each(pageItems, function(index, pageItem){
        var linea = '<span>' + pageItem.key + '</span><span>' + pageItem.value + '</span>';
	    $('main ol').append('<li><b>' + (index + 1) +'.</b> ' + linea + buttons + '</li>')
    });

		$('main').on('click', '.borrar', function(){
			$(this).parent().remove();
			var $losLi = $('main ol li');
			for (var s = 0; s <= $losLi.length; s++) {
				$losLi.eq(s).find('b').text(s + 1);
			};

		});
		$('main').on('click', '.editar', function(){
			var $li = $(this).parent();
			$li.addClass('editando');
			var $losSpan = $li.find('span');
			$.each($losSpan, function(i) {
				var $elSpan = $losSpan.eq(i);
				$elSpan.replaceWith('<input data-real="'+ $elSpan.text() + '" type="text" value="' + $elSpan.text() + '"/>');
			});
		});
		$('main').on('click', '.cancelar', function(){
			var $li = $(this).parent();
			$li.removeClass('editando');

			var $losInput = $li.find('input');
			$.each($losInput, function(i) {
				var $elInput = $losInput.eq(i);
				$elInput.replaceWith('<span>' + $elInput.attr('data-real') + '</span>');
			});
		});

		$('main').on('click', '.guardar', function(){
			var $li = $(this).parent();
			$li.removeClass('editando');
			var $losInput = $li.find('input');
			$.each($losInput, function(i) {
				var $elInput = $losInput.eq(i);
				$elInput.replaceWith('<span>' + $elInput.val() + '</span>');
			});
		});
			//$elSpan.replaceWith('<input type="text" value="' + $elSpan.text() + '"/>');
	})
	.fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ', ' + error;
		alert('The JSON File dont was charged: ' + err);
	});

var $formularios = $('#update-add').find('form');
$formularios.eq(0).find('input[type="submit"]').click(function(event){
	event.preventDefault();
	var $ul = $('ol');
	var $buscaInputs = $ul.find('input');
	if ($buscaInputs.length > 0) {
		alert('The item N° ' + ($buscaInputs.parent().index() + 1) + ' is editing, you have to \'cancel\' or \'save\' that edition to add a new item.');
	} else {
		var $input = $(this).parent().find('input');
		var friday = $input.eq(1).val().trim();
		var usuario = $input.eq(0).val().trim();
		if (usuario == '') {
			alert('The user input is empty :V');
		} else {
			if (friday == '') {
				alert('The Friday input is empty :V')
			} else {
				var $lis = $ul.find('li');
				for (var l = 0; l < $lis.length; l++) {
					if ($lis.eq(l).find('span').eq(0).text() == usuario) {
						alert("Exits a same Key already, (in the item n° " + (l + 1) + "), you can't add the same key for two items.");
						return false;
					}
				};
				$(this).parent().find('input[type="text"]').val('');
				var $elOl = $('main ol');
				$elOl.append('<li><b>' + ($elOl.find('li').length + 1) + '</b><span>' + usuario + '</span>\n' + '<span>' + friday + '</span>' + buttons + '</li>');
			}
		}
	}
});
$formularios.eq(1).find('input[type="submit"]').click(function(event){
	event.preventDefault();
	$(this).val('Updating...');
	$(this).attr('disabled', true);
	var $items = $('main ol li');
	var $buscaInputs = $items.find('input');
	if ($buscaInputs.length > 0) {
		alert('The item N° ' + ($buscaInputs.parent().index() + 1) + ' is editing, you have to \'cancel\' or \'save\' that edition to update the JSON file.');
	} else {
		var nuevoJson = {};
		for (var i = 0; i < $items.length; i++) {
			var llave = $items.eq(i).find('span').eq(0).text();
			var valor = $items.eq(i).find('span').eq(1).text();
			nuevoJson[llave] = valor;
		};
		$.ajax({
			type: "POST",
			dataType : 'json',
			url: jsonSaver,
			data: {
				json: JSON.stringify(nuevoJson),
				archivo: jsonFile
			},
			success: function(response){
				if (response == 'echo') {
					alert('¡The JSON file was updated! :)');
				} else {
					alert(response);
				}
			},
			failure: function(){alert("Error!");}
		});
		$(this).val('.: Update JSON :.');
		$(this).attr('disabled', false);
	}
});
/* End the magic :'C */
