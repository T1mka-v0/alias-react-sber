import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux'
import { store } from './store'
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
const artem_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI1ZDA5YzRlNi1mNjE1LTQzZWYtOWZlMi1lNGM5NmY3ZmYzOTkiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNzgzOTI3NiwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE3NzUyODY2LCJzaWQiOiIzMzQ3MDMxNS1mM2ZmLTRmMTEtYTFiYS05OWRhMjFkMTA0ODAifQ.uF9UK-wCRyAqTdh9o8UnFHLEq4JVDw0onUnPC2T47gN4pi49D9clN53PbWn7X3H5DoxReuJcMqEpRbSu-mLoE_R2nSWEaL4MdDLp_-mfqfJeJaUNHmOVwgSsHk47k-tUbJ6qCVaBzyKFxAr-q7tnPA28AcezTSvh5I-DFIDbRc3QStwFSEIx5tM9chjI4z7qOg69xQs_IDehR9Vh5ixnMKuWO460PFomcHJICqSz9aalgBp2FoGJFgcX_Npng-FVcAblkgYtwxtfIFqomXFKIN1V_78a3HLB_B2D-pSuIgwyDZDmb8knVI3UYi9ASiAYm4QFwz_oUOp2sLSwkUyV04SwS104cI5cnUeRCUtCfs2F7d-F1y1Qh5DgmLd0DvrMg5FZI5Me3kw8yfmf1I8rlWvXheGwBrIz2yqfdM3gfYYEBVmepl6W3Jkd7k9BK_GaPUdEWixoZf-CdxNm_rP1iOaE74P-5lHdzV3c0Y8SbaVZ-m_zp2hcXqRcutyJxzakXtj2GWhdDOz5t4p-MDPvYtyiREH-n1Q5I2zcfMz_8ADt46Pm_muuoNWhc8K46iFG1YtKvaoSnnQ7GNZect94JHtVY39P_nLPLi9xq1u8EE4QDkVHAebXSauO0G1u5Mu0KG1_upMsUFlVC9NhX8lEMir_KWO3ATy1_jgRys5b-gQ';
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
      items: store.getState().teamsArray.map(({ id, name }, index) => ({
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
  console.log('Состояние стора: ', store.getState());
  // пишем функцию dispatchAssAction чтобы он закидывал команду в список
    // Подписка на команды ассистента, в т.ч. команда инициализации смартапа.
    // Ниже представлен пример обработки голосовых команд "ниже"/"выше"
});
function dispatchAssistantAction(command) {
  console.log('Command from dispAct: ', command)
  if (command.type === 'smart_app_data') {
    switch (command.action.type) {
      case 'add_team':
        store.dispatch(addTeam(store.getState().teamId, command.action.payload.name));
        store.dispatch({type: 'NEXT'});
        console.log('Зашел в case add_team');
        break;
      case 'remove_team':
        console.log('Принята команда удалить команду с id ', command.action.payload.id);
        store.dispatch(removeTeam(parseInt(command.action.payload.id, 10)));
        store.dispatch(setNewId());
        break;
      case 'rename_team':
        console.log(`Принята команда на переименование команды с id ${command.action.payload.id} и названием ${command.action.payload.name}`);
        store.dispatch(renameTeam(parseInt(command.action.payload.id, 10), command.action.payload.name));
      
      // Переходы на страницы
      case 'go_to_settings':
        console.log('Получена команда перейти на страницу настроек');
        // navigate('settings')
      
      // настройки
      case 'set_duration':
        console.log('Запрос на установление длительности раунда: ', command.action.payload.value);
      case 'setNumerOfWords':
        console.log('Запрос на установку количества слов: ', command.action.payload.value)
      case 'turn_on_penalty':
        console.log('Штраф за последнее слово включен!');
      case 'turn_off_penalty':
        console.log('Штраф за последнее слово выключен!');
      case 'turn_on_clw':
        console.log('Штраф за последнее слово включен!');
      case 'turn_off_clw':
        console.log('Штраф за последнее слово выключен!');
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
    <Provider store={store}>
      <RouterProvider router={router}>
        
          
        
        
      </RouterProvider>
    </Provider>
  </DeviceThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals