import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const web = window.Telegram.WebApp;
  web.MainButton.setParams({
    text: 'Close',
    is_visible: true
  });
  web.MainButton.onClick(() => {
    web.close();
  });

  const [hide, setHide] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    if(hide) {
      web.MainButton.hide();
    } else {
      web.MainButton.show();
    }
  }, [hide]);

  useEffect(() => {
    if(disabled) {
      web.MainButton.disable();
    } else {
      web.MainButton.enable();
    }
  }, [disabled])

  const sendData = () => {
    const text = document.querySelector('input[name=textData]').value;
    const data = {message: text, id: 5};
    web.sendData(JSON.stringify(data));
    web.MainButton.show();
  }

  const showProgress = () => {
    web.MainButton.showProgress();
    web.MainButton.setParams({
      text_color: '#000000',
      color: '#ffbb00'
    });
    setTimeout(() => {
      console.log('close');
      web.MainButton.hideProgress();
      web.MainButton.setParams({
        text_color: web.themeParams.button_text_color,
        color: web.themeParams.button_color
      });
    }, 1000);
  }

  return (
    <div className="App">
      <h1>Username: </h1>
      <p>
        {JSON.stringify(web.initData)}
      </p>

      <div className="inputBox">
        <input type="text" name="textData"></input>
        <button onClick={() => sendData()}>Send</button>
      </div>

      <div className="buttons">
        <button onClick={() => setHide(!hide)}>Show/Hide MainButton</button>
        <button onClick={() => setDisabled(!disabled)}>Enable/Disable MainButton</button>
        <button onClick={() => showProgress()}>Show progress</button>
      </div>
    </div>
  );
}

export default App;
