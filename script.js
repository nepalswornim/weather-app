// 🌤️ Weather App Script
const cityInput = document.getElementById("cityInput");
const questionInput = document.getElementById("questionInput");
const aiError = document.getElementById("aiError");
const aiAdvice = document.getElementById("aiAdvice");
const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherResult");

let latestWeatherData = null;

// 🌍 Country backgrounds
const countryBackgrounds = {
  AU: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3lkbmV5fGVufDB8fDB8fHww?auto=format&fit=crop&w=1500&q=80", // Australia
  NP: "https://www.andbeyond.com/wp-content/uploads/sites/5/nepal-village.jpg?auto=format&fit=crop&w=1500&q=80", // Nepal
  US: "https://wallpapersok.com/images/hd/new-york-hd-harbor-and-skyscrapers-5lcoe5nyg04r0tl7.jpg?auto=format&fit=crop&w=1500&q=80", // USA
  FR: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1500&q=80", // France
  JP: "https://images3.alphacoders.com/979/97969.jpg?auto=format&fit=crop&w=1500&q=80", // Japan
  IN: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWF8ZW58MHx8MHx8fDA%3D?auto=format&fit=crop&w=1500&q=80", // India
  GB: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG9uZG9ufGVufDB8fDB8fHww?auto=format&fit=crop&w=1500&q=80", // UK
};

// Load last city from localStorage on page load
window.onload = () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather();
  }
};

// Get Weather Function
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

    // 🌍 Set background image
    const countryCode = data.sys.country;
    const bgUrl = countryBackgrounds[countryCode];
    if (bgUrl) {
      document.body.style.backgroundImage = `url('${bgUrl}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.transition = "background-image 0.5s ease-in-out";
    } else {
      document.body.style.background = document.body.classList.contains("dark-mode")
        ? "linear-gradient(to right, #1a1a1a, #121212)"
        : "linear-gradient(to right, #e0f7fa, #fff)";
      document.body.style.backgroundImage = "none";
    }

    // 🌐 Fetch news
    const countryCodeLower = data.sys.country.toLowerCase();
    fetchNews(countryCodeLower);

    // 🌡️ Weather display
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temp").textContent = data.main.temp.toFixed(1);
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("wind").textContent = data.wind.speed;
    document.getElementById("weatherIcon").src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    aiAdvice.textContent = getFallbackAdvice(data);
    weatherCard.classList.remove("hidden");

    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    document.getElementById("sunrise").textContent = sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("sunset").textContent = sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  } catch (error) {
    console.error("Weather fetch error:", error);
    alert("⚠️ Failed to fetch weather data.");
  }
}

// AI Response Function
async function askAI() {
  const question = questionInput.value.trim();
  const city = cityInput.value.trim();
  if (!question || !city || !latestWeatherData) return;

  aiError.textContent = "";
  aiAdvice.textContent = "";
  loading.style.display = "block";

  try {
    // Mock AI logic
    const answer = getMockAIResponse(question, latestWeatherData);
    aiAdvice.textContent = answer;
  } catch (err) {
    aiError.textContent = "⚠️ Something went wrong with AI.";
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
}

// Fallback AI logic
function getFallbackAdvice(data) {
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  if (humidity > 80) return "💧 Might feel muggy today!";
  if (wind > 10) return "💨 Breezy day — wear a jacket!";
  if (temp > 30) return "🔥 Stay hydrated, it's hot!";
  if (temp < 10) return "🧊 Dress warmly, it's chilly!";
  return `It's a decent day. ${data.weather[0].description}, ${temp.toFixed(1)}°C, ${humidity}% humidity.`;
}

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
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

// Location Detection on Load
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || "your area";
        document.getElementById("cityInput").value = city;
        getWeather();
      } catch (err) {
        console.error("Failed to fetch location:", err);
      }
    }, (err) => {
      console.warn("Geolocation blocked. Use manual input.");
    });
  }
});

// 📰 Fetch News by Country using NewsData.io
async function fetchNews(countryCode) {
  const apiKey = "pub_cda539826f694c2aaa07620fef3efc1d"; // Replace with your NewsData.io API key
  try {
    const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&country=${countryCode}&language=en&category=top`);
    const data = await res.json();

    // Remove previous news
    const oldNewsBox = document.getElementById("newsBox");
    if (oldNewsBox) oldNewsBox.remove();

    const newsBox = document.createElement("div");
    newsBox.className = "card";
    newsBox.id = "newsBox";
    newsBox.innerHTML = `<h3>📰 Top News in ${countryCode.toUpperCase()}</h3>`;

    if (data.results && data.results.length > 0) {
      data.results.slice(0, 3).forEach(article => {
        newsBox.innerHTML += `
          <p><a href="${article.link}" target="_blank">${article.title}</a></p>
        `;
      });
    } else {
      newsBox.innerHTML += "<p>No local news found.</p>";
    }

    document.querySelector(".container").appendChild(newsBox);
  } catch (error) {
    console.error("News fetch error:", error);
  }
}

// Attach for button usage
window.getWeather = getWeather;
window.askAI = askAI;
