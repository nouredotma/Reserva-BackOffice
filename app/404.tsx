import ComingSoon from '@/components/ComingSoon';

export default function NotFoundPage() {
  return (
    <ComingSoon 
      title="404" 
      description="page not found"
      backLink="/dashboard/rendez-vous"
      backLinkText="Retour à l'agenda"
    />
  );
}
