"use strict"

import{valida} from './validacao.js';

const listaDeInputs = document.querySelectorAll('input');

listaDeInputs.forEach( input => input.addEventListener('blur', e => {
    valida(e.target);
}));