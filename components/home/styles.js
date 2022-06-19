import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ currentNFT }) => css`
    padding: 0 20px;
    background-color: #1c1e21;
    height: 100vh;
    width: 100%;

    @media (min-width: 768px) {
      padding: 0;
      display: grid;
      justify-items: center;
      align-items: center;
    }

    .container {
      height: 100%;
      display: grid;
      justify-items: center;
      align-items: center;
      max-width: 1366px;
      grid-template-rows: 200px auto;

      @media (min-width: 1024px) {
        grid-template-rows: initial;
        grid-template-columns: auto 460px;
        grid-gap: 50px;
      }
    }

    .content {
      .content-title {
        color: white;

        @media (min-width: 1024px) {
          font-size: 50px;
        }
      }

      .content-description {
        font-size: 14px;
        color: white;
        opacity: 0.7;
        margin: 0;
        margin-top: 20px;
        line-height: 1.4;

        @media (min-width: 1024px) {
          font-size: 20px;
        }
      }
    }

    .nfts {
      .nfts-images {
        width: 460px;
        height: 460px;
        background-image: url('${currentNFT}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        transition: all 0.2s ease;
        border-radius: 20px;
      }

      .nfts-actions {
        margin-top: 25px;
      }
    }
  `}
`;

export const Button = styled.button`
  cursor: pointer;
  display: block;
  margin: 0 auto;
  font-weight: 600;
  width: 168px;
  height: 46px;
  background-image: linear-gradient(to left, #f213a4 0, #418dff 101.52%);
  color: white;
  text-align: center;
  border-radius: 9999px;
  border-style: none;
  outline: none;
`;
