import { createGlobalStyle } from 'styled-components';
import { darkJoy, darkSber, lightJoy, darkEva, lightEva, lightSber, dark01, dark03, sbermarket__dark, sbermarket_business__dark, sberprime__dark, darkOverlayBlur, darkPlasma_web, darkSberprime } from '@salutejs/plasma-tokens';
import { text, background, gradient } from '@salutejs/plasma-tokens';

export const DocStyles = createGlobalStyle`
    html {
        color: ${text};
        background-color: ${background};
        background-image: ${gradient};

        /** необходимо залить градиентом всю подложку */
        min-height: 100vh;
    }
`;

// создаем react-компонент для персонажа
export const Theme = createGlobalStyle(darkSberprime);