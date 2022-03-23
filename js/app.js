"use strict"

import{valida} from './validacao.js';

const listaDeInputs = document.querySelectorAll('input');

listaDeInputs.forEach( input => {
    if (input.dataset.tipo === 'preco'){
        SimpleMaskMoney.setMask(input, {
            prefix: 'R$ ',
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
        });
    }
    input.addEventListener('blur', e => {
    valida(e.target);
})});