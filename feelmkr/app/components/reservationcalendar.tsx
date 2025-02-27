import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fonction pour récupérer le token JWT
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Fonction pour récupérer les réservations depuis l'API
const fetchReservations = async () => {
  const token = getToken();
  if (!token) return [];

  try {
    const response = await axios.get(`${API_URL}/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations", error);
    return [];
  }
};

// Initialiser le localizer avec date-fns
const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ReservationCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadReservations = async () => {
      const data = await fetchReservations();
      const formattedEvents = data.map((r: { date: string }) => ({
        start: new Date(r.date),
        end: new Date(r.date + 1), // Ajouter une heure à l'événement
      }));
      setEvents(formattedEvents);
    };
    loadReservations();
  }, []);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Fonction pour colorier les événements
  const eventPropGetter = (event: any) => {
    const backgroundColor = '#ffcccc'; // Couleur de fond pour les dates réservées
    return { style: { backgroundColor } };
  };

  return (
    <Container className="d-flex justify-content-center" style={{ paddingTop: '5vh', position: 'relative' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, width: '100%' }}
        popup
        views={['month']}
        defaultView="month"
        messages={{
          next: 'Suivant',
          previous: 'Précédent',
          today: "Aujourd'hui",
          event: 'Événement',
        }}
        selectable // Permet la sélection des slots
        onSelectSlot={handleSelectSlot} // Gérer la sélection d'un slot
        eventPropGetter={eventPropGetter} // Appliquer des styles aux événements
      />

      {/* Modal pour afficher la date sélectionnée */}
      <Modal isOpen={modalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Date Sélectionnée</ModalHeader>
        <ModalBody>
          {selectedDate ? `Vous avez sélectionné : ${format(selectedDate, 'dd/MM/yyyy')}` : "Aucune date sélectionnée."}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCloseModal}>Fermer</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default ReservationCalendar;
