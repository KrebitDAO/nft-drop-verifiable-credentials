import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  display: grid;
  grid-gap: 20px;
  margin: 0 auto;

  @media (min-width: 1024px) {
    max-width: 1366px;
    grid-template-columns: repeat(3, 415px);
  }
`;

export const Card = styled.div`
  ${({ currentNFT }) => css`
    border: 1px solid #ffffff66;
    border-radius: 20px;

    .image {
      background-image: url('${currentNFT}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      width: 100%;
      height: 300px;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }

    .title {
      color: white;
      font-weight: 600;
      margin: 0;
      margin-top: 10px;
      margin-left: 10px;
      justify-self: left;
    }

    .description {
      font-size: 14px;
      color: white;
      opacity: 0.7;
      margin: 0;
      margin-top: 15px;
      margin-left: 10px;
      line-height: 1.4;
      justify-self: left;
    }

    .button {
      width: 200px;
      height: 45px;
      margin: 20px auto;
    }
  `}
`;
