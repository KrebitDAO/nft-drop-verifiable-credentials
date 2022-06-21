import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ currentNFT }) => css`
    padding: 0 20px;
    min-height: calc(100vh - 50px);
    height: 100%;
    width: 100%;

    @media (min-width: 1024px) {
      padding: 0;
      min-height: calc(100vh - 80px);
      display: grid;
      align-content: center;
      justify-content: center;
    }

    .container {
      @media (min-width: 1024px) {
        max-width: 1366px;
        display: grid;
        align-items: center;
        grid-template-columns: auto 460px;
        grid-gap: 50px;
      }
    }

    .content {
      padding: 50px 0;

      @media (min-width: 1024px) {
        padding: 0;
      }

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
      width: 100%;

      .nfts-images {
        height: 460px;
        background-image: url('${currentNFT}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        transition: all 0.2s ease;
        border-radius: 20px;

        @media (min-width: 1024px) {
          width: 460px;
        }
      }
    }
  `}
`;
