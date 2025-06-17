// This is our mock AI function that simulates an "AI response" based on weather data.
function getMockAIResponse(question, weatherData) {
  if (!weatherData) {
    return "Please fetch the weather data first.";
  }
  
  const temp = weatherData.main.temp;
  const condition = weatherData.weather[0].description;
  const lowerQuestion = question.toLowerCase();
  let advice = "";
  
  if (lowerQuestion.includes("rain")) {
    advice = (weatherData.main.humidity > 80 || condition.includes("rain"))
      ? "Yes, there’s a high chance of rain. Bring an umbrella!"
      : "It doesn't look like it'll rain much.";
  } else if (lowerQuestion.includes("cold")) {
    advice = (temp < 10)
      ? "It is quite cold. You should definitely wear a jacket."
      : "It's not too cold today.";
  } else if (lowerQuestion.includes("hot")) {
    advice = (temp > 30)
      ? "It's really hot. Stay hydrated!"
      : "It's a moderate temperature today.";
  } else {
    // General fallback reply.
    advice = `Based on the current weather, it seems ${condition} with a temperature of ${temp.toFixed(1)}°C.`;
  }
  
  return advice;
}
