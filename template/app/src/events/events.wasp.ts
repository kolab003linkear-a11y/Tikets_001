import { action, query, type Spec } from "@wasp.sh/spec";

import {
  createEvent,
  getEvents,
  toggleEventPublication,
  updateTicketCapacity,
} from "./operations" with { type: "ref" };

export const eventsSpec: Spec = [
  query(getEvents, { entities: ["Event", "EventTicketType"] }),
  action(createEvent, { entities: ["Event", "EventTicketType"] }),
  action(toggleEventPublication, { entities: ["Event"] }),
  action(updateTicketCapacity, { entities: ["EventTicketType"] }),
];
