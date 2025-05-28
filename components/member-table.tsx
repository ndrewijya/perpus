"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Eye, Edit, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string | Date;
}

interface MemberTableProps {
  members: Member[];
}

export function MemberTable({ members }: MemberTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loanStatus, setLoanStatus] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter anggota berdasarkan nama/email
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ambil status pinjam anggota saat buka detail
  const handleViewMember = async (member: Member) => {
    setSelectedMember(member);
    setLoanStatus(null);
    try {
      const res = await fetch(`/api/members/${member.id}/loan-status`);
      const data = await res.json();
      setLoanStatus(data.status || "Tidak diketahui");
    } catch {
      setLoanStatus("Tidak diketahui");
    }
  };

  const handleCloseDetail = () => {
    setSelectedMember(null);
    setLoanStatus(null);
  };

  // Hapus anggota
  const handleDelete = async (id: string, forceDelete: boolean = false) => {
    const confirmMessage = forceDelete
      ? "PERHATIAN: Anda akan menghapus anggota ini beserta SEMUA data pinjamannya. Tindakan ini tidak dapat dibatalkan. Yakin ingin melanjutkan?"
      : "Yakin ingin menghapus anggota ini?";
      
    if (!confirm(confirmMessage)) return;
    setDeletingId(id);
    
    try {
      const url = forceDelete
        ? `/api/members/${id}?force=true`
        : `/api/members/${id}`;
        
      const res = await fetch(url, { method: "DELETE" });
      
      if (res.ok) {
        toast({
          title: "Berhasil!!",
          description: "Anggota berhasil dihapus",
          variant: "default",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        const data = await res.json();
        
        // Jika anggota memiliki pinjaman aktif dan bisa di-force delete
        if (!res.ok && data.canForceDelete) {
          toast({
            title: "Anggota memiliki pinjaman aktif",
            description: "Klik 'Force Delete' untuk menghapus anggota beserta semua pinjamannya.",
            variant: "destructive",
            action: (
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(id, true)}
                >
                  Force Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDeletingId(null)}
                >
                  Batal
                </Button>
              </div>
            ),
          });
          return;
        }
        
        toast({
          title: "Gagal",
          description: data.error || "Gagal menghapus anggota.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus anggota.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Eye className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Telepon</TableHead>
              <TableHead className="hidden md:table-cell">Alamat</TableHead>
              <TableHead className="hidden md:table-cell">Terdaftar</TableHead>
              <TableHead className="text-center w-28">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada data anggota.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {member.phone || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {member.address || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {typeof member.createdAt === "string"
                      ? new Date(member.createdAt).toLocaleDateString("id-ID")
                      : member.createdAt.toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Detail"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleViewMember(member)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link href={`/members/${member.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                          className="text-yellow-600 hover:bg-yellow-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Hapus"
                        className="text-red-600 hover:bg-red-50"
                        disabled={deletingId === member.id}
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Detail Anggota */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleCloseDetail}
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Detail Anggota</h2>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Nama:</span>{" "}
                {selectedMember.name}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {selectedMember.email}
              </div>
              <div>
                <span className="font-semibold">Telepon:</span>{" "}
                {selectedMember.phone || "-"}
              </div>
              <div>
                <span className="font-semibold">Alamat:</span>{" "}
                {selectedMember.address || "-"}
              </div>
              <div>
                <span className="font-semibold">Terdaftar:</span>{" "}
                {typeof selectedMember.createdAt === "string"
                  ? new Date(selectedMember.createdAt).toLocaleDateString(
                      "id-ID"
                    )
                  : selectedMember.createdAt.toLocaleDateString("id-ID")}
              </div>
              <div>
                <span className="font-semibold">Status Peminjaman:</span>{" "}
                {loanStatus === null ? "Memuat..." : loanStatus}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
