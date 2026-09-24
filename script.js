/*https://github.com/jenesh/Battle-Pokemons-using-PokeAPI */


/*PREPARAR EL ENTORNO*/
//DOMContent asegura que el HTML este listo antes de ejecutar el js, y conecta los botones 
document.addEventListener('DOMContentLoaded', () =>{
    //Al cargar la página, obtenemos dos Pokemones inciales
    getPokemon();

    //Boton para traer nuevos pokemones
    document.querySelector('#get-pokemon-btn').addEventListener('click',() =>{
        getNewPokemon();
        })

    //Boton para iniciar batalla
    document.querySelector('#battle-btn').addEventListener('click',()=>{
        const resultAnterior = document.querySelector('.battle-result');

        document.querySelector('.battle-result')?.remove();
        battlePokemon();
        
    });
});



/*OBTENER POKEMOS DE LA API*/
const getPokemon = async ()=>{
    const randomNumber1 = Math.floor(Math.random() * 151) +1; //Primer Pokemon
    const randomNumber2 = Math.floor(Math.random() *151)+1; // segundo pokemon

    const pokeData = await pokemonDataSync(randomNumber1, randomNumber2);
    renderPokemonSync(pokeData);
};
//pokemonDataSync nos da los datos del pokemon, y con el render los muestra en la pantalla



/*LLAMAE A LA API*/
//junta dos pokemones en un arreglo
const pokemonDataSync = async (num1,num2) => {
    const pokemon1= await makeApiCall(num1);
    const pokemon2= await makeApiCall(num2);
    return [pokemon1, pokemon2];
};



/*MOSTRAR POEMON EN PANTALLA*/
const renderPokemonSync = (pokeData)=>{
    document.querySelector('.data').innerHTML = ''; //limpia antes de mostrar
    displayPokemonData(pokeData[0]);
    displayPokemonData(pokeData[1]);
};

const getNewPokemon = async () =>{
    await getPokemon();
};

/*BATALLA POKEMON*/
// usamos Math.random para elegir ganador/muestra el resultado en el historial/llama a getNewPokemon para refrescar la arena
const battlePokemon = () =>{
    const pokemonName = document.querySelectorAll('.pokemon-name');

    const pokemon1 = pokemonName[0].innerText;
    const pokemon2 = pokemonName[1].innerText;

    const battleResult = document.createElement('p');

    battleResult.classList.add('battle-result');


    const randomNumber= Math.random();

    if (randomNumber < 0.5){
        battleResult.innerText = `${pokemon1} vencio a ${pokemon2}`;
    }else{
        battleResult.innerText= `${pokemon2} vencio a ${pokemon1}`;
    }

    document.querySelector('.data').appendChild(battleResult);



    /*
    const randomNumber= Math.random();
    const battleResult = document.createElement('p');

    const pokemon1 = document.querySelectorAll('.pokemon-name')[0].innerText;
    const pokemon2 = document.querySelector('.pokemon-name')[1].innerText;

    if (randomNumber < 0.5){
        battleResult.innerText = `${pokemon1} vencio a ${pokemon2}`;
    }else{
        battleResult.innerText= `${pokemon2} vencio a ${pokemon1}`;
    }
    //Mostrar el resultado
    document.getElementById('data').appendChild(battleResult);
    
    getNewPokemon(); //Al terminar la batalla, carga nuevos pokemones*/
};

const getUniqueNumber = (history, max)=>{
    const ranNum = Math.floor(Math.random() * max);
    if(!history.includes(ranNum)){
        history.push(ranNum);
        return ranNum;
    }else{
        return getUniqueNumber(history, max);
    }
}


//pedir pokemon por ID
const makeApiCall = async (id) => {
    return await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
};

const makeMovesApiCall = async (url) => await axios.get(url);


//crea un div con clase .pokeCard, miestra nombre, sprite y hp, y lo agrega a .data
const displayPokemonData = (data) => {

    const pokeContainer = document.createElement('div');
    pokeContainer.setAttribute('class', 'pokeCard');

    //NOMBRE
    const name = document.createElement('h3');
    name.setAttribute('class','pokemon-name');
    name.innerHTML= data.data.name;

    //IMAGEN
    const img = document.createElement('img');
    img.src = data.data.sprites.front_default;

    //HP
    const hp= document.createElement ('p');
    hp.innerText = `HP: ${data.data.stats[5].base_stat}`;

    //MOVIMIENTOS
    const moves = document.createElement('p');
    moves.innerText = 'Moves:';

    //AGREGAR ELEMENTOS BASICOS
    pokeContainer.appendChild(name);
    pokeContainer.appendChild(img);
    pokeContainer.appendChild(hp);
    pokeContainer.appendChild(moves);

    //4 MOVIMIENTOS ALEATORIOS
    let movesHistory = [];
    for (let i = 0; i < 4; i ++){
        const moveIndex = getUniqueNumber(movesHistory, data.data.moves.length);
        const chosenMove = data.data.moves[moveIndex];
        const move = document.createElement('p');

        move.innerText = chosenMove.move.name;
        pokeContainer.appendChild(move);
    }
    //INSERTAR EN EL CONTENEDOR PRINCIPAL
    document.querySelector('.data').appendChild(pokeContainer);

};
