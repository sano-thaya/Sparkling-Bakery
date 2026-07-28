import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // Optional: add a secret key check to ensure only Vercel Cron can call this
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    const ordersDue = await prisma.order.findMany({
      where: {
        deliveryDate: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
        status: {
          not: "cancelled"
        }
      }
    });

    if (ordersDue.length > 0) {
      const orderListHtml = ordersDue.map(o => 
        `<li>Order ${o.id}: ${o.guestName || 'Customer'} - ${o.description}</li>`
      ).join("");

      await resend.emails.send({
        from: 'Sparkling Bakery <noreply@sparklingbakery.com>',
        to: process.env.ADMIN_EMAIL!,
        subject: `Reminder: ${ordersDue.length} Orders Due Tomorrow`,
        html: `
          <h2>Orders Due Tomorrow</h2>
          <p>You have ${ordersDue.length} orders scheduled for delivery tomorrow:</p>
          <ul>
            ${orderListHtml}
          </ul>
        `
      });
    }

    return NextResponse.json({ success: true, count: ordersDue.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to run cron" }, { status: 500 });
  }
}
