const API_KEY = "3ec68b63";
const BASE_URL = "https://www.omdbapi.com/";
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (searchTerm) {
        getMovies(`${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}`);
        search.value = '';
    }
});

function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "True") {
                showMovies(data.Search);
            } else {
                displayError(data.Error);
            }
        })
        .catch(error => {
            displayError('Failed to fetch data. Please try again later.');
        });
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach(movie => {
        const { Title, Poster, imdbID, Year } = movie;
        getMovieDetails(imdbID)
            .then(movieDetails => {
                const movieEl = document.createElement('div');
                movieEl.classList.add('movie');

                movieEl.innerHTML = `
                    <img src="${Poster !== 'N/A' ? Poster : 'img4.webp'}" alt="${Title}">
                    <div class="movie-info">
                        <h3>${Title}</h3>
                        <span class="year">${Year}</span>
                    </div>
                    <div class="overview">
                        <h3>Overview</h3>
                        <p>${movieDetails.Plot}</p>
                        <ul>
                            <li><strong>Genre:</strong> ${movieDetails.Genre}</li>
                            <li><strong>Director:</strong> ${movieDetails.Director}</li>
                            <li><strong>Actors:</strong> ${movieDetails.Actors}</li>
                        </ul>
                    </div>
                `;
                main.appendChild(movieEl);
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
            });
    });
}

function getMovieDetails(imdbID) {
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`;
    return fetch(url)
        .then(res => res.json())
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}

function displayError(message) {
    main.innerHTML = `<h2 class="no-results">${message}</h2>`;
}

