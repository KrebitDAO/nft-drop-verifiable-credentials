import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.nav`
  ${props => css`
    padding: 0 20px;
    height: 50px;
    width: 100%;
    display: grid;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: 87px ${props.authStatus === 'resolved'
        ? '48px'
        : '150px'};

    @media (min-width: 1024px) {
      padding: 0 40px;
      height: 80px;
      grid-template-columns: 100px auto;
    }

    .logo {
      width: 100%;
      height: 35px;
      background-image: url('/krebit.png');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      cursor: pointer;

      @media (min-width: 1024px) {
        height: 45px;
      }
    }

    .connect {
      width: 100%;

      .connect-icon {
        svg {
          fill: white;
        }

        @media (min-width: 1024px) {
          display: none;
        }
      }

      .connect-menu-mobile {
        position: absolute;
        left: 0;
        display: grid;
        grid-gap: 10px;
        width: 100%;
        background-color: #1c1e21;
        padding: 0 20px;
        z-index: 10;

        @media (min-width: 1024px) {
          display: none;
        }

        .connect-text {
          padding: 0;
          color: white;
          cursor: pointer;
          padding: 10px 0;
        }
      }

      .connect-list {
        display: none;

        @media (min-width: 1024px) {
          display: flex;
          grid-gap: 20px;
        }

        .connect-text {
          padding: 0;
          color: white;
          cursor: pointer;
        }
      }
    }
  `}
`;
