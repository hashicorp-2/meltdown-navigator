import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { CrisisTranslatorForm } from '@/components/CrisisTranslatorForm';

export default function Home() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Meltdown Navigator"
        title="Grounded support, step by step."
        subtitle="Input how you're feeling and we'll craft a calm, structured plan your caregiver can follow. Tap the triggers that resonate so the AI knows which patterns to support."
      />

      <CrisisTranslatorForm />
    </AppShell>
  );
}
