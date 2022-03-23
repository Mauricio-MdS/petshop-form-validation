"use strict"

export function valida(input){
    const tipoDeInput = input.dataset.tipo;
    const campoDeErro = input.parentElement.querySelector('.input-mensagem-erro');

    //Adiciona validadores para os inputs.
    if (validadores[tipoDeInput]){
        validadores[tipoDeInput](input);

    }

    //Mostra ou esconde o span com a mensagem de erro no formulário
    if (input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido');
    }else{
        input.parentElement.classList.add('input-container--invalido');
        
        let mensagem = buscaMensagem(input.validity, tipoDeInput);
        campoDeErro.innerHTML = mensagem;
    }   

}

const cpfInvalido = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999'
]

const mensagensDeErro = {
    nome: {
        valueMissing: 'Você precisa preencher o nome.',
    },
    email: {
        typeMismatch: 'Você precisa colocar um e-mail válido.',
        valueMissing: 'Você precisa preencher o e-mail.',
    },
    senha: {
        patternMismatch: 'A senha precisa ter pelo menos 6 caracteres e deve conter pelo menos uma letra e um número.',
        valueMissing: 'Você precisa escolher uma senha.',
    },
    dataNascimento: {
        customError: 'Só é permitido o cadastro para maiores de 18 anos.',
        valueMissing: 'Você precisa preencher a data de nascimento.',
    },
    cpf: {
        customError: 'CPF inválido',
        valueMissing: 'Você precisa preencher o CPF.',
    },
    cep: {
        customError: 'CEP inválido',
        patternMismatch: 'CEP inválido',
        valueMissing: 'Você precisa preencher o CEP.',
    },
    logradouro: {
        valueMissing: 'Você precisa preencher o logradouro.'
    },
    cidade: {
        valueMissing: 'Você precisa preencher a cidade.'
    },
    estado: {
        valueMissing: 'Você precisa preencher o estado.'
    },
    preco: {
        valueMissing: 'Você precisa preencher o preço.'
    }
}

const errosPossiveis = ['valueMissing', 'typeMismatch', 'patternMismatch', 'customError'];

/*
Objeto com chave validadores e valor de respectivas funções validadoras
*/
const validadores = {
    dataNascimento: input => validaDataNascimento(input),
    cpf: input => validaCpf(input),
    cep: input => validaCep(input),
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

function preencheEndereco(endereco){
    const campoLogradouro = document.querySelector('[data-tipo = logradouro]');
    const campoCidade = document.querySelector('[data-tipo = cidade]');
    const campoEstado = document.querySelector('[data-tipo = estado]');
    campoLogradouro.value = endereco.logradouro;
    campoCidade.value = endereco.localidade;
    campoEstado.value = endereco.uf;
    console.log(endereco);
    console.log(campoLogradouro);
    console.log(campoCidade);
    console.log(campoEstado);
}

function validaCep(input){
    input.setCustomValidity('');
    if (input.validity.valid){
        const cep = input.value.replace(/\D/g,'');
        const url = `https://viacep.com.br/ws/${cep}/json`;
        const options = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'content-type': 'application/json; charset=utf-8'
            }
        }
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if (data.erro){
                    input.setCustomValidity('CEP inválido.');
                    return;
                }
                preencheEndereco(data);
            }
        );
    }
    
}

function validaCpf(input){
    let cpf = input.value.replace(/\D/g,'');
    let mensagem = '';
    if (cpf.length > 11){
        mensagem = 'CPF inválido';
    } else {
        //adiciona zeros à esquerda
        while(cpf.length < 11){
            cpf = '0' + cpf;
        }

        //verifica números repetidos
        cpfInvalido.forEach(invalido => {
            if(cpf == invalido){
                mensagem = 'CPF inválido';
            }
        });

        //verificação do 1o dígito
        let somaDigitoVerificador = 0;
        for(let i = 0; i < 9; i++){
            somaDigitoVerificador += cpf[i] * (10-i);
        }

        let controle = 11 - somaDigitoVerificador % 11;
        if (controle > 9){
            controle = 0;
        }

        if (cpf[9]!= controle){
            mensagem = 'CPF inválido';
        } else {


            //verificação do 2o dígito
            somaDigitoVerificador = 0;
            for(let i = 0; i < 10; i++){
                somaDigitoVerificador += cpf[i] * (11-i);
            }

            controle = 11 - somaDigitoVerificador % 11;
            if (controle > 9){
                controle = 0;
            }

            if (cpf[10]!= controle){
                mensagem = 'CPF inválido';
            }

        }

    }

    input.setCustomValidity(mensagem);
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
