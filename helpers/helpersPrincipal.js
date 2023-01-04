const calculadora = (a,b) => {
    const resultado = a + b;
    return `El resultaod es ${resultado}`;
}

const saludo = () => {
    return 'Buenos días/tardes/noches';
}

const formatearNumero = numero => {
    return new Intl.NumberFormat().format(numero);
}

const selected = (a, b) => {
    //console.log(`${a} - ${b}`)
    if(a == b){
        return 'selected';
    }else{
        return '';
    }
}

export {
    calculadora,
    saludo,
    formatearNumero,
    selected
}