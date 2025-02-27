import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import App from '@/app/page'; // Point d'entrée de votre application
import userEvent from '@testing-library/user-event';

// Mock du router Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Functional Test', () => {
  it('devrait permettre à l\'utilisateur de se connecter et de créer une réservation', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock de fetch pour la connexion
    (global.fetch as jest.Mock) = jest.fn((url) =>
      Promise.resolve({
        ok: url.includes('/token/'),
        json: () =>
          Promise.resolve(
            url.includes('/token/')
              ? { access: 'fakeAccessToken', refresh: 'fakeRefreshToken' }
              : { detail: 'Invalid credentials' }
          ),
      })
    );

    render(<App />);

    // Accéder à la page de connexion
    const loginLink = screen.getByRole('link', { name: /Se connecter/i });
    fireEvent.click(loginLink);

    // Remplissage du formulaire de connexion
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    // Vérification de la redirection vers la page de réservation
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/reservations'));

    // Simuler la création d'une réservation
    const reservationButton = screen.getByRole('button', { name: /Créer une réservation/i });
    fireEvent.click(reservationButton);

    // Remplissage du formulaire de réservation
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Heure/i);
    const submitReservationButton = screen.getByRole('button', { name: /Confirmer/i });

    await userEvent.type(dateInput, '2025-03-07');
    await userEvent.type(timeInput, '10:00');
    fireEvent.click(submitReservationButton);

    // Vérification que la réservation a été ajoutée
    await waitFor(() => screen.getByText(/Réservation créée avec succès/i));
  });
});
