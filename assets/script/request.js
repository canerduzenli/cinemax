import { select, selectAll, print, onEvent } from './utils.js';

const cityURL = './assets/script/cities.json';
const movieURL = './assets/script/movies.json';
const movieList = select('section');
const movieDropdown = select("#movie-S");
const cityDropdown = select("#city-S");
const movieInput = select("#name");
const cityInput = select("#cities");

const options = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  mode: 'cors'
};

// Fetch functions
async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`${response.statusText} (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    print(error.message);
  }
}

async function getMovies() {
  const data = await fetchData(movieURL, options);
  listMovies(data.movies);
  autocomplete(movieInput, movieDropdown, data.movies.map(movie => movie.title));
}

async function getCities() {
  const data = await fetchData(cityURL, options);
  autocomplete(cityInput, cityDropdown, data.cities.map(city => city.name));
}

// UI functions
function listMovies(array) {
  movieList.innerHTML = '';
  let movies = array.length > 0
    ? array.map(movie => `<div><img src="${movie.img}"><p>${movie.title}</p></div>`).join('')
    : `<p>Movies not found</p>`;
  movieList.innerHTML = movies;
}

function autocomplete(input, dropdown, array) {
  onEvent('keyup', input, function () {
    let temp = input.value.toLowerCase().trim();
    dropdown.innerHTML = '';

    if (temp.length > 1) {
      const filteredItems = array.filter(element => element.toLowerCase().includes(temp));
      const items = filteredItems.length > 0
        ? filteredItems.map(name => `<div>${name}</div>`).join('')
        : `<div>Not found</div>`;
      dropdown.innerHTML = items;

      selectAll(`${dropdown.tagName} > div`).forEach(item => {
        item.addEventListener('click', () => {
          input.value = item.innerText;
          dropdown.innerHTML = '';
        });
      });
    }
  });
}

// Initialize the application
getMovies();
getCities();
