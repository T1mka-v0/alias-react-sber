import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { store } from './store';
import { DocStyles, Theme } from './styles/SberStyles';

import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import { Button, Container } from '@salutejs/plasma-ui';
import { GlobalStyle } from './styles/GlobalStyle';
//import { send_action_value, assistant } from './assistant';

function App() {

  return (
    <div className="App" style={{display:"flex", flexDirection:"column", alignContent:"center", justifyContent:"center"}}>
      <h1 style={{display:"flex", justifyContent:"center"}}>Отгадай слово</h1>
      <nav>
        <ul style={{listStyleType: "none", padding:"0px 0px"}}>
          <li>
            <Container style={{padding:"16px 64px"}}>
              <Link to={'settings'}>
                <Button style={{width:"100%"}}
                  onClick={() => {
                    //send_action_value('to_settings', 1);
                  }}
                >Настроить игру</Button>
              </Link>
            </Container>
          </li>
          <li>
            <Container style={{padding:"16px 64px"}}>
              <Link to={'rules'}>
                <Button style={{width:"100%"}}>
                  Правила
                </Button>
              </Link>
            </Container>
          </li>
          
        </ul>
      </nav>
    </div>
  );
}

export default App;

/*
_send_action_value(action_id, value) {
    const data = {
      action: {
        action_id: action_id,
        parameters: {   // значение поля parameters может любым, но должно соответствовать серверной логике
          value: value, // см.файл src/sc/noteDone.sc смартаппа в Studio Code
        }
      }
    };
    const unsubscribe = this.assistant.sendData(
      data,
      (data) => {   // функция, вызываемая, если на sendData() был отправлен ответ
        const {type, payload} = data;
        console.log('sendData onData:', type, payload);
        unsubscribe();
      });
    }
*/