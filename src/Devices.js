import React from 'react';
import { FiEdit2 } from "react-icons/fi";
import { AiTwotoneSave, AiOutlinePoweroff } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import './Devices.css';

function LeaderConfig(index) {
  if(index == 0){
    return (
      <p className="config-leader-title">Leader</p>
    );
  }
  else{
    return (
      <p className="config-follower-title">&#8205;</p>
    );
  }
}

function Leader(index) {
  if(index == 0){
    return (
      <p className="leader-title">Leader</p>
    );
  }
  else{
    return (
      <p className="follower-title">&#8205;</p>
    );
  }
}

function EditableDeviceName(props, device, index) {
  if(device.isEditingName){
    return (
      <div className="editable-title-holder">
        <form className="editing-form" onSubmit={e => { e.preventDefault(); }}>

          <input type="text" name="device_name"
            onChange={event => props.handleNameChange(index, event)}
            value={props.devices[index].new_name}
            className="editing-title"></input>

        </form>
        <AiTwotoneSave className="done-icon" onClick={() => props.onClickEditNameDone(index)}/>
      </div>
    );
  }
  else{
    return (
      <div className="editable-title-holder" onClick={() => props.onClickEditName(index)}>
        <h4 className="editable-title">{device.name}</h4>
        <FiEdit2 className="edit-icon"/>
      </div>
    );
  }
}

function ConfigurableDevice(props, device, index) {
  if(device.isConfiguring){
    return (
      <div className="config-card-body">
        {LeaderConfig(index)}
        <h4 className="config-main-title">{device.name} - {device.id}</h4>
        <form className="config-form" onSubmit={e => { e.preventDefault(); }}>

          <p className="config-title">Destination ID</p>
          <input type="text" name="device_name"
            onChange={event => props.handleConfigField(index, event, "dest_id")}
            value={props.devices[index].config.dest_id}
            className="config-box"></input>

          <p className="config-title">Method</p>
          <input type="text" name="device_name"
            onChange={event => props.handleConfigField(index, event, "method")}
            value={props.devices[index].config.method}
            className="config-box"></input>

          <p className="config-title">Path</p>
          <input type="text" name="device_name"
            onChange={event => props.handleConfigField(index, event, "path")}
            value={props.devices[index].config.path}
            className="config-box"></input>

          <p className="config-title">Data</p>
          <input type="text" name="device_name"
            onChange={event => props.handleConfigField(index, event, "data")}
            value={props.devices[index].config.data_string}
            className="config-box"></input>

        </form>
        <div className="button-holder">
          <button className="button" onClick={() => props.onClickSave(device.id, index)}>Save</button>
          <button className="button" onClick={() => props.onClickCancel(index)}>Cancel</button>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="card-body">
        {Leader(index)}
        {EditableDeviceName(props, device, index)}
        <h6 className="card-id">{device.id}</h6>
        <p>{device.ip}</p>
        <div className="button-holder">
          <button className="button" onClick={() => props.onClickSet(device.id, "on")}>
            On
            <AiOutlinePoweroff className="power-on-icon"/>
          </button>
          <button className="button" onClick={() => props.onClickSet(device.id, "off")}>
            Off
            <AiOutlinePoweroff className="power-off-icon"/>
          </button>
        </div>
        <div className="button-holder">
          <button className="button" onClick={() => props.onClickToggle(device.id)}>Toggle</button>
          <button className="button" onClick={() => props.onClickConfig(device.id, index)}>Config</button>
        </div>
      </div>
    );
  }
}

function OfflineDevice(props, device, index) {
  if(device.isConfiguring){
    return (
      <div className="config-card-body">
        <p className="offline-config-padding">&#8205;</p>
        <h4 className="config-main-title">{device.name} - {device.id}</h4>
        <form className="config-form" onSubmit={e => { e.preventDefault(); }}>

          <p className="config-title">Destination ID</p>
          <input type="text" name="device_name"
            onChange={event => props.handleOfflineConfigField(index, event, "dest_id")}
            value={props.devices_offline[index].config.dest_id}
            className="config-box"></input>

          <p className="config-title">Method</p>
          <input type="text" name="device_name"
            onChange={event => props.handleOfflineConfigField(index, event, "method")}
            value={props.devices_offline[index].config.method}
            className="config-box"></input>

          <p className="config-title">Path</p>
          <input type="text" name="device_name"
            onChange={event => props.handleOfflineConfigField(index, event, "path")}
            value={props.devices_offline[index].config.path}
            className="config-box"></input>

          <p className="config-title">Data</p>
          <input type="text" name="device_name"
            onChange={event => props.handleOfflineConfigField(index, event, "data")}
            value={props.devices_offline[index].config.data}
            className="config-box"></input>

        </form>
        <div className="button-holder">
          <button className="button" onClick={() => props.onClickOfflineSave(device.id, index)}>Save</button>
          <button className="button" onClick={() => props.onClickOfflineCancel(index)}>Cancel</button>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="card-body">
        <h4 className="offline-title">{device.name}</h4>
        <h6 className="card-id">{device.id}</h6>
        <div className="button-holder">
          <button className="button" onClick={() => props.onClickOfflineConfig(device.id, index)}>Config</button>
          <button className="button" onClick={() => props.onClickOfflineDelete(device.id, index)}>Delete</button>
        </div>
      </div>
    );
  }
}


function Devices(props) {
  return (
    <div className="Devices">

      <center><h1 className="main-title">Online Devices</h1></center>
      <center><button onClick={() => props.onClickRefresh()}>Refresh</button></center>
      {props.devices.map((device, index) => (
        <div className="card-holder">
          {ConfigurableDevice(props, device, index)}
        </div>
      ))}

      <center><h1 className="main-title">Offline Devices</h1></center>
      {props.devices_offline.map((device, index) => (
        <div className="card-holder">
          {OfflineDevice(props, device, index)}
        </div>
      ))}
    </div>
  );
}

export default Devices