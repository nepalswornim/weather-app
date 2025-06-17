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

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  localStorage.setItem("lastCity", city);

  try {
    const apiKey = "670bf1ca8ae119a31433dc91fdbd8362"; // Replace if you rotate it
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (res.status !== 200 || !data.main) {
      alert("❌ City not found or weather data missing.");
      return;
    }

    latestWeatherData = data;

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temp").textContent = data.main.temp.toFixed(1);
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("wind").textContent = data.wind.speed;
    document.getElementById("weatherIcon").src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    aiAdvice.textContent = getFallbackAdvice(data);
    weatherCard.classList.remove("hidden");
    // Convert sunrise/sunset timestamps to local time
const sunriseTime = new Date(data.sys.sunrise * 1000);
const sunsetTime = new Date(data.sys.sunset * 1000);

document.getElementById("sunrise").textContent = sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
document.getElementById("sunset").textContent = sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
    document.getElementById("themeToggle").textContent = "🌚 Toggle Light Mode";
  }
});


//Toggle Function

// Attach to window for button onclick use
window.getWeather = getWeather;
window.askAI = askAI;
