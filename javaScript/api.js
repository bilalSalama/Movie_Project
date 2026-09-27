// ============================
// 1- API Configuration
// ============================

const API_KEY = "f3dd138291c1859ee2f4a104d2344684";
const API_URL = "https://api.themoviedb.org/3/";

// ============================
// 2- Shared Functions
// ============================

// ! Create Image
function createImage(posterPath, textAlt) {
  // Create A Container Containing The Image
  const image = document.createElement("div");
  image.className = "image";

  // Fetch The Image From The API
  const img = document.createElement("img");

  img.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
  img.alt = textAlt;
  img.loading = "lazy";

  // Append Img To The Container (image)
  image.appendChild(img);

  return image;
}

// ! Create Card
function createCard(moveId) {
  const card = document.createElement("div");
  card.className = "card";

  if (moveId) {
    card.dataset.movieId = moveId;
  }

  return card;
}

// ! Create Bullets
function createBullets(slider, length) {
  const number = Math.ceil(length / 5);

  for (let i = 0; i < number; i++) {
    const span = document.createElement("span");

    if (i === 0) {
      span.className = "active";
    }

    slider.appendChild(span);
  }
}

// ! Send Request And Accept Respons
async function fetchData(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }

  return await res.json();
}

// ! Fetc Genres Data
let genresData = null;
async function getGenres() {
  if (genresData) {
    return genresData;
  }

  const data = await fetchData(`${API_URL}genre/movie/list?api_key=${API_KEY}`);
  genresData = data.genres;

  return genresData;
}

// ============================
// 3- Section Functions
// ============================

// ? 1- Load Genres
async function loadGenres() {
  // Create A Card For The Data Recieved From The API And Assign It To The Slider
  const imageContainer = document.querySelector("#genres .slides");
  const slider = document.querySelector("#genres .slider-bullets");

  if (!imageContainer) {
    return;
  }

  const genres = await getGenres();

  const moviesData = await Promise.all(
    genres.map(async (ele) => {
      const data = await fetchData(
        `${API_URL}discover/movie?api_key=${API_KEY}&with_genres=${ele.id}`,
      );

      return data;
    }),
  );

  let count = 0;

  for (let i = 0; i < genres.length; i++) {
    const ele = genres[i];
    const sectionMovies = moviesData[i];

    const card = createCard();

    // Add Data Set To Cards For Genres Page
    card.dataset.genreId = ele.id;
    card.dataset.genreName = ele.name;

    if (sectionMovies.results && sectionMovies.results.length > 0) {
      const movie = sectionMovies.results[0];

      const img = createImage(movie.poster_path, movie.title);

      card.appendChild(img);

      // Create Information Container
      const info = document.createElement("div");

      info.className = "info";

      // Create Genre Title
      const title = document.createElement("p");

      title.innerHTML = ele.name;

      info.appendChild(title);

      // Create Arrow
      const icon = document.createElement("div");

      icon.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;

      info.appendChild(icon);

      // Append Information To Card
      card.appendChild(info);

      // Append Card To Slider
      imageContainer.appendChild(card);
    }
    count++;
  }

  createBullets(slider, count);
}

// ? 2- Load Top 10
async function loadTop10() {
  const imageContainer = document.querySelector("#top10 .slides");
  const slider = document.querySelector("#top10 .slider-bullets");

  if (!imageContainer) {
    return;
  }

  const genres = await getGenres();

  const moviesData = await Promise.all(
    genres.map(async (ele) => {
      const data = await fetchData(
        `${API_URL}discover/movie?api_key=${API_KEY}&with_genres=${ele.id}`,
      );

      return data;
    }),
  );

  let count = 0;

  for (let i = 0; i < genres.length; i++) {
    const ele = genres[i];
    const sectionMovies = moviesData[i];

    const card = createCard();

    // Add Data Set To Cards For Genres Page
    card.dataset.genreId = ele.id;
    card.dataset.genreName = ele.name;

    if (sectionMovies.results && sectionMovies.results.length > 0) {
      const movie = sectionMovies.results[0];

      const img = createImage(movie.poster_path, movie.title);
      card.appendChild(img);
      // Create A Container Containing The Information (The Section Name)
      const info = document.createElement("div");
      info.className = "info top";

      // Create A Paragraph To Containing The Section Name
      const title = document.createElement("p");
      title.innerHTML = ele.name;

      // Append The Name To The Container (information)
      info.appendChild(title);

      // Create A Container Containing On The Icon (Next)
      const icon = document.createElement("div");
      icon.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;

      // Append The Icon To The Container (information)
      info.appendChild(icon);

      // Append The Container Containing The Information To The Card
      card.appendChild(info);

      // Append The Container Containing On The Section To The Slider
      imageContainer.appendChild(card);

      count++;
    }
  }
  createBullets(slider, count);
}

