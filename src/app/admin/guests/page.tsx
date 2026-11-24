import { Crown, Mail, Phone, UserPlus } from "lucide-react";
import { Avatar, Button, Card, PageHeader, shortDate } from "@/components/admin/ui";
import { GUESTS } from "@/components/admin/mockData";
import { formatBDT } from "@/components/resort/lib/format";

export default function GuestsPage() {
  return (
    <>
      <PageHeader
        title="Guests"
        description={`${GUESTS.length} guest profiles · ${GUESTS.filter((g) => g.vip).length} VIP`}
        actions={
          <Button variant="accent" icon={UserPlus}>
            Add guest
          </Button>
        }
      />
      <Card bodyClassName="p-0 sm:p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50/60 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th scope="col" className="rounded-tl-2xl px-5 py-3">Guest</th>
                <th scope="col" className="px-3 py-3">Contact</th>
                <th scope="col" className="px-3 py-3 text-right">Stays</th>
                <th scope="col" className="px-3 py-3 text-right">Total spent</th>
                <th scope="col" className="rounded-tr-2xl px-5 py-3">Last stay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GUESTS.map((g) => (
                <tr key={g.email} className="transition-colors hover:bg-brand-50/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={g.name} />
                      <div>
                        <p className="flex items-center gap-2 font-semibold text-slate-900">
                          {g.name}
                          {g.vip && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-sand/25 px-2 py-0.5 text-[10px] font-bold text-[#7a5a1e]">
                              <Crown className="size-3" aria-hidden /> VIP
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400">{g.stays > 3 ? "Loyal guest" : "Guest"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-slate-400" aria-hidden />
                      {g.email}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5">
                      <Phone className="size-3.5 text-slate-400" aria-hidden />
                      {g.phone}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-slate-900 tabular-nums">{g.stays}</td>
                  <td className="px-3 py-4 text-right font-semibold text-slate-900 tabular-nums">{formatBDT(g.spent)}</td>
                  <td className="px-5 py-4 text-slate-600">{shortDate(g.lastStay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
