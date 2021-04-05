import React from 'react';
import Devices from './Devices';

function filter_offline_devices(online, registered) {
  if (!registered) return [];

  const online_ids = online.map((device) => (
    device.id
  ));
  
  const filtered = registered.filter(reg_dev => !online_ids.includes(reg_dev.id));

  return filtered;
}

class LoadDevices extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        devices:[],
        devices_offline:[]
      }

      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleConfigField = this.handleConfigField.bind(this);
  }

  componentDidMount() {
    fetch('http://UniFrame.local:235/devices')
    .then(res => res.json())
    .then((online) => {
      this.setState({ devices: online.devices });
      fetch('http://192.168.1.179:5000/device')
      .then(res => res.json())
      .then((registered) => {
        this.setState({ devices_offline: filter_offline_devices(online.devices, registered) });
      })
    })
    .catch((e) => {
      console.log(e);
      fetch('http://192.168.1.179:5000/device')
      .then(res => res.json())
      .then((registered) => {
        this.setState({ devices_offline: registered });
      });
    });
  }

  handleClickRefresh() {
    fetch('http://UniFrame.local:235/devices')
    .then(res => res.json())
    .then((online) => {
      this.setState({ devices: online.devices });
      fetch('http://192.168.1.179:5000/device')
      .then(res => res.json())
      .then((registered) => {
        this.setState({ devices_offline: filter_offline_devices(online.devices, registered) });
      })
    })
    .catch((e) => {
      console.log(e);
      fetch('http://192.168.1.179:5000/device')
      .then(res => res.json())
      .then((registered) => {
        this.setState({ devices: [] });
        this.setState({ devices_offline: registered });
      });
    });
  }

  handleClickEditName(index) {
    const newDevices = this.state.devices.slice();
    newDevices[index].isEditingName = true;
    newDevices[index].new_name = newDevices[index].name;
    this.setState({devices: newDevices});
  }

  handleClickEditNameDone(index) {
    const newDevices = this.state.devices.slice();
    newDevices[index].isEditingName = false;
    newDevices[index].name = newDevices[index].new_name;
    this.setState({devices: newDevices});

    const device = newDevices[index];

    fetch('http://UniFrame.local:235/name', 
    {
      method: 'POST',
      body: JSON.stringify({
        id: device.id,
        new_name: device.new_name
      })
    })
    .catch(console.log)
  }

  handleNameChange = (index, event) => {
    const newDevices = this.state.devices.slice();
    newDevices[index].new_name = event.target.value;
    this.setState({devices: newDevices});
  }

  handleClickSet(device_id, action) {
    fetch('http://UniFrame.local:235/device?id=' + device_id, 
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'set',
        power: action === 'on'? true: false
      })
    })
    .catch(console.log)
  }

  handleClickToggle(device_id) {
    fetch('http://UniFrame.local:235/device?id=' + device_id, 
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'toggle'
      })
    })
    .catch(console.log)
  }

  handleConfigClick(device_id, index) {
    fetch('http://UniFrame.local:235/connected?id=' + device_id)
    .then(res => res.json())
    .then((data) => {
      const newDevices = this.state.devices.slice();
      // Cancels name editing if editing in process
      newDevices[index].isEditingName = false;
      newDevices[index].isConfiguring = true;
      newDevices[index].config = data;
      newDevices[index].config.data_string = JSON.stringify(data.data);
      this.setState({devices: newDevices});
    })
    .catch(console.log)
  }
  
  handleConfigCancel(index) {
    const newDevices = this.state.devices.slice();
    newDevices[index].isEditingName = false;
    newDevices[index].isConfiguring = false;
    newDevices[index].config = "";
    this.setState({devices: newDevices});
  }
  
  handleConfigField = (index, event, field) => {
    const newDevices = this.state.devices.slice();
    
    if (field === "dest_id") newDevices[index].config.dest_id     = event.target.value;
    if (field === "method")  newDevices[index].config.method      = event.target.value;
    if (field === "path")    newDevices[index].config.path        = event.target.value;
    if (field === "data")    newDevices[index].config.data_string = event.target.value;
    
    this.setState({devices: newDevices});
  }
  
  handleConfigSave(device_id, index) {
    const newDevices = this.state.devices.slice();
    newDevices[index].isConfiguring = false;
    const config = newDevices[index].config;
    newDevices[index].config = "";
    this.setState({devices: newDevices});
    
    fetch('http://UniFrame.local:235/connected?id=' + device_id, 
    {
      method: 'POST',
      body: JSON.stringify({
        dest_id: config.dest_id,
        method: config.method,
        path: config.path,
        data: config.data_string
      })
    })
    .catch(console.log)
    
    fetch('http://192.168.1.179:5000/config?id=' + device_id, 
    {
      method: 'POST',
      body: JSON.stringify({
        dest_id: config.dest_id,
        method: config.method,
        path: config.path,
        data: config.data_string
      })
    })
    .catch(console.log)
  }
  
  // Offline
  handleOfflineConfigClick(device_id, index) {
  fetch('http://192.168.1.179:5000/config?id=' + device_id)
  .then(res => res.json())
  .then((data) => {
    const newDevices = this.state.devices_offline.slice();
    newDevices[index].isConfiguring = true;
    newDevices[index].config = data;
    this.setState({devices_offline: newDevices});
  })
  .catch((e) => {
    console.log(e);
    const newDevices = this.state.devices_offline.slice();
    newDevices[index].isConfiguring = true;
    newDevices[index].config = [];
    this.setState({devices_offline: newDevices});
  })
}

