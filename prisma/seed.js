const { PrismaClient } = require("../app/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      coins: 10,
      price: 29900,
      currency: "INR",
      description: "10 AI headshot generations",
      availableForCommerce: true,
      customRatio: false,
      canDownload: true,
    },
    {
      id: "pro",
      name: "Pro",
      coins: 25,
      price: 59900,
      currency: "INR",
      description: "25 AI headshot generations",
      availableForCommerce: true,
      customRatio: true,
      canDownload: true,
    },
    {
      id: "premium",
      name: "Premium",
      coins: 50,
      price: 99900,
      currency: "INR",
      description: "50 AI headshot generations",
      availableForCommerce: true,
      customRatio: true,
      canDownload: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: {
        id: plan.id,
      },
      update: plan,
      create: plan,
    });
  }

  console.log("Plans seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });