import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const activeLoan = await prisma.loan.findFirst({
    where: {
      memberId: id,
      status: "BORROWED",
      loanItems: {
        some: { returned: false },
      },
    },
  });

  if (activeLoan) {
    return NextResponse.json({ status: "Sedang Meminjam" });
  }
  return NextResponse.json({ status: "Tidak Meminjam" });
}
