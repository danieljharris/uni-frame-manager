import React from 'react';
import './Devices.css';



function Devices(props) {
  return (
    <div className="Devices">
      <center><h1>Devices</h1></center>
      {props.devices.map((device) => (
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{device.name}</h4>
            <h4 className="card-title">{device.id}</h4>
            <p className="card-text">{device.ip}</p>
            <button className="button-on" onClick={() => props.onClickSet(device.id, "on")}>On</button>
            <button className="button-off" onClick={() => props.onClickSet(device.id, "off")}>Off</button>
            <button className="button-toggle" onClick={() => props.onClickToggle(device.id)}>Toggle</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Devices