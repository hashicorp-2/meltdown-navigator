import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { CrisisTranslatorForm } from '@/components/CrisisTranslatorForm';

export default function Home() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Meltdown Navigator AI Agent · Crisis Translator"
        title="Translate crisis signals into compassionate connection."
        subtitle="Capture dysregulated communication, lean on personalized AI insights, and send messages that invite support instead of conflict. This is the heart of the Meltdown Navigator mission—turning overwhelming moments into collaborative care."
      />

      <CrisisTranslatorForm />
    </AppShell>
  );
}
