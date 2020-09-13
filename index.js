'use strict';

const API_KEY = '8bc1638106a12707e4c5c02b7eb11bf4';
const API_BASE_Name = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=cz`;
const API_BASE = `https://api.openweathermap.org/data/2.5/onecall?&exclude=minutely,hourly&units=metric&lang=cz&appid=${API_KEY}`;

const actCity = document.querySelector("#actCity");
const temper = document.querySelector("#temper");
const popis = document.querySelector("#popis");
let ikonaElement = document.querySelector('#weatherIcon');
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");

const forecastBlock = document.querySelector(".forecastBlock");
const day = document.querySelector("#day");
const forecastIcon = document.querySelector("#forecastIcon");
const forecastTemper = document.querySelector("#forecastTemper");

document.querySelector('.navPanel').addEventListener('click', vyberMisto);
document.querySelector('#actPosition').addEventListener('click', getLocation);

// vychoziPoloha = 'Praha';
let lat = '50.0867806';
let lon = '14.4237125';
nactiPocasi(lat, lon);

// tlacitko map-marker
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    nactiPocasi(lat, lon);
}
// nacteni dat / 'meteoData' - hodnoty & 'nameData' - nazev polohy podle GPS
function nactiPocasi(lat, lon){

    fetch(API_BASE + `&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(meteoData => zobrazPocasi(meteoData));
 
    fetch(API_BASE_Name + `&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(nameData => zobrazMisto(nameData));
}
// preddefinovana tlacitka mest
function vyberMisto(){
	if (event.target.id === 'city1'){
        //poloha = 'Praha';
        lat = '50.0867806';
        lon = '14.4237125';
	}
	if (event.target.id === 'city2'){
        //poloha = 'New York';
        lat = '40.7092817';
        lon = '-73.9617828'; 
    } 
    if (event.target.id === 'city3'){
        //poloha = 'Sydney';
        lat = '-33.8559799094';
        lon = '151.20666584';
    }
    nactiPocasi(lat, lon);
    lat = '';
    lon = '';
}
// nacte nazev mista (API_BASE_Name)
let misto = '';
function zobrazMisto(nameData){
    let misto = nameData.name;
    actCity.textContent = misto;
    //console.log(misto);
}
// nacte hodnoty (API_BASE)
function zobrazPocasi(meteoData){
// current weather    
    let teplota = Math.round(meteoData.current.temp);
    let descr = meteoData.current.weather[0].description;

    let pocasiId = meteoData.current.weather[0].id;
    let icon = meteoData.current.weather[0].icon;
    let novaIkona = getWeatherIcon(meteoData.current.weather[0].id, meteoData.current.weather[0].icon);
 
    let oblacnost = meteoData.current.weather[0].main;
    let vitr = meteoData.current.wind_speed.toFixed(1);
    let vlhkost = meteoData.current.humidity;
    let vychod = new Date(meteoData.current.sunrise * 1000).getHours() + ':' + new Date(meteoData.current.sunrise * 1000).getMinutes();
    let zapad = new Date(meteoData.current.sunset * 1000).getHours() + ':' + new Date(meteoData.current.sunset * 1000).getMinutes();
   
    temper.textContent = teplota;
    popis.textContent = descr;
    ikonaElement.innerHTML = novaIkona;
    wind.textContent = vitr;
    humidity.textContent = vlhkost;
    sunrise.textContent = vychod;
    sunset.textContent = zapad;

// forecast
    
// create new icon for forecast
    function createIcon(i){
    let pocasiId = meteoData.daily[i].weather[0].id;
    let icon = meteoData.daily[i].weather[0].icon;
    return novaIkona = getWeatherIcon(meteoData.daily[i].weather[0].id, meteoData.daily[i].weather[0].icon);
    }
// nacti pole forecast
    // formatovani datumu
        const wkDay =[ 'Neděle','Pondělí', 'Úterý','Středa','Čtvrtek','Pátek','Sobota'];
        function myFormatedDate(i){
            let myDate = new Date(meteoData.daily[i].dt * 1000);
            let myWkDay = wkDay[myDate.getDay()];
            let myDay = myDate.getDate();
            let myMonth = myDate.getMonth()+1;
            let myFormatedDate = `${myWkDay} ${myDay}.${myMonth}.`;
            return myFormatedDate;
        }
        //document.querySelector('.roletka').addEventListener('click', addfrcstDays);
        
        let forecast = [];
        for (let i=1; i<5; i++){
            forecast.push({
                date: myFormatedDate(i),
                icon: createIcon(i),
                temper: Math.round(meteoData.daily[i].temp.day)
            })
        }
    // zobraz forecast 
        let predpoved = '';
        for (let forecastPolozka of forecast){
            predpoved += `<div class="forecast">
                        <div id="day">${forecastPolozka.date}</div>
                        <div id="forecastIcon">${forecastPolozka.icon}</div>
                        <span id="forecastTemper">${forecastPolozka.temper} °C</span>
                    </div>`;
                }

        forecastBlock.innerHTML = predpoved;
    
    
}


