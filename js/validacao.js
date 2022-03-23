"use strict"

export function valida(input){
    const tipoDeInput = input.dataset.tipo;
    const campoDeErro = input.parentElement.querySelector('.input-mensagem-erro');

    if (validadores[tipoDeInput]){
        validadores[tipoDeInput](input);

    }

    if (input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido');
    }else{
        input.parentElement.classList.add('input-container--invalido');
        
        let mensagem = buscaMensagem(input.validity, tipoDeInput);
        campoDeErro.innerHTML = mensagem;
    }   

}

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo nome precisa ser preenchido.',
    },
    email: {
        typeMismatch: 'Você precisa colocar um e-mail válido.',
        valueMissing: 'O campo email precisa ser preenchido.',
    },
    senha: {
        patternMismatch: 'A senha precisa ter pelo menos 6 caracteres e deve conter pelo menos uma letra um número.',
        valueMissing: 'O campo senha precisa ser preenchido.',
    },
    dataNascimento: {
        customError: 'Só é permitido o cadastro para maiores de 18 anos.',
        valueMissing: 'O campo data de nascimento precisa ser preenchido.',
    },
}

const errosPossiveis = ['valueMissing', 'typeMismatch', 'patternMismatch', 'customError'];

/*
Objeto com chave validadores e valor de respectivas funções validadoras
*/
const validadores = {
    dataNascimento: input => validaDataNascimento(input),
}

function buscaMensagem(validade, tipo){
    let mensagem = 'Este campo não está válido';
    errosPossiveis.forEach(erro => {
        if (validade[erro]){
            mensagem = mensagensDeErro[tipo][erro];
        }
    });
    return mensagem;

}



/*
Apresenta problema no caso do aniversário de 18 anos ser hoje, por conta dos milissegundos
*/
function validaDataNascimento(input){
    const dataDeNascimento = new Date(input.value);
    const dataStringMaioridade = `${dataDeNascimento.getUTCFullYear()+18}-${dataDeNascimento.getUTCMonth()+1}-${dataDeNascimento.getUTCDate()+1}`;
    const dataDeMaioridade = new Date(dataStringMaioridade);
    const dataDeHoje = new Date(Date.now());

    //zera o campo para o caso de já ter apresentado resultado inválido
    let mensagem = '';
    if (dataDeMaioridade > dataDeHoje){
        mensagem = 'Só é permitido o cadastro para maiores de 18 anos.';
    }
    input.setCustomValidity(mensagem);
}
