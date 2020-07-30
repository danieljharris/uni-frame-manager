import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


//Custom
import Devices from './Devices';

class LoadDevices extends React.Component {
  state = {
    devices:[]
  }

  componentDidMount() {
    fetch('http://UniFrame.local:235/devices')
    .then(res => res.json())
    .then((data) => {
      this.setState({ devices: data.devices })
    })
    .catch(console.log)
  }

  handleClickSet(device_id, action) {
    fetch('http://UniFrame.local:235/device', 
    {
      method: 'POST',
      body: JSON.stringify({
        id: device_id,
        action: 'set',
        power: action === 'on'? true: false 
      })
    })
    .catch(console.log)
  }

  handleClickToggle(device_id) {
    fetch('http://UniFrame.local:235/device', 
    {
      method: 'POST',
      body: JSON.stringify({
        id: device_id,
        action: 'toggle'
      })
    })
    .catch(console.log)
  }

  render() {
    return (
      <Devices
        devices={this.state.devices}
        onClickSet={(device_id, action) => this.handleClickSet(device_id, action)}
        onClickToggle={device_id => this.handleClickToggle(device_id)}
      />
    )
  }
}


ReactDOM.render(
  <React.StrictMode>
    <LoadDevices />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
