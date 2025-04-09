// copied from prisma docs: client-side-only-queries

// Prisma is a modern ORM (Object-Relational Mapping) tool designed to simplify database interactions
// It provides a type-safe database client for TypeScript and Node.js
// It also includes a schema definition language (Prisma Schema) for defining your database structure
// and a query builder for interacting with the database  
import { PrismaClient } from "@prisma/client";

// This is a singleton pattern to ensure that the PrismaClient is only instantiated once
// This is useful for performance and to avoid connection issues  
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// This is a singleton pattern to ensure that the PrismaClient is only instantiated once
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// This is a singleton pattern to ensure that the PrismaClient is only instantiated once
// This is useful for performance and to avoid connection issues  
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// This is a singleton pattern to ensure that the PrismaClient is only instantiated once
// This is useful for performance and to avoid connection issues  
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
