require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('[Seed] Starting database seed...');

    // Check if events already exist
    const existingEvents = await prisma.event.count();
    if (existingEvents > 0) {
        console.log('[Seed] Database already seeded. Skipping...');
        return;
    }

    console.log('[Seed] Creating events...');

    const events = [
        {
            title: 'Noche de Cócteles en Apartamento',
            description: 'Experimenta la mejor coctelería de autor en uno de los bares más exclusivos de Güemes. Ambiente sofisticado con diseño interior único y una extensa carta de tragos premium.',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000),
            location: 'Apartamento - Achával Rodríguez 365, Güemes',
            latitude: -31.4201,
            longitude: -64.1888,
            price: 3500,
            category: 'Party',
            imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Jazz & Tapas en Dadá Mini',
            description: 'Música jazz en vivo en el patio interno más encantador de Córdoba. Disfruta de tapas gourmet y una selección de vinos. Ubicado en la galería San Plácido.',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
            location: 'Dadá Mini - Achával Rodríguez 250, Güemes',
            latitude: -31.4198,
            longitude: -64.1890,
            price: 2800,
            category: 'Music',
            imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Degustación de Cervezas Artesanales',
            description: 'Evento especial en Capitán Cervecería con 8 estilos diferentes de cerveza tirada. Incluye maridaje con picadas premium y charla con el maestro cervecero.',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
            location: 'Capitán - Galería Barrio, Güemes',
            latitude: -31.4200,
            longitude: -64.1892,
            price: 4500,
            category: 'Food',
            imageUrl: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&q=80&w=800'
        },
        // Add more events as needed...
    ];

    for (const event of events) {
        await prisma.event.create({ data: event });
    }

    console.log(`[Seed] Created ${events.length} events successfully!`);
}

main()
    .catch((e) => {
        console.error('[Seed] Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
