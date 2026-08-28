import { action, page, query, route, type Spec } from "@wasp.sh/spec";

import { BusRoutesList } from "./components/BusRoutesList" with { type: "ref" };
import { BusSchedulePicker } from "./components/BusSchedulePicker" with { type: "ref" };
import { BusSeatMap } from "./components/BusSeatMap" with { type: "ref" };
import { BusTicketWallet } from "./components/BusTicketWallet" with { type: "ref" };
import {
  cancelBusTicket,
  getBusRoutes,
  getSchedulesByRoute,
  getSeatMap,
  getUserBusTickets,
  purchaseBusTicket,
  validateBusBoarding,
} from "./operations" with { type: "ref" };

export const busesSpec: Spec = [
  route("BusRoutesRoute", "/buses", page(BusRoutesList, { authRequired: true })),
  route(
    "BusScheduleRoute",
    "/buses/:routeSlug/schedules",
    page(BusSchedulePicker, { authRequired: true }),
  ),
  route(
    "BusSeatMapRoute",
    "/buses/:scheduleId/seats",
    page(BusSeatMap, { authRequired: true }),
  ),
  route(
    "BusTicketRoute",
    "/buses/ticket/:ticketId",
    page(BusTicketWallet, { authRequired: true }),
  ),
  query(getBusRoutes, { entities: ["BusRoute", "BusSchedule"] }),
  query(getSchedulesByRoute, { entities: ["BusSchedule", "BusTicket"] }),
  query(getSeatMap, { entities: ["BusTicket"] }),
  query(getUserBusTickets, { entities: ["BusTicket", "BusSchedule", "BusRoute"] }),
  action(purchaseBusTicket, { entities: ["BusTicket", "User"] }),
  action(validateBusBoarding, { entities: ["BusTicket"] }),
  action(cancelBusTicket, { entities: ["BusTicket"] }),
];
