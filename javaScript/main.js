// ===============================
// 1- Burger Menue
// ===============================
let burgerMenue = document.querySelector(".burger-menue");
let navMenue = document.querySelector(".nav-container ul");

// ? The Event On Spans And Menue
burgerMenue.onclick = function () {
  burgerMenue.classList.toggle("clicked");
  navMenue.classList.toggle("active");
};

// ===============================
// 2- Qiestion Section
// ===============================

let answers = document.querySelectorAll("#question .show-ansower");

answers.forEach((answerBtn) => {
  answerBtn.addEventListener("click", () => {
    let questionItem = answerBtn.closest(".question-item");
    let answerText = questionItem.querySelector(".question-answer");

    answerBtn.classList.toggle("active");
    answerText.classList.toggle("active");
  });
});

// =====================================
// 3- Events Occerd after Load api.js
// =====================================
document.addEventListener("apiReady", () => {
  // ===================================
  // 1- Slider and Prev-Next Buttons
  // ===================================

  // ? Selected All Boxes Contain Slidrs(Movies)
  const boxes = document.querySelectorAll(".movies .box");
  boxes.forEach((box) => {
    const slides = box.querySelector(".slides");
    const cards = box.querySelectorAll(".card");

    const prevButton = box.querySelector(".prev-btn");
    const nextButton = box.querySelector(".next-btn");

    const bullets = box.querySelectorAll(".slider-bullets span");

    const indecator = box.querySelector(".scroll-phon span");
    let currentPage = 0;

    const cardsPerPage = 5;

    let pages = Math.ceil(cards.length / cardsPerPage);

    // =======================
    // 2- Next Button
    // =======================
    nextButton.addEventListener("click", () => {
      if (currentPage < pages - 1) {
        currentPage++;
        const cardIndex = currentPage * cardsPerPage;

        slides.scrollTo({
          left: currentPage * slides.clientWidth,
          behavior: "smooth",
        });
        updateBullets();
      }
    });
    // =======================
    // 3- Preveus Button
    // =======================
    prevButton.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        const cardIndex = currentPage * cardsPerPage;

        slides.scrollTo({
          left: currentPage * slides.clientWidth,
          behavior: "smooth",
        });
        updateBullets();
      }
    });

    // =======================
    // 4- Update Bullets
    // =======================
    function updateBullets() {
      bullets.forEach((bullete, index) => {
        bullete.classList.toggle("active", index === currentPage);
      });
    }

    // =======================
    // 5- Scroll Phone
    // =======================
    slides.addEventListener("scroll", () => {
      const maxScroll = slides.scrollWidth - slides.clientWidth;
      const scrollPrecen = slides.scrollLeft / maxScroll;
      const maxIndecatorLeft =
        indecator.parentElement.clientWidth - indecator.clientWidth;
      indecator.style.left = `${scrollPrecen * maxIndecatorLeft}px`;
    });
  });

  // ===============================
  // 6- Genre Page
  // ===============================

  // ? Selected All Genres Sections
  const cards = document.querySelectorAll("#genres .card, #top10 .card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const section = card.closest(".box");
      const genreId = card.dataset.genreId;
      const genreName = card.dataset.genreName;
      window.location = `genre.html?id=${genreId}&namesection=${genreName}&type=${section.id}`;
    });
  });
});

// ===============================
// 4- Details Page
// ===============================

// ? Sellected All Card Contain On Movies
document.addEventListener("click", (ele) => {
  const card = ele.target.closest(".card[data-movie-id]");
  if (!card) return;
  const movieId = card.dataset.movieId;
  window.location = `details.html?id=${movieId}`;
});

// ====================================================
// 5- Functions To Create And Load Elements In Page HTML
// ====================================================

// ? 1- Create A Title

function createGenreTitle(genreName) {
  const title = document.createElement("div");
  title.className = "title";

  const h3 = document.createElement("h3");
  h3.innerHTML = genreName;

  title.appendChild(h3);

  return title;
}

// ? 2- Create A Card
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.movieId = movie.id;

  const image = document.createElement("div");
  image.className = "image";

  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  img.alt = movie.title;

  image.appendChild(img);

  const info = document.createElement("div");
  info.className = "info";

  const header = document.createElement("h3");
  header.innerHTML = movie.title;
  info.appendChild(header);

  const vote = document.createElement("div");
  vote.className = "vote";

  const date = document.createElement("div");
  date.className = "date";
  date.innerHTML = movie.release_date;
  vote.appendChild(date);

  const star = document.createElement("div");
  star.className = "star";
  star.innerHTML = `
    <i class="fa-solid fa-star"></i>
    ${movie.vote_average.toFixed(1)}
  `;
  vote.appendChild(star);

  info.appendChild(vote);

  card.appendChild(image);
  card.appendChild(info);

  return card;
}

