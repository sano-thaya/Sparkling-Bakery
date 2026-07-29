import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

      <div className="bg-white rounded-3xl shadow-soft p-8 border border-peach max-w-xl">
        <h2 className="text-xl font-bold mb-6 text-ink border-b border-peach pb-4">Pricing Configuration</h2>
        
        <form action={updateSettings} className="space-y-6">
          <div>
            <label htmlFor="baseAmount" className="block text-sm font-bold text-ink-light mb-2">
              Base Cake Price ($)
            </label>
            <p className="text-xs text-ink-light/80 mb-3">
              This is the default starting price shown on the order page deposit.
            </p>
            <input
              type="number"
              id="baseAmount"
              name="baseAmount"
              step="0.01"
              min="0"
              defaultValue={currentBasePrice}
              className="w-full px-5 py-3.5 rounded-xl border border-peach bg-white text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-magenta"
              required
            />
          </div>

          <button type="submit" className="px-6 py-3 bg-magenta text-white font-bold rounded-pill shadow-sm hover:bg-magenta-dark transition-colors">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
