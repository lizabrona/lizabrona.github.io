(function(){
	var qualities = [
		{ 
			name: 'First item' , 
			comments: ["The women who's minds are full of knowledge. " +
			"They know what's going on in the world and how they think it should be different and why. "+
			"They might even disagree with you, and you respect them for it."]
		},
		{ 
			name: 'Second item',
			comments: ['A women who are lovely and dreamy and cuddly and shy and beautiful.']
		}
	];
	var app = angular.module('womQuality',[]);
	app.controller('QualityController', ['dataService', function(dataService){
		this.products = dataService.getAll();
		this.current = this.products.length ? this.products[0]: null;
		dataService.setCurrent(this.current);
		var self = this;
		
		this.showComment = function(p){
			dataService.setCurrent(p);
			self.current = p;
		};
		this.deleteItem = function(p){
			dataService.del(p);
			if (self.current ==p)
				dataService.setCurrent(null);
		};
	}]);
	
	app.service('dataService', function() {
		var data = localStorage.getItem('products');
		
		var quals = data ? JSON.parse(data): [];
			//qualities;
		var currentChanged;
		var current;
		
		var self = this;
		
		this.getAll = function () {
			return quals;
		};
		
		this.add = function (product) {
			quals.push(product);
			localStorage.setItem('products', JSON.stringify(quals));
			if (quals.length == 1) {
				self.setCurrent(quals[0]);
			}
		};
		
		this.onCurrentChanged = function (f) {
			currentChanged = f;
			
			if (current) f(current);
		};
		
		this.setCurrent = function (p) {
			current = p;
			return currentChanged && currentChanged(p);
		};
		this.del = function(p){
			var a = quals.indexOf(p);
			quals.splice(a,1);
			localStorage.setItem('products', JSON.stringify(quals));
		};
		
		this.addComment = function(p, comment) {
			p.comments.push(comment);
			localStorage.setItem('products', JSON.stringify(quals));
		};
	});
	
	app.controller('CommentController', ['dataService', function(dataService){		
		var self = this;
		this.item = "";
		var product;
		this.addItem = function() {
			if (!product) return;
			dataService.addComment(product, self.item);
			self.item = "";
		};
		
		dataService.onCurrentChanged(function (p) {
			product = p;
			self.comments = p? p.comments: null;
		});
	}]);
	app.controller("AddController", ["dataService",function(dataService){
		this.item = {};
		var self = this;
		
		this.addItem = function(){
			self.item.comments=[];
			dataService.add(self.item);
			self.item = {};
		};
	}])
})();	