import { CalendarCheck, Download } from "lucide-react";
import BookingsTable from "@/components/admin/BookingsTable";
import { Button, PageHeader } from "@/components/admin/ui";

export default function BookingsPage() {
  return (
    <>
      <PageHeader
        title="Bookings"
        description="Every reservation across the website, WhatsApp, phone and walk-ins."
        actions={
          <>
            <Button variant="ghost" icon={Download}>
              Export CSV
            </Button>
            <Button variant="accent" icon={CalendarCheck}>
              New booking
            </Button>
          </>
        }
      />
      <BookingsTable />
    </>
  );
}
