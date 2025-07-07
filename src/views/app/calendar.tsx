import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { baseUrl } from "../../hooks/fetch-api.hook";
import { useEffect, useState } from "react";
import type { EventInput } from "@fullcalendar/core";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Badge,
  Divider,
  ButtonGroup,
} from "@heroui/react";
import {
  CalendarIcon,
  Clock,
  RefreshCw,
  Grid3X3,
  List,
  LayoutGrid,
} from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  createdAt?: string;
  modifiedAt?: string;
  userId?: string;
}

interface SelectedEvent {
  id: string;
  title: string;
  start: Date;
  type: string;
  createdAt?: string;
  userId?: string;
}

export default function Calendar() {
  const [loader, setLoader] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
    null
  );
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchEvents = async () => {
    try {
      setLoader(true);
      const response = await axios.get(`${baseUrl}posted-event`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatEvents = (events: CalendarEvent[]): EventInput[] => {
    return events.map((event) => ({
      id: event.id.toString(),
      title: `${event.title}`,
      start: `${event.date}T${event.time}`,
      allDay: false,
      extendedProps: {
        type: event.type,
        createdAt: event.createdAt,
        userId: event.userId,
        originalTitle: event.title,
      },
      color: getEventColor(event.type),
      display: "auto",
    }));
  };

  const getEventColor = (type: string): string => {
    const colors: Record<string, string> = {
      youtube: "#FF0000",
      facebook: "#4267B2",
      instagram: "#E1306C",
      twitter: "#1DA1F2",
      default: "#8B5CF6", // Purple to match theme
    };
    return colors[type.toLowerCase()] || colors.default;
  };

  const getEventTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      youtube: "📺",
      facebook: "📘",
      instagram: "📷",
      twitter: "🐦",
      default: "📅",
    };
    return icons[type.toLowerCase()] || icons.default;
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.extendedProps.originalTitle,
      start: event.start,
      type: event.extendedProps.type,
      createdAt: event.extendedProps.createdAt,
      userId: event.extendedProps.userId,
    });
    onOpen();
  };

  const getEventStats = () => {
    const stats = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const eventStats = getEventStats();

  if (loader) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Spinner size="lg" color="secondary" />
          <p className="text-zinc-400 mt-4">Loading your content calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Content Calendar</h1>
            <p className="text-zinc-400">Track your content schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            startContent={<RefreshCw className="w-4 h-4" />}
            color="secondary"
            className="bg-purple-600 hover:bg-purple-700"
            onPress={fetchEvents}
            isLoading={loader}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-white">{events.length}</p>
              </div>
              <Badge
                content={events.length}
                color="secondary"
                className="bg-purple-600"
              >
                <CalendarIcon className="w-6 h-6 text-zinc-400" />
              </Badge>
            </div>
          </CardBody>
        </Card>

        {Object.entries(eventStats).map(([type, count]) => (
          <Card key={type} className="bg-zinc-900/50 border-zinc-800/50">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm capitalize">{type}</p>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </div>
                <div className="text-2xl">{getEventTypeIcon(type)}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Calendar Card */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-semibold text-white">
                Schedule Overview
              </span>
            </div>

            <ButtonGroup variant="bordered" className="border-zinc-700">
              <Button
                size="sm"
                className={`${
                  currentView === "dayGridMonth"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "text-zinc-400 border-zinc-700 hover:border-purple-500"
                }`}
                aria-label="Month view"
                onPress={() => setCurrentView("dayGridMonth")}
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Month</span>
                <span className="not-sr-only">Month</span>
              </Button>
              <Button
                size="sm"
                className={`${
                  currentView === "timeGridWeek"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "text-zinc-400 border-zinc-700 hover:border-purple-500"
                }`}
                aria-label="Week view"
                onPress={() => setCurrentView("timeGridWeek")}
              >
                <Grid3X3 className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Week</span>
                <span className="not-sr-only">Week</span>
              </Button>
              <Button
                size="sm"
                className={`${
                  currentView === "timeGridDay"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "text-zinc-400 border-zinc-700 hover:border-purple-500"
                }`}
                aria-label="Day view"
                onPress={() => setCurrentView("timeGridDay")}
              >
                <List className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Day</span>
                <span className="not-sr-only">Day</span>
              </Button>
            </ButtonGroup>
          </div>
        </CardHeader>

        <Divider className="bg-zinc-800/50" />

        <CardBody className="p-6">
          <div className="calendar-container">
            <FullCalendar
              key={currentView}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              events={formatEvents(events)}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "", // We handle view switching with our custom buttons
              }}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }}
              eventClick={handleEventClick}
              eventDisplay="block"
              height="auto"
              nowIndicator={true}
              editable={false}
              selectable={false}
              weekends={true}
              dayMaxEvents={3}
              eventContent={(eventInfo) => (
                <div className="p-1 text-xs">
                  <div className="flex items-center gap-1">
                    <span>
                      {getEventTypeIcon(eventInfo.event.extendedProps.type)}
                    </span>
                    <span className="font-medium truncate">
                      {eventInfo.event.extendedProps.originalTitle}
                    </span>
                  </div>
                  <div className="text-xs opacity-75">{eventInfo.timeText}</div>
                </div>
              )}
            />
          </div>
        </CardBody>
      </Card>

      {/* Event Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        className="bg-zinc-900 border border-zinc-800"
      >
        <ModalContent>
          <ModalHeader className="text-white border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {selectedEvent && getEventTypeIcon(selectedEvent.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Event Details</h3>
                <p className="text-sm text-zinc-400">
                  Content schedule information
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="py-6">
            {selectedEvent && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-400">
                    Title
                  </label>
                  <p className="text-white mt-1">{selectedEvent.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-400">
                      Platform
                    </label>
                    <div className="mt-1">
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: getEventColor(selectedEvent.type),
                        }}
                        className="text-white"
                      >
                        {selectedEvent.type.toUpperCase()}
                      </Chip>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-400">
                      Scheduled Time
                    </label>
                    <p className="text-white mt-1">
                      {selectedEvent.start.toLocaleDateString()} at{" "}
                      {selectedEvent.start.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {selectedEvent.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-zinc-400">
                      Created
                    </label>
                    <p className="text-white mt-1">
                      {new Date(selectedEvent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </ModalBody>

          <ModalFooter className="border-t border-zinc-800">
            <Button
              variant="bordered"
              onPress={onClose}
              color="secondary"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <style>{`
        .calendar-container .fc {
          background: transparent;
          color: white;
        }
        
        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: rgb(39 39 42 / 0.5);
        }
        
        .calendar-container .fc-col-header-cell {
          background: #1E1E1E;
          color: #9333EA;
          font-weight: 600;
        }
        
        .calendar-container .fc-daygrid-day {
          background: transparent;
        }
        
        .calendar-container .fc-daygrid-day:hover {
          background: rgb(147 51 234 / 0.1);
        }
        
        .calendar-container .fc-day-today {
          background: rgb(147 51 234 / 0.2) !important;
        }
        
        .calendar-container .fc-button {
          background: rgb(39 39 42);
          border-color: rgb(63 63 70);
          color: white;
        }
        
        .calendar-container .fc-button:hover {
          background: rgb(147 51 234);
          border-color: rgb(147 51 234);
        }
        
        .calendar-container .fc-button-active {
          background: rgb(147 51 234) !important;
          border-color: rgb(147 51 234) !important;
        }
        
        .calendar-container .fc-toolbar-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .calendar-container .fc-event {
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
        }
        
        .calendar-container .fc-event:hover {
          opacity: 0.8;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}
