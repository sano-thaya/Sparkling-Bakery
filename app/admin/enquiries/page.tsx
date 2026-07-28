import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function markAsResponded(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.enquiry.update({
      where: { id },
      data: { status: "responded" }
    });
    revalidatePath("/admin/enquiries");
  }

  return (
    <div>
      <h1 className="title-lg mb-6">Manage Enquiries</h1>

      <div className="grid grid-cols-2">
        {enquiries.map((enq) => (
          <div key={enq.id} className="card">
            <div className="flex justify-between mb-4">
              <h3 style={{ margin: 0 }}>{enq.name}</h3>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                backgroundColor: enq.status === 'new' ? '#fffaf0' : '#e6fffa',
                color: enq.status === 'new' ? '#c05621' : '#2c7a7b'
              }}>
                {enq.status}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              <strong>Email:</strong> {enq.email} <br/>
              <strong>Phone:</strong> {enq.phone || 'N/A'} <br/>
              <strong>Date:</strong> {enq.createdAt.toLocaleDateString()}
            </p>
            <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>"{enq.message}"</p>
            </div>
            
            {enq.status === 'new' && (
              <form action={markAsResponded}>
                <input type="hidden" name="id" value={enq.id} />
                <button type="submit" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.875rem' }}>
                  Mark as Responded
                </button>
              </form>
            )}
          </div>
        ))}
        {enquiries.length === 0 && (
          <p>No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
