import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { CaregiverDashboard } from '@/components/CaregiverDashboard';

export default function CaregiverPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Caregiver Dashboard"
        title="Real-time support insights"
        subtitle="Monitor stress patterns, receive alerts, and coordinate support for your loved one."
      />

      <CaregiverDashboard />
    </AppShell>
  );
}

