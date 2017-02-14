$(document).ready(function(){
	$(".help-tooltip").tooltip({placement:'right'});

	function set_events() {
		$('select').live('change', function() {
			var self = $(this);
			var id = self.attr('id');
			localStorage[id] = self.val();
			localStorage['lastChange'] = new Date().getTime();
		});

		$('input[type="checkbox"]').live('change', function() {
			var self = $(this);
			var id = self.attr('id');
			localStorage[id] = self.is(':checked');
			localStorage['lastChange'] = new Date().getTime();
		});
	}

	function load_options() {
		$('select').each(function(){
			var self = $(this);
			self.val(localStorage[self.attr('id')]);
		});

		$('input[type="checkbox"]').each(function(){
			var self = $(this);
			self.prop('checked', (localStorage[self.attr('id')].toLowerCase() == 'true'));
		});

		set_events();
	}

	load_options();
});