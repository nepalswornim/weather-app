// 🌤️ Weather App Script
const cityInput = document.getElementById("cityInput");
const questionInput = document.getElementById("questionInput");
const aiError = document.getElementById("aiError");
const aiAdvice = document.getElementById("aiAdvice");
const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherResult");

let latestWeatherData = null;

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
  const oldNewsBox = document.getElementById("newsBox");
  if (oldNewsBox) oldNewsBox.remove();

  const city = cityInput.value.trim();
  if (!city) return;

  localStorage.setItem("lastCity", city);

  try {
    const apiKey = "670bf1ca8ae119a31433dc91fdbd8362"; // OpenWeatherMap API
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (res.status !== 200 || !data.main) {
      alert("❌ City not found or weather data missing.");
      return;
    }

    latestWeatherData = data;

    // Fetch news by country code
    const countryCode = data.sys.country;
    fetchNews(countryCode);

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

// Ask AI Function
async function askAI() {
  const question = questionInput.value.trim();
  const city = cityInput.value.trim();
  if (!question || !city || !latestWeatherData) return;

  aiError.textContent = "";
  aiAdvice.textContent = "";
  loading.style.display = "block";

  try {
    const answer = getMockAIResponse(question, latestWeatherData); // Your mock AI
    aiAdvice.textContent = answer;
  } catch (err) {
    aiError.textContent = "⚠️ Something went wrong with AI.";
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
}

// Mock AI response generator
function getMockAIResponse(question, data) {
  const temp = data.main.temp;
  if (question.toLowerCase().includes("umbrella")) {
    return data.weather[0].main.toLowerCase().includes("rain")
      ? "☔ Yes, carry one!"
      : "🌤️ No rain expected today.";
  }
  return `Based on current weather in ${data.name}, it's ${temp.toFixed(1)}°C. Plan accordingly!`;
}

// Fallback Advice
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

// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  themeToggle.textContent = isDark ? "🌚 Toggle Light Mode" : "🌞 Toggle Dark Mode";
});

// Apply dark mode on load
window.addEventListener("DOMContentLoaded", () => {
  const darkPref = localStorage.getItem("darkMode");
  if (darkPref === "enabled") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "🌚 Toggle Light Mode";
  }
});

// Get user's location on load
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

// 📰 Fetch News by Country Code
async function fetchNews(countryCode) {
  const apiKey = "157fc7c9ae11b357b0d8e37374dc970a"; // GNews API

  const oldNewsBox = document.getElementById("newsBox");
  if (oldNewsBox) oldNewsBox.remove();

  try {
    const res = await fetch(`https://gnews.io/api/v4/top-headlines?lang=en&country=${countryCode}&max=3&token=${apiKey}`);

    const data = await res.json();

    const newsBox = document.createElement("div");
    newsBox.className = "card";
    newsBox.id = "newsBox";
    newsBox.innerHTML = `<h3>📰 Top News in ${countryCode}</h3>`;

    if (data.articles && data.articles.length > 0) {
      data.articles.forEach(article => {
        newsBox.innerHTML += `<p><a href="${article.url}" target="_blank">${article.title}</a></p>`;
      });
    } else {
      newsBox.innerHTML += "<p>No local news found.</p>";
    }

    document.querySelector(".container").appendChild(newsBox);
  } catch (error) {
    console.error("News fetch error:", error);

    const fallbackBox = document.createElement("div");
    fallbackBox.className = "card";
    fallbackBox.id = "newsBox";
    fallbackBox.innerHTML = `<h3>📰 News Error</h3><p>Could not fetch news for ${countryCode}.</p>`;
    document.querySelector(".container").appendChild(fallbackBox);
  }
}

// Attach functions globally
window.getWeather = getWeather;
window.askAI = askAI;
