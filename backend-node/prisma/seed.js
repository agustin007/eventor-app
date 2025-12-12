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

    // Create Default User
    console.log('[Seed] Creating default user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'demo@eventor.com' },
        update: {},
        create: {
            email: 'demo@eventor.com',
            fullName: 'Demo User',
            password: hashedPassword
        }
    });

    console.log(`[Seed] Created user: ${user.email} / password123`);

    console.log('[Seed] Creating events...');

    const events = [
        // MUSIC
        {
            title: 'Jazz & Tapas en Dadá Mini',
            description: 'Música jazz en vivo en el patio interno más encantador de Córdoba. Disfruta de tapas gourmet y una selección de vinos. Ubicado en la galería San Plácido.',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
            location: 'Dadá Mini - Achával Rodríguez 250, Güemes',
            latitude: -31.4198,
            longitude: -64.1890,
            price: 2800,
            category: 'Music',
            imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Los Fabulosos Cadillacs en Córdoba',
            description: 'La banda icónica argentina regresa con un show épico en el estadio Kempes. No te pierdas los grandes éxitos y temas nuevos.',
            date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000),
            location: 'Estadio Kempes - Av. Cárcano, Alta Córdoba',
            latitude: -31.3711,
            longitude: -64.2418,
            price: 12000,
            category: 'Music',
            imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Folklore Night en La Vieja Esquina',
            description: 'Peña folclórica con artistas locales. Disfruta de empanadas, vino y la mejor música argentina en un ambiente familiar.',
            date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000),
            location: 'La Vieja Esquina - Belgrano 899, Centro',
            latitude: -31.4152,
            longitude: -64.1889,
            price: 1500,
            category: 'Music',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Electronic Session en Green Park',
            description: 'Fiesta electrónica al aire libre con los mejores DJs de la escena local. Ambiente relajado en los jardines del Green Park Hotel.',
            date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000),
            location: 'Green Park Hotel - Av. Amadeo Sabattini 3965',
            latitude: -31.3389,
            longitude: -64.2259,
            price: 3500,
            category: 'Music',
            imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Rock & Blues en Hard Rock Cafe',
            description: 'Bandas tributo a los grandes del rock mundial. Ambiente auténtico con memorabilia del rock.',
            date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
            location: 'Hard Rock Cafe - Paseo del Buen Pastor',
            latitude: -31.4213,
            longitude: -64.1792,
            price: 4200,
            category: 'Music',
            imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=800'
        },

        // PARTY
        {
            title: 'Noche de Cócteles en Apartamento',
            description: 'Experimenta la mejor coctelería de autor en uno de los bares más exclusivos de Güemes. Ambiente sofisticado con diseño interior único.',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
            location: 'Apartamento - Achával Rodríguez 365, Güemes',
            latitude: -31.4201,
            longitude: -64.1888,
            price: 3500,
            category: 'Party',
            imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Fiesta Temática Años 80',
            description: 'Revive los mejores hits de los 80s con DJ especializado, tragos temáticos y premios al mejor disfraz.',
            date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000),
            location: 'Club Social Fernet - Bartolomé Mitre 30, Centro',
            latitude: -31.4173,
            longitude: -64.1887,
            price: 2500,
            category: 'Party',
            imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Rooftop Sunset Party',
            description: 'Fiesta en la terraza con DJs, food trucks gourmet y las mejores vistas de la ciudad. Dress code: casual chic.',
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
            location: 'Terrazas del Abasto - Shopping Abasto, Nueva Córdoba',
            latitude: -31.4257,
            longitude: -64.1799,
            price: 4000,
            category: 'Party',
            imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800'
        },

        // FOOD
        {
            title: 'Degustación de Cervezas Artesanales',
            description: 'Evento especial en Capitán Cervecería con 8 estilos diferentes. Incluye maridaje con picadas premium y charla con el maestro cervecero.',
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
            location: 'Capitán Cervecería - Rondeau 255, Güemes',
            latitude: -31.4200,
            longitude: -64.1892,
            price: 4500,
            category: 'Food',
            imageUrl: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Festival Gastronómico Internacional',
            description: 'Prueba platos de 15 países diferentes preparados por chefs locales. Incluye bebida de bienvenida.',
            date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
            location: 'Patio Olmos - San Juan 1, Centro',
            latitude: -31.4207,
            longitude: -64.1895,
            price: 6000,
            category: 'Food',
            imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Clase Magistral de Cocina Argentina',
            description: 'Aprende a preparar asado perfecto y empanadas cordobesas con un chef profesional. Incluye cena y recetario.',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
            location: 'Escuela de Gastronomía - Av. Hipólito Yrigoyen 555',
            latitude: -31.4112,
            longitude: -64.1943,
            price: 7500,
            category: 'Food',
            imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Wine Tasting Experience',
            description: 'Degustación de 6 vinos premium de bodegas cordobesas. Incluye quesos artesanales y sommelier profesional.',
            date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
            location: 'Vinoteca Tierras - Av. General Paz 145',
            latitude: -31.4168,
            longitude: -64.1703,
            price: 5500,
            category: 'Food',
            imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800'
        },

        // CULTURE
        {
            title: 'Noche de los Museos 2025',
            description: 'Recorre +50 espacios culturales de forma gratuita en una noche mágica. Música, arte y actividades para toda la familia.',
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
            location: 'Diversos puntos - Centro de Córdoba',
            latitude: -31.4201,
            longitude: -64.1888,
            price: 0,
            category: 'Culture',
            imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Obra de Teatro: "Esperando la Carroza"',
            description: 'El clásico argentino vuelve con elenco local. Una comedia imperdible que te hará reír de principio a fin.',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000),
            location: 'Teatro del Libertador - Av. Vélez Sarsfield 365',
            latitude: -31.4164,
            longitude: -64.1829,
            price: 3800,
            category: 'Culture',
            imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Exposición de Arte Contemporáneo',
            description: 'Muestra colectiva de 20 artistas cordobeses emergentes. Vernissage con vino y música en vivo.',
            date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
            location: 'Centro Cultural España - La Rioja 250',
            latitude: -31.4195,
            longitude: -64.1871,
            price: 1000,
            category: 'Culture',
            imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Festival de Cine Independiente',
            description: 'Tres días de proyecciones de cine argentino e internacional. Incluye charlas con directores.',
            date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
            location: 'Cineclub Municipal - Bv. San Juan 49',
            latitude: -31.4199,
            longitude: -64.1873,
            price: 2200,
            category: 'Culture',
            imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
        },

        // SPORTS
        {
            title: 'Maratón de Córdoba 2025',
            description: '42K, 21K y 10K por las calles más emblemáticas de la ciudad. Para todos los niveles.',
            date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
            location: 'Partida: Plaza San Martín',
            latitude: -31.4203,
            longitude: -64.1887,
            price: 3000,
            category: 'Sports',
            imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Torneo de Pádel Amateur',
            description: 'Torneo abierto para todas las categorías. Premios para ganadores y sorteos de equipamiento deportivo.',
            date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
            location: 'Club Atlético Belgrano - Calle Arturo Orgaz',
            latitude: -31.3852,
            longitude: -64.2442,
            price: 2500,
            category: 'Sports',
            imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Clase de Yoga al Amanecer',
            description: 'Sesión de yoga en el Parque Sarmiento con vista al lago. Incluye meditación y desayuno saludable.',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
            location: 'Parque Sarmiento - Sector Lago',
            latitude: -31.4024,
            longitude: -64.2347,
            price: 800,
            category: 'Sports',
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Cicletada Nocturna por Nueva Córdoba',
            description: 'Recorrido de 15km por los principales bulevares de la ciudad. Incluye remera del evento y hidratación.',
            date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
            location: 'Salida: Paseo del Buen Pastor',
            latitude: -31.4213,
            longitude: -64.1792,
            price: 1200,
            category: 'Sports',
            imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800'
        },

        // MORE VARIETY
        {
            title: 'Stand Up Comedy Night',
            description: 'Los mejores comediantes de Córdoba en una noche de risas. Incluye consumición.',
            date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
            location: 'Comedy Bar - Humberto Primo 670',
            latitude: -31.4211,
            longitude: -64.1903,
            price: 3200,
            category: 'Culture',
            imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Feria de Diseño Independiente',
            description: 'Más de 80 emprendedores locales de moda, deco y accesorios. Música en vivo y foodtrucks.',
            date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
            location: 'Paseo de las Artes - Rodriguez Peña 540',
            latitude: -31.4145,
            longitude: -64.1835,
            price: 500,
            category: 'Culture',
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Milonga en Salón Azul',
            description: 'Noche de tango con orquesta en vivo. Clase previa para principiantes incluida.',
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000),
            location: 'Salón Azul - 9 de Julio 330',
            latitude: -31.4177,
            longitude: -64.1876,
            price: 2000,
            category: 'Music',
            imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: 'Brunch Dominical con Música en Vivo',
            description: 'Buffet gourmet ilimitado con música acústica. Ambiente familiar en el corazón de Güemes.',
            date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
            location: 'Casa Pueblito - Ituzaingó 208, Güemes',
            latitude: -31.4187,
            longitude: -64.1879,
            price: 6500,
            category: 'Food',
            imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=800'
        }
    ];

    for (const event of events) {
        await prisma.event.create({ data: event });
    }

    // Create Tickets (Mock Sales)
    console.log('[Seed] Creating tickets...');

    // 1. Give Demo User some tickets
    const demoUser = await prisma.user.findUnique({ where: { email: 'demo@eventor.com' } });
    const allEvents = await prisma.event.findMany();

    if (demoUser && allEvents.length > 0) {
        // Buy tickets for first 3 events
        for (let i = 0; i < 3; i++) {
            await prisma.ticket.create({
                data: {
                    userId: demoUser.id,
                    eventId: allEvents[i].id,
                    qrCode: `mock-qr-${i}`,
                    status: 'VALID'
                }
            });
        }
    }

    // 2. Add random sales to events (for Dashboard Stats)
    // We need to create random users or just assign to demo for now?
    // Dashboard counts tickets by event.tickets.length.
    // If we want "Sales" on dashboard, we need tickets linked to events.
    // We can link them to the demo user for simplicity, or create a dummy buyer.

    // Create a dummy buyer
    const dummyBuyer = await prisma.user.upsert({
        where: { email: 'buyer@test.com' },
        update: {},
        create: { email: 'buyer@test.com', password: 'hash', fullName: 'Random Buyer' }
    });

    // Add 5-20 tickets to each event (to show sales volume)
    for (const event of allEvents) {
        const salesCount = Math.floor(Math.random() * 15) + 5;
        for (let k = 0; k < salesCount; k++) {
            await prisma.ticket.create({
                data: {
                    userId: dummyBuyer.id,
                    eventId: event.id,
                    qrCode: `auto-qr-${event.id}-${k}`,
                    status: 'VALID'
                }
            });
        }
    }

    console.log(`[Seed] Created ${events.length} events and mock tickets successfully!`);
}

main()
    .catch((e) => {
        console.error('[Seed] Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
