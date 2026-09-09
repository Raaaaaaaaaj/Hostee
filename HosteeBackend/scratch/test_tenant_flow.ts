import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_BASE = "http://localhost:5000/api";

async function runMultiTenantVerification() {
  console.log("=================================================");
  console.log("   MASTER TENANT MULTI-TENANCY VERIFICATION TEST ");
  console.log("=================================================\n");

  try {
    // 1. Create Hotel 1 (hotel1)
    console.log("1. Provisioning Tenant 1 (hotel1 - Grand Hotel Alpha)...");
    const res1 = await fetch(`${API_BASE}/tenants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Grand Hotel Alpha",
        slug: "hotel1",
        subscriptionTier: "PREMIUM",
        adminName: "Alice Admin",
        adminEmail: "admin@hotel1.com",
        adminPassword: "Password123!",
      }),
    });
    const data1 = await res1.json();
    console.log("Status Code:", res1.status);
    console.log("Response:", JSON.stringify(data1, null, 2));

    // 2. Create Hotel 2 (hotel2)
    console.log("\n2. Provisioning Tenant 2 (hotel2 - Sunset Resort Beta)...");
    const res2 = await fetch(`${API_BASE}/tenants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Sunset Resort Beta",
        slug: "hotel2",
        subscriptionTier: "BASIC",
        adminName: "Bob Admin",
        adminEmail: "admin@hotel2.com",
        adminPassword: "Password123!",
      }),
    });
    const data2 = await res2.json();
    console.log("Status Code:", res2.status);
    console.log("Response:", JSON.stringify(data2, null, 2));

    // 3. Register Receptionist under Hotel 1 (tenantSlug: hotel1)
    console.log("\n3. Registering Receptionist staff under hotel1...");
    const resStaff1 = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantSlug: "hotel1",
        name: "Rita Receptionist",
        email: "receptionist@hotel1.com",
        password: "Password123!",
        role: "RECEPTIONIST",
      }),
    });
    const dataStaff1 = await resStaff1.json();
    console.log("Status Code:", resStaff1.status);
    console.log("Response:", JSON.stringify(dataStaff1, null, 2));

    // 4. Register Cleaner staff under Hotel 2 (tenantSlug: hotel2)
    console.log("\n4. Registering Cleaner staff under hotel2...");
    const resStaff2 = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantSlug: "hotel2",
        name: "Charlie Cleaner",
        email: "cleaner@hotel2.com",
        password: "Password123!",
        role: "CLEANER",
      }),
    });
    const dataStaff2 = await resStaff2.json();
    console.log("Status Code:", resStaff2.status);
    console.log("Response:", JSON.stringify(dataStaff2, null, 2));

    // 5. Fetch Hotel 1 details & users
    console.log("\n5. Querying GET /api/tenants/hotel1 ...");
    const resGet1 = await fetch(`${API_BASE}/tenants/hotel1`);
    const dataGet1 = await resGet1.json();
    console.log("Hotel 1 Users Count:", dataGet1.data.users.length);
    console.log("Hotel 1 Users:", dataGet1.data.users.map((u: any) => `${u.name} (${u.role})`));

    // 6. Fetch Hotel 2 details & users
    console.log("\n6. Querying GET /api/tenants/hotel2 ...");
    const resGet2 = await fetch(`${API_BASE}/tenants/hotel2`);
    const dataGet2 = await resGet2.json();
    console.log("Hotel 2 Users Count:", dataGet2.data.users.length);
    console.log("Hotel 2 Users:", dataGet2.data.users.map((u: any) => `${u.name} (${u.role})`));

    // 7. Verify Database Isolation in PostgreSQL
    console.log("\n7. Verifying PostgreSQL DB Records via Prisma...");
    const tenantsInDb = await prisma.tenant.findMany({
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true, tenantId: true },
        },
      },
    });

    console.log("\n✅ DATABASE VERIFICATION SUMMARY:");
    tenantsInDb.forEach((t) => {
      console.log(`\n🏨 TENANT: ${t.name} (Slug: ${t.slug}, ID: ${t.id})`);
      console.log(`   Users (${t.users.length}):`);
      t.users.forEach((u) => {
        console.log(`   - [${u.role}] ${u.name} (${u.email}) -> tenantId: ${u.tenantId}`);
      });
    });

  } catch (err) {
    console.error("❌ Multi-tenant verification error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

runMultiTenantVerification();
