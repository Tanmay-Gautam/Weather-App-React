import "./App.css";
import React, { Component } from "react";
import { WiCloud, WiHumidity, WiWindy } from "react-icons/wi";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import day from "./images/day.png";
import night from "./images/night.png";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      url: "",
      data: [],
      loading: false,
    };
  }

  async componentDidMount() {
    let success = (pos) => {
      console.log(pos.coords.latitude, pos.coords.longitude);
      const myUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=a2d55cddcf1d8175ebb4b92368c97ffe`;
      this.setState({ url: myUrl, loading: false });
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  async componentDidUpdate(_, prevState) {
    if (this.state.url !== "" && this.state.url !== prevState.url) {
      const res = await fetch(this.state.url);
      const jsonData = await res.json();
      console.log(jsonData);
      this.state.data.pop(0)
      this.setState({ data: [...this.state.data, jsonData] });
    }
  }

  render() {
    const updateLocation = async () => {
      const loc = prompt("Location: ");
      if(loc == null) {
        return
      }
      const myUrl = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=a2d55cddcf1d8175ebb4b92368c97ffe`;
      this.setState({ url: myUrl, loading: false });
      const res = await fetch(this.state.url);
      const jsonData = await res.json();
      this.state.data.pop(0)
      this.setState({ data: [...this.state.data, jsonData] });
    };

    const UnixToTime = (props) => {
      // console.log(props.unix);
      let dateObj = new Date(props.unix * 1000);
      let time = dateObj.toLocaleString().slice(-10, -6);
      return time;
    };

    const d = new Date();
    const hours = d.getHours();
    const is_day = hours > 6 && hours < 20;

    if (this.state.data.length === 0) {
      console.log(this.state.data.length);
      return <div className="loading">Loading ...</div>;
    } else {
      return (
        <div className="App">
          <div
            className="WeatherCard"
            style={{
              background: is_day ? "url(" + day + ")" : "url(" + night + ")",
              color: is_day ? "" : "white",
            }}
          >
            <div className="WeatherCard-topBar">
              <div>
                <h1>
                  <WiCloud />
                </h1>
                <span>{this.state.data[0].clouds.all}%</span>
              </div>
              <div>
                <h1>
                  <WiWindy />
                </h1>
                <span>{this.state.data[0].wind.speed}km/h</span>
              </div>
              <div>
                <h1>
                  <WiHumidity />
                </h1>
                <span>{this.state.data[0].main.humidity}%</span>
              </div>
            </div>
            <div className="WeatherCard-mainContent">
              <div className="WeatherCard-mainContent-details">
                <h2>
                  {this.state.data[0].name}, {this.state.data[0].sys.country}
                </h2>
                <p>
                  {
                    /*Day*/ new Intl.DateTimeFormat("en-US", {
                      weekday: "long",
                    }).format(d) +
                      ", " +
                      d.toLocaleString("default", { month: "long" }) +
                      " " +
                      d.getDate() +
                      ", " +
                      d.getFullYear()
                  }
                </p>
              </div>

              <div className="temp">
                <h1>
                  {Math.floor(this.state.data[0].main.temp)}
                  <sup>°C</sup>
                </h1>
              </div>
              <div className="dotted-line"></div>
              <div className="otherInfo">
                <div className="weatherIconTag">
                  <img
                    src={`http://openweathermap.org/img/wn/${this.state.data[0].weather[0].icon}@2x.png`}
                    alt=""
                  />
                  <h3>{this.state.data[0].weather[0].main}</h3>
                </div>
                {/* <br /> */}
                <br />
                <div className="sunRiseSet">
                  <h3>
                    <FiSunrise /> <UnixToTime unix={this.state.data[0].sys.sunrise} /> AM
                  </h3>
                  <h3>|</h3>
                  <h3>
                    <FiSunset /> <UnixToTime unix={this.state.data[0].sys.sunset} /> PM
                  </h3>
                </div>
              </div>
            </div>
            <GrLocation className="updateBtn" onClick={updateLocation} />
          </div>
        </div>
      );
    }
  }
}