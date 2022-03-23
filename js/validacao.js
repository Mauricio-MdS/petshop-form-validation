"use strict"

const campoDataDeNascimento = document.querySelector('#nascimento');

/*
Apresenta problema no caso do aniversário de 18 anos ser hoje, por conta dos milissegundos
*/
campoDataDeNascimento.addEventListener('blur', (e) => {

    const dataDeNascimento = new Date(e.target.value);
    const dataStringMaioridade = `${dataDeNascimento.getUTCFullYear()+18}-${dataDeNascimento.getUTCMonth()+1}-${dataDeNascimento.getUTCDate()+1}`;
    const dataDeMaioridade = new Date(dataStringMaioridade);
    const dataDeHoje = new Date(Date.now());

    //zera o campo para o caso de já ter apresentado resultado inválido
    let mensagem = '';
    if (dataDeMaioridade > dataDeHoje){
        mensagem = 'Só é permitido o cadastro para maiores de 18 anos.';
    }
    campoDataDeNascimento.setCustomValidity(mensagem);

});
