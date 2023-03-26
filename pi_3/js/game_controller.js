const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		gameStart: false,
		temps: 3000,
		resta: 20
	},
	created: function(){
		this.username = sessionStorage.getItem("username","unknown");
		var configuracio = JSON.parse(localStorage.getItem('config'));
		this.num_cards = configuracio.cards;
		if (configuracio.dificulty == "easy"){
			temps = 3000;
			resta = 20;
		}
		else if (configuracio.dificulty == "normal"){
			temps = 2000;
			resta = 30;
		}
		else if (configuracio.dificulty == "hard"){
			temps = 1000;
			resta = 40;
		}
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: back});
		}
		for (var i = 0; i < this.items.length; i++){
			Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
		setTimeout(() => {this.turn_cards()}, temps);

	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		},
		turn_cards: function(){
			for (var i = 0; i < this.items.length; i++){
				Vue.set(this.current_card, i, {done: false, texture: back});
			}
			gameStart = true;
		}
	},
	watch: {
		current_card: function(value){
			if (gameStart){
				if (value.texture === back) return;
				var front = null;
				var i_front = -1;
				for (var i = 0; i < this.current_card.length; i++){
					if (!this.current_card[i].done && this.current_card[i].texture !== back){
						if (front){
							if (front.texture === this.current_card[i].texture){
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else{
								Vue.set(this.current_card, i, {done: false, texture: back});
								Vue.set(this.current_card, i_front, {done: false, texture: back});
								this.bad_clicks++;
								break;
							}
						}
						else{
							front = this.current_card[i];
							i_front = i;
						}
					}
				}			
		
			}
		}
	},
	computed: {
		score_text: function(){
			return 100 - this.bad_clicks * resta;
		}
	}
});





