import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [advertisements, setAdvertisements] = useState([])
  
useEffect(() => {
  fetch('http://localhost:3000/fakeDataSet')
  .then((res) => {
    if (res.ok) {
      res.json().then(setAdvertisements)
    } else {
      throw new Error('Network response was not ok')
    }
  })
  .catch((errObj) => console.error('Error:', errObj))
  },[]) 

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
