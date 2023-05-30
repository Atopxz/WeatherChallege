//Variáveis


const apiKey = "e5d547c492fae17ae940736320bb6a74";
const apiCountryURL = "https://flagsapi.com/.png";

const placeH1 = document.querySelector("#place");
const countryElement = document.querySelector("#country");
const weatherIconElement = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feelsLike");
const description = document.querySelector("#description");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const visibility = document.querySelector("#visibility");
const pressure = document.querySelector("#pressure");

const placeInput = document.querySelector("#place-input");
const searchBtn = document.querySelector("#searchBtn");

const nextDivBtn = document.querySelector("#nextDivBtn");

const moreInfoIcons = document.querySelectorAll(".moreInfoIcon");
const moreInfoTexts = document.querySelectorAll(".moreInfo p");

const loading = document.querySelector(".loading");
const container = document.querySelector(".container");
const error = document.querySelector(".error");

const itemForecast = document.querySelectorAll(".itemForecast");

const forecastGallery = document.querySelector(".forecastGallery");
const controlCarousel = document.querySelectorAll(".controlCarousel");
const leftBtn = document.querySelector(".leftBtn");
const rightBtn = document.querySelector(".rightBtn");

//Funções
function forecastDayUpdate() {
  const dataAtual = new Date();

  for (let i = 0; i < itemForecast.length; i++) {
    const itemCarousel = itemForecast[i];
    const data = new Date();
    data.setDate(dataAtual.getDate() + i);

    const forecastDay = itemCarousel.getElementsByClassName("forecastDay")[0];
    if (i === 0) {
      forecastDay.textContent = "Hoje";
    } else
      forecastDay.textContent = data.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
      });
  }
}
forecastDayUpdate();

//Aparece/desaparece a tela de carregamento
function loadingScrean() {
  loading.classList.toggle("hide");
  container.classList.toggle("hide");
}

//Aparece a tela de erro
function errorScrean() {
  loading.classList.toggle("hide");
  error.classList.remove("hide");
}

// Chama infos da API
const getWeatherData = async (place) => {
  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  return data;
};

//Modifica o site com as info
const showWeatherData = async (place) => {
  loadingScrean();
  try {
    const data = await getWeatherData(place);

    placeH1.innerText = data.name;
    countryElement.setAttribute(
      "src",
      `https://flagsapi.com/${data.sys.country}/flat/64.png`
    );
    temperature.innerText = `${parseInt(data.main.temp)}°`;
    weatherIconElement.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    feelsLike.innerText = `${parseInt(data.main.feels_like)}°`;
    description.innerText = data.weather[0].description;
    wind.innerText = `${data.wind.speed} Km/h`;
    humidity.innerText = `${data.main.humidity}%`;
    visibility.innerText = `${data.visibility / 1000} Km`;
    pressure.innerText = `${data.main.pressure} mb`;

    itemForecast.forEach((item) => {
      item.querySelector(".forescastMax").innerText = `${parseInt(data.main.temp_max)}°`;
      item.querySelector(".forescastMin").innerText = `${parseInt(data.main.temp_min)}°`;
    });

    loadingScrean();
  } catch (error) {
    // Tratamento de erro, se necessário
    errorScrean();
  }
};

//Para colocar o tempo atual
function showTime() {
  const time = document.querySelector("#time");
  const dataAtual = new Date();
  const horario = dataAtual.toLocaleTimeString();

  time.innerText = horario;
}
setInterval(showTime, 1000);

//Eventos

// Adiciona o evento de clique e c a tecla pressionada p a procura
searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const place = placeInput.value;
  showWeatherData(place);
});

placeInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const place = e.target.value;

    showWeatherData(place);
  }
});

// Abaixa a página pra a parte do conteúdo
nextDivBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const content = document.querySelector(".containerTop");
  content.scrollIntoView({ behavior: "smooth" });
});

// Faz aparecer/desaparecer a descrição do icone de mais informações
moreInfoIcons.forEach((icon, index) => {
  icon.addEventListener("mouseover", () => {
    moreInfoTexts[index].style.visibility = "visible";
  });

  icon.addEventListener("mouseout", () => {
    moreInfoTexts[index].style.visibility = "hidden";
  });
});

//Pra mostrar mais informações ao selecionar o dia na previsão do tempo
itemForecast.forEach(function (item) {
  item.addEventListener("click", function () {
    itemForecast.forEach(function (iten) {
      iten.classList.remove("current-item");
      iten.querySelector(".forecastMoreDesc").classList.add("hide");
    });
    this.classList.add("current-item");
    this.querySelector(".forecastMoreDesc").classList.remove("hide");
  });
});

//Botões de scroll da previsão
controlCarousel.forEach(function (control) {
  control.addEventListener("click", (e) => {
    if (control.classList.contains("leftBtn")) {
      forecastGallery.scrollLeft -= forecastGallery.offsetWidth;
      rightBtn.classList.toggle("hide");
      leftBtn.classList.toggle("hide");
    } else {
      forecastGallery.scrollLeft += forecastGallery.offsetWidth;
      leftBtn.classList.toggle("hide");
      rightBtn.classList.toggle("hide");
    }
  });
});

//Botão de "Tente novamente" // alerta para gambiarra
error.addEventListener("click", () => {
  placeH1.innerText = "Rio Branco";
  container.classList.toggle("hide");
  error.classList.toggle("hide");
});
