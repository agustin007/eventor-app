using EventosCba.API.Data;
using EventosCba.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EventosCba.API.Seeders
{
    public static class DataSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            if (context.Events.Any())
            {
                return;   // DB has been seeded
            }

            var events = new List<Event>
            {
                // GÜEMES - Bares y Vida Nocturna
                new Event
                {
                    Title = "Noche de Cócteles en Apartamento",
                    Description = "Experimenta la mejor coctelería de autor en uno de los bares más exclusivos de Güemes. Ambiente sofisticado con diseño interior único y una extensa carta de tragos premium.",
                    Date = DateTime.UtcNow.AddDays(2).AddHours(21),
                    Location = "Apartamento - Achával Rodríguez 365, Güemes",
                    Latitude = -31.4201,
                    Longitude = -64.1888,
                    Price = 3500,
                    Category = "Party",
                    ImageUrl = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Jazz & Tapas en Dadá Mini",
                    Description = "Música jazz en vivo en el patio interno más encantador de Córdoba. Disfruta de tapas gourmet y una selección de vinos. Ubicado en la galería San Plácido.",
                    Date = DateTime.UtcNow.AddDays(5).AddHours(20),
                    Location = "Dadá Mini - Achával Rodríguez 250, Güemes",
                    Latitude = -31.4198,
                    Longitude = -64.1890,
                    Price = 2800,
                    Category = "Music",
                    ImageUrl = "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Degustación de Cervezas Artesanales",
                    Description = "Evento especial en Capitán Cervecería con 8 estilos diferentes de cerveza tirada. Incluye maridaje con picadas premium y charla con el maestro cervecero.",
                    Date = DateTime.UtcNow.AddDays(7).AddHours(19),
                    Location = "Capitán - Galería Barrio, Güemes",
                    Latitude = -31.4200,
                    Longitude = -64.1892,
                    Price = 4500,
                    Category = "Food",
                    ImageUrl = "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "After Office en Chilli Street Food",
                    Description = "After office con música en vivo, coctelería de autor y lo mejor de la comida street food. DJ invitado y promociones especiales hasta las 22:00.",
                    Date = DateTime.UtcNow.AddDays(1).AddHours(19),
                    Location = "Chilli Street Food - Fructuoso Rivera 273, Güemes",
                    Latitude = -31.4203,
                    Longitude = -64.1886,
                    Price = 2000,
                    Category = "Party",
                    ImageUrl = "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800"
                },
                
                // NUEVA CÓRDOBA - Cultura y Gastronomía
                new Event
                {
                    Title = "Cóctel Tiki Night en Holbox",
                    Description = "Transporte hacia una isla exótica con los mejores cócteles Tiki de Córdoba. Música tropical, decoración temática y gastronomía caribeña.",
                    Date = DateTime.UtcNow.AddDays(3).AddHours(21),
                    Location = "Holbox - Buenos Aires 478, Nueva Córdoba",
                    Latitude = -31.4220,
                    Longitude = -64.1885,
                    Price = 3200,
                    Category = "Party",
                    ImageUrl = "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Noche de Vinos en Astor",
                    Description = "Degustación exclusiva de vinos argentinos en el bar del Teatro San Martín. Incluye maridaje con platos de autor y presentación de sommelier.",
                    Date = DateTime.UtcNow.AddDays(9).AddHours(20),
                    Location = "Astor - Av. Vélez Sarsfield 365, Nueva Córdoba",
                    Latitude = -31.4234,
                    Longitude = -64.1867,
                    Price = 5500,
                    Category = "Food",
                    ImageUrl = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Brunch Dominical en Cientovolando",
                    Description = "El mejor brunch de la ciudad con opciones sweet y savory. Incluye mimosas o bloody mary de cortesía. Música chill out ambiente.",
                    Date = DateTime.UtcNow.AddDays(6).AddHours(11),
                    Location = "Cientovolando - Rondeau 515, Nueva Córdoba",
                    Latitude = -31.4215,
                    Longitude = -64.1878,
                    Price = 4200,
                    Category = "Food",
                    ImageUrl = "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800"
                },
                
                // CENTRO - Cultura y Eventos
                new Event
                {
                    Title = "Concierto Sinfónico - Teatro del Libertador",
                    Description = "Orquesta Sinfónica Provincial presenta un repertorio clásico especial. Obras de Mozart, Beethoven y compositores argentinos contemporáneos.",
                    Date = DateTime.UtcNow.AddDays(14).AddHours(20),
                    Location = "Teatro del Libertador - Av. Vélez Sarsfield 365",
                    Latitude = -31.4165,
                    Longitude = -64.1835,
                    Price = 6000,
                    Category = "Music",
                    ImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Feria de Arte Urbano en Cabildo",
                    Description = "Exposición y venta de obras de arte urbano local. Incluye murales en vivo, talleres de graffiti y música de DJs. Entrada libre.",
                    Date = DateTime.UtcNow.AddDays(4).AddHours(17),
                    Location = "Cabildo de Córdoba - Plaza San Martín",
                    Latitude = -31.4170,
                    Longitude = -64.1838,
                    Price = 0,
                    Category = "Art",
                    ImageUrl = "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Aguas Danzantes - Paseo del Buen Pastor",
                    Description = "Espectáculo de aguas danzantes sincronizadas con música clásica y moderna. Incluye show de luces LED. Ideal para toda la familia.",
                    Date = DateTime.UtcNow.AddDays(1).AddHours(20),
                    Location = "Paseo del Buen Pastor - Av. Hipólito Yrigoyen 325",
                    Latitude = -31.4210,
                    Longitude = -64.1873,
                    Price = 0,
                    Category = "Art",
                    ImageUrl = "https://images.unsplash.com/photo-1533761523072-f08b324e6f1f?auto=format&fit=crop&q=80&w=800"
                },
                
                // TECH & NETWORKING
                new Event
                {
                    Title = "Tech Meetup: IA y Desarrollo Web",
                    Description = "Networking para desarrolladores y tech enthusiasts. Charlas sobre IA, Machine Learning y las últimas tecnologías web. Incluye pizza y cerveza.",
                    Date = DateTime.UtcNow.AddDays(8).AddHours(18),
                    Location = "Espacio de Cowork - Obispo Trejo 323",
                    Latitude = -31.4180,
                    Longitude = -64.1850,
                    Price = 1500,
                    Category = "Tech",
                    ImageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
                },
                
                // NATURALEZA & OUTDOOR
                new Event
                {
                    Title = "Trekking a La Calera con Guía",
                    Description = "Caminata guiada por los senderos de las sierras de La Calera. Nivel medio. Incluye transporte ida y vuelta, guía profesional y lunch. Cupos limitados.",
                    Date = DateTime.UtcNow.AddDays(10).AddHours(8),
                    Location = "Punto de encuentro: Terminal de Ómnibus",
                    Latitude = -31.4240,
                    Longitude = -64.1910,
                    Price = 3800,
                    Category = "Nature",
                    ImageUrl = "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Sunset Yoga en Parque Sarmiento",
                    Description = "Clase de yoga al atardecer con vista al lago. Nivel principiante-intermedio. Trae tu mat. Donation based, fondos para comunidad local.",
                    Date = DateTime.UtcNow.AddDays(3).AddHours(18),
                    Location = "Parque Sarmiento - Sector Lago",
                    Latitude = -31.4050,
                    Longitude = -64.1950,
                    Price = 0,
                    Category = "Nature",
                    ImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
                },
                
                // ADICIONALES
                new Event
                {
                    Title = "Mercado de Pulgas Vintage",
                    Description = "Feria de antigüedades, ropa vintage, vinilos y artesanías. Food trucks, música en vivo y buen ambiente. Todos los sábados del mes.",
                    Date = DateTime.UtcNow.AddDays(5).AddHours(10),
                    Location = "Plaza Colón, Alberdi",
                    Latitude = -31.4089,
                    Longitude = -64.1987,
                    Price = 0,
                    Category = "Art",
                    ImageUrl = "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800"
                },
                new Event
                {
                    Title = "Pizza Party & Board Games",
                    Description = "Noche de pizzas artesanales y juegos de mesa en Pibi. Torneos de juegos clásicos y modernos. Premios para los ganadores.",
                    Date = DateTime.UtcNow.AddDays(4).AddHours(20),
                    Location = "Pibi Pizzería - Galería Barrio, Güemes",
                    Latitude = -31.4201,
                    Longitude = -64.1891,
                    Price = 2500,
                    Category = "Food",
                    ImageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"
                }
            };

            context.Events.AddRange(events);
            context.SaveChanges();
        }
    }
}
