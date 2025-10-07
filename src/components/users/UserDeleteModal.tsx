import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/shadcn/ui/dialog";
import { Button } from "@/components/shadcn/ui/button";

/**
 * Komponen modal untuk konfirmasi penghapusan pengguna
 */
interface UserDeleteModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any;
  getInitials: (name: string) => string;
  handleConfirmDelete: () => Promise<boolean | undefined>;
  setError: (error: string) => void;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  isOpen,
  setIsOpen,
  user,
  getInitials,
  handleConfirmDelete,
  setError
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const onConfirm = async () => {
    try {
      setIsDeleting(true);
      const result = await handleConfirmDelete();
      if (result) {
        setIsOpen(false);
      }
    } catch (error: any) {
      setError(error.message || 'Gagal menghapus pengguna');
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Pengguna</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pengguna {user?.username}? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};