document.addEventListener("DOMContentLoaded", () => {
  let forecastData = [];

  async function getWeather(lat, lon) {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=1691e12e42cb422083c122510241906&q=${lat},${lon}&days=3&aqi=no&alerts=no`
      );
      const data = await response.json();
      const forecastDays = data.forecast.forecastday;
      const locationName = data.location.name;
      const currentTemp = data.current;

      forecastData = forecastDays.map((forecastDay) => {
        const date = new Date(forecastDay.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        const formattedDate = `${date.getDate()}${date.toLocaleDateString(
          "en-US",
          { month: "short" }
        )}`;
        return {
          dayName,
          current: currentTemp,
          forecast: forecastDay.day,
          location: locationName,
          formattedDate,
        };
      });

      display(forecastData);
    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
  }

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeather(latitude, longitude);
      },
      (error) => {
        console.log("Error getting location:", error);
      }
    );
  }

  function display(data) {
    let theadContent = `<tr>`;
    let tbodyContent = `<tr>`;

    data.forEach(
      ({ dayName, current, forecast, location, formattedDate }, index) => {
        if (index === 0) {
          theadContent += `<th class="col-md-3" scope="col" data-label="">${dayName}<span class="float-end">${formattedDate}</span></th>`;
          tbodyContent += `<td class="text-center date" data-label="${dayName}\t${formattedDate}">
          <p class="pt-4 fs-2 text-primary fw-bolder fst-italic">${location}</p>
          <p class="currentTemp">${current.temp_c}°C</p>
          <img class="icon" src="https:${current.condition.icon}" alt="Current Weather Icon">
          <p class="text">${current.condition.text}</p>
          <p>
            <span class="me-5"><img class="me-2" src="imgs/images4.png" alt="Current Weather Icon">${current.cloud}%</span>
            <span class="me-5"><img class="me-2" src="imgs/images5.png" alt="Current Weather Icon">${current.wind_kph}km/h</span>
            <span><img class="me-2" src="imgs/images6.png" alt="Current Weather Icon">${current.wind_dir}</span>
          </p>
        </td>`;
        } else {
          theadContent += `<th class="col-md-3" scope="col" data-label="">${dayName}</th>`;
          tbodyContent += `<td data-label="${dayName}">
          <div class="d-flex justify-content-center align-items-center flex-column">
            <img class="icon" src="https:${forecast.condition.icon}" alt="Current Weather Icon">
            <p class="maxTemp">${forecast.maxtemp_c}°C</p>
            <p class="minTemp">${forecast.mintemp_c}°C</p>
            <p class="text">${forecast.condition.text}</p>
          </div>
        </td>`;
        }
      }
    );

    theadContent += `</tr>`;
    tbodyContent += `</tr>`;

    document.querySelector(".table").innerHTML = `
      <thead>${theadContent}</thead>
      <tbody>${tbodyContent}</tbody>
    `;
  }

  getCurrentLocation();

  async function searchForecast(searchKey) {
    if (searchKey.trim() === "") {
      getCurrentLocation();
      return;
    }
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=1691e12e42cb422083c122510241906&q=${searchKey}&days=3&aqi=no&alerts=no`
      );
      if (response.ok && response.status !== 400) {
        const data = await response.json();
        const forecastDays = data.forecast.forecastday;
        const locationName = data.location.name;
        const currentTemp = data.current;

        const searchForecastData = forecastDays.map((forecastDay) => {
          const date = new Date(forecastDay.date);
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
          const formattedDate = `${date.getDate()}${date.toLocaleDateString(
            "en-US",
            { month: "short" }
          )}`;
          return {
            dayName,
            current: currentTemp,
            forecast: forecastDay.day,
            location: locationName,
            formattedDate,
          };
        });

        display(searchForecastData);
      }
    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
  }

  document.getElementById("search").addEventListener("input", (event) => {
    searchForecast(event.target.value);
  });
  document.getElementById("submit").addEventListener("click", () => {
    const searchKey = document.getElementById("search").value;
    searchForecast(searchKey);
  });
});
