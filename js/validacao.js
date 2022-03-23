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
    cpf: {
        customError: 'CPF inválido',
        valueMissing: 'O CPF precisa ser preenchido.',
    },
}

const errosPossiveis = ['valueMissing', 'typeMismatch', 'patternMismatch', 'customError'];

/*
Objeto com chave validadores e valor de respectivas funções validadoras
*/
const validadores = {
    dataNascimento: input => validaDataNascimento(input),
    cpf: input => validaCpf(input),
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
