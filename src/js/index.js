const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("searchbtn");
const searchSection = document.getElementById("search-section");
const cityScore = document.getElementById("city-score");
const cityDesc = document.getElementById("city-description");
const cityImg = document.getElementById("img-citta");
const scoreTitle = document.getElementById("score-title");
const categoriesDiv = document.getElementById("categories");
const categoriesDivName = document.getElementsByClassName("categories-name");
const categoriesTitle = document.getElementById("categories-title");
const mediaQueryMobile = window.matchMedia("(max-width: 1023px)");
const errorContainer = document.getElementById("error-container");
const resultsSection = document.querySelector(".results");

let cityName;

async function getData() {
  if (searchInput.value == "") {
    getError();
  } else {
    removeClass();
    categoriesDiv.innerHTML = "";
    //corregge nome citta
    cityName = searchInput.value.toLowerCase().replace(/\s+/g, "-");

    //scores
    axios
      .get(`https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`)
      .then((res) => {
        //Aggiungo titolo pagina sinistra
        const titleText = "Quality of life in " + cityName;
        scoreTitle.textContent = titleText.toUpperCase();
        //Aggiungo titolo pagina destra
        const CategoriesTitleText = "life quality score";
        categoriesTitle.textContent = CategoriesTitleText.toUpperCase();
        //prendo la descrizione della citta
        const summary = res.data.summary;
        cityDesc.innerHTML = summary;
        //prendo il city score
        const teleportScore = res.data.teleport_city_score;
        cityScore.innerHTML = "Total score: " + teleportScore.toFixed(2);
        //city categories
        const categories = res.data.categories;

        categories.forEach((element) => {
          //credo card per ogni categoria
          const card = document.createElement("div");
          card.classList.add("card");
          categoriesDiv.appendChild(card);

          //div per 'controllo css' nome card
          const divLeft = document.createElement("div");
          divLeft.classList.add("div-left");
          card.appendChild(divLeft);
          //div per 'controllo css' progressbar
          const divCenter = document.createElement("div");
          divCenter.classList.add("div-center");
          card.appendChild(divCenter);
          //div per 'controllo css' score
          const divRight = document.createElement("div");
          divRight.classList.add("div-right");
          card.appendChild(divRight);

          //credo nome della card
          const nameCard = document.createElement("h4");
          nameCard.classList.add("card-name");
          nameCard.innerHTML = element.name;
          divLeft.appendChild(nameCard);

          //creo progress bar
          const progressBarDiv = document.createElement("div");
          progressBarDiv.classList.add("progress-bar");
          divCenter.appendChild(progressBarDiv);

          //creo progress bar colorata
          const colorProgressBar = document.createElement("div");
          colorProgressBar.classList.add("color-progress-bar");
          colorProgressBar.style.backgroundColor = element.color;
          /* Arrotondo il valore di score e lo setto come width della ColorProgressBar */
          let number = element.score_out_of_10.toFixed(2) * 10 + "%";
          colorProgressBar.style.width = number;
          progressBarDiv.appendChild(colorProgressBar);
          // prendo score/10
          const scoreTen = document.createElement("p");
          scoreTen.classList.add("score-ten");
          scoreTen.innerHTML = element.score_out_of_10.toFixed(0) + "/10";
          divRight.appendChild(scoreTen);
        });
        //images
        axios
          .get(
            `https://api.teleport.org/api/urban_areas/slug:${cityName}/images/`
          )
          .then((res) => {
            const cityImgLink = res.data.photos[0].image;
            //seleziono l'img in base alla media query
            if (mediaQueryMobile.matches) {
              cityImg.src = cityImgLink.mobile;
            } else {
              cityImg.src = cityImgLink.web;
            }
          })
          .catch((error) => {});
      })
      .catch((err) => {
        if (err.name === "AxiosError") {
          errorContainer.innerHTML = "";
          const cityErr = document.createElement("p");
          cityErr.classList.add("error-message");
          cityErr.textContent = "City not found!";
          errorContainer.appendChild(cityErr);
          resultsSection.classList.add("hidden");
        }
      });
  }
}

//Rimuovo classe hide se non viene compilato il form
function getError() {
  const errorMsg = document.querySelector(".error-message");
  errorMsg.classList.remove("hide");
  if (searchInput.value == "") {
    errorMsg.textContent = "The input field cannot be empty!";
  }
  return errorMsg;
}

//Rimuovo classe hidden
function removeClass() {
  resultsSection.classList.remove("hidden");
}

//Ricerca citta'
searchBtn.addEventListener("click", () => {
  getData();
});

//Ricerca citta' se viene premuto enter
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (searchInput.value === "") {
      getError();
    } else {
      getData();
    }
    const errorMsg = document.querySelector(".error-message");
    errorMsg.classList.add("hide");
  }
});
