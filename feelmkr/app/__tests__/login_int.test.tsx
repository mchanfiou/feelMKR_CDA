import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/login/page';
import userEvent from '@testing-library/user-event';

// Mock du router Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock de fetch pour l'authentification
(global.fetch as jest.Mock) = jest.fn();

describe('LoginPage Integration Test', () => {
  it('devrait se connecter avec des identifiants valides et rediriger', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock de la réponse fetch
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            access: 'fakeAccessToken',
            refresh: 'fakeRefreshToken',
          }),
      })
    );

    render(<LoginPage />);

    // Remplissage du formulaire
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Clic sur le bouton de connexion
    fireEvent.click(submitButton);

    // Attente de la redirection
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));

    // Vérification que le token est stocké
    expect(localStorage.getItem('accessToken')).toBe('fakeAccessToken');
    expect(localStorage.getItem('refreshToken')).toBe('fakeRefreshToken');
  });
});
