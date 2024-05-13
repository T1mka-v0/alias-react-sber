import { createGlobalStyle } from 'styled-components';
import { salutejs_sber__dark } from '@salutejs/plasma-tokens/themes'; // Или один из списка: salutejs_eva__dark, salutejs_joy__dark, salutejs_eva__light, salutejs_sber__light
import {
    text, // Цвет текста
    background, // Цвет подложки
    gradient,
    dark03, // Градиент
} from '@salutejs/plasma-tokens';

const DocumentStyle = createGlobalStyle`
    html {
        color: ${text};
        background-color: ${background};
        background-image: ${gradient};
    }
`;
const ThemeStyle = createGlobalStyle(dark03);

export const GlobalStyle = () => (
    <>
        <DocumentStyle />
        <ThemeStyle />
    </>
);