import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Container, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import axios from "axios";
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

interface Reservation {
  date: string;
}

interface CalendarEvent {
  start: Date;
  end: Date;
}

const ReservationCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadReservations = async () => {
      const data: Reservation[] = await fetchReservations();
      const formattedEvents = data.map((r) => ({
        start: new Date(r.date),
        end: new Date(r.date + 1),
      }));
      setEvents(formattedEvents);
    };
    loadReservations();
  }, []);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setModalOpen(true);
  };

  // Fonction pour colorier les événements
  const eventPropGetter = (event: CalendarEvent) => {
    const isReserved = events.some(e => e.start && event.start && e.start.toDateString() === event.start.toDateString());
    
    if (isReserved) {
      return { style: { backgroundColor: '#ffcccc' } }; // Couleur de fond pour les réservations
    }
    
    return {};
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
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventPropGetter}
      />

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>Date Sélectionnée</ModalHeader>
        <ModalBody>
          {selectedDate ? `Vous avez sélectionné : ${format(selectedDate, 'dd/MM/yyyy')}` : "Aucune date sélectionnée."}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setModalOpen(false)}>Fermer</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default ReservationCalendar;
