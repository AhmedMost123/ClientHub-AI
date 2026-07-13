import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/PageContainer";

export default function UnauthorizedPage() {
  return (
    <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        You do not have permission to view this page.
      </p>
      <Button href="/dashboard" className="mt-6">
        Go to Dashboard
      </Button>
    </PageContainer>
  );
}
