import styled from '@emotion/styled';

export const ButtonStyled = styled.button`
  cursor: pointer;
  display: block;
  margin: 0 auto;
  font-weight: 600;
  width: 100%;
  height: 35px;
  background-image: linear-gradient(to left, #f213a4 0, #418dff 101.52%);
  color: white;
  text-align: center;
  border-radius: 9999px;
  border-style: none;
  outline: none;

  @media (min-width: 1024px) {
    height: 45px;
    width: 180px;
  }
`;
