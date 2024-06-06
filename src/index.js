import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux'
import { teamStore, teamId } from './store'
import {
  addTeam,
  removeTeam,
  renameTeam,
  setNewId,
  setCommonLastWord,
  setPenaltyForSkip,
  setRoundDuration,
  setWordsCountToWin
 } from './actions';

import App from './App';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import ErrorPage from './pages/error-page';
import Settings from './pages/Settings';
import Rules from './pages/Rules';
import Game from './pages/Game';

import { DeviceThemeProvider } from '@salutejs/plasma-ui';
import { GlobalStyle } from './GlobalStyle';
import { createGlobalStyle } from 'styled-components';
import Result from './pages/Result';

import { createSmartappDebugger, createAssistant } from '@salutejs/client';
import SwitchTest from './pages/SwitchTest';

const devType = "development";
const artem_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI4MDhlMjJhNS05OGMyLTQzMjEtYTQ4MC01NjJmMDkzOTdkNWIiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNzY5NzE1OCwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE3NjEwNzQ4LCJzaWQiOiJkMDI4MTVkZS03MGYxLTRhOTctYTUwOS05NGI4MzgxM2M5NWEifQ.i3W3oqJ7NZ947kJYdPu_CIIxShoAPjMorSD2C6KhOIsTJPkhQ-xfTIcxJp9DChiLZRkMr_MoGXO4qOmNq5lql3ufWAWhYTsCi9iIWKoxvvXyBCUdflLyBHk5YNO10TDPdcYj9FFcbjft6Y2L1fVCz-qxkh-iKBgL4RCibHhtD7R_QReOUQDmeYQsEPBQRnci11P4GFcdkrjNdn-YNiIYRrhWJ2QdCXJpTNFBI-rVj416V1AOhL3bjNBk_d13YRdHktqKy7UVx5e0eNc_QNNAwIEXjHjX5pvgY5PeaqPPkosSfjFrZr4rdrNdgz7SZeFBBHIeqpgc6weUDgXtdA588NqCVDWD0PdEIjnwKBPOuAUCIAKfZwneHdNGIc_QECMm-INhhUdHypL6lKFoKmAYTKY5-4Kswwi0NDTR4c50S9FAGE0yZ3vBu50yxW84iB_qLIR4-HfXKqzr0-ZUCN26wbH2lzObc5yq-Brjv0McmUiTv7rC61vFrP8e3LQoWc5m55TX0PD5X7jyvnuN4cIIJipEPiy4pI33E2azNNvKwHLKFgxNI6VZzaCuokfKiNbOgt_ubJWmiwnO7R2M52dt1QseU3UFfAY9Vl3eDrb8D2YsITgBXmbdXqzC0TZ9WADVID3b1BWRFKY6SxMZNPhGkawTQ8ofAzBrUIvahVEGwjw';
const alykoshin_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJiZWFkMzU2Ny03ZjY2LTRkZTQtYmY2YS0yNDFkZjk2MzJhMTQiLCJzdWIiOiIwMDFhMGI5Yzc2Yjg5ZTE0YzI0MjhkYjNiMGI2MjBjMDMwYTVmMmQzMWFkNWExMjZjZTlhMGJhZDFhOTExY2E2NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNjExMjgxOSwiYXVkIjoiVlBTIiwidXNyIjoiM2YwOTUxNTgtODM3NS05YmVmLWI4MTktNDczZmExYTE4YTAzIiwiaWF0IjoxNzE2MDI2NDA5LCJzaWQiOiI5NTYwNTgzNC01NjA3LTQ5NzgtOTUxNC1iYmJhYmI1OWEwN2MifQ.NWElFSQynkPy5Us12ONnk7mi4Fp_G5iIv-4H3Yc3AyjupdT2nhaihxnVFvn1mlKCUqoCd-elbnr1adRFgagwRlAgQYYQbte2ntWE4o1NyJGQavxYSp9zHroq-2qK6AEIC8BQPaovMx5-WNfCP6pugYUYaMizoFews5bPNjL8y5865puCCIzu_UBh-lHyJwSu8E5-60ZaPtyLAFyNhoWaKH7639itALrHhziv-3Q3YAopzY-IBCkDCH3gx6WlC11j9Jq4XL8-Bb05hsueAYE3lYqDct_dTCMmeYM0QrMt7atkrdADYGctNhNPwBwVySC490F1xd7MUcqjZnTVnL7_8_cQuEclC0K2Imu6VenM0V2ogWNyTER_goFjXVOS6u-fnsApebZRqIgBtAl_uC9P6xqkHmnIB7CNONmko3n59_sVCYdqRsFr6g45iN4IUKwqW_Oy9a0Zklee4H4CMUp5hncqhdSiigVn8-5rl5e7DYvtvWy_34lkvAN3zmbHxXH2HM__pWTynwRZSfuYty8CeNxsfdvskuKqsMyY7cfIdaq5Z04frXLGDqdBhJXQHYx6QNB1BIyA5mFqlgp43OPU9cSO5OjTorfWXhgnMyZRq-q3AggWnw8tYpbQlXjsG-TdOk0_pldETjqx1Qd81tj43OtRm4XNblff3st6QWRkB0o"


