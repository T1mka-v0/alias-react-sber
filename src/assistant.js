import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createSmartappDebugger, createAssistant } from '@salutejs/client';

import { store } from './store';
import {
  addTeam,
  removeTeam,
  renameTeam,
  setNewId,
  setCommonLastWord,
  setPenaltyForSkip,
  setRoundDuration,
  setWordsCountToWin,
} from './actions';

import { Outlet, createBrowserRouter } from 'react-router-dom';
import Game from './pages/Game';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import App from './App';
import ErrorPage from './pages/error-page';
import Result from './pages/Result';
// import router from './router';

const dev = false;
const artem_token =
  `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJiM2VlZjhiYy1lMmQzLTQxNjgtODJiZi01NGZjOGRmOTg5NjYiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxOTMwODcxOSwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE5MjIyMzA5LCJzaWQiOiIwNzAxZDJjOC00MjRjLTQwNTYtODQwMy01OGI2MTRkYmRiNzgifQ.DTJtnG2hRU_2EY4xoCnTH-s-J4mOXMf80PpLkOkhBEjazefzfttY06dCTDhNSSivdAg9VzWqDjGW9HHqoAgB-BoJF3VQbkK980NmLkctdyn9DJzO8olwAr2fVq-Ls0Ldemhgla1FwS71iZ8nwmCDTUF0p6NRgxAJ530t8xHI_JBdXMxMin8Bi56U5SuVFGWSkxcCb91uxXS9cSrsXA0SNbkw_uk1Srw4rVtRQW1r2lShqOdKaTKnUND8ICJ6w35Z4q5wy0Js8P8E_zGTCJuVfV8AtebvRAn6OwlSUZ8QNUjdebgeFdHVraKyiDNuCbZ71oYNvtbG1JzsQPb3qdLV7gDhUrX3VjyQl-FWNjY-kjQ44oEcvjWhUpgQMBzOJR6nTDnbEQ-LV6emdone5R5FFAp6vfw3hyWzSmnGvVXzIPFQRyYx-BHSfC1hJFFAq66Qs8EDy8x2LVmewbOBWInTXfCBoFFk_skOEEg1oSn9YsJGGZzH-lPs66pDwgDI6hnexS7RTYLUitx17wR5pBNlqEa5UyN0S1mxsz2TupgJ0tTbj9Ejp5ioTHQiaUyJWWe9au5kOhc4UiOmghLuzXMP7YlCy9oEO4RIQqc9tZBe90hadOaAEdBbjOmQOWcQJq8MLkVFQ_0WK76BVldKBezItO8YEiLtwLh1tgsPo1Jb7fM`;

const initialize = (getState) => {
  if (dev) {
    return createSmartappDebugger({
      // Токен из Кабинета разработчика
      token: artem_token,
      // Пример фразы для запуска смартапа process.env.REACT_APP_TOKEN ?? ''
      initPhrase: 'Запусти Элиас',
      // initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      // Текущее состояние смартапа
      getState,
      // Состояние смартапа, с которым он будет восстановлен при следующем запуске
      // getRecoveryState,
      // Необязательные параметры панели, имитирующей панель на реальном устройстве
    });
  }

  // Только для среды production
  return createAssistant({ getState });
};
function getStateForAssistant() {
  const state = {
    item_selector: {
      items: store.getState().teamsArray.map(({ id, name }, index) => ({
        number: index + 1,
        id,
        name,
      })),
      ignored_words: [
        'добавить',
        'запиши',
        'закинь',
        'добавь',
        'создать',
        'создай', // addTeam.sc
        'удали',
        'убери',
        'убрать',
        'убирать',
        'удалять',
        'удалить', //removeTeam.sc
        'начни',
        'начать'
      ],
    },
  };
  console.log('getStateForAssistant: state:', state);
  return state;
}

const assistant = initialize(() => getStateForAssistant());

assistant.on('data', (command) => {
  console.log('Data received', command.action);
  dispatchAssistantAction(command);
  console.log('Состояние стора: ', store.getState());
  // пишем функцию dispatchAssAction чтобы он закидывал команду в список
  // Подписка на команды ассистента, в т.ч. команда инициализации смартапа.
  // Ниже представлен пример обработки голосовых команд "ниже"/"выше"
});

function dispatchAssistantAction(command) {
  console.log('Command from dispAct: ', command);
  if (command.type === 'smart_app_data') {
    switch (command.action.type) {
      case 'add_team':
        store.dispatch(
          addTeam(store.getState().teamId, command.action.payload.name)
        );
        store.dispatch({ type: 'NEXT' });
        console.log('Зашел в case add_team');
        break;

      case 'remove_team':
        console.log(
          'Принята команда удалить команду с id ',
          command.action.payload.id
        );
        store.dispatch(removeTeam(parseInt(command.action.payload.id, 10)));
        store.dispatch(setNewId());
        break;

      case 'rename_team':
        console.log(
          `Принята команда на переименование команды с id ${command.action.payload.id} и названием ${command.action.payload.name}`
        );
        store.dispatch(
          renameTeam(
            parseInt(command.action.payload.id, 10),
            command.action.payload.name
          )
        );
        break;

      // Переходы на страницы
      case 'go_to_settings':
        console.log('Pathname: ', router.state.location.pathname);
        console.log('Получена команда перейти на страницу настроек');
        console.log('Состояние роутера:', router.state);
        router.navigate('/settings');
        break;
      
      case 'go_to_game':
        console.log('Получена команда перехода на страницу игры');
        router.navigate('/game');
        break;

      case 'go_to_rules':
        router.navigate('/rules');
        break;

      case 'go_back':
        window.history.back();
        break;
      // case 'back':

      // настройки
      case 'set_duration':
        console.log(
          'Запрос на установление длительности раунда: ',
          command.action.payload.value
        );
        break;

      case 'set_number_of_words':
        store.dispatch(setWordsCountToWin(parseInt(command.action.payload.value, 10)));
        console.log(
          'Запрос на установку количества слов: ',
          command.action.payload.value
        );
        break;

      case 'turn_on_penalty':
        store.dispatch(setPenaltyForSkip(true));
        console.log('Штраф за последнее слово включен!');
        break;
      case 'turn_off_penalty':
        store.dispatch(setPenaltyForSkip(false));
        console.log('Штраф за последнее слово выключен!');
        break;
      case 'turn_on_clw':
        store.dispatch(setCommonLastWord(true));
        console.log('Штраф за последнее слово включен!');
        break;
      case 'turn_off_clw':
        store.dispatch(setCommonLastWord(false));
        console.log('Штраф за последнее слово выключен!');
        break;

      case 'start_over':
        store.dispatch({type: 'RESET'});
        router.navigate('/');
      default:
        console.log('Получена ошибочная команда');
    }
  }
}

assistant.on('start', (event) => {
  let initialData = assistant.getInitialData();

  console.log(`assistant.on(start)`, event, initialData);
});

assistant.on('command', (command) => {
  console.log('Command: ', command);
});

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
  assistant.sendData(data);
  // const unsubscribe = assistant.sendData(data, (data) => {
  //   // функция, вызываемая, если на sendData() был отправлен ответ
  //   const { type, payload } = data;
  //   console.log('sendData onData:', type, payload);
  //   unsubscribe();
  // });
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      {
        path: 'game',
        element: <Game />,
      },
      {
        path: 'rules',
        element: <Rules />,
      },
      {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'settings',
        element: <Settings send_action_value={send_action_value}/>,
      },
      {
        path: 'result',
        element: <Result />,
      }
    ],
  },
]);