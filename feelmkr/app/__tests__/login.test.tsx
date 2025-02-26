import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/login/page';
import userEvent from '@testing-library/user-event';

// Mock du router Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock de fetch pour l'authentification
global.fetch = jest.fn((url, options) =>
  Promise.resolve({
    ok: url.includes('/token/'),
    json: () =>
      Promise.resolve(
        url.includes('/token/')
          ? { access: 'fakeAccessToken', refresh: 'fakeRefreshToken' }
          : { detail: 'Invalid credentials' }
      ),
  })
) as jest.Mock;

describe('LoginPage', () => {
  it('devrait se connecter et rediriger vers /', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<LoginPage />);

    // Remplissage du formulaire
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Clic sur le bouton de connexion
    fireEvent.click(submitButton);

    // Attente que la redirection se produise
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));

    // Vérification que le token est bien stocké
    expect(localStorage.getItem('accessToken')).toBe('fakeAccessToken');
    expect(localStorage.getItem('refreshToken')).toBe('fakeRefreshToken');
  });

  it('devrait afficher une erreur si les identifiants sont invalides', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Invalid credentials' }),
      })
    ) as jest.Mock;

    render(<LoginPage />);

    // Remplissage du formulaire
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');

    // Clic sur le bouton de connexion
    fireEvent.click(submitButton);

    // Vérification que le message d'erreur est affiché
    await waitFor(() => screen.getByText(/Invalid credentials/i));
  });
});
