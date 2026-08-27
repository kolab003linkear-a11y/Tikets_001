import express from 'express';
import cors from 'cors';
import { UserController } from './user.controller.js';
import { StadiumController } from './stadium.controller.js';
import { EventController } from './event.controller.js';
import { TeamController, NewsController } from './team.controller.js';
import { SectorController, SeatController, MatchController, MatchSectorPriceController } from './match.controller.js';
import { PurchaseController, TicketController, TicketTransferController } from './ticket.controller.js';
import { ProductCategoryController, ProductController, OrderController } from './product.controller.js';
import { SupportTicketController, TicketRequestController } from './support.controller.js';
import { MatchStatController, ReminderController } from './stat.controller.js';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Rutas de comprobación
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Estadios API', timestamp: new Date() });
  });

  // Rutas de Usuarios
  app.get('/api/users', UserController.getUsers);
  app.get('/api/users/:id', UserController.getUserById);

  // Rutas de Estadios (CRUD)
  app.get('/api/stadiums', StadiumController.getAll);
  app.get('/api/stadiums/:id', StadiumController.getById);
  app.post('/api/stadiums', StadiumController.create);
  app.put('/api/stadiums/:id', StadiumController.update);
  app.delete('/api/stadiums/:id', StadiumController.delete);

  // Rutas de Eventos (CRUD) — legacy, se mantiene mientras se migra a Matches
  app.get('/api/events', EventController.getEvents);
  app.get('/api/events/:id', EventController.getEventById);
  app.post('/api/events', EventController.createEvent);
  app.delete('/api/events/:id', EventController.deleteEvent);

  // Rutas de Equipos
  app.get('/api/teams', TeamController.getAll);
  app.get('/api/teams/:id', TeamController.getById);
  app.post('/api/teams', TeamController.create);
  app.put('/api/teams/:id', TeamController.update);
  app.delete('/api/teams/:id', TeamController.delete);

  // Rutas de Noticias
  app.get('/api/news', NewsController.getAll);
  app.get('/api/news/:id', NewsController.getById);
  app.post('/api/news', NewsController.create);
  app.put('/api/news/:id', NewsController.update);
  app.delete('/api/news/:id', NewsController.delete);

  // Rutas de Sectores
  app.get('/api/stadiums/:stadiumId/sectors', SectorController.getAllByStadium);
  app.get('/api/sectors/:id', SectorController.getById);
  app.post('/api/sectors', SectorController.create);
  app.put('/api/sectors/:id', SectorController.update);
  app.delete('/api/sectors/:id', SectorController.delete);

  // Rutas de Asientos
  app.get('/api/sectors/:sectorId/seats', SeatController.getAllBySector);
  app.post('/api/seats', SeatController.create);
  app.post('/api/sectors/:sectorId/seats/bulk', SeatController.createBulk);
  app.delete('/api/seats/:id', SeatController.delete);

  // Rutas de Partidos
  app.get('/api/matches', MatchController.getAll);
  app.get('/api/matches/:id', MatchController.getById);
  app.post('/api/matches', MatchController.create);
  app.patch('/api/matches/:id/status', MatchController.updateStatus);
  app.delete('/api/matches/:id', MatchController.delete);

  // Rutas de Precios por Sector y Partido
  app.get('/api/matches/:matchId/sector-prices', MatchSectorPriceController.getByMatch);
  app.post('/api/matches/:matchId/sector-prices', MatchSectorPriceController.setPrice);

  // Rutas de Compras
  app.post('/api/purchases', PurchaseController.create);
  app.get('/api/users/:userId/purchases', PurchaseController.getByUser);

  // Rutas de Tickets
  app.get('/api/users/:userId/tickets', TicketController.getByUser);
  app.get('/api/tickets/qr/:qrCode', TicketController.getByQrCode);
  app.post('/api/tickets/qr/:qrCode/validate', TicketController.validate);

  // Rutas de Transferencias de Tickets
  app.post('/api/ticket-transfers', TicketTransferController.create);
  app.patch('/api/ticket-transfers/:id/accept', TicketTransferController.accept);
  app.patch('/api/ticket-transfers/:id/reject', TicketTransferController.reject);

  // Rutas de Categorías de Producto
  app.get('/api/product-categories', ProductCategoryController.getAll);
  app.post('/api/product-categories', ProductCategoryController.create);
  app.put('/api/product-categories/:id', ProductCategoryController.update);
  app.delete('/api/product-categories/:id', ProductCategoryController.delete);

  // Rutas de Productos
  app.get('/api/products', ProductController.getAll);
  app.get('/api/products/:id', ProductController.getById);
  app.post('/api/products', ProductController.create);
  app.put('/api/products/:id', ProductController.update);
  app.delete('/api/products/:id', ProductController.delete);

  // Rutas de Pedidos
  app.get('/api/users/:userId/orders', OrderController.getByUser);
  app.get('/api/orders/:id', OrderController.getById);
  app.post('/api/orders', OrderController.create);
  app.patch('/api/orders/:id/status', OrderController.updateStatus);

  // Rutas de Soporte
  app.get('/api/support', SupportTicketController.getAll);
  app.get('/api/users/:userId/support', SupportTicketController.getByUser);
  app.get('/api/support/:id', SupportTicketController.getById);
  app.post('/api/support', SupportTicketController.create);
  app.patch('/api/support/:id/status', SupportTicketController.updateStatus);

  // Rutas de Solicitudes (reembolsos/cambios)
  app.get('/api/support/:supportTicketId/requests', TicketRequestController.getBySupportTicket);
  app.post('/api/support-requests', TicketRequestController.create);
  app.patch('/api/support-requests/:id/status', TicketRequestController.updateStatus);

  // Rutas de Estadísticas
  app.get('/api/matches/:matchId/stats', MatchStatController.getByMatch);
  app.post('/api/stats', MatchStatController.add);
  app.delete('/api/stats/:id', MatchStatController.delete);

  // Rutas de Recordatorios
  app.get('/api/users/:userId/reminders', ReminderController.getByUser);
  app.post('/api/reminders', ReminderController.create);
  app.delete('/api/reminders/:id', ReminderController.delete);

  return app;
}