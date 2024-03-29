import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ currentImage }) => css`
    .container {
      margin: 50px 20px;

      @media (min-width: 1024px) {
        margin: 0 20px;
        margin-top: 80px;
        display: grid;
        grid-template-columns: 495px 532px;
        grid-gap: 115px;
        justify-content: center;
      }

      .container-image {
        width: 100%;
        height: 350px;
        background-image: url('${currentImage}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        @media (min-width: 1024px) {
          height: 504px;
        }
      }

      .container-content {
        @media (min-width: 1024px) {
          align-self: center;
        }

        .container-title {
          color: white;
          font-weight: 600;
          font-size: 20px;
          margin: 0;
          margin-top: 10px;

          @media (min-width: 1024px) {
            margin: 0;
            font-size: 40px;
          }
        }

        .container-subtitle {
          color: white;
          font-weight: 600;
          font-size: 20px;
          margin: 0;
          margin-top: 10px;

          @media (min-width: 1024px) {
            margin-top: 20px;
          }
        }

        .container-description {
          font-size: 14px;
          color: white;
          opacity: 0.7;
          margin: 0;
          margin-top: 15px;
          line-height: 1.4;

          @media (min-width: 1024px) {
            margin: 0;
            margin-top: 15px;
            font-size: 16px;
          }
        }

        .container-description-error {
          color: red;
          opacity: 0.8;
          font-weight: 400;
        }

        .container-button {
          width: 200px;
          height: 45px;
          margin: 20px auto;

          @media (min-width: 1024px) {
            width: 250px;
            height: 50px;
            margin: 0;
            margin-top: 20px;
          }
        }

        .container-networks {
          display: flex;
          grid-gap: 10px;
          margin-top: 20px;

          & > a {
            border: 1px solid #ffffff66;
            padding: 10px;
            background-color: white;
            color: #1c1e21;
            border-radius: 29px;
            font-size: 14px;
            font-weight: 400;
            display: flex;
            grid-gap: 5px;
            align-items: center;
          }
        }
      }
    }
  `}
`;
