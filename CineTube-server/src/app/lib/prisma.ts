import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "process";
import { envVars } from "../config/env";

//import { PrismaClient } from "@prisma/client/extension";
//import { PrismaClient } from "../generated/prisma/client";

const connectionString = envVars.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };