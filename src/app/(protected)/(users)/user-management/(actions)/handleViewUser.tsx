import { User } from "@/hooks/api/v2/users"
import { Dispatch, SetStateAction } from "react"

/**
 * Handler untuk melihat detail pengguna
 * @param user - Data pengguna yang akan dilihat
 * @param setSelectedUser - Fungsi untuk mengatur pengguna yang dipilih
 * @param setIsViewModalOpen - Fungsi untuk mengatur status modal view
 */
export const handleViewUser = (
  user: User,
  setSelectedUser: Dispatch<SetStateAction<User | null>>,
  setIsViewModalOpen: Dispatch<SetStateAction<boolean>>
) => {
  setSelectedUser(user)
  setIsViewModalOpen(true)
}