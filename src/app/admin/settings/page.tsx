import { PageHeader } from "@/components/admin/ui";
import SettingsForm from "@/components/admin/SettingsForm";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Property details, booking rules and notifications." />
      <SettingsForm />
    </>
  );
}
