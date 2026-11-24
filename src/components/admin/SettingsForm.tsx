"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Building2, CalendarRange, CircleCheckBig, BellRing, Save } from "lucide-react";
import { BOOKING_RULES, RESORT } from "@/config/resort";
import Toggle from "./Toggle";
import type { LucideIcon } from "lucide-react";

const input =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-shadow focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:grid-cols-[280px_1fr]">
      <div>
        <span className="mb-3 grid size-10 place-items-center rounded-xl bg-brand-50 text-brand">
          <Icon className="size-5" aria-hidden />
        </span>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, id, children, wide = false }: { label: string; id: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SettingsForm() {
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[Admin] Save settings", Object.fromEntries(new FormData(e.currentTarget)));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section icon={Building2} title="Property" description="Shown on the website header, footer and booking emails.">
        <Field label="Resort name" id="s-name">
          <input id="s-name" name="name" defaultValue={RESORT.name} className={input} />
        </Field>
        <Field label="Location" id="s-location">
          <input id="s-location" name="location" defaultValue={RESORT.location} className={input} />
        </Field>
        <Field label="Phone" id="s-phone">
          <input id="s-phone" name="phone" defaultValue={RESORT.phoneDisplay} className={input} />
        </Field>
        <Field label="WhatsApp number" id="s-wa">
          <input id="s-wa" name="whatsapp" defaultValue={RESORT.whatsappNumber} className={input} />
        </Field>
        <Field label="Address" id="s-address" wide>
          <textarea
            id="s-address"
            name="address"
            rows={2}
            defaultValue={RESORT.address}
            className={`${input} h-auto py-2.5`}
          />
        </Field>
      </Section>

      <Section icon={CalendarRange} title="Booking rules" description="Limits applied by the booking bar on the website.">
        <Field label="Minimum stay (nights)" id="s-min">
          <input id="s-min" name="minStay" type="number" min={1} defaultValue={BOOKING_RULES.minStayNights} className={input} />
        </Field>
        <Field label="Maximum stay (nights)" id="s-max">
          <input id="s-max" name="maxStay" type="number" min={1} defaultValue={BOOKING_RULES.maxStayNights} className={input} />
        </Field>
        <Field label="Check-in time" id="s-in">
          <input id="s-in" name="checkIn" type="time" defaultValue="14:00" className={input} />
        </Field>
        <Field label="Check-out time" id="s-out">
          <input id="s-out" name="checkOut" type="time" defaultValue="12:00" className={input} />
        </Field>
      </Section>

      <Section icon={BellRing} title="Notifications" description="Who gets told when something happens.">
        <div className="space-y-4 sm:col-span-2">
          <Toggle label="Email me for every new booking" defaultChecked />
          <Toggle label="WhatsApp alert for same-day bookings" defaultChecked />
          <Toggle label="Daily summary at 8:00 AM" />
          <Toggle label="Notify when a review is 3 stars or lower" defaultChecked />
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-3 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)] backdrop-blur">
        <p role="status" className="mr-auto flex items-center gap-2 pl-2 text-sm font-medium text-emerald-700">
          {saved && (
            <>
              <CircleCheckBig className="size-4" aria-hidden /> Settings saved (demo — logged to console)
            </>
          )}
        </p>
        <button
          type="reset"
          className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Save className="size-4" aria-hidden />
          Save changes
        </button>
      </div>
    </form>
  );
}
