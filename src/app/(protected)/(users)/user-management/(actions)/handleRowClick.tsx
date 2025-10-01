
/**
 * Handler untuk aksi pengguna
 */
import { User } from "@/hooks/api/v2/users/all.hook"
import router from "next/router"

/**
 * Handler untuk aksi pengguna
 */
export const handleRowClick = (user: User) => {
  router.push(`/users/${user.id}`)
}

