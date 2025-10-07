import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/shadcn/ui/dialog";
import { Button } from "@/components/shadcn/ui/button";
import { Avatar, AvatarFallback } from "@/components/shadcn/ui/avatar";
import { Badge } from "@/components/shadcn/ui/badge";
import { User } from "@/hooks/api/v2/users/all.hook.v2";

/**
 * Komponen modal untuk melihat detail pengguna
 */
interface UserViewModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  departments: Array<{ id: string; name: string }>;
  getInitials: (name: string) => string;
  formatDate: (dateString: string) => string;
}

export const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  setIsOpen,
  user,
  departments,
  getInitials,
  formatDate
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Pengguna</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-xl">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">{user.username}</h3>
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? 'Aktif' : 'Tidak Aktif'}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="capitalize">{user.level || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Departemen</p>
            <p>{user.primaryDepartment?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Region</p>
            <p>{user.region || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dibuat pada</p>
            <p>{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diperbarui pada</p>
            <p>{formatDate(user.updatedAt)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};