/// <reference types="node" />
import { PrismaClient, Role, ProductType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial users...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@estadios.com' },
    update: {},
    create: {
      name: 'Administrador Estadios',
      email: 'admin@estadios.com',
      dni: '0999999999',
      role: Role.ADMIN,
    },
  });

  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@estadios.com' },
    update: {},
    create: {
      name: 'Juan Perez (Cliente)',
      email: 'cliente@estadios.com',
      dni: '1788888888',
      role: Role.CLIENT,
    },
  });

  await prisma.user.upsert({
    where: { email: 'validador@estadios.com' },
    update: {},
    create: {
      name: 'Carlos Puertas (Validador)',
      email: 'validador@estadios.com',
      dni: '1177777777',
      role: Role.VALIDATOR,
    },
  });

  console.log('Seeding teams and news...');

  const local = await prisma.team.upsert({
    where: { name: 'Liga Deportiva Universitaria' },
    update: {},
    create: { name: 'Liga Deportiva Universitaria', city: 'Quito' },
  });

  const visitante = await prisma.team.upsert({
    where: { name: 'Barcelona SC' },
    update: {},
    create: { name: 'Barcelona SC', city: 'Guayaquil' },
  });

  await prisma.userFavoriteTeam.upsert({
    where: { userId_teamId: { userId: cliente.id, teamId: local.id } },
    update: {},
    create: { userId: cliente.id, teamId: local.id },
  });

  const existingNews = await prisma.news.findFirst({ where: { teamId: local.id } });
  if (!existingNews) {
    await prisma.news.create({
      data: {
        title: `${local.name} presenta su nueva camiseta`,
        content: 'El equipo reveló su indumentaria para la nueva temporada.',
        teamId: local.id,
      },
    });
  }

  console.log('Seeding stadium, sectors and seats...');

  let estadio = await prisma.stadium.findFirst({ where: { name: 'Estadio Rodrigo Paz Delgado' } });
  if (!estadio) {
    estadio = await prisma.stadium.create({
      data: { name: 'Estadio Rodrigo Paz Delgado', city: 'Quito', capacity: 41575 },
    });
  }

  let general = await prisma.sector.findFirst({ where: { stadiumId: estadio.id, name: 'General' } });
  if (!general) {
    general = await prisma.sector.create({ data: { name: 'General', capacity: 200, stadiumId: estadio.id } });
  }

  let preferencia = await prisma.sector.findFirst({ where: { stadiumId: estadio.id, name: 'Preferencia' } });
  if (!preferencia) {
    preferencia = await prisma.sector.create({ data: { name: 'Preferencia', capacity: 100, stadiumId: estadio.id } });
  }

  if ((await prisma.seat.count({ where: { sectorId: general.id } })) === 0) {
    await prisma.seat.createMany({
      data: Array.from({ length: 20 }, (_, i) => ({ row: 'A', number: i + 1, sectorId: general!.id })),
    });
  }

  if ((await prisma.seat.count({ where: { sectorId: preferencia.id } })) === 0) {
    await prisma.seat.createMany({
      data: Array.from({ length: 10 }, (_, i) => ({ row: 'A', number: i + 1, sectorId: preferencia!.id })),
    });
  }

  console.log('Seeding match and sector prices...');

  let match = await prisma.match.findFirst({ where: { homeTeamId: local.id, awayTeamId: visitante.id } });
  if (!match) {
    match = await prisma.match.create({
      data: {
        homeTeamId: local.id,
        awayTeamId: visitante.id,
        stadiumId: estadio.id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // en 7 días
      },
    });
  }

  await prisma.matchSectorPrice.upsert({
    where: { matchId_sectorId: { matchId: match.id, sectorId: general.id } },
    update: {},
    create: { matchId: match.id, sectorId: general.id, price: 15 },
  });

  await prisma.matchSectorPrice.upsert({
    where: { matchId_sectorId: { matchId: match.id, sectorId: preferencia.id } },
    update: {},
    create: { matchId: match.id, sectorId: preferencia.id, price: 35 },
  });

  console.log('Seeding product categories and products...');

  const comida = await prisma.productCategory.upsert({
    where: { name: 'Comida' },
    update: {},
    create: { name: 'Comida' },
  });

  const merch = await prisma.productCategory.upsert({
    where: { name: 'Merchandising' },
    update: {},
    create: { name: 'Merchandising' },
  });

  await prisma.product.createMany({
    data: [
      { name: 'Hot dog', price: 3.5, type: ProductType.FOOD, categoryId: comida.id },
      { name: 'Gaseosa 500ml', price: 2, type: ProductType.FOOD, categoryId: comida.id },
      { name: 'Camiseta oficial', price: 60, type: ProductType.MERCHANDISE, categoryId: merch.id },
      { name: 'Bufanda', price: 15, type: ProductType.MERCHANDISE, categoryId: merch.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completed successfully!');
  console.log({
    users: ['admin@estadios.com', 'cliente@estadios.com', 'validador@estadios.com'],
    teams: [local.name, visitante.name],
    stadium: estadio.name,
    match: `${local.name} vs ${visitante.name}`,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });