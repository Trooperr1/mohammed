import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.modifier.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log("Creating users...");
  const hashedPin = await bcrypt.hash("1234", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@swisspos.ch",
      name: "Admin User",
      pin: hashedPin,
      role: "ADMIN",
      active: true,
    },
  });

  const waiter1 = await prisma.user.create({
    data: {
      email: "hans@swisspos.ch",
      name: "Hans Müller",
      pin: hashedPin,
      role: "WAITER",
      active: true,
    },
  });

  const waiter2 = await prisma.user.create({
    data: {
      email: "marie@swisspos.ch",
      name: "Marie Dubois",
      pin: hashedPin,
      role: "WAITER",
      active: true,
    },
  });

  const kitchen = await prisma.user.create({
    data: {
      email: "kitchen@swisspos.ch",
      name: "Kitchen Staff",
      pin: hashedPin,
      role: "KITCHEN",
      active: true,
    },
  });

  // Create Tables
  console.log("Creating tables...");
  const tables = [];
  for (let i = 1; i <= 20; i++) {
    const section = i <= 10 ? "indoor" : i <= 15 ? "outdoor" : "bar";
    const capacity = i <= 15 ? (i % 2 === 0 ? 4 : 2) : 2;

    tables.push(
      await prisma.table.create({
        data: {
          number: i,
          capacity,
          section,
          status: "AVAILABLE",
          x: (i - 1) % 5 * 150 + 50,
          y: Math.floor((i - 1) / 5) * 150 + 50,
        },
      })
    );
  }

  // Create Categories
  console.log("Creating categories...");

  const categories = {
    pizza: await prisma.category.create({
      data: {
        name: "Pizza",
        nameDE: "Pizza",
        nameFR: "Pizza",
        nameIT: "Pizza",
        sortOrder: 1,
        active: true,
      },
    }),
    pasta: await prisma.category.create({
      data: {
        name: "Pasta",
        nameDE: "Pasta",
        nameFR: "Pâtes",
        nameIT: "Pasta",
        sortOrder: 2,
        active: true,
      },
    }),
    salads: await prisma.category.create({
      data: {
        name: "Salads",
        nameDE: "Salate",
        nameFR: "Salades",
        nameIT: "Insalate",
        sortOrder: 3,
        active: true,
      },
    }),
    swiss: await prisma.category.create({
      data: {
        name: "Swiss Specialties",
        nameDE: "Schweizer Spezialitäten",
        nameFR: "Spécialités suisses",
        nameIT: "Specialità svizzere",
        sortOrder: 4,
        active: true,
      },
    }),
    drinks: await prisma.category.create({
      data: {
        name: "Drinks",
        nameDE: "Getränke",
        nameFR: "Boissons",
        nameIT: "Bevande",
        sortOrder: 5,
        active: true,
      },
    }),
    desserts: await prisma.category.create({
      data: {
        name: "Desserts",
        nameDE: "Desserts",
        nameFR: "Desserts",
        nameIT: "Dolci",
        sortOrder: 6,
        active: true,
      },
    }),
  };

  // Create Menu Items - Pizza
  console.log("Creating menu items...");

  await prisma.menuItem.createMany({
    data: [
      // Pizzas
      {
        name: "Margherita",
        nameDE: "Margherita",
        nameFR: "Margherita",
        nameIT: "Margherita",
        description: "Tomato sauce, mozzarella, basil",
        descriptionDE: "Tomatensauce, Mozzarella, Basilikum",
        descriptionFR: "Sauce tomate, mozzarella, basilic",
        descriptionIT: "Salsa di pomodoro, mozzarella, basilico",
        price: 16.50,
        vatRate: "STANDARD",
        categoryId: categories.pizza.id,
        preparationTime: 15,
        available: true,
        allergens: ["gluten", "dairy"],
      },
      {
        name: "Prosciutto",
        nameDE: "Prosciutto",
        nameFR: "Jambon",
        nameIT: "Prosciutto",
        description: "Tomato sauce, mozzarella, ham",
        descriptionDE: "Tomatensauce, Mozzarella, Schinken",
        descriptionFR: "Sauce tomate, mozzarella, jambon",
        descriptionIT: "Salsa di pomodoro, mozzarella, prosciutto",
        price: 19.50,
        vatRate: "STANDARD",
        categoryId: categories.pizza.id,
        preparationTime: 15,
        available: true,
        allergens: ["gluten", "dairy"],
      },
      {
        name: "Quattro Formaggi",
        nameDE: "Vier Käse",
        nameFR: "Quatre fromages",
        nameIT: "Quattro Formaggi",
        description: "Mozzarella, gorgonzola, parmesan, goat cheese",
        descriptionDE: "Mozzarella, Gorgonzola, Parmesan, Ziegenkäse",
        descriptionFR: "Mozzarella, gorgonzola, parmesan, chèvre",
        descriptionIT: "Mozzarella, gorgonzola, parmigiano, caprino",
        price: 21.00,
        vatRate: "STANDARD",
        categoryId: categories.pizza.id,
        preparationTime: 15,
        available: true,
        allergens: ["gluten", "dairy"],
      },

      // Pasta
      {
        name: "Spaghetti Carbonara",
        nameDE: "Spaghetti Carbonara",
        nameFR: "Spaghetti Carbonara",
        nameIT: "Spaghetti alla Carbonara",
        description: "Eggs, bacon, parmesan, black pepper",
        descriptionDE: "Eier, Speck, Parmesan, schwarzer Pfeffer",
        descriptionFR: "Œufs, bacon, parmesan, poivre noir",
        descriptionIT: "Uova, pancetta, parmigiano, pepe nero",
        price: 22.00,
        vatRate: "STANDARD",
        categoryId: categories.pasta.id,
        preparationTime: 12,
        available: true,
        allergens: ["gluten", "dairy", "eggs"],
      },
      {
        name: "Penne Arrabiata",
        nameDE: "Penne Arrabiata",
        nameFR: "Penne Arrabiata",
        nameIT: "Penne all'Arrabiata",
        description: "Spicy tomato sauce, garlic, chili",
        descriptionDE: "Scharfe Tomatensauce, Knoblauch, Chili",
        descriptionFR: "Sauce tomate épicée, ail, piment",
        descriptionIT: "Salsa di pomodoro piccante, aglio, peperoncino",
        price: 19.50,
        vatRate: "STANDARD",
        categoryId: categories.pasta.id,
        preparationTime: 12,
        available: true,
        allergens: ["gluten"],
      },

      // Salads
      {
        name: "Caesar Salad",
        nameDE: "Caesar Salat",
        nameFR: "Salade César",
        nameIT: "Insalata Caesar",
        description: "Romaine lettuce, chicken, croutons, parmesan, Caesar dressing",
        descriptionDE: "Römersalat, Hähnchen, Croutons, Parmesan, Caesar-Dressing",
        descriptionFR: "Laitue romaine, poulet, croûtons, parmesan, sauce César",
        descriptionIT: "Lattuga romana, pollo, crostini, parmigiano, salsa Caesar",
        price: 18.50,
        vatRate: "REDUCED",
        categoryId: categories.salads.id,
        preparationTime: 8,
        available: true,
        allergens: ["gluten", "dairy", "eggs"],
      },
      {
        name: "Mixed Green Salad",
        nameDE: "Gemischter Grüner Salat",
        nameFR: "Salade verte mixte",
        nameIT: "Insalata mista verde",
        description: "Mixed greens, tomatoes, cucumber, olive oil",
        descriptionDE: "Gemischtes Grün, Tomaten, Gurke, Olivenöl",
        descriptionFR: "Verdures mélangées, tomates, concombre, huile d'olive",
        descriptionIT: "Verdure miste, pomodori, cetriolo, olio d'oliva",
        price: 12.50,
        vatRate: "REDUCED",
        categoryId: categories.salads.id,
        preparationTime: 5,
        available: true,
        allergens: [],
      },

      // Swiss Specialties
      {
        name: "Cheese Fondue",
        nameDE: "Käsefondue",
        nameFR: "Fondue au fromage",
        nameIT: "Fonduta di formaggio",
        description: "Traditional Swiss cheese fondue with bread",
        descriptionDE: "Traditionelles Schweizer Käsefondue mit Brot",
        descriptionFR: "Fondue au fromage suisse traditionnelle avec pain",
        descriptionIT: "Fonduta di formaggio svizzera tradizionale con pane",
        price: 28.00,
        vatRate: "STANDARD",
        categoryId: categories.swiss.id,
        preparationTime: 20,
        available: true,
        allergens: ["dairy", "gluten"],
      },
      {
        name: "Rösti",
        nameDE: "Rösti",
        nameFR: "Rösti",
        nameIT: "Rösti",
        description: "Swiss potato pancake with cheese",
        descriptionDE: "Schweizer Kartoffelpuffer mit Käse",
        descriptionFR: "Galette de pommes de terre suisse avec fromage",
        descriptionIT: "Frittella di patate svizzera con formaggio",
        price: 16.50,
        vatRate: "STANDARD",
        categoryId: categories.swiss.id,
        preparationTime: 15,
        available: true,
        allergens: ["dairy"],
      },
      {
        name: "Zürcher Geschnetzeltes",
        nameDE: "Zürcher Geschnetzeltes",
        nameFR: "Émincé de veau à la zurichoise",
        nameIT: "Zürcher Geschnetzeltes",
        description: "Sliced veal in cream sauce with rösti",
        descriptionDE: "Kalbfleischstreifen in Rahmsauce mit Rösti",
        descriptionFR: "Émincé de veau à la crème avec rösti",
        descriptionIT: "Fettine di vitello in salsa cremosa con rösti",
        price: 32.00,
        vatRate: "STANDARD",
        categoryId: categories.swiss.id,
        preparationTime: 18,
        available: true,
        allergens: ["dairy"],
      },

      // Drinks
      {
        name: "Coca-Cola",
        nameDE: "Coca-Cola",
        nameFR: "Coca-Cola",
        nameIT: "Coca-Cola",
        description: "0.33L",
        descriptionDE: "0.33L",
        descriptionFR: "0.33L",
        descriptionIT: "0.33L",
        price: 4.50,
        vatRate: "REDUCED",
        categoryId: categories.drinks.id,
        preparationTime: 1,
        available: true,
        allergens: [],
      },
      {
        name: "Mineral Water",
        nameDE: "Mineralwasser",
        nameFR: "Eau minérale",
        nameIT: "Acqua minerale",
        description: "0.5L sparkling or still",
        descriptionDE: "0.5L mit oder ohne Kohlensäure",
        descriptionFR: "0.5L pétillante ou plate",
        descriptionIT: "0.5L frizzante o naturale",
        price: 3.50,
        vatRate: "REDUCED",
        categoryId: categories.drinks.id,
        preparationTime: 1,
        available: true,
        allergens: [],
      },
      {
        name: "Swiss Beer",
        nameDE: "Schweizer Bier",
        nameFR: "Bière suisse",
        nameIT: "Birra svizzera",
        description: "0.5L local beer",
        descriptionDE: "0.5L lokales Bier",
        descriptionFR: "0.5L bière locale",
        descriptionIT: "0.5L birra locale",
        price: 6.50,
        vatRate: "STANDARD",
        categoryId: categories.drinks.id,
        preparationTime: 1,
        available: true,
        allergens: ["gluten"],
      },

      // Desserts
      {
        name: "Tiramisu",
        nameDE: "Tiramisu",
        nameFR: "Tiramisu",
        nameIT: "Tiramisù",
        description: "Classic Italian dessert",
        descriptionDE: "Klassisches italienisches Dessert",
        descriptionFR: "Dessert italien classique",
        descriptionIT: "Classico dolce italiano",
        price: 9.50,
        vatRate: "STANDARD",
        categoryId: categories.desserts.id,
        preparationTime: 3,
        available: true,
        allergens: ["dairy", "eggs", "gluten"],
      },
      {
        name: "Chocolate Mousse",
        nameDE: "Schokoladenmousse",
        nameFR: "Mousse au chocolat",
        nameIT: "Mousse al cioccolato",
        description: "Rich chocolate mousse",
        descriptionDE: "Reichhaltige Schokoladenmousse",
        descriptionFR: "Mousse au chocolat riche",
        descriptionIT: "Mousse al cioccolato ricca",
        price: 8.50,
        vatRate: "STANDARD",
        categoryId: categories.desserts.id,
        preparationTime: 3,
        available: true,
        allergens: ["dairy", "eggs"],
      },
    ],
  });

  console.log("✅ Seeding completed!");
  console.log("👤 Demo Users:");
  console.log("   Admin: admin@swisspos.ch / PIN: 1234");
  console.log("   Waiter 1: hans@swisspos.ch / PIN: 1234");
  console.log("   Waiter 2: marie@swisspos.ch / PIN: 1234");
  console.log("   Kitchen: kitchen@swisspos.ch / PIN: 1234");
  console.log(`🪑 Tables: ${tables.length} tables created`);
  console.log(`📋 Categories: 6 categories created`);
  console.log(`🍕 Menu Items: 16 items created`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
