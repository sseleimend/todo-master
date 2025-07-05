import { clerkClient } from "@clerk/nextjs/server";

async function isAdmin(userId: string) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  return user.publicMetadata.role === "admin"
}

export async function 