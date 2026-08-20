import { PrismaClient } from "@prisma/client/extension";

// This code sets up a PrismaClient instance for database interactions.This approach helps prevent multiple instances of PrismaClient during development, which can lead to issues with database connections.
const globalForPrisma = global as unknown as {prisma: PrismaClient};

export const prisma = 
    // Checks if a PrismaClient instance already exists in the global scope. If it does, it uses that instance; otherwise, it creates a new one.
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query", "error", "warn"],
    });

 // Cheecks if the environment is not production, it assigns the PrismaClient instance to a global variable to prevent multiple instances during development.
if(process.env.NODE_ENV !== "production"){
    globalForPrisma.prisma = prisma;
}