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

const dev = false;
const artem_token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJlMWIwODVmOS1jYTM0LTQ2MzAtOTUxYS1mYjEwYzBmOTE5NTkiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxODI4ODI2OSwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE4MjAxODU5LCJzaWQiOiI0MjhiZjliMi01Y2Q5LTRmNzYtOTk3NS01NDYyMDAyMTQyMGMifQ.ehBmpDskomZw4kT0dNb0eFRYXVrG1g0xSSZJjD2I_6sDfSZeJRcSnPe3gWrX4Wzn_w41b8UHDN4W7YET8s88FT9HuMQf3-QjH99Sp5uSc9MZXGqg8FE2_TewYkQFLjj4WIx3J02r_vUfXuKeIz44mYHFSSwljwYMc4xU5ZSMb4BMQg4PUUKJnPKeC_5lxNVG5E4w6BpAqSXqdn0xckMcnCIbBYlAbZWI2U0YH57g7_ro6uQ8IPcPmKdJBznvDlP8gTe4uZLQlogD78h2CrrjxFh8uxzEk-y0kF64h_Iu0rwLkOd9PD_-_Aes_HfFhN97xPvg-QRSoTg2l6PbwYBz75dps1KQYLMGwcKGWwDaxgO0ps_-I8WbcmiUbtYKwAaoATaBZnOXNPU7pLnV9dYukFQ362hej8KU-apfLjvQTKwwaxUXNPQPgRjKV_sUEfIvOd7HfnKahmrbsWqtqgpbHT4Sac190xi7nvqB43MPRHpQpy93Hdtle8z8KBhr6LAjdAcGtgO1m8RboTfzTLLGPgoCYt1WZsFdy2G2KoEMgBtrz8t8U2Kd2dhJBbvRvFIdwXwio0-5rJZQpiqZPJjH--KUbCZqvHxLBmCLuttMKellZKB64tAYgStEVQyDqy8M21M4qDokm-hOTjiFu_5qNKMEK2VLmHa28_OkxNKZ9eo';

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

export function send_action_value(action_id, value) {
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
