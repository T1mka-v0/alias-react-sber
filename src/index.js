import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux'
import { teamStore, teamId } from './store'
import { addTeam, removeTeam, renameTeam,
  setCommonLastWord,
  setPenaltyForSkip,
  setRoundDuration,
  setWordsCountToWin
 } from './actions';

import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/error-page';
import Settings from './pages/Settings';
import Rules from './pages/Rules';
import Game from './pages/Game';

import { DeviceThemeProvider } from '@salutejs/plasma-ui';
import { GlobalStyle } from './GlobalStyle';
import { createGlobalStyle } from 'styled-components';
import Result from './pages/Result';

import { createSmartappDebugger, createAssistant } from '@salutejs/client';

const devType = "development";
const artem_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3NjFiNGYwZC03ZWYxLTQ0NWUtOWU2Yi1mYjQ5ODMyZDllZTEiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNjc0MjcwOCwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE2NjU2Mjk4LCJzaWQiOiI5ODRhNzAxMS1iYWY1LTQ3OGItYjUxOC1mYmIwMjBmMTY5MjUifQ.l9Np1lK27chnXccZQwfS_G7TtOEK-2I6S021zg9h7OzVdKU-dYZg8R4xtQxe2zUWcLr7d2zLR6Tq5wz3W3lLUZQ_A1nzL4i9hOijkvgHxDxCIYqAd-7GqElK5oSVEWS91Mj_hDkPeV_3erJcWKinEwHe6uomBAGkPoZAIYLby-EavwbmC8XhrIGAp0QMx913PSZyisL2KrMVLEaRyKq08WpQ5shsPnMXFNnV7ANQ6mtPNIKbXYWTSoyr4IjxXrWb9KRBhz06A3jjvmyHyiBLY-nx-YuMXCofahFfg8BnGLVUwwH_aiTxftiIZaA0fIGiXShWTXZv5_8zy4aQZxZpxWVQFrYtHcO1KMMsnmiaBylMvw2-YIcmiDNOmwpFJSkaiiLvNNXOY1yiMqE2QSeYwA2xuIH6mTK2qQTitVec_9WKCRhR3rBOXzEB0exeZBoaFht01csg6JuqmorZ2Qg1ZOBW-gEHrUXI9TWJK1Lc9_2_zPl32FoOeNopYebF28SBzGPUrZu56wLwx038_-qyN2wYIqNGpppzRrUq9T2r2VR2QpJKgLmQrWvik0zhKnlFobWV4ZB_1i5ex0H5PamVE3pNDn1AZT_xvTCT9f3Hl4SG5RW8MH-2QRKPGowMjUUkoYcMCSZpWAE_oaRrdDEwU--wIbT6HaPsrMriTIpPbsA"
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
      case 'remove_team':
        console.log('Принята команда удалить команду с id ', command.action.payload.id);
        teamStore.dispatch(removeTeam(command.action.payload.id));
        teamId.dispatch({type: 'PREV'});
        // перерисовка и переопределение id у команд сук
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