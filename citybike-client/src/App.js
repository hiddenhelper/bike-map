import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const iconPerson = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: new L.Point(10, 15),
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("bikeData", (data) => {
      console.log("re", data);
      const { network } = data;
      this.setState({
        response: network,
        lat: network.location.latitude,
        lng: network.location.longitude,
      });
    });
  }
  render() {
    const { response } = this.state;
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {response &&
            response.stations.map((station, index) => {
              return (
                <Marker position={[station.latitude, station.longitude]} key={`marker-${index}`} icon={iconPerson}>
                  <Popup>
                    <div>empty_slots: {station.empty_slots}</div>
                    <div>free_bikes: {station.free_bikes}</div>
                    <div>id: {station.id}</div>
                    <div>name: {station.name}</div>
                    <div>timestamp: {station.timestamp}</div>
                  </Popup>
                </Marker>
              );
            })}
        </Map>
      </div>
    );
  }
}
export default App;
