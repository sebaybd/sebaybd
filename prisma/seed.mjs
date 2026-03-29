import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
	{
		name: "Admin User",
		email: "admin@sebaybd.bd",
		role: "ADMIN",
		password: "Admin123!",
	},
	{
		name: "Provider User",
		email: "provider@sebaybd.bd",
		role: "PROVIDER",
		password: "Provider123!",
	},
	{
		name: "Customer User",
		email: "user@sebaybd.bd",
		role: "CUSTOMER",
		password: "User12345!",
	},
];

async function main() {
	for (const item of users) {
		const passwordHash = await bcrypt.hash(item.password, 10);

		await prisma.user.upsert({
			where: { email: item.email },
			update: {
				name: item.name,
				role: item.role,
				passwordHash,
			},
			create: {
				name: item.name,
				email: item.email,
				role: item.role,
				passwordHash,
			},
		});
	}

	console.log("Seeded admin/provider/customer credential users.");
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
