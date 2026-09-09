import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_BASE = "http://localhost:5000/api";

async function testTenantCrud() {
  console.log("=================================================");
  console.log("   SUPER ADMIN TENANT EDIT & DELETE VERIFICATION ");
  console.log("=================================================\n");

  try {
    // 1. Provision temporary test tenant
    console.log("1. Creating test tenant 'Hotel Temp'...");
    const resCreate = await fetch(`${API_BASE}/tenants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Hotel Temp",
        slug: "hoteltemp",
        subscriptionTier: "FREE",
      }),
    });
    const dataCreate = await resCreate.json();
    console.log("Status Code:", resCreate.status);
    const tenantId = dataCreate.data.tenant.id;
    console.log("Created Tenant ID:", tenantId);

    // 2. Edit tenant details (PUT /api/tenants/:id)
    console.log("\n2. Updating tenant via PUT /api/tenants/" + tenantId + "...");
    const resUpdate = await fetch(`${API_BASE}/tenants/${tenantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Hotel Temp Updated",
        slug: "hoteltemp-updated",
        subscriptionTier: "ENTERPRISE",
        status: "ACTIVE",
      }),
    });
    const dataUpdate = await resUpdate.json();
    console.log("Status Code:", resUpdate.status);
    console.log("Updated Tenant Name:", dataUpdate.data.name);
    console.log("Updated Subscription Tier:", dataUpdate.data.subscriptionTier);

    // 3. Delete tenant (DELETE /api/tenants/:id)
    console.log("\n3. Deleting tenant via DELETE /api/tenants/" + tenantId + "...");
    const resDelete = await fetch(`${API_BASE}/tenants/${tenantId}`, {
      method: "DELETE",
    });
    const dataDelete = await resDelete.json();
    console.log("Status Code:", resDelete.status);
    console.log("Delete Response:", dataDelete.message);

    // 4. Verify in DB that tenant is removed
    console.log("\n4. Verifying record removal in PostgreSQL via Prisma...");
    const dbTenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!dbTenant) {
      console.log("✅ VERIFICATION PASSED! Hotel record successfully deleted from database.");
    } else {
      console.error("❌ VERIFICATION FAILED! Record still exists in DB.");
    }
  } catch (err) {
    console.error("❌ Error running tenant CRUD verification:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testTenantCrud();
