import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import EnquiriesClient from "@/components/EnquiriesClient";

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function markResponded(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.enquiry.update({ where: { id }, data: { status: "responded" } });
    revalidatePath("/admin/enquiries");
  }

  async function deleteEnquiry(id: string) {
    "use server";
    await prisma.enquiry.delete({ where: { id } });
    revalidatePath("/admin/enquiries");
  }

  return (
    <EnquiriesClient
      initialEnquiries={enquiries}
      markRespondedAction={markResponded}
      deleteEnquiryAction={deleteEnquiry}
    />
  );
}