handleOfflineConfigCancel(index) {
  const newDevices = this.state.devices_offline.slice();
  newDevices[index].isEditingName = false;
  newDevices[index].isConfiguring = false;
  newDevices[index].config = "";
  this.setState({devices_offline: newDevices});
}

handleOfflineConfigField = (index, event, field) => {
  const newDevices = this.state.devices_offline.slice();
  
  if (field === "dest_id") newDevices[index].config.dest_id = event.target.value;
  if (field === "method")  newDevices[index].config.method  = event.target.value;
  if (field === "path")    newDevices[index].config.path    = event.target.value;
  if (field === "data")    newDevices[index].config.data    = event.target.value;
  
  this.setState({devices_offline: newDevices});
}

handleOfflineConfigSave(device_id, index) {
  const newDevices = this.state.devices_offline.slice();
  newDevices[index].isConfiguring = false;
  const config = newDevices[index].config;
  newDevices[index].config = "";
  this.setState({devices_offline: newDevices});
  
  fetch('http://192.168.1.179:5000/config?id=' + device_id, 
  {
    method: 'POST',
    body: JSON.stringify({
      dest_id: config.dest_id,
      method: config.method,
      path: config.path,
      data: config.data
    })
  })
  .catch(console.log)
}

handleOfflineDeleteClick(device_id, index) {
  const newDevices = this.state.devices_offline.slice();
  delete newDevices[index];
  this.setState({devices_offline: newDevices});
  
  fetch('http://192.168.1.179:5000/device?id=' + device_id, {method: 'DELETE'})
  .catch(console.log)
}

  render() {
    return (
      <Devices
        devices={this.state.devices}
        devices_offline={this.state.devices_offline}

        onClickRefresh={() => this.handleClickRefresh()}
        onClickEditName={(device) => this.handleClickEditName(device)}
        onClickEditNameDone={(device) => this.handleClickEditNameDone(device)}

        onClickSet={(device_id, action) => this.handleClickSet(device_id, action)}
        onClickToggle={device_id => this.handleClickToggle(device_id)}

        handleNameChange={(index, event) => this.handleNameChange(index, event)}

        onClickConfig={(device_id, index) => this.handleConfigClick(device_id, index)}
        onClickSave={(device_id, index) => this.handleConfigSave(device_id, index)}
        onClickCancel={index => this.handleConfigCancel(index)}
        handleConfigField={(index, event, field) => this.handleConfigField(index, event, field)}

        // Offline
        onClickOfflineDelete={(device_id, index) => this.handleOfflineDeleteClick(device_id, index)}
        onClickOfflineConfig={(device_id, index) => this.handleOfflineConfigClick(device_id, index)}
        onClickOfflineSave={(device_id, index) => this.handleOfflineConfigSave(device_id, index)}
        onClickOfflineCancel={index => this.handleOfflineConfigCancel(index)}
        handleOfflineConfigField={(index, event, field) => this.handleOfflineConfigField(index, event, field)}
        />
    )
  }
}

export default LoadDevices;