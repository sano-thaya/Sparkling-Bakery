import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import SettingsFormClient from "@/components/SettingsFormClient";

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst();
  const currentBasePrice = settings?.baseAmount ? Number(settings.baseAmount) : 150.00;

  async function updateSettings(formData: FormData) {
    "use server";
    const baseAmount = Number(formData.get("baseAmount"));
    
    const existing = await prisma.settings.findFirst();
    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: { baseAmount }
      });
    } else {
      await prisma.settings.create({
        data: { baseAmount }
      });
    }
    
    revalidatePath("/admin/settings");
    revalidatePath("/order");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Store Settings</h1>
        <p className="text-ink-light">Manage global configuration for Sparkling Bakery.</p>
      </div>

      <SettingsFormClient 
        currentBasePrice={currentBasePrice} 
        updateSettingsAction={updateSettings} 
      />
    </div>
  );
}
