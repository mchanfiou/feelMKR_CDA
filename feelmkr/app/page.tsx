'use client';

import { Container, Button, Navbar, Nav } from 'reactstrap'; // Importation de reactstrap
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Navbar color="light" light expand="lg" className="p-3">
        <a href="#" className="navbar-brand">FeelMKR</a> {/* Remplacer Navbar.Brand par une balise a */}
        <Nav className="ms-auto">
          <Button outline color="secondary" className="me-2">Se connecter</Button>
          <Button color="dark">Essayer gratuitement</Button>
        </Nav>
      </Navbar>
      
      <Container className="text-center my-5">
        <h1 className="fw-bold">Capturez l’instant, <br /> racontez votre histoire</h1>
        <p>FeelMKR, votre vitrine professionnelle pour sublimer vos réalisations vidéo</p>
        <Button color="dark" size="lg">Essayer gratuitement</Button>
      </Container>
      
      <Container className="text-center">
        <Image src="/img_vitrine.png" alt="Clap cinéma et objectifs" width={800} height={400} className="img-fluid" />
      </Container>
      
      <footer className="text-center mt-5 py-4 bg-light">
        <Container>
          <div className="d-flex justify-content-center gap-3">
            <a href="#">X</a>
            <a href="#">G</a>
            <a href="#">In</a>
          </div>
          <div className="mt-3">
            <p>&copy; 2025 FeelMKR</p>
          </div>
        </Container>
      </footer>
    </>
  );
}
