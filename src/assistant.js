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

const devType = 'development';
const artem_token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI1ZDA5YzRlNi1mNjE1LTQzZWYtOWZlMi1lNGM5NmY3ZmYzOTkiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNzgzOTI3NiwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE3NzUyODY2LCJzaWQiOiIzMzQ3MDMxNS1mM2ZmLTRmMTEtYTFiYS05OWRhMjFkMTA0ODAifQ.uF9UK-wCRyAqTdh9o8UnFHLEq4JVDw0onUnPC2T47gN4pi49D9clN53PbWn7X3H5DoxReuJcMqEpRbSu-mLoE_R2nSWEaL4MdDLp_-mfqfJeJaUNHmOVwgSsHk47k-tUbJ6qCVaBzyKFxAr-q7tnPA28AcezTSvh5I-DFIDbRc3QStwFSEIx5tM9chjI4z7qOg69xQs_IDehR9Vh5ixnMKuWO460PFomcHJICqSz9aalgBp2FoGJFgcX_Npng-FVcAblkgYtwxtfIFqomXFKIN1V_78a3HLB_B2D-pSuIgwyDZDmb8knVI3UYi9ASiAYm4QFwz_oUOp2sLSwkUyV04SwS104cI5cnUeRCUtCfs2F7d-F1y1Qh5DgmLd0DvrMg5FZI5Me3kw8yfmf1I8rlWvXheGwBrIz2yqfdM3gfYYEBVmepl6W3Jkd7k9BK_GaPUdEWixoZf-CdxNm_rP1iOaE74P-5lHdzV3c0Y8SbaVZ-m_zp2hcXqRcutyJxzakXtj2GWhdDOz5t4p-MDPvYtyiREH-n1Q5I2zcfMz_8ADt46Pm_muuoNWhc8K46iFG1YtKvaoSnnQ7GNZect94JHtVY39P_nLPLi9xq1u8EE4QDkVHAebXSauO0G1u5Mu0KG1_upMsUFlVC9NhX8lEMir_KWO3ATy1_jgRys5b-gQ';

const initialize = (getState) => {
  if (devType === 'development') {
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
        console.log('Получена команда перейти на страницу настроек');
        router.navigate('settings');
        break;

      // настройки
      case 'set_duration':
        console.log(
          'Запрос на установление длительности раунда: ',
          command.action.payload.value
        );
        break;

      case 'setNumerOfWords':
        console.log(
          'Запрос на установку количества слов: ',
          command.action.payload.value
        );
        break;

      case 'turn_on_penalty':
        console.log('Штраф за последнее слово включен!');
        break;
      case 'turn_off_penalty':
        console.log('Штраф за последнее слово выключен!');
        break;
      case 'turn_on_clw':
        console.log('Штраф за последнее слово включен!');
        break;
      case 'turn_off_clw':
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
