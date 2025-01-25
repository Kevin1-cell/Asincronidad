const climaElement = document.getElementById("current-weather");
const celsiusElement = document.getElementById("current-temperature-c");
const fahrenheitElement = document.getElementById("current-temperature-f");

async function consultarClima() {
    const promesas = [consultaApiUno(),consultaApiDos(),consultaApiTres()];
    const info = await Promise.race(promesas);
    cambiarVariables(info);
}

function cambiarVariables (info){
    climaElement.textContent = info.clima;
    celsiusElement.textContent = info.climaC;
    fahrenheitElement.textContent = info.climaF;
}

function determinarclima(climaCelcius) {

    if (climaCelcius <= 10) return "Helado";

    if(climaCelcius <= 15) return "Frio";

    if(climaCelcius <= 23) return "Templado";

    if(climaCelcius <= 30) return "Calido";

    return "caluroso";

}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

async function consultaApiUno() {
    const resp = await fetch("https://wttr.in/Medell%C3%ADn?format=j1").catch(()=> "Error al llamar la api");
    if (resp.status !== 200) {
        return `Error HTTP: ${resp.status}`
    }
    const respJson = await resp.json();
    const tempC = respJson.current_condition[0].temp_C 
    const finalResp = {
        "climaC" : `${tempC}°C`,
        "climaF" : `${respJson.current_condition[0].temp_F}°F`,
        "clima" : determinarclima(tempC)
    }

    return finalResp
}

async function consultaApiDos() {
    const resp = await fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=6.25184&lon=-75.56359").catch(()=> "Error al llamar la api");
    if (resp.status !== 200) {
        return `Error HTTP: ${resp.status}`
    }
    const respJson = await resp.json();

    const tempC = respJson.properties.timeseries[0].data.instant.details.air_temperature
    const tempF = celsiusToFahrenheit(tempC)
    const clima = determinarclima(tempC)

    const finalResp = {
        "climaC" : `${tempC}°C`,
        "climaF" : `${tempF}°F`,
        "clima" : clima
    }

    return finalResp
}

async function consultaApiTres() {
    const resp = await fetch("https://api.open-meteo.com/v1/forecast?latitude=6.25184&longitude=-75.56359&current_weather=true").catch(()=> "Error al llamar la api");
    if (resp.status !== 200) {
        return `Error HTTP: ${resp.status}`
    }
    const respJson = await resp.json();

    const tempC = respJson.current_weather.temperature
    const tempF = celsiusToFahrenheit(tempC)
    const clima = determinarclima(tempC)

    const finalResp = {
        "climaC" : `${tempC}°C`,
        "climaF" : `${tempF}°F`,
        "clima" : clima
    }

    return finalResp
}

async function main() {
    consultarClima();
    setInterval(consultarClima, 10000);
}

main();