import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding: 0 20px;
  min-height: calc(100vh - 60px);
  height: 100%;
  width: 100%;
  display: grid;
  align-content: center;
  justify-content: center;

  @media (min-width: 1024px) {
    padding: 0;
    min-height: calc(100vh - 80px);
    margin: 0 auto;
  }

  .content {
    .content-title {
      color: white;
      text-align: center;
      font-size: 50px;

      @media (min-width: 1024px) {
        font-size: 80px;
      }
    }

    .content-description {
      font-size: 14px;
      color: white;
      opacity: 0.7;
      margin: 0;
      margin-top: 20px;
      line-height: 1.4;
      text-align: center;

      @media (min-width: 1024px) {
        font-size: 20px;
        margin-top: 30px;
      }
    }

    .content-button {
      margin: 0 auto;
      margin-top: 20px;
      width: 200px;
      height: 45px;

      @media (min-width: 1024px) {
        height: 50px;
        margin-top: 30px;
      }
    }
  }
`;
