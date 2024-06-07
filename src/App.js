import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { store } from './store';

import { Theme, DocStyles } from './SberStyles';
import { useNavigate, redirect, redirectDocument } from 'react-router-dom';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import { Button, Container } from '@salutejs/plasma-ui';
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

function App() {
  const devType = 'development';
  const artem_token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI2YzJhMzk1NS0zMDBkLTRlZTMtYjM3Yy04OWE0Y2I0ZWVmMmEiLCJzdWIiOiIwMDFhMGI5Yzc2Yjg5ZTE0YzI0MjhkYjNiMGI2MjBjMDMwYTVmMmQzMWFkNWExMjZjZTlhMGJhZDFhOTExY2E2NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNzg3ODcxNSwiYXVkIjoiVlBTIiwidXNyIjoiM2YwOTUxNTgtODM3NS05YmVmLWI4MTktNDczZmExYTE4YTAzIiwiaWF0IjoxNzE3NzkyMzA1LCJzaWQiOiJlZmRiNWViYi1iYjYyLTQ0MzAtOGVjZC1jZWJmODhkZTcxYzkifQ.ebtpjFnpR1Mht6YFutKWR3IX68DYRIUsSm7ypcZSvTXmsfSs9-Qe0nd97u5u5wrwpgkG7HlZixt3g9I0eR54Rsne7aD3x6F0aeuD1Naj0a_u_PqQZJi54PyRr5MlP4_uUvDnC2EcuWCqzomLkOqqP-jpsIodI88ylsGLvgP1xSS2UPvAEK-edrSK8zwpMBr2KUvazYAm2WpUYPsKy2ZaoSCFBjBbhULwabxKfAzE8WLpfdmjNKNQle8iLPxbK7ymLorL8M2FOhL3ffnHTHnJ1Ke4llw0J_S5Td2rxZCt803N49RwhBjh0pjbVpCPk-PW3vvCEDwADPtwf0OHN_c9wOQo7loHiTjRcQ54Hp7xobmLd_uPbpC7YPXSSZ3zCKbD-nToBxk2qt36vTSJuz8CSfFL5WXeH9h6sGR6LEBvWA3JUMpLJMJPYAjWk8kA78usob-DGAC2bJEPSPrIratRXqOvy3mTL731x74SDVp2oA1kYY0H_no1aQQQmC3uSmxUUba0s-j5FRg9sam0MlHAIElSkG0Dgu4FyZoxV4VkxhPEbelv7DSHhjnCrxFCIGT8W88lIzMHkIVTa9qrb8xDEw7hmXrI3XrReDHxHDVflVJCkwF8la5p-yvRkaUgA4di6oUs87lu-WcOhNjOjB4ekPdMCz2ekKQ2Lv-1U92NjDU';

  const navigate = useNavigate();

  const initialize = (getState) => {
    if (devType === 'development') {
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
    console.log('Data received: command.action:', command.action);
    console.log('Data received: command:', command);
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
          navigate('/settings');
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
          console.error('Получена неизвестная команда');
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

  // function dispatchAssistantAction(command) {
  //   switch (action.type) {
  //     case "add_team":

  //   }
  // }

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <DocStyles />
      <Theme />
      <h1 style={{ display: 'flex', justifyContent: 'center' }}>Alias</h1>
      <nav>
        <ul style={{ listStyleType: 'none', padding: '0px 0px' }}>
          <li>
            <Container style={{ padding: '16px 64px' }}>
              <Link to={'settings'}>
                <Button style={{ width: '100%' }}>Начать игру</Button>
              </Link>
            </Container>
          </li>
          <li>
            <Container style={{ padding: '16px 64px' }}>
              <Link to={'rules'}>
                <Button style={{ width: '100%' }}>Правила</Button>
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
