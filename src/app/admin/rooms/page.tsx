import { BedDouble, Plus, User } from "lucide-react";
import { Button, PageHeader, RoomStatusBadge } from "@/components/admin/ui";
import { ROOM_UNITS, type RoomStatus } from "@/components/admin/mockData";
import { formatBDT } from "@/components/resort/lib/format";
import { cn } from "@/components/resort/lib/cn";

const TONES: Record<RoomStatus, string> = {
  available: "from-emerald-500/15 to-emerald-500/0",
  occupied: "from-sky-500/15 to-sky-500/0",
  cleaning: "from-amber-500/20 to-amber-500/0",
  maintenance: "from-rose-500/15 to-rose-500/0",
};

const STATUSES: RoomStatus[] = ["available", "occupied", "cleaning", "maintenance"];

export default function RoomsPage() {
  return (
    <>
      <PageHeader
        title="Rooms & Villas"
        description="Live status of every unit on the property."
        actions={
          <Button variant="accent" icon={Plus}>
            Add unit
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {STATUSES.map((s) => (
          <div key={s} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5">
            <RoomStatusBadge status={s} />
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {ROOM_UNITS.filter((r) => r.status === s).length}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ROOM_UNITS.map((room) => (
          <article
            key={room.number}
            className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.25)]"
          >
            <div aria-hidden className={cn("absolute inset-x-0 top-0 h-24 bg-gradient-to-b", TONES[room.status])} />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-white text-lg font-bold text-brand shadow-sm ring-1 ring-slate-200/70">
                  {room.number}
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">{room.type}</h2>
                  <p className="text-xs text-slate-500">{room.floor}</p>
                </div>
              </div>
              <RoomStatusBadge status={room.status} />
            </div>
            <div className="relative mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                {room.guest ? (
                  <User className="size-4 text-slate-400" aria-hidden />
                ) : (
                  <BedDouble className="size-4 text-slate-400" aria-hidden />
                )}
                {room.guest ?? "No guest"}
              </span>
              <p className="text-sm text-slate-500">
                <span className="text-lg font-bold text-slate-900 tabular-nums">{formatBDT(room.rate)}</span>/night
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
