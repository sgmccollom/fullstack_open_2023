import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Country = ({ country,temp,icon,wind}) => {
  let c = country[0]
  let langs = Object.values(c.languages)
  let flag = Object.values(c.flags)

  return (
    <>
      <h1>{c.name.common}</h1>
      <p>
        capital: {c.capital[0]}<br/>
        area: {c.area}</p>
      <p><strong>Languages:</strong></p>
        <ul>
          {langs.map(l => 
            <li>
              {l}
            </li>
          )}
        </ul>
      <img src={flag[0]} alt={flag[2]}/>
      <h2>Weather in {c.capital[0]}</h2>
      <p>
        Temperature: {temp} Celcius<br/>
        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}/><br/>
        Wind: {wind} m/s<br/>

      </p>
    </>
  )
}

const Countries = ({ countries,handleShowClick,temp,icon,wind }) => {
  if (countries.length > 10) {
    return (
      <ul>
        <li>Too many matches, specify another letter</li>
      </ul>
    )
  } else if (countries.length === 1) {
    return (
      <Country country={countries} temp={temp} icon={icon} wind={wind}/>
    )
  }

  return (
    <ul>
      {countries.map(country =>
        <li>
          {country.name.common}
          <button onClick={() => handleShowClick(country.name.common)}>
            show
          </button>
        </li>
      )}
    </ul>
  )

}

function App() {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState([])
  const [newTemp, setNewTemp] = useState(null)
  const [newWind, setNewWind] = useState(null)
  const [newIcon, setNewIcon] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log(response.data)
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter(country => {
    let regex = new RegExp(`${newSearch}`, 'i')
    return country.name.common.match(regex)
  })
  

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const showSelectedCountry = (name) => {
    console.log(name, ' shows button was clicked')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        let country = response.data
        setNewSearch(country.name.common)

        let [lat, lon] = country.capitalInfo.latlng

        axios
          .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`)
          .then(response => {
            let data = response.data
            console.log(response.data)
            console.log(data.current.weather[0].icon)
            setNewIcon(data.current.weather[0].icon)
            setNewTemp(data.current.temp)
            setNewWind(data.current.wind_speed)
          })
          .catch(error => {
            console.log(error)
          })
        })
  }

  return (
    <div>
      find countries <input value={newSearch} onChange={handleSearchChange}/>
      <Countries 
        countries={countriesToShow} 
        handleShowClick={showSelectedCountry}
        temp={newTemp}
        icon={newIcon}
        wind={newWind}
      />
    </div>
  );
}

export default App;
