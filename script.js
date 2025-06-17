

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "670bf1ca8ae119a31433dc91fdbd8362";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const resultBox = document.getElementById("weatherResult");
  resultBox.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
  resultBox.style.display = "block";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

   const summary = generateSummary(data);

resultBox.innerHTML = `
  <h2>${data.name}</h2>
  <img src="${iconUrl}" alt="Weather icon">
  <p>🌡️ Temp: ${data.main.temp} °C</p>
  <p>🌥️ Weather: ${data.weather[0].description}</p>
  <p>💧 Humidity: ${data.main.humidity}%</p>
  <p>🌬️ Wind: ${data.wind.speed} m/s</p>
  <hr>
  <p><strong>🤖 AI Advice:</strong> ${summary}</p>
`;

  } catch (err) {
    resultBox.innerHTML = `<p class="text-danger">❌ ${err.message}</p>`;
  }
}
function generateSummary(data) {
  const temp = data.main.temp;
  const condition = data.weather[0].main.toLowerCase();
  const humidity = data.main.humidity;

  let advice = "It's a decent day.";
  if (condition.includes("rain") || humidity > 80) {
    advice = "Carry an umbrella just in case!";
  } else if (temp > 30) {
    advice = "Stay hydrated, it's hot out.";
  } else if (temp < 5) {
    advice = "Bundle up, it's chilly.";
  }

  return `${advice} Currently ${condition} with ${temp}°C and ${humidity}% humidity.`;
}

