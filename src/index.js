import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const value = e.target.value.trim();
  if (value.length < 1) reset();
  if (!value) return;
  handleFetchCountries(value);
}

// очищення розмітки
function reset() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function handleFetchCountries(value) {
  fetchCountries(value).then(renderMarkup).catch(handleError);
}

function markupOneCountry(data) {
  return data
    .map(country => {
      return `<img src="${
        country.flags.svg
      }" alt="Flag" width="30" height="24"></img>
                <h2 class="country-info-title">${country.name.official}</h2>
                <p>Capital: <span>${country.capital}</span></p>
                <p>Population: <span>${country.population}</span></p>
                <p>Languages: <span>${Object.values(
                  country.languages
                )}</span></p>`;
    })
    .join('');
}

function markupMoreCountries(data) {
  return data
    .map(country => {
      return `<li class="country-list-item">
      <img src="${country.flags.svg}" alt="Flag" width="20" height="16"></img>${country.name.official}</li>`;
    })
    .join('');
}

// рендерить розмітку за к-стю одержанних країн
function renderMarkup(data) {
  reset();
  if (data.length === 1) {
    refs.info.insertAdjacentHTML('beforeend', markupOneCountry(data));
  } else if (data.length > 1 && data.length <= 10) {
    refs.list.insertAdjacentHTML('beforeend', markupMoreCountries(data));
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function handleError() {
  Notify.failure('Oops, there is no country with that name');
  reset();
}
