import { createGlobalStyle } from 'styled-components';
import { darkSberprime, salutejs_sber__dark } from '@salutejs/plasma-tokens/themes'; // Или один из списка: salutejs_eva__dark, salutejs_joy__dark, salutejs_eva__light, salutejs_sber__light
import {
    text, // Цвет текста
    background, // Цвет подложки
    gradient,
    dark03, // Градиент
} from '@salutejs/plasma-tokens';

const DocumentStyle = createGlobalStyle`
    html {
        color: ${text};
        // background-color: ${background};
        background-image: url("./back.png");
        background-size: cover;
        background-position: center;
        min-height: 100vh;
    }
`;
const ThemeStyle = createGlobalStyle(darkSberprime);

export const GlobalStyle = () => (
    <>
        <DocumentStyle />
        <ThemeStyle />
    </>
);