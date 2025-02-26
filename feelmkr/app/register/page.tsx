'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Form, FormGroup, Label, Input, Alert, Navbar } from 'reactstrap';
import Image from 'next/image';

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!termsAccepted) {
      setError('Vous devez accepter les CGU.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/utilisateurs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Échec de l\'inscription');
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  return (
    <>
      <Navbar color="light" light expand="lg" className="p-3">
        <Image src="/FeelMKR.png" alt="Logo" width={65} height={65} className="img-fluid" />
      </Navbar>
      
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '85vh' }}>
        <div className="p-4 border rounded shadow" style={{ width: '400px', backgroundColor: '#fff' }}>
          <h2 className="text-center mb-4">Inscription</h2>
          {error && <Alert color="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <FormGroup>
              <Label for="companyName">Nom d'entreprise</Label>
              <Input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label for="password">Mot de passe</Label>
              <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirmer le mot de passe</Label>
              <Input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />{' '}
                J'accepte les CGU
              </Label>
            </FormGroup>
            <Button color="dark" block>S'inscrire</Button>
          </Form>
          <div className="text-center mt-3">
            <a href="#">J'ai oublié mon mot de passe</a> | <a href="/login">Se connecter</a>
          </div>
        </div>
      </Container>
    </>
  );
}
