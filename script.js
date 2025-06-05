const searchInput = document.querySelector("#search");
const cardsFlex = document.querySelector("#c-flex");
const regionSelect = document.querySelector("#region");
const themeBtn = document.querySelector(".theme");
const mode = document.querySelector("#mode");
const moon = document.querySelector("#moon");
const sun = document.querySelector("#sun");
const backBtn = document.querySelector("#backBtn");
const countryWrapper = document.querySelector(".country-wrapper");
const circle = document.querySelector(".circle");

// ====================================================

if (cardsFlex) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      circle.classList.add("show");
    } else {
      circle.classList.remove("show");
    }
  });

  circle.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

(() => {
  let checkTheme = JSON.parse(localStorage.getItem("country-theme"));
  if (checkTheme === "light") {
    document.body.classList.add("light");
    moon.style.display = "none";
    sun.style.display = "inline-block";
    mode.textContent = "Light mode";
  }
})();

themeBtn.addEventListener("click", () => {
  let body = document.querySelector("body");
  if (!body.classList.contains("light")) {
    body.classList.add("light");
    moon.style.display = "none";
    sun.style.display = "inline-block";
    mode.textContent = "Light mode";
    localStorage.setItem("country-theme", JSON.stringify("light"));
  } else {
    body.classList.remove("light");
    mode.textContent = "Dark mode";
    moon.style.display = "inline-block";
    sun.style.display = "none";
    localStorage.setItem("country-theme", JSON.stringify("dark"));
  }
});

// ========================== Card Generator =================================

const generateCards = (arr) => {
  if (!cardsFlex) return;
  cardsFlex.innerHTML = arr
    .map((x) => {
      let pop = x.population.toLocaleString();
      return `<div class="c-box">
        <img class="c-image" src=${x.flags.png} alt="">
        <div class="c-title">${x.name.common}</div>
        <div class="c-details">
            <p>Population: ${pop}</p>
            <p>Region: ${x.region}</p>
            <p>Capital: ${x.capital}</p>
        </div>
    </div>`;
    })
    .join("");
};

// =============================== Fetch API ============================

const countryCall = async () => {
  let response = await fetch("https://restcountries.com/v3.1/all?fields=name,nativeName,population,region,subregion,capital,tld,currencies,languages,borders,flags,cca3");
  let result = await response.json();

  generateCards(result);

  // index.html
  const update = (e) => {
    let searchValue = e.target.value.toLowerCase();
    let newArr = result.filter((f) =>
      f.name.common.toLowerCase().includes(searchValue)
    );
    generateCards(newArr);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  let bouncedUpdate = debounce(update, 500);

  if (searchInput) {
    searchInput.addEventListener("input", bouncedUpdate);
  }

  if (regionSelect) {
    regionSelect.addEventListener("change", (e) => {
      let selected = e.target.value.toLowerCase();
      let newArr = result.filter((f) =>
        f.region.toLowerCase().includes(selected)
      );
      generateCards(newArr);
    });
  }

  // country.html
  if (countryWrapper) {
    let localCountry = JSON.parse(
      localStorage.getItem("country").toLowerCase()
    );

    let newArr = result.filter((f) => {
      return f.name.common.toLowerCase() === localCountry;
    });

    let fullDetails = () => {
      countryWrapper.innerHTML = newArr
        .map((x) => {
          
          let borderName = (b) => {
            let reArr = result.filter((f) => f.cca3 === b);
            console.log(reArr)
            return reArr[0].name.common
          };

          return `<div class="detail-flex">
      <img class="full-image" src=${x.flags.png} alt="">
      <div class="full-details">
        <div class="full-Title">${x.name.common}</div>
        <div class="full-info">
          <div class="info1">
            <div class="nativeName"><span class="bold">Native-Name&nbsp;:</span> <span>${
              x.name.nativeName[Object.keys(x.name.nativeName)[0]].official
            }</span></div>
            <div class="nativeName"><span class="bold">Population&nbsp;:</span><span>${
              x.population
            }</span></div>
            <div class="nativeName"><span class="bold">Region&nbsp;:</span><span>${
              x.region
            }</span></div>
            <div class="nativeName"><span class="bold">Sub&nbsp;Region&nbsp;:</span><span>${
              x.subregion
            }</span></div>
            <div class="nativeName"><span class="bold">Capital&nbsp;:</span><span>${
              x.capital ? x.capital[0] : "none"
            }</span></div>
            
          </div>
          <div class="info2">
            <div class="nativeName"><span class="bold">Top&nbsp;Level&nbsp;Domain&nbsp;:</span><span>${
              x.tld[0]
            }</span></div>
            <div class="nativeName"><span class="bold">Currencies&nbsp;:</span><span></span>${
              x.currencies[Object.keys(x.currencies)[0]].symbol
            }, ${x.currencies[Object.keys(x.currencies)[0]].name}</div>
            <div class="nativeName"><span class="bold">Languages&nbsp;:</span><span>${Object.values(
              x.languages
            ).join(", ")}</span></div>
          </div>
        </div>
        <div class="border">
          <span class="bold">Border Countries&nbsp;:</span>
          <span onclick="goTo('${
            x.borders ? borderName(x.borders[0]) : "none"
          }')" class="neighbours">${
            x.borders ? borderName(x.borders[0]) : "N/A"
          }</span>
          <span onclick="goTo('${
            x.borders && x.borders.length >= 2
              ? borderName(x.borders[1])
              : "none"
          }')" class="neighbours">${
            x.borders && x.borders.length >= 2
              ? borderName(x.borders[1])
              : "N/A"
          }</span>
          <span onclick="goTo('${
            x.borders && x.borders.length >= 3
              ? borderName(x.borders[2])
              : "none"
          }')" class="neighbours">${
            x.borders && x.borders.length >= 3
              ? borderName(x.borders[2])
              : "N/A"
          }</span>
        </div>
      </div>
    </div>`;
        })
        .join("");

        const fullImage = document.querySelector(".full-image");
          if (fullImage) {
            Observer.observe(fullImage);
          }

        const natives = document.querySelectorAll('.nativeName');
        if(natives){
          natives.forEach((n)=> Observer.observe(n));
        }

        const neighbours = document.querySelectorAll('.neighbours');
        if(neighbours){
          neighbours.forEach((n)=> Observer.observe(n));
        }


    };
    fullDetails();
  }
};

countryCall();

// ================================ Redirection =============================================================

// index.html
if (cardsFlex) {
  cardsFlex.addEventListener("click", (e) => {
    let box = e.target.closest(".c-box");
    if (box) {
      let title = box.querySelector(".c-title").textContent;
      localStorage.setItem("country", JSON.stringify(title));
      window.location.href = "./country.html";
    }
  });
}

// country.html
let goTo = (x) => {
  if (x === "none") return;
  let title = x.toLowerCase();
  localStorage.setItem("country", JSON.stringify(title));
  window.location.href = "./country.html";
};

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}

// ==================================== IntersectionObserver ========================================

const Observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("observed");
      } else {
        entry.target.classList.remove("observed");
      }
    });
  },
  { threshold: 0.5 }
);
