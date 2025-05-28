import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

// Signature yang benar untuk Next.js App Router
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Using the correct params destructuring pattern to avoid Next.js warning
  const id = params.id;
  console.log(`Attempting to delete member with ID: ${id}`);
  
  // Check if force delete is requested
  const { searchParams } = new URL(request.url);
  const forceDelete = searchParams.get('force') === 'true';
  console.log(`Force delete: ${forceDelete}`);

  try {
    // Check if ID is a UUID or a numeric ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const numericId = !isUuid && /^\d+$/.test(id) ? parseInt(id, 10) : null;
    
    console.log(`Is UUID: ${isUuid}, Numeric ID: ${numericId}`);
    
    // Check if member exists in database
    let memberExists = false;
    
    if (isUuid) {
      // If it's a UUID, check in the Prisma database
      try {
        const member = await prisma.member.findUnique({
          where: { id }
        });
        memberExists = !!member;
      } catch (error) {
        console.error(`Error checking member in Prisma: ${error}`);
      }
    } else if (numericId !== null) {
      // If it's a numeric ID, check in the anggota table
      const { data, error } = await supabase
        .from('anggota')
        .select('id_anggota')
        .eq('id_anggota', numericId)
        .single();
      
      if (error) {
        console.log(`Error checking if member exists: ${error.message}`);
        return NextResponse.json(
          { error: "Gagal memeriksa keberadaan anggota." },
          { status: 500 }
        );
      }
      
      memberExists = !!data;
    }
    
    if (!memberExists) {
      console.log(`Member with ID ${isUuid ? id : numericId} not found in database`);
      return NextResponse.json(
        { error: "Anggota tidak ditemukan." },
        { status: 404 }
      );
    }

    // If not force delete, check if there are active loans
    if (!forceDelete) {
      let loanCount = 0;
      
      if (isUuid) {
        // For UUID, check in Prisma Loan model
        try {
          loanCount = await prisma.loan.count({
            where: {
              memberId: id,
              status: 'BORROWED'
            }
          });
        } catch (error) {
          console.error(`Error checking active loans in Prisma: ${error}`);
          return NextResponse.json(
            { error: "Gagal memeriksa peminjaman aktif." },
            { status: 500 }
          );
        }
      } else if (numericId !== null) {
        // For numeric ID, check in native peminjaman table
        const { count, error } = await supabase
          .from('peminjaman')
          .select('id_peminjaman', { count: 'exact' })
          .eq('id_anggota', numericId)
          .ilike('status', 'dipinjam');
        
        if (error) {
          console.log(`Error checking active loans: ${error.message}`);
          return NextResponse.json(
            { error: "Gagal memeriksa peminjaman aktif." },
            { status: 500 }
          );
        }
        
        loanCount = count || 0;
      }
      
      console.log(`Active loan count: ${loanCount}`);

      if (loanCount > 0) {
        return NextResponse.json(
          {
            error: "Anggota tidak bisa dihapus karena masih memiliki pinjaman aktif. Gunakan opsi 'force delete' untuk menghapus anggota beserta semua pinjamannya.",
            canForceDelete: true
          },
          { status: 400 }
        );
      }
    }

    try {
      if (isUuid) {
        // Handle UUID-based member (Prisma model)
        try {
          if (forceDelete) {
            // Update all loans to RETURNED status
            await prisma.loan.updateMany({
              where: {
                memberId: id,
                status: 'BORROWED'
              },
              data: {
                status: 'RETURNED',
                returnDate: new Date()
              }
            });
            console.log(`Updated all active loans to 'RETURNED' for member ${id}`);
          }
          
          // Delete the member and all related records using Prisma's cascading delete
          await prisma.member.delete({
            where: { id }
          });
          
          console.log(`Successfully deleted member ${id} with Prisma`);
        } catch (prismaError: any) {
          console.error(`Error deleting with Prisma: ${prismaError.message}`);
          throw prismaError;
        }
      } else if (numericId !== null) {
        // Handle numeric ID-based member (native tables)
        if (forceDelete) {
          // Update all loans to 'dikembalikan' status
          const updateLoansResult = await supabase
            .from('peminjaman')
            .update({ 
              status: 'dikembalikan',
              tanggal_kembali: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            })
            .eq('id_anggota', numericId)
            .ilike('status', 'dipinjam');
            
          if (updateLoansResult.error) {
            console.error(`Error updating loans: ${updateLoansResult.error.message}`);
          } else {
            console.log(`Updated all active loans to 'dikembalikan' for member ${numericId}`);
          }
        }
        
        // Use the Supabase function to delete member and all related history
        const { data: deleteResult, error: functionError } = await supabase
          .rpc('delete_member_with_history', { member_id: numericId });
        
        if (functionError) {
          console.error(`Supabase function error: ${functionError.message}`);
          throw functionError;
        }
        
        console.log(`Delete member result from Supabase function: ${deleteResult}`);
        
        if (!deleteResult) {
          throw new Error("Gagal menghapus anggota menggunakan fungsi Supabase");
        }
      }
      
      // Refresh materialized view if it exists
      try {
        const { error: viewError } = await supabase.rpc('refresh_buku_populer_view');
        if (viewError) {
          console.log(`Note: buku_populer is not a materialized view or couldn't be refreshed: ${viewError.message}`);
        } else {
          console.log(`Refreshed buku_populer view`);
        }
      } catch (viewError) {
        console.log(`Error refreshing view: ${viewError}`);
      }
      
      return NextResponse.json({ 
        success: true,
        message: forceDelete 
          ? "Anggota berhasil dihapus beserta semua pinjamannya." 
          : "Anggota berhasil dihapus."
      });
    } catch (supabaseError: any) {
      console.error(`Supabase operation error: ${supabaseError.message}`);
      
      // If Supabase function fails, try manual approach
      console.log(`Trying manual approach with individual deletes...`);
      
      try {
        let deleteSuccess = false;
        
        if (isUuid) {
          // Manual deletion for UUID-based member using Prisma
          try {
            // Delete all related data and the member using Prisma transactions
            await prisma.$transaction(async (tx) => {
              // Get all loans for this member
              const loans = await tx.loan.findMany({
                where: { memberId: id },
                select: { id: true }
              });
              
              // Delete loan items for these loans
              if (loans.length > 0) {
                await tx.loanItem.deleteMany({
                  where: {
                    loanId: { in: loans.map(loan => loan.id) }
                  }
                });
              }
              
              // Delete loans
              await tx.loan.deleteMany({
                where: { memberId: id }
              });
              
              // Delete member
              await tx.member.delete({
                where: { id }
              });
            });
            
            console.log(`Manual: Successfully deleted member ${id} with Prisma transaction`);
            deleteSuccess = true;
          } catch (prismaError: any) {
            console.error(`Manual Prisma approach failed: ${prismaError.message}`);
            throw prismaError;
          }
        } else if (numericId !== null) {
          // Manual deletion for numeric ID-based member
          // Delete loan details first
          const { error: detailsError } = await supabase.rpc(
            'delete_member_loan_details',
            { member_id: numericId }
          );
          
          if (detailsError) {
            console.error(`Manual: Error deleting loan details: ${detailsError.message}`);
            // Try direct SQL approach
            // First get all peminjaman IDs
            const { data: peminjamanIds } = await supabase
              .from('peminjaman')
              .select('id_peminjaman')
              .eq('id_anggota', numericId);
              
            if (peminjamanIds && peminjamanIds.length > 0) {
              // Then delete detail_peminjaman records
              const { error: directDetailsError } = await supabase
                .from('detail_peminjaman')
                .delete()
                .in('id_peminjaman', peminjamanIds.map(p => p.id_peminjaman));
                
              if (directDetailsError) console.error(`Manual direct: Error deleting loan details: ${directDetailsError.message}`);
            }
          }
          console.log(`Manual: Deleted loan details for member ${numericId}`);
          
          // Delete loans
          const { error: loansError } = await supabase
            .from('peminjaman')
            .delete()
            .eq('id_anggota', numericId);
          
          if (loansError) console.error(`Manual: Error deleting loans: ${loansError.message}`);
          console.log(`Manual: Deleted loans for member ${numericId}`);
          
          // Delete wishlist
          const { error: wishlistError } = await supabase
            .from('wishlist')
            .delete()
            .eq('id_anggota', numericId);
          
          if (wishlistError) console.error(`Manual: Error deleting wishlist: ${wishlistError.message}`);
          console.log(`Manual: Deleted wishlist for member ${numericId}`);
          
          // Delete member
          const { error: memberError } = await supabase
            .from('anggota')
            .delete()
            .eq('id_anggota', numericId);
          
          if (memberError) {
            console.error(`Manual: Error deleting member: ${memberError.message}`);
            throw memberError;
          }
          
          console.log(`Manual: Successfully deleted member ${numericId}`);
          deleteSuccess = true;
        }
        
        if (deleteSuccess) {
          return NextResponse.json({ 
            success: true,
            message: "Anggota berhasil dihapus dengan metode manual."
          });
        } else {
          throw new Error("Gagal menghapus anggota dengan metode manual");
        }
      } catch (manualError: any) {
        console.error(`Manual approach failed: ${manualError.message}`);
        throw manualError;
      }
    }
  } catch (error: any) {
    console.error(`Final error in DELETE member: ${error.message}`);
    
    return NextResponse.json(
      { 
        error: "Gagal menghapus anggota.",
        details: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
