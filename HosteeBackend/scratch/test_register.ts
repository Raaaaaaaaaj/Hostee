import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testUserRegistration() {
  console.log("=== Testing User Registration API & Database Operation ===");

  const testUser = {
    name: "Admin User",
    email: "admin@hostee.com",
    password: "SuperSecurePassword123!",
    role: "ADMIN",
  };

  console.log("Sending POST /api/auth/register request using fetch...");

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    console.log("HTTP Status Code:", response.status);
    console.log("Response Body:", JSON.stringify(data, null, 2));

    if (response.status === 201 && data.success) {
      console.log("\n✅ Registration API test PASSED!");
      console.log("User ID created:", data.data.user.id);
      console.log("JWT Token issued:", data.data.token ? "YES (Valid Token Present)" : "NO");

      // Verify direct database query
      console.log("\nVerifying direct database record in PostgreSQL via Prisma...");
      const dbUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      if (dbUser) {
        console.log("\n✅ Database verification PASSED! User record found in Postgres:");
        console.log("  - ID:", dbUser.id);
        console.log("  - Email:", dbUser.email);
        console.log("  - Name:", dbUser.name);
        console.log("  - Role:", dbUser.role);
        console.log("  - Password Hash:", dbUser.password.substring(0, 15) + "...");
        console.log("  - Created At:", dbUser.createdAt);
      } else {
        console.error("❌ Database verification FAILED! User record not found.");
      }
    } else {
      console.error("❌ Registration API test FAILED!");
    }
  } catch (error) {
    console.error("❌ Error executing fetch:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserRegistration();
