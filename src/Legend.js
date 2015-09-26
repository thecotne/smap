var R = require('ramda');
var $ = require('jquery');

var Legend = Class({
	'protected wrapper': null,
	'protected list': null,
	'protected nav': null,
	'protected collapseBtn': null,
	__construct: function(wrapper, list, nav, collapseBtn){
		this.wrapper = wrapper;
		this.list = list;
		this.nav = nav;
		this.collapseBtn = collapseBtn;
		$(this.list).append($(this.nav).find('> ul > li > ul > li.has_childs').clone());
		$(this.list).find('> li > a').click($.proxy(this.click, this));
		$(this.list).find('> li > ul a').removeAttr('href');

		$(this.collapseBtn).click(R.bind(this.toggleCollapse, this));

	},


	'protected afterCollapse': function() {
		$(this.collapseBtn).addClass('expand');
		$(this.wrapper).addClass('collapsed');
	},
	'protected toggleCollapse': function() {
		if ($(this.collapseBtn).hasClass('expand')) {
			$(this.wrapper).removeClass('collapsed');
			$(this.wrapper).slideDown();
			$(this.collapseBtn).removeClass('expand');
		} else {
			$(this.wrapper).slideUp(R.bind(this.afterCollapse, this));
		}
	},
	'protected click': function(e) {
		e.preventDefault();
		var li = $(e.target).parent();
		li.siblings().removeClass('active');
		li.addClass('active');
	},
	show: function(selector){
		var li = $(this.list).find(selector);
		if (li.length) {
			li.addClass('visible');
			if ( ! $(this.list).find('.active').length) {
				this.showFirstVisible();
			};
			if ( ! $(this.wrapper).is(':visible')) {
				$(this.wrapper).slideDown();
				$(this.wrapper).addClass('visible');
			};
		};
	},
	hide: function(selector){
		$(this.list).find(selector).removeClass('visible');
		this.showFirstVisible();

		if ( ! $(this.list).find('.visible').length) {
			if ($(this.wrapper).is(':visible')) {
				$(this.wrapper).slideUp();
				$(this.wrapper).removeClass('visible');
			}
		};
	},
	showCat: function(catId){
		this.show('[data-id='+ catId +']');
	},
	hideCat: function(catId){
		this.hide('[data-id='+ catId +']');
	},
	showFirstVisible: function(){
		$(this.list).find('.visible a').first().click();
	}
});


module.exports = Legend;

