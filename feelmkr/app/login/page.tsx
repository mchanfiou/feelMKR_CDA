'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Form, FormGroup, Label, Input, Alert, Navbar } from 'reactstrap';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Échec de la connexion');
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      router.push('/');
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
        <Image src="/FeelMKR.png" alt="Logo" width={50} height={50} className="img-fluid" />
      </Navbar>
      
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="p-4 border rounded shadow" style={{ width: '400px', backgroundColor: '#fff' }}>
          <h2 className="text-center mb-4">Connexion</h2>
          {error && <Alert color="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label for="password">Mot de passe</Label>
              <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FormGroup>
            <Button color="dark" block>Se connecter</Button>
          </Form>
          <div className="text-center mt-3">
            <a href="#">J&apos;ai oublié mon mot de passe</a> | <a href="/register">S&apos;inscrire</a>
          </div>
        </div>
      </Container>
    </>
  );
}
