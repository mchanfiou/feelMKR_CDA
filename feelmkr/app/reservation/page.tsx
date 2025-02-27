"use client";
import ReservationCalendar from "@/app/components/reservationcalendar";
import { Container, Navbar, Button} from "reactstrap";
import Image from "next/image";

export default function ReservationPage() {
  return (
    <>
    <div className="d-flex flex-column min-vh-100">
    <Navbar color="light" light expand="lg" className="p-3">
      <Image src="/FeelMKR.png" alt="Logo" width={65} height={65} className="img-fluid" />
    </Navbar>
    <Container className="d-flex justify-content-center" style={{paddingTop: '10vh', position: 'relative' }}>
      <h1 className="text-center text-2xl fw-bold mb-6">Gérez vos réservations</h1>
    </Container>
    <Container className="d-flex justify-content-center p-6">
      <ReservationCalendar />
    </Container>
    <Container className="d-flex justify-content-center">
      <Button className="mt-4" onClick={() => console.log("Réservation ajoutée")}>Ajouter une réservation</Button>
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
