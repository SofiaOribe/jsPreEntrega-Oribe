//Variables
const formLoan = document.getElementById('form-loan');
const containerShow = document.getElementById('showLoan');
const STORAGE = 'showLoan';
const recoverLoan = localStorage.getItem(STORAGE);

//Objetos
const FEES = [
    {
        valor: 3,
        text: '3'
    },
    {
        valor: 6,
        text: '6'
    },
    {
        valor: 12,
        text: '12'
    },
    {
        valor: 24,
        text: '24'
    }
];


//Clases
class Loan {
    constructor(capital, fees) {
        this.capital = parseInt(capital);
        this.fees = fees;
    }
};


//Funciones

//Función para crear alerta cuando el usuario no ingresa los datos
const errorSwal = () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You must fill in all the boxes, try again.'
    });
}

//Función para crear alerta cuando los datos ingresados son menor o igual a 0
const errorCalculate = () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You must enter positive numbers, greater than zero. Try again.'
    });
}


//Creo funcioón para mostrar cuotas
FEES.forEach((fees) => {
    formLoan.fees.innerHTML += `<option value=${fees.valor}>${fees.text}</option>`;
});

//Creo una función para limpiar el prestamo
const cleanLoan = () => {
    localStorage.removeItem(STORAGE);
    containerShow.innerHTML = '';
};

//Creo una función para mostrar el prestamo
const showLoan = (show) => {

    //Calculo costo financiero total
    let tfc = 10*parseInt(show.fees);
    //Calculo intereses
    let interest = Math.round((show.capital*tfc*(show.fees*30))/(100*365));
    //Calculo IVA
    let iva = Math.round(0.21*interest);
    //Calculo el monto a devolver mensualmente
    let amountReturned = parseInt(show.capital/show.fees) + parseInt(interest) + parseInt(iva);
    
    //Coloco los datos del prestamo con innerhtml
    containerShow.innerHTML = `
    <div class="container">
        <div class="row text-primary">
            <div class="row">Capital: $${show.capital}</div>
            <div class="row">Fees: ${show.fees}</div>
            <div class="row">Interest: $${interest.toLocaleString()}</div>
            <div class="row">IVA: $${iva.toLocaleString()}</div>
            <div class="row">Total financial cost: ${tfc} %</div>
            <div class="row">Amount to be returned: $${amountReturned.toLocaleString()}</div>
        </div>
        <div class="p-2"></div>
        <button class="btn btn-secondary" onclick="cleanLoan()">Limpiar</button>
    </div>
    `;
};

//Creo una función para optimizar la creación de préstamos
const addValue = (values, events) => {
    //detecto con target y devuelvo los valores correspondientes
    return events.target[values].value;
};

//Recuperar préstamo
const recoverValueSaved = () => {
    if(recoverLoan) {
        const oldLoan = JSON.parse(recoverLoan);
        showLoan(oldLoan);
    }
};

recoverValueSaved();

//Crear un préstamo ingresando los datos
const handleSubmit = (e) => {
    e.preventDefault();

    //Creo un nuevo préstamo con la clase Loan
    //Llamo a la función addValue para crear el préstamo de manera dinamica
    const newLoan = new Loan(addValue('capital', e), addValue('fees', e));
    if(addValue('capital', e) === "" || addValue('fees', e) === "Fee"){
        errorSwal();
        return;
    } else if(addValue('capital', e) <= 0) {
        errorCalculate();
        return;
    }

    //guardo el préstamo en el localstorage, covierno newLoan a string
    localStorage.setItem(STORAGE, JSON.stringify(newLoan));

    //Muestro el prestamo
    showLoan(newLoan);
};

formLoan.onsubmit = handleSubmit;

console.log(formLoan);