// ? 3- Load Trending
async function loadTrending() {
  const imageContainer = document.querySelector("#trending .slides");
  const slider = document.querySelector("#trending .slider-bullets");

  if (!imageContainer) {
    return;
  }

  const data = await fetchData(
    `${API_URL}trending/movie/week?api_key=${API_KEY}`,
  );

  const moviesDetails = await Promise.all(
    data.results.map(async (ele) => {
      const movieDetails = await fetchData(
        `${API_URL}movie/${ele.id}?api_key=${API_KEY}`,
      );

      return movieDetails;
    }),
  );

  let count = 0;

  for (let i = 0; i < data.results.length; i++) {
    const ele = data.results[i];
    const movieDetails = moviesDetails[i];
    if (!ele.poster_path) {
      continue;
    }

    const card = createCard(ele.id);

    const img = createImage(ele.poster_path, ele.title);

    card.appendChild(img);

    // Information
    const info = document.createElement("div");

    info.className = "info-trending";

    // Runtime
    const time = document.createElement("div");

    time.className = "time";

    time.innerHTML = `
      <i class="fa-regular fa-clock"></i>
      ${Math.floor(movieDetails.runtime / 60)}h
      ${Math.floor(movieDetails.runtime % 60)}min
    `;

    info.appendChild(time);

    // Views Demo
    const shows = document.createElement("div");

    shows.className = "shows";

    shows.innerHTML = `
      <i class="fa-solid fa-eye"></i>
      <span>${Math.floor(movieDetails.runtime * 10)}K</span>
    `;

    info.appendChild(shows);

    card.appendChild(info);

    imageContainer.appendChild(card);

    count++;
  }

  createBullets(slider, count);
}

// ? 4- Load Release
async function loadRelease() {
  const imageContainer = document.querySelector("#release .slides");
  const slider = document.querySelector("#release .slider-bullets");

  if (!imageContainer) {
    return;
  }

  const data = await fetchData(
    `${API_URL}discover/movie?api_key=${API_KEY}&sort_by=primary_release_date.desc`,
  );

  let count = 0;

  data.results.forEach((ele) => {
    if (!ele.poster_path) {
      return;
    }

    const card = createCard(ele.id);

    const img = createImage(ele.poster_path, ele.title);

    card.appendChild(img);

    // Release Date
    const released = document.createElement("div");

    released.className = "info-released";

    released.innerHTML = ele.release_date;

    card.appendChild(released);

    // Append Card
    imageContainer.appendChild(card);

    count++;
  });

  createBullets(slider, count);
}

// ? 5- Load Popular
async function loadPopular() {
  const imageContainer = document.querySelector("#populer .slides");
  const slider = document.querySelector("#populer .slider-bullets");

  if (!imageContainer) {
    return;
  }

  try {
    const data = await fetchData(
      `${API_URL}movie/top_rated?api_key=${API_KEY}&page=1`,
    );

    let count = 0;

    data.results.forEach((ele) => {
      if (!ele.poster_path) {
        return;
      }

      const card = createCard(ele.id);

      const img = createImage(ele.poster_path, ele.title);

      card.appendChild(img);

      // Information
      const populer = document.createElement("div");

      populer.className = "info-watch";

      // Rating
      const star = document.createElement("div");

      star.className = "star";

      star.innerHTML = `
        <i class="fa-solid fa-star"></i>
        ${ele.vote_average.toFixed(1)}
      `;

      populer.appendChild(star);

      card.appendChild(populer);

      // Append Card
      imageContainer.appendChild(card);

      count++;
    });

    createBullets(slider, count);
  } catch (error) {
    console.log(error);
  }
}

// ? 6- Function To Fetch The Movies By ID
async function loadGenreMovies(genreId, limit) {
  const data = await fetchData(
    `${API_URL}discover/movie?api_key=${API_KEY}&with_genres=${genreId}`,
  );
  if (limit) {
    return data.results.slice(0, limit);
  }
  return data.results;
}

// ? 7- Function To Fetch Movie By Id
async function loadMovie(movieId) {
  const data = await fetchData(`${API_URL}movie/${movieId}?api_key=${API_KEY}`);

  return data;
}

// ? 8- Function To Load Wark Cast By Id
async function loadCastWark(movieId) {
  const data = await fetchData(
    `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`,
  );

  return data.cast;
}

// ? 9- Search Movies From TMDB
async function searchMovies(query, signal) {
  const res = await fetch(
    `${API_URL}search/movie?api_key=${API_KEY}&query=${query}`,
    { signal },
  );

  const data = await res.json();

  return data.results;
}

// ============================
// 4- Load All Data
// ============================
async function loadAllData() {
  try {
    await Promise.all([
      loadGenres(),
      loadTop10(),
      loadTrending(),
      loadRelease(),
      loadPopular(),
    ]);

    document.dispatchEvent(new Event("apiReady"));
  } catch (error) {
    console.log(error);
  }
}

// ============================
// 5- Run
// ============================
loadAllData();
