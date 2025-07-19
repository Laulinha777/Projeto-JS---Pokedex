
const pokemonList = document.getElementById('pokemonList');
const loadMore = document.getElementById('loadMore')

let offset = 0;
const limit= 5;

function convertPokemonsTypes(pokemonTypes) {
  // Gera a lista de tipos em <li>
  return pokemonTypes
    .map(typeSlot => `<li class="type">${typeSlot.type.name}</li>`)
    .join(' ');
}

function convertPokemonHtml(pokemon) {
  return `
    <li class="poke  ${pokemon.type}">
      <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
      <span class="name">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}" />
      </div>
    </li>
  `;
}

function convertPokeApiDetail(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map(typeSlot => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default || pokeDetail.sprites.front_default;

  return pokemon;
}

function loadMorePokemons(offset, limit){
const pokemonUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

fetch(pokemonUrl)
  .then(response => response.json())
  .then(jsonbody => jsonbody.results)
  .then(pokemons =>
    Promise.all(
      pokemons.map(pokemon =>
        fetch(pokemon.url).then(res => res.json())
    .then(convertPokeApiDetail )
      )
    )
  )


  .then(pokemonDetails => {
    const newList = pokemonDetails.map(pokemon => convertPokemonHtml(pokemon));
    const newHtml = newList.join('');
    pokemonList.innerHTML += newHtml;
    console.log(pokemonDetails);
  })
  .catch(error => console.error(error));
}
  
loadMorePokemons(offset, limit);

loadMore.addEventListener('click', () =>{
    offset += limit;
    loadMorePokemons(offset, limit)
})

