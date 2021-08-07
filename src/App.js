import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table'; 
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
function App() {
  //https://disease.sh/v3/covid-19/countries
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
useEffect(() => {
fetch("https://disease.sh/v3/covid-19/all")
.then(response => response.json())
.then((data) => {
  setCountryInfo(data);
})
}, [])  

 useEffect(()=>{
const getCountriesData = async () => {
  await fetch("https://disease.sh/v3/covid-19/countries")
  .then((response) => response.json())
  .then((data) => {
    const countries = data.map((country) =>(
      {
        name: country.country,
        value: country.countryInfo.iso2
      }
    ))
    const sortedData = sortData(data);
    setTableData(sortedData);
    setCountries(countries);
  })
}
getCountriesData();
 }, [])

 const onCountryChange = async (event) => {
  const countryCode = event.target.value;
  setCountry(countryCode);

  const url = countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/countries/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  await fetch(url)
  .then(response => response.json())
  .then(data => {
    setCountry(countryCode);
    setCountryInfo(data);
   
    });
 };
    
 console.log(countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        {/* Header part */}
      <div className="app__header"> 
      <h1>CoronaVirus Tracker</h1> 
      <FormControl className="app__dropdown"> 
      <Select variant="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
      {
        countries.map(country => (
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))
      }
      </Select>
      </FormControl>
      </div>

      {/* Info  recovered deaths*/}
      <div className ="app__stats">
      <InfoBox title="CoronaVirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
      <InfoBox title="Recover" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
      <InfoBox title="Death" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
      </div>

      {/* Map */}
      <Map/>
      </div>
    <Card className="app__right">
      <CardContent>
      {/* Table */} 
      <h3>Till Date Cases by Country</h3>
     <Table countries={tableData}/>
      {/* Graph */}
      <h3>Worldwide New Cases</h3>
      <LineGraph />
      </CardContent>
    </Card>
    </div>
  );
}

export default App;
