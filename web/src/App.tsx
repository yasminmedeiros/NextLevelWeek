import React /*, { useState }*/ from 'react';
import './App.css';
import Routes from './routes';

//npm install react-router-dom

//import Header from './Header';
//JSX: Sintaxe de XML(HTML) dentro do JS

function App() {
  /*const [counter, setCounter] = useState(0);//[valor do estado, função para atualizar o valor do estado]


  function handleButtonClick(){
    setCounter(counter+1);
  }
  return (
      <div>
        <Header title="Hello World" />
        <h1>{counter}</h1>
        <button type="button" onClick={handleButtonClick}>Aumentar</button>
      </div>
  );*/
  return (
    <Routes />
  );
  
}

export default App;