"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (userId: string) => {
    toast({
      title: "Melihat detail anggota",
      description: `Melihat detail anggota dengan ID: ${userId}`,
    });
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit anggota",
      description: `Mengedit anggota dengan ID: ${userId}`,
    });
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Terdaftar</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada data anggota.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{user.address || "-"}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
