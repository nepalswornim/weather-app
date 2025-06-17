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

let showingDetails = false;

function toggleWeatherDetails() {
  const weatherCard = document.getElementById("weatherResult");
  const details = document.getElementById("extraDetails");

  if (!latestWeatherData) return;

  if (showingDetails) {
    details.innerHTML = "";
  } else {
    details.innerHTML = `
      <p>🤒 Feels Like: ${latestWeatherData.main.feels_like} °C</p>
      <p>📈 Pressure: ${latestWeatherData.main.pressure} hPa</p>
      <p>🌫️ Visibility: ${latestWeatherData.visibility / 1000} km</p>
    `;
  }
  showingDetails = !showingDetails;
}

//Toggle Function

// Attach to window for button onclick use
window.getWeather = getWeather;
window.askAI = askAI;
