import { ButtonStyled } from './styles';

export const Button = props => {
  const { text, onClick, isLoading = false } = props;

  return (
    <ButtonStyled
      onClick={isLoading ? undefined : onClick}
      isLoading={isLoading}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : text}
    </ButtonStyled>
  );
};