const initialize = (getState) => {
    if (devType === "development") {
        return createSmartappDebugger({
            // Токен из Кабинета разработчика
            token: artem_token,
            // Пример фразы для запуска смартапа process.env.REACT_APP_TOKEN ?? ''
            initPhrase: 'Запусти Элиас',
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
  const state = {
    item_selector: {
      items: teamStore.getState().map(({ id, name }, index) => ({
        number: index + 1,
        id,
        name,
      })),
      ignored_words: [
        'добавить','запиши','закинь','добавь', 'создать','создай', // addTeam.sc
        'удали', 'убери', 'убрать', 'убирать', 'удалять', 'удалить' //removeTeam.sc
      ],
    },
  };
  console.log('getStateForAssistant: state:', state);
  return state;
}
const assistant = initialize(() => getStateForAssistant());
assistant.on('data', (command) => {
  console.log("Data received", command.action);
  dispatchAssistantAction(command);
  console.log('Состояние стора: ', teamStore.getState());
  // пишем функцию dispatchAssAction чтобы он закидывал команду в список
    // Подписка на команды ассистента, в т.ч. команда инициализации смартапа.
    // Ниже представлен пример обработки голосовых команд "ниже"/"выше"
});
function dispatchAssistantAction(command) {
  console.log('Command from dispAct: ', command)
  if (command.type === 'smart_app_data') {
    switch (command.action.type) {
      case 'add_team':
        teamStore.dispatch(addTeam(teamId.getState(), command.action.payload.name));
        teamId.dispatch({type: 'NEXT'});
        console.log('Зашел в case add_team');
        break;
      case 'remove_team':
        console.log('Принята команда удалить команду с id ', command.action.payload.id);
        teamStore.dispatch(removeTeam(parseInt(command.action.payload.id, 10)));
        teamStore.dispatch(setNewId());
        break;
      case 'rename_team':
        console.log(`Принята команда на переименование команды с id ${command.action.payload.id} и названием ${command.action.payload.name}`);
        teamStore.dispatch(renameTeam(parseInt(command.action.payload.id, 10), command.action.payload.name));
      case 'go_to_settings':
        console.log('Получена команда перейти на страницу настроек');
        // navigate('settings')
    }
  }
  
}

assistant.on('start', (event) => {
  let initialData = assistant.getInitialData();

  console.log(`assistant.on(start)`, event, initialData);
});

assistant.on('command', (command) => {
  console.log('Command: ', command);
})

function send_action_value(action_id, value) {
  const data = {
    action: {
      action_id: action_id,
      parameters: {
        // значение поля parameters может быть любым, но должно соответствовать серверной логике
        value: value, // см.файл src/sc/noteDone.sc смартаппа в Studio Code
      },
    },
  };
  const unsubscribe = assistant.sendData(data, (data) => {
    // функция, вызываемая, если на sendData() был отправлен ответ
    const { type, payload } = data;
    console.log('sendData onData:', type, payload);
    unsubscribe();
  });
}

// function dispatchAssistantAction(command) {
//   switch (action.type) {
//     case "add_team":

//   }
// }

const router = createBrowserRouter([
  {
    path: 'game',
    element: <Game />,
  },
  {
    path: 'rules',
    element: <Rules />
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: 'settings',
    element: <Settings />
  },
  {
    path: 'result',
    element: <Result />
  },
  { // Test
    path: 'switch',
    element: <SwitchTest />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DeviceThemeProvider responsiveTypo>
    <GlobalStyle />
    <Provider store={teamStore}>
      <RouterProvider router={router}>
        
          
        
        
      </RouterProvider>
    </Provider>
  </DeviceThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals