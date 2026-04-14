import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from '../Components/Common/PasswordInput';

describe('PasswordInput', () => {
  it('должен переключать видимость пароля', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Пароль" />);

    const input = screen.getByLabelText('Пароль') as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggleButton = screen.getByRole('button', { name: /показать пароль/i });
    
    await act(async () => {
      await user.click(toggleButton);
    });

    const hideButton = await screen.findByRole('button', { name: /скрыть пароль/i });
    expect(hideButton).toBeInTheDocument();
    expect(input.type).toBe('text');

    await act(async () => {
      await user.click(hideButton);
    });

    const showButton = await screen.findByRole('button', { name: /показать пароль/i });
    expect(showButton).toBeInTheDocument();
    expect(input.type).toBe('password');
  });
});