// ? 3- Load Videos To page
async function loadMovies(container, genreId, limit) {
  const movies = await loadGenreMovies(genreId, limit);

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

// =============================================
// 6- Load Sections (Genres, Top10)
// =============================================

// ? 1- Function To Load Genre Page
async function loadGenrePage() {
  const params = new URLSearchParams(window.location.search);

  const genreId = params.get("id");
  const genreName = params.get("namesection");

  const movieContainer = document.querySelector(".vedieos #genre");

  if (!movieContainer) {
    return;
  }
  movieContainer.classList.add("active");

  const title = createGenreTitle(genreName);
  movieContainer.appendChild(title);

  await loadMovies(movieContainer, genreId);
}

// ? 2- Function To Load Genre Top 10 Page
async function loadTop10Page() {
  const movieContainer = document.querySelector(".vedieos #top10");

  if (!movieContainer) {
    return;
  }
  movieContainer.classList.add("active");

  const params = new URLSearchParams(window.location.search);

  const genreId = params.get("id");
  const genreName = params.get("namesection");

  const title = createGenreTitle(genreName);
  movieContainer.appendChild(title);

  await loadMovies(movieContainer, genreId, 10);
}

// ? 3- Function To Load Details Page
async function loadDetailsPage() {
  // Get ID
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  // If Not Movie
  if (!movieId) {
    return;
  }

  const [movie, cast] = await Promise.all([
    loadMovie(movieId),
    loadCastWark(movieId),
  ]);

  // Wait Function Load Movie From api.js File

  // Select Landing Section and Assign To Background
  const content = document.querySelector(".landing .content");
  content.style.backgroundImage = `url("https://image.tmdb.org/t/p/original${
    movie.backdrop_path
  })`;

  // Select The Box From Landing Page
  const box = document.querySelector(".content .box");

  // Create A Header To The Movie
  const header = document.createElement("h2");
  header.innerHTML = movie.title;

  // Create A Paragraph To The Movie
  const description = document.createElement("p");
  description.innerHTML = movie.overview;

  // Append The Elements To The Box
  box.prepend(description);
  box.prepend(header);

  // Sellect Container Contain On Movie Details
  const details = document.querySelector(".details");

  details.querySelector(".image img").src =
    `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  details.querySelector(".image img").alt = movie.title;

  details.querySelector(".title span").innerHTML = movie.title;

  details.querySelector(".tagline span").innerHTML = movie.tagline;

  details.querySelector(".overview span").innerHTML = movie.overview;

  details.querySelector(".lang span").innerHTML = movie.original_language;

  details.querySelector(".country span").innerHTML = movie.origin_country[0];

  details.querySelector(".time span").innerHTML =
    `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`;

  details.querySelector(".rating span").innerHTML = `
  <i class="fa-solid fa-star"></i>
  ${movie.vote_average.toFixed(1)}
`;
  const genres = movie.genres.map((genre) => genre.name).join(", ");

  details.querySelector(".genre").innerHTML = `Genre: <span>(${genres})</span>`;

  details.querySelector(".date").innerHTML =
    `Release Date: <span>${movie.release_date}</span>`;

  // Create A Container Contain On The Work Cast

  const boxx = document.querySelector(".cast .box");
  cast.forEach((actor) => {
    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("div");
    image.className = "image";

    const img = document.createElement("img");

    if (actor.profile_path) {
      img.src = `https://image.tmdb.org/t/p/w500${actor.profile_path}`;
    } else {
      img.src = "images/someone.jpeg";
    }
    img.alt = actor.name;

    image.appendChild(img);

    const info = document.createElement("div");
    info.className = "info";

    const name = document.createElement("div");
    name.className = "name";

    name.innerHTML = `Name: <span>${actor.name}</span>`;

    const character = document.createElement("div");
    character.className = "character";

    character.innerHTML = `Character: <span>${actor.character}</span>`;

    info.appendChild(name);
    info.appendChild(character);

    card.appendChild(image);
    card.appendChild(info);

    boxx.appendChild(card);
  });
}

// ===============================
// 7- Search Popup
// ===============================

// ? 1- Function To Create A Card To Show A Result Search
function createSearchCard(movie) {
  const card = document.createElement("div");
  card.className = "search-card";

  card.dataset.movieId = movie.id;

  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  img.alt = movie.title;

  const title = document.createElement("h3");
  title.innerHTML = movie.title;

  card.appendChild(img);
  card.appendChild(title);

  card.addEventListener("click", () => {
    window.location = `details.html?id=${movie.id}`;
  });

  return card;
}
// ? 2- Select Items
const searchIcon = document.querySelector(".search");
const searchPopup = document.querySelector(".popup");
const searchInput = document.querySelector(".search-content input");
const searchResults = document.querySelector(".search-results");
const closeIcon = document.querySelector(".popup .icon i");

// ? 3- Add Event On Search Icon To Add Class Active
searchIcon.addEventListener("click", () => {
  searchPopup.classList.add("active");
});

// ? 4- Add Event On Input Search
let searchController;
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = "";
    return;
  }

  // Cancel Previous Request
  if (searchController) {
    searchController.abort();
  }

  // Create New Controller
  searchController = new AbortController();

  try {
    const movies = await searchMovies(query, searchController.signal);

    searchResults.innerHTML = "";

    movies.forEach((movie) => {
      if (!movie.poster_path) {
        return;
      }

      const card = createSearchCard(movie);

      searchResults.appendChild(card);
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
  }
});

// ? 5- Add Event On Close Icon To Remove Class Active
closeIcon.addEventListener("click", () => {
  searchPopup.classList.remove("active");
});

// ===============================
// 8- Plans Duration
// ===============================
const durationBtns = document.querySelectorAll(".plan-duration .duration-btn");
const priceElements = document.querySelectorAll(".plans .plan-card .price");

const monthlyPrices = [9.99, 12.99, 14.99];

durationBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    durationBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const isYearly = index === 1;

    priceElements.forEach((priceEl, priceIndex) => {
      if (isYearly) {
        const yearlyPrice = (monthlyPrices[priceIndex] * 10).toFixed(2);
        priceEl.innerHTML = `$${yearlyPrice}<span>/Year</span>`;
      } else {
        priceEl.innerHTML = `$${monthlyPrices[priceIndex]}<span>/Month</span>`;
      }
    });
  });
});

// =============================================
// 9- Load Page
// =============================================
async function loadPage() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");

  if (type === "genres") {
    await loadGenrePage();
  } else if (type === "top10") {
    await loadTop10Page();
  }
}

// =============================================
// 10- Run
// =============================================
loadPage();
loadDetailsPage();
