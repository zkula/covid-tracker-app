import React, { useState, useEffect } from "react";
import "./App.css";
import Stats from "./Stats.js";
import Map from "./Map.js";
import {
  Card,
  CardContent,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import Table from "./Table.js";
import { sortData, prettyPrintStat } from "./util.js";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getCountriesData = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await response.json();
      const _countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2, //UK, US, CA
      }));
      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(_countries);
      setMapCountries(data);
    };

    getCountriesData();
    console.log("GLOBAL DATA", countryInfo);
    console.log("COUNTRIES DATA", countries);
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  console.log("GLOBAL DATA", countryInfo);
  console.log("COUNTRIES DATA", countries);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  console.log("COUNTRYINFO", countryInfo);

  return (
    <div className="app">
      {/* Left Side (stats, map, title, dropdown list*/}
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              {/* Loop through all countries and show drop down display */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <Stats
            active={casesType === "cases"}
            casesType={casesType}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            today={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <Stats
            active={casesType === "recovered"}
            casesType={casesType}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            today={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <Stats
            active={casesType === "deaths"}
            casesType={casesType}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            today={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <div className="map">
          {/* <DisplayMap /> */}
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>

      {/* Right Side - Table and Graphs*/}
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Cases By Country</h3>
          <Table countries={tableData} />
          {/* Graph */}
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
