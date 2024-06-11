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

import router from './router';

const dev = true;
const artem_token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJhYTdmNzJiMS1mZDcyLTQ1M2QtYjQ3Yi1jZjE0ZmQxMDc5NzQiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxODE3OTIwNCwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE4MDkyNzk0LCJzaWQiOiI0NjY0Mzc2YS03MmMzLTRmNmUtYTI3MS1mY2E2NTdmYzUxZTIifQ.cPKeLCD9cv3uZi6HD7ZoK8ci16BC0sNA2ecFDi5fqu-kYR-YLxnpCPrWGeCiuh6b9PfhwS0dsz8yxn1D6zorKQ40_yf7VqJAwts52i84BEd7ye51I987w8T8DSV3qmUGj95lenV9PAaf8nNX1TYjbVasqGMe8cb_vd59-U2lM3jAJFC3rkWkF4Iv1kqDoPPUelv53g9m671n0K5AZnnC4h4mOx0a3Viitk4Qk67G5HLXaT2jXpbuby-A-0bK5o8bNWv4op8f8bmoWmMC4nH7ffAsRedGRK5N_sBnxu8rgv08EqzrVcz00tw5lBJCnj9c30DiSIQv4j8L3lOyH-AmxhyKlku5FGbTTF1MWTFKs1QlxR8p-w7OwRLFewu6QW2o_8hila7LcHiMxoTJyne7eALSrM0orgJMMfzh9diu0Rtfq7T1vVbJiKf8PgC4TcShsLIgE9mVT8kjFvhH7NFlMIU90PvOlmhDSh27zz6SpN46lzGNrEG-cM-Ky4MAIIso2TpHJHcT5GgVxjU6yEPyr0F00kD99LikWyTPnS04uyv5RTMmZ6spx_WgLbVqMPy96IGJDbhQrqhrGcaCiqWWHIvrozPohjzolj3dU3R1WH5wTfoJ0GyPPPQY5ibQHJSmmxbjiUdduB_yMj_zZV7SC02YsSevgOsv8T5hvHhjHf4';

const initialize = (getState) => {
  if (dev) {
    return createSmartappDebugger({
      // Токен из Кабинета разработчика
      token: artem_token,
      // Пример фразы для запуска смартапа process.env.REACT_APP_TOKEN ?? ''
      // initPhrase: 'Запусти Элиас',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
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

      case 'back':
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
  const unsubscribe = assistant.sendData(data, (data) => {
    // функция, вызываемая, если на sendData() был отправлен ответ
    const { type, payload } = data;
    console.log('sendData onData:', type, payload);
    unsubscribe();
  });
}
