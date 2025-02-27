'use client'; 
import { useRouter } from 'next/navigation';
import { Container, Button, Navbar, Nav } from 'reactstrap'; // Importation de reactstrap
import Image from 'next/image';


export default function HomePage() {
  const router = useRouter();
  return (
    <>
    <div className="d-flex flex-column min-vh-100">
      <Navbar color="light" light expand="lg" className="p-3">
      <Image src="/FeelMKR.png" alt="Logo" width={65} height={65} className="img-fluid" />
        <Nav className="ms-auto">
          <Button outline color="secondary" className="me-2" onClick={() => router.push('/login')}>Se connecter</Button>
          <Button color="dark" onClick={() => router.push('/register')}>Essayer gratuitement</Button>
        </Nav>
      </Navbar>
      
      <Container className="text-center my-5 " style={{ height: '50vh', paddingTop: '12.5vh', position: 'relative' }}>
        <h1 className="fw-bold d-flex justify-content-center">Capturez l’instant présent, <br /> racontez votre histoire</h1>
        <p>FeelMKR, votre vitrine professionnelle pour sublimer vos réalisations vidéo</p>
        <Button color="dark" size="lg" onClick={() => router.push('/reservation')}>Essayer gratuitement</Button>
      </Container>
      
      <Container fluid style={{ height: '50vh', position: 'relative' }}>
        <Image 
          src="/img.jpg" 
          alt="Clap cinéma et objectifs" 
          fill
          className="img-fluid "
          style={{ objectFit: 'cover' }}
        />
      </Container>
      
      <footer className="text-center mt-auto py-4 bg-light">
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
      </div>
    </>
  );
}
