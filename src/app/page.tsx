import { FeedbackForm } from '@/components/feedback-form';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold text-foreground sm:text-5xl">Share Your Thoughts</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We'd love to hear from you! Whether you have feedback or a new game idea, let us know.
          </p>
        </div>
        <FeedbackForm />
      </div>
    </main>
  );
}
