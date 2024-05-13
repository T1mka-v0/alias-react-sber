import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { teamStore, teamId } from './store';

import { Theme, DocStyles } from './SberStyles';

import { createAssistant, createSmartappDebugger } from '@salutejs/client';
const devType = "development";
const initialize = (getState) => {
    if (devType === "development") {
        return createSmartappDebugger({
            // Токен из Кабинета разработчика
            token: process.env.REACT_APP_TOKEN ?? '',
            // Пример фразы для запуска смартапа
            initPhrase: 'запусти элиас',
            // initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`
            // Текущее состояние смартапа
            getState,
            // Состояние смартапа, с которым он будет восстановлен при следующем запуске
            // getRecoveryState,
            // Необязательные параметры панели, имитирующей панель на реальном устройстве
        });
    }

	  // Только для среды production
    return createAssistant({ getState });
}
function getStateForAssistant() {
  const state = teamStore.state;
}
const assistant = initialize(() => getStateForAssistant());
assistant.on('data', (command) => {
  console.log("Command received", command);

  
    // Подписка на команды ассистента, в т.ч. команда инициализации смартапа.
    // Ниже представлен пример обработки голосовых команд "ниже"/"выше"
    
    
});

assistant.on('start', (event) => {
  let initialData = assistant.getInitialData();

  console.log(`assistant.on(start)`, event, initialData);
});
function App() {

  const path = 'https://jsonplaceholder.typicode.com/users';
  async function getUsers() {
    let response = await fetch(path);
    if (response.ok) return await response.json();
    console.log(response);
  }

  return (
    <div className="App">
      <DocStyles />
      <Theme />
      <h1>Alias</h1>
      <nav>
        <ul>
          <li>
            <Link to={'settings'}>Продолжить игру</Link>
          </li>
          <li>
            <Link to={'settings'}>Начать игру</Link>
          </li>
          <li>
            <Link to={'rules'}>Rules</Link>
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