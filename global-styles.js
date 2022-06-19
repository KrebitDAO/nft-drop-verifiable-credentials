import { css, Global } from '@emotion/react';

export const globalStyles = (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap');

      * {
        font-family: 'Roboto', sans-serif;
        box-sizing: border-box;
        font-weight: 300;
      }

      html,
      body {
        scroll-behavior: smooth;
        margin: 0;
        padding: 0;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: initial;
        margin: 0;
        padding: 0;
      }

      a {
        text-decoration: none;
      }
    `}
  />
);
