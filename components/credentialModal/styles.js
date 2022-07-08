import styled from '@emotion/styled';

export const Wrapper = styled.div`
  .background {
    background-color: rgba(49, 49, 51, 0.65);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }

  .credential-modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #1c1e21;
    z-index: 20;
    padding: 20px;
    display: flex;
    flex-direction: column;

    @media (min-width: 1024px) {
      width: 800px;
      height: 500px;
      border: 1px solid #ffffff4d;
      border-radius: 29px;
      margin: 0 auto;
      margin-top: 50px;
    }

    .credential-modal-close {
      align-self: flex-end;
      cursor: pointer;

      & > svg {
        width: 24px;
        height: 24px;
        fill: white;

        @media (min-width: 1024px) {
          width: 30px;
          height: 39px;
        }
      }
    }

    .credential-modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 120px;

      @media (min-width: 1024px) {
        margin-top: 80px;
      }

      .credential-modal-title {
        margin: 0;
        color: white;
        font-size: 40px;
        font-weight: 600;
        text-align: center;

        @media (min-width: 1024px) {
          font-size: 60px;
        }
      }

      .credential-modal-description {
        margin-top: 15px;
        margin-bottom: 40px;
        color: white;
        font-size: 16px;
        text-align: center;

        @media (min-width: 1024px) {
          font-size: 20px;
        }
      }

      .credential-modal-button {
        width: 200px;
        height: 45px;

        @media (min-width: 1024px) {
          width: 250px;
          height: 50px;
        }
      }
    }
  }
`;
