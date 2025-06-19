const cityInput = document.getElementById("cityInput");
const questionInput = document.getElementById("questionInput");
const aiError = document.getElementById("aiError");
const aiAdvice = document.getElementById("aiAdvice");
const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherResult");

let latestWeatherData = null;

const countryBackgrounds = {
  AU: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a",
  NP: "https://www.andbeyond.com/wp-content/uploads/sites/5/nepal-village.jpg",
  US: "https://wallpapersok.com/images/hd/new-york-hd-harbor-and-skyscrapers-5lcoe5nyg04r0tl7.jpg",
  FR: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  JP: "https://images3.alphacoders.com/979/97969.jpg",
  IN: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
  GB: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be",
};

window.onload = () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather();
  }
};

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  localStorage.setItem("lastCity", city);

  try {
    const apiKey = "670bf1ca8ae119a31433dc91fdbd8362";
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    if (res.status !== 200 || !data.main) {
      alert("❌ City not found or weather data missing.");
      return;
    }

    latestWeatherData = data;

    // Set background
    const countryCode = data.sys.country;
    const bgUrl = countryBackgrounds[countryCode];
    document.body.style.backgroundImage = bgUrl
      ? `url('${bgUrl}')`
      : document.body.classList.contains("dark-mode")
      ? "linear-gradient(to right, #1a1a1a, #121212)"
      : "linear-gradient(to right, #e0f7fa, #fff)";

    // Weather details
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temp").textContent = data.main.temp.toFixed(1);
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("wind").textContent = data.wind.speed;
    document.getElementById("weatherIcon").src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    aiAdvice.textContent = getFallbackAdvice(data);
    weatherCard.classList.remove("hidden");

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    document.getElementById("sunrise").textContent = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("sunset").textContent = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    fetchNews(data.sys.country.toLowerCase());
  } catch (error) {
    console.error("Weather fetch error:", error);
    alert("⚠️ Failed to fetch weather data.");
  }
}

async function askAI() {
  const question = questionInput.value.trim();
  const city = cityInput.value.trim();
  if (!question || !city || !latestWeatherData) return;

  aiError.textContent = "";
  aiAdvice.textContent = "";
  loading.style.display = "block";

  try {
    const answer = getMockAIResponse(question, latestWeatherData);
    aiAdvice.textContent = answer;
  } catch (err) {
    aiError.textContent = "⚠️ Something went wrong with AI.";
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
}

function getFallbackAdvice(data) {
  const { temp, humidity } = data.main;
  const wind = data.wind.speed;
  if (humidity > 80) return "💧 Might feel muggy today!";
  if (wind > 10) return "💨 Breezy day — wear a jacket!";
  if (temp > 30) return "🔥 Stay hydrated, it's hot!";
  if (temp < 10) return "🧊 Dress warmly, it's chilly!";
  return `It's a decent day. ${data.weather[0].description}, ${temp.toFixed(1)}°C, ${humidity}% humidity.`;
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  themeToggle.textContent = isDark ? "🌚 Toggle Light Mode" : "🌞 Toggle Dark Mode";
});

window.addEventListener("DOMContentLoaded", () => {
  const darkPref = localStorage.getItem("darkMode");
  if (darkPref === "enabled") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "🌚 Toggle Light Mode";
  }
});

async function fetchNews(countryCode) {
  const apiKey = "pub_cda539826f694c2aaa07620fef3efc1d";
  try {
    const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&country=${countryCode}&language=en&category=top`);
    const data = await res.json();
    const oldBox = document.getElementById("newsBox");
    if (oldBox) oldBox.remove();

    const box = document.createElement("div");
    box.className = "card";
    box.id = "newsBox";
    box.innerHTML = `<h3>📰 Top News in ${countryCode.toUpperCase()}</h3>`;
    (data.results || []).slice(0, 3).forEach(article => {
      box.innerHTML += `<p><a href="${article.link}" target="_blank">${article.title}</a></p>`;
    });
    document.querySelector(".container").appendChild(box);
  } catch (err) {
    console.error("News error:", err);
  }
}
