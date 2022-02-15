const { render, screen, fireEvent } = require('@testing-library/react');
import userEvent from '@testing-library/user-event';
import { Button } from '.';

/*
beforeAll()      beforeEach()
afterAll()       afterEach()
*/

//Describe para agrupar uma sequência de testes
describe('<Button />', () => {
  it('should render the button with the text "Load more"', () => {
    render(<Button text="Load more" />);

    //Espera-se duas acertivas
    expect.assertions(1);

    const button = screen.getByRole('button', { name: /load more/i });

    //Espera-se que button com este name esteja presente no documento
    expect(button).toBeInTheDocument();
  });

  it('should call function on button click', () => {
    const fn = jest.fn(); //Jest cria uma função mock para teste
    render(<Button text="Load more" onClick={fn} />);
    const button = screen.getByRole('button', { name: /load more/i });
    userEvent.click(button); //Simula o click do usuário no botão
    fireEvent.click(button); //Simula o click do usuário no botão
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should be disabled when disabled is true', () => {
    render(<Button text="Load more" disabled={true} />);
    const button = screen.getByRole('button', { name: /load more/i });
    expect(button).toBeDisabled();
  });

  it('should be enabled when disabled is false', () => {
    render(<Button text="Load more" disabled={false} />);
    const button = screen.getByRole('button', { name: /load more/i });
    expect(button).toBeEnabled();
  });
});

//npm test -- --watchAll="false" --coverage
