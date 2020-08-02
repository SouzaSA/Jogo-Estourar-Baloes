// variaveis Globais

var baloes = []; //mantem um registro dos balões o id é composto de um caracter 'b' mais o indice do vetor

var fps = 25;  //seta o numero máximo de frames por segundo

var timerId = null;  //temporizador par a contagem regressiva

function iniciaJogo(){
	let url = window.location.search;
	let nivel_jogo = url.replace('?', '');
	let tempo_segundos = tempoPeloNivel(nivel_jogo);
	let qtde_baloes = 20;

  document.getElementById('cronometro').innerHTML = tempo_segundos;
  document.getElementById('baloes_inteiros').innerHTML = qtde_baloes;
  document.getElementById('baloes_estourados').innerHTML = 0;

	criaBaloes(qtde_baloes);
	contagem_tempo(tempo_segundos + 1);
	movimentaBaloes();
}

function tempoPeloNivel(nivel_jogo) {
	let tempo_segundos = 0;
	switch (nivel_jogo) {
		case '1':
			tempo_segundos = 120;
			break;
		case '2':
			tempo_segundos = 60;
			break;
		case '3':
			tempo_segundos = 30;
			break;
	}
	return tempo_segundos;
}

function atribuCoordenadasIniciais() {
	return {
		top: Math.floor(Math.random()*450)+10,
		left: Math.floor(Math.random()*550)+10,
	};
}

function verificaColisao(obj) {
	let colidiu = 0; //flag de colisão, 0 não colidiu 1 colidiu
	let coldido;
	let larguraBalao = 36;
	let alturaBalao = 36;

	baloes.forEach(element => {
		//verifica rre sobreposição de baloes
		if ((obj.top <= (element.top+alturaBalao)) && ((obj.top+alturaBalao) >= element.top) && ((obj.left+larguraBalao) >= element.left) && (obj.left <= (element.left+larguraBalao))) {
			colidiu = 1;
			coldido = element;
		}
	});
	return {colidiu, coldido};
}

function criaBaloes(qtde_baloes){
	for (let i = 1; i <= qtde_baloes; i++) {
		let colidiu = 1;
		let direcao = 0.0;
		while (colidiu) {
			coordenadas = atribuCoordenadasIniciais();
			colidiu = verificaColisao(coordenadas).colidiu;
		}
		//direção em radianos
		dir = (Math.random()*2)*Math.PI;
		baloes.push({top: coordenadas.top, left: coordenadas.left, direcaoX: Math.cos(dir), direcaoY: Math.sin(dir), estourado: 0});
	}

	baloes.forEach(element => {
		var balao = document.createElement('img');
    balao.src ='../imagens/balao_azul_pequeno.png';
		balao.style.position = 'absolute'
		balao.style.top = element.top + 'px';
		balao.style.left = element.left + 'px';
    balao.id = 'b'+ baloes.indexOf(element);
    balao.onclick = function () {
      estourar(this);
    };
    document.getElementById('cenario').appendChild(balao);   
	});
}


function estourar(img){
  var id_balao= img.id;
	document.getElementById(id_balao).src = '../imagens/balao_azul_pequeno_estourado.png';
	document.getElementById(id_balao).setAttribute("onclick","");

	baloes[id_balao.replace('b', '')].estourado = 1;

	pontuacao()
}

function pontuacao() {
	var baloes_inteiros = document.getElementById('baloes_inteiros').innerHTML;
	var baloes_estourados = document.getElementById('baloes_estourados').innerHTML;

	baloes_inteiros = parseInt(baloes_inteiros);
	baloes_estourados = parseInt(baloes_estourados);

	baloes_inteiros--;
	baloes_estourados++;

	document.getElementById('baloes_inteiros').innerHTML = baloes_inteiros;
	document.getElementById('baloes_estourados').innerHTML = baloes_estourados;

	situacao_jogo(baloes_inteiros);
}

function situacao_jogo(baloes_inteiros){
	if(baloes_inteiros == 0){
		alert('Parabéns, você conseguiu estourar todos os balões a tempo');
		parar_jogo();
	}
}

function parar_jogo(){
	clearTimeout(timerId);
}

function contagem_tempo(segundos){
	segundos = segundos - 1;

	if(segundos == -1){
		clearTimeout(timerId); //para a execução da função do settimeout
		game_over();
		return false;
	}

	document.getElementById('cronometro').innerHTML = segundos;
	timerId = setTimeout("contagem_tempo("+segundos+")", 1000);
}

function game_over(){
	//corrigir TODO
	remove_eventos_baloes();
	alert('Fim de jogo, você não conseguiu estourar todos os balões a tempo');
}


function remove_eventos_baloes() {
	var i = 1; //contador para recuperar balões por id
	
	//percorre os elementos de acordo com o id e só irá sair do laço quando não houver correspondência com elemento
	while(document.getElementById('b'+ i)) {
			//retira o evento onclick do elemnto
			document.getElementById('b'+ i).onclick = '';
			i++; //faz a iteração da variávei i
	}
}

function movimentaBaloes(){
	let velocidade = 2;
	let indice = 0;
	let objColisao;
	baloes.forEach(element => {
		if (!element.estourado){
			indice = baloes.indexOf(element);
			baloes[indice].top += velocidade*element.direcaoY;
			baloes[indice].left += velocidade*element.direcaoX;
			document.getElementById('b'+indice).style.top = baloes[indice].top+'px';
			document.getElementById('b'+indice).style.left = baloes[indice].left+'px';
			objColisao = verificaColisao(element);

			if (element.left >= 560 || element.left <= 0){
				element.direcaoX *= -1;
			}

			if (element.top >= 460 || element.top <= 0){
				element.direcaoY *= -1;
			}
		}
	});

	//faz a chamada da função novamente para refazer o quadro
	if (document.getElementById('cronometro').innerHTML > 0){
		setTimeout(function() {
			requestAnimationFrame(movimentaBaloes);
		}, 1000/fps);
	}
}

