import { action, page, query, route, type Spec } from "@wasp.sh/spec";

import { AnalyticsDashboardPage } from "./dashboards/analytics/AnalyticsDashboardPage" with { type: "ref" };
import { ConcessionsAdminPage } from "./dashboards/concessions/ConcessionsAdminPage" with { type: "ref" };
import { EventsAdminPage } from "./dashboards/events/EventsAdminPage" with { type: "ref" };
import { MessagesPage } from "./dashboards/messages/MessagesPage" with { type: "ref" };
import { ParkingAdminPage } from "./dashboards/parking/ParkingAdminPage" with { type: "ref" };
import { TransitAdminPage } from "./dashboards/transit/TransitAdminPage" with { type: "ref" };
import { UsersDashboardPage } from "./dashboards/users/UsersDashboardPage" with { type: "ref" };
import { CalendarPage } from "./elements/calendar/CalendarPage" with { type: "ref" };
import { SettingsPage } from "./elements/settings/SettingsPage" with { type: "ref" };
import { ButtonsPage } from "./elements/ui-elements/ButtonsPage" with { type: "ref" };

import {
  createOrUpdateStadiumVenue,
  getAdminConcessionsStatsAndOrders,
  updateConcessionOrderStatus,
} from "../concessions/operations" with { type: "ref" };
import {
  createOrUpdateParkingFacility,
  getAdminParkingStatsAndFacilities,
  manualCloseParkingSession,
} from "../parking/operations" with { type: "ref" };
import {
  createAdminTicket,
  getAdminTicketsAndStats,
  updateAdminTicketStatus,
} from "../ticketing/operations" with { type: "ref" };
import {
  createAdminTransitTrip,
  createOrUpdateTransitRoute,
  getAdminTransitStatsAndRoutes,
  updateTransitTripStatus,
} from "../transit/operations" with { type: "ref" };
import { getAdminGlobalSummaryStats } from "./operations" with { type: "ref" };

export const adminSpec: Spec = [
  route(
    "AdminRoute",
    "/admin",
    page(AnalyticsDashboardPage, { authRequired: true }),
  ),
  route(
    "AdminUsersRoute",
    "/admin/users",
    page(UsersDashboardPage, { authRequired: true }),
  ),
  route(
    "AdminEventsRoute",
    "/admin/events",
    page(EventsAdminPage, { authRequired: true }),
  ),
  route(
    "AdminParkingRoute",
    "/admin/parking",
    page(ParkingAdminPage, { authRequired: true }),
  ),
  route(
    "AdminTransitRoute",
    "/admin/transit",
    page(TransitAdminPage, { authRequired: true }),
  ),
  route(
    "AdminConcessionsRoute",
    "/admin/concessions",
    page(ConcessionsAdminPage, { authRequired: true }),
  ),
  route(
    "AdminSettingsRoute",
    "/admin/settings",
    page(SettingsPage, { authRequired: true }),
  ),
  route(
    "AdminCalendarRoute",
    "/admin/calendar",
    page(CalendarPage, { authRequired: true }),
  ),
  route(
    "AdminUIButtonsRoute",
    "/admin/ui/buttons",
    page(ButtonsPage, { authRequired: true }),
  ),
  route(
    "AdminMessagesRoute",
    "/admin/messages",
    page(MessagesPage, { authRequired: true }),
  ),
  query(getAdminGlobalSummaryStats, {
    entities: [
      "User",
      "Ticket",
      "ParkingFacility",
      "ParkingSession",
      "TransitTrip",
      "ConcessionOrder",
    ],
  }),

  query(getAdminTicketsAndStats, { entities: ["Ticket", "User"] }),
  action(createAdminTicket, { entities: ["Ticket", "User"] }),
  action(updateAdminTicketStatus, { entities: ["Ticket"] }),

  query(getAdminParkingStatsAndFacilities, {
    entities: ["ParkingFacility", "ParkingSession", "LPRVehicle", "User"],
  }),
  action(createOrUpdateParkingFacility, { entities: ["ParkingFacility"] }),
  action(manualCloseParkingSession, {
    entities: ["ParkingSession", "ParkingFacility"],
  }),

  query(getAdminTransitStatsAndRoutes, {
    entities: ["TransitRoute", "TransitTrip", "PassengerManifestEntry"],
  }),
  action(createOrUpdateTransitRoute, { entities: ["TransitRoute"] }),
  action(createAdminTransitTrip, { entities: ["TransitTrip", "TransitRoute"] }),
  action(updateTransitTripStatus, { entities: ["TransitTrip"] }),

  query(getAdminConcessionsStatsAndOrders, {
    entities: ["InStadiumVenue", "ConcessionOrder", "User", "Ticket"],
  }),
  action(createOrUpdateStadiumVenue, { entities: ["InStadiumVenue"] }),
  action(updateConcessionOrderStatus, { entities: ["ConcessionOrder"] }),
];
