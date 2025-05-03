import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_WEATHER;

function Country({ countryInfo, weatherInfo }) {
    if (countryInfo && weatherInfo) {
        return (
            <div>
                <h1>{countryInfo.name.common}</h1>
                <div>{countryInfo.capital[0]}</div>
                <div>Area {countryInfo.area}</div>
                <h3>Languages</h3>
                <ul>
                    {Object.keys(countryInfo.languages).map((l) => (
                        <li key={l}>{countryInfo.languages[l]}</li>
                    ))}
                </ul>
                <img src={countryInfo.flags.png}></img>
                <h3>Weather in {countryInfo.capital[0]}</h3>
                <div>Temperature {weatherInfo.main.temp} Celcius</div>
                <img src={`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`}></img>
                <div>Wind {weatherInfo.wind.speed} m/s</div>
            </div>
        );
    }
    return <div>Loading</div>;
}

function SearchBar({ handleSearch }) {
    return (
        <>
            {"find countries"} <input onChange={(event) => handleSearch(event.target.value)}></input>
        </>
    );
}

function App() {
    const [countries, setCountries] = useState([]);
    const [allCountries, setAllCountries] = useState([]);
    const [found, setFound] = useState("");
    const [countryInfo, setCountryInfo] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState(null);

    useEffect(() => {
        if (found != "") {
            axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${found}`).then((response) => {
                setCountryInfo(response.data);
                axios
                    .get(
                        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${response.data.capitalInfo.latlng[0]}&lon=${response.data.capitalInfo.latlng[1]}&appid=${API}`
                    )
                    .then((response2) => {
                        setWeatherInfo(response2.data);
                        console.log(response2.data);
                    });
            });
        }
    }, [found]);

    useEffect(() => {
        axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then((response) => {
            setAllCountries(response.data.map((c) => c.name.common));
        });
    }, []);

    const handleSearch = (val) => {
        let reduced = allCountries.filter((c) => c.toLowerCase().includes(val));
        setCountries(reduced);
        if (reduced.length == 1) {
            setFound(reduced[0]);
        }
    };

    return (
        <>
            <SearchBar handleSearch={handleSearch} />
            {countries.length == 1 ? (
                <Country countryInfo={countryInfo} weatherInfo={weatherInfo} />
            ) : countries.length <= 10 ? (
                countries.map((c) => {
                    return (
                        <div key={c}>
                            {c}{" "}
                            <button
                                onClick={() => {
                                    setCountries([c]);
                                    setFound(c);
                                }}
                            >
                                Show
                            </button>
                        </div>
                    );
                })
            ) : (
                <div>Too many matches, specify another filter</div>
            )}
        </>
    );
}

export default App;
