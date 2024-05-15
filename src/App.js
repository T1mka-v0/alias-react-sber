import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { teamStore, teamId } from './store';

import { Theme, DocStyles } from './SberStyles';

import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import { Button, Container } from '@salutejs/plasma-ui';
const devType = "development";

const artem_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJlMmQ3NWI3Yy1kODFjLTQwMTQtODg5ZS0xODU5ZDFiZjFkYTgiLCJzdWIiOiJmNTY2OWE2MWI3ZGFhN2I1MWQzYThmOGQyM2ZjZDRkZmRkZGJiMWI0ODI4MzUyNGI5OGRmODNhNzMwYjg5MWU0NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNTc4MDcwNiwiYXVkIjoiVlBTIiwidXNyIjoiMzc4MDg2OTctYmM0NS00NTkyLTk4ZmItOWEzYjBmMWZiZTI3IiwiaWF0IjoxNzE1Njk0Mjk2LCJzaWQiOiJkOGQxZWE3Mi1hNWYxLTRkZGEtYTI3Ny1iNmYwYzM4NWM5NWEifQ.c6tLOJLhKbVFRZPnFP8QTGl1uLprwIocYl8Mn47OhgrVdz_kJBuaB1ln3Sn-KGqmxWrB_vfq50FQGqaZH3ohWgqjm6CaBfzbWiBJKTKj0NFesA1FOMOprK2gdyxKsfn5uGJi-BOvX_hGLfHlrrPz6sLSN3r_BChX-LR-6AsPIDdEE2iG41wedUnzMLD6tEKBcwF2cjIah9Lv-7V4YLqZMuqYqYdQEkcXNV9LS5tXkbU0ge_d5eqhbxm9p34Wvqlx64_RTun7N9KNh5HgdJyZfyM26Mb3ya60D_sqCTZStbAema2MY5Gqtu6NJZDqncdj9G003nJaksHZgrtH5A0cbKfCWYfNqehFPRvTgxnoDqv-dmjlMC1niQAnCi3KMAY00t1rNalZHD-hZhTzaHQyksJ-Di1prtM1SzAOzDvnzb5LG-M6eb87hWKwLOzsV6v6wgJ73infEx6KWxIo2wqdW9RK30_us9nug3VSHfpSDUyfaDNfQPU3cpoXjswH5arnvFbI7KOlQ_jwcQgGH0mxqvXP2zdhh0ryB7CXLZwswMHQFhsSIpg3HzFiKNvPorHEiqcxb_g2BtmgxR0dFfENbAyE8MW6LtuCh5wCDvjDT83CuhWUy3qSm_QC2hZFcezLfUnwagamCGxOehO40Um-UqEJ3lwt6GCFJUg7f4qjMkU"
const alykoshin_token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIyOGY4YzU3Yi00NGQ1LTQ3NmEtOWM3Zi1mYTBhZWYzMjJhMmIiLCJzdWIiOiIwMDFhMGI5Yzc2Yjg5ZTE0YzI0MjhkYjNiMGI2MjBjMDMwYTVmMmQzMWFkNWExMjZjZTlhMGJhZDFhOTExY2E2NTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcxNTcwNjk4MCwiYXVkIjoiVlBTIiwidXNyIjoiM2YwOTUxNTgtODM3NS05YmVmLWI4MTktNDczZmExYTE4YTAzIiwiaWF0IjoxNzE1NjIwNTcwLCJzaWQiOiI0YTY2YzJkYS01NDE4LTRlZDEtYWI5My1iMDFiZWQ5NTgxODAifQ.cxAw9zIa8Qrs3K-keNDko861r_2NS54lo_drtkMDGPSxKrZNlKGQPPNUGiils7lnzdpuE6pQWhW8K6ki-hmZKbTg8BCb3vkyIovbsv6oM6sgFSzShnwppanjpxmZFFz_0plvw9iJQyj84yRb10ZVqRaqg5IxsADP-JLXqQKbCCqTFI0XVEqq8fvQtgqbOm8gZnTj3pAXhdl2tR68nGXASXRnJOxdDQ1XiJemSUxMz-6BbW2J_yCd58_BsF0nm70eFM_uJPv5mrXZxlVDPPhIt5R53l31T-SpOl7-NmskRTuCLM7Ln0Jiw4kuIzK1vENuV3GwogRt20I_gicWqsOmaemG9nF_KF7PYxffbO-cB3zeRG_W1Dk3ZZYakHJiywljyLv8CeYx2v9P5szVsxEXM06oK46uv3KzH1p0xL_JJrd-h1rC1SEWA1zoL8POyFzgv30dgU-gdvPgiPMMYU6HL1y_868dDOglUazAfk2914Ps9yJHb6N2D-GpHx8mHbqba9sJ8EGgd_0o0VJO9EVdKX1VubIxOxwstzUeL89OJ9_GghlHL0nrijTxeq9pRUS3KvN-EbxhN1udGa6OCKmayqtA4KDPH1Ei1UKV1LZ-Dz5cwa4B_oNwWgoLJB4qlnH-mziop2B5HNgoHiTDh9Vs3uFqdikFrhW_jNtj47BtAcw`;


const initialize = (getState) => {
    if (devType === "development") {
        return createSmartappDebugger({
            // Токен из Кабинета разработчика
            token: artem_token,
            // Пример фразы для запуска смартапа process.env.REACT_APP_TOKEN ?? ''
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
// const assistant = initialize(() => getStateForAssistant());
// assistant.on('data', (command) => {
//   console.log("Command received", command);
//     // Подписка на команды ассистента, в т.ч. команда инициализации смартапа.
//     // Ниже представлен пример обработки голосовых команд "ниже"/"выше"
// });

// assistant.on('start', (event) => {
//   let initialData = assistant.getInitialData();

//   console.log(`assistant.on(start)`, event, initialData);
// });
function App() {

  const path = 'https://jsonplaceholder.typicode.com/users';
  async function getUsers() {
    let response = await fetch(path);
    if (response.ok) return await response.json();
    console.log(response);
  }

  return (
    <div className="App" style={{display:"flex", flexDirection:"column", alignContent:"center", justifyContent:"center"}}>
      <DocStyles />
      <Theme />
      <h1 style={{display:"flex", justifyContent:"center"}}>Alias</h1>
      <nav>
        <ul style={{listStyleType: "none"}}>
          <li>
            <Container style={{padding:"16px 64px"}}>
              <Link to={'settings'}>
                <Button style={{width:"100%"}}>Начать игру</Button>
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