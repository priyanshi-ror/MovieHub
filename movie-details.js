const movieDetail = document.querySelector("#movie-detail");
const params = new URLSearchParams(location.search);
const imdbID = params.get("id");

const NO_POSTER = "https://placehold.co/400x600/18181b/a1a1aa?text=No+Poster";

if (imdbID) {
    searchMovie(imdbID.trim());
} else {
    movieDetail.innerHTML = `
        <div class="text-center py-20">
            <p class="text-zinc-400 text-lg mb-4">No movie selected.</p>
            <a href="index.html#search" class="text-red-500 hover:underline">Return to Search</a>
        </div>
    `;
}

async function searchMovie(imdbID) {
    movieDetail.innerHTML = `
        <div class="flex justify-center py-20">
            <span class="loader"></span>
        </div>
    `;

    try {
        let response = await fetch(`https://www.omdbapi.com/?apikey=3eed3bad&i=${encodeURIComponent(imdbID)}&plot=full`);
        let data = await response.json();

        if (data.Response === "True") {
            displayMovie(data);
        } else {
            movieDetail.innerHTML = `
                <div class="text-center py-20">
                    <p class="text-red-400 text-xl font-semibold mb-2">${data.Error || 'Movie not found.'}</p>
                    <a href="index.html" class="text-zinc-400 hover:text-white underline">Back to Search</a>
                </div>
            `;
        }
    } catch (error) {
        movieDetail.innerHTML = `
            <div class="text-center py-20">
                <p class="text-red-400 text-lg">Error loading movie details. Please try again.</p>
            </div>
        `;
    }
}

function displayMovie(data) {
    document.title = `${data.Title} - MovieHub`;

    const poster = (data.Poster && data.Poster !== "N/A") ? data.Poster : NO_POSTER;

    movieDetail.innerHTML = `
        <div class="detail-panel">
            <div class="detail-layout">
                <div class="detail-poster-wrap">
                    <img src="${poster}" alt="${data.Title}">
                </div>

                <div class="detail-content">
                    <span class="hero-badge">${data.Type || 'Movie'}</span>
                    <h1 class="detail-heading">${data.Title}</h1>

                    <section class="meta-row">
                        <span class="meta-pill">${data.Released}</span>
                        <span class="meta-pill">${data.Rated}</span>
                        <span class="meta-pill">${data.Runtime}</span>
                        <span class="meta-pill accent">${data.Genre}</span>
                        <span class="meta-pill rating">IMDb: ${data.imdbRating} / 10</span>
                    </section>

                    <div class="story-box">
                        <h2>Plot Overview</h2>
                        <p>${data.Plot}</p>
                    </div>

                    <div class="info-grid">
                        <section class="info-card-box">
                            <span class="info-label">Director</span>
                            <span class="info-value">${data.Director}</span>
                        </section>
                        <section class="info-card-box">
                            <span class="info-label">Writer</span>
                            <span class="info-value">${data.Writer}</span>
                        </section>
                        <div class="info-card-box" style="grid-column: 1 / -1;">
                            <span class="info-label">Actors</span>
                            <span class="info-value">${data.Actors}</span>
                        </div>
                        <section class="info-card-box">
                            <span class="info-label">Language</span>
                            <span class="info-value">${data.Language}</span>
                        </section>
                        <section class="info-card-box">
                            <span class="info-label">Country</span>
                            <span class="info-value">${data.Country}</span>
                        </section>
                    </div>

                    <a
                        href="https://www.imdb.com/title/${data.imdbID}/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="imdb-button"
                    >
                        <span>View on IMDb</span>
                        <span>&rarr;</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}