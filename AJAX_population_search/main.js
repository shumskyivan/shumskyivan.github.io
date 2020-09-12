//Новые переменные
const endpoint = "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";
const citiesData = [];
const searchInput = document.querySelector('#search');
const resultsContainer = document.querySelector('.results-container');
//Функциональные выражения
const numberWithCommas = function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const citiesDataFilter = function (input, array){
    return array.filter(item => {
        const regexp = new RegExp(input, "gi");
        return item.city.match(regexp) || item.state.match(regexp);
    });
}

const getDataFromAPI = async function(key){
    let promise = await fetch(key);
    let res = await promise.json();
    citiesData.push(...res);
}

const searchFunction = function(){
    const matchValue = citiesDataFilter(this.value, citiesData);
    resultsContainer.innerHTML = "";
    const html = matchValue.map(el => {
        const regexp = new RegExp(this.value, "gi");

        const cityName = el.city.replace(regexp, `<span class="hl">${this.value}</span>`);
        const stateName = el.state.replace(regexp, `<span class="hl">${this.value}</span>`);

        return `<div class="result-item">
        <div class="item-title" id="title">${cityName}, ${stateName}</div>
        <div class="item-value" id="value">${numberWithCommas(el.population)}</div>
    </div>`;
    }).join("");

    resultsContainer.innerHTML += html;
}

//Слушатели событий
searchInput.addEventListener("input", searchFunction);

//Вызовы функций
getDataFromAPI(endpoint);
