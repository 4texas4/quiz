'use server';

import {z} from 'zod';
import {ai} from '../genkit';

const SendEmailInputSchema = z.object({
  email: z.string(),
  type: z.string(),
  message: z.string(),
  rating: z.number(),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

const SendEmailOutputSchema = z.string();
export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailInputSchema,
    outputSchema: SendEmailOutputSchema,
  },
  async (payload) => {
    // In a real application, you would use a service like SendGrid, Resend, or Nodemailer
    // to send an actual email. For this example, we'll simulate the process and log to console.
    
    console.log("----------[ SIMULATED EMAIL ]----------");
    console.log(`To: your-email@example.com`);
    console.log(`From: Feedback Flow <noreply@feedbackflow.com>`);
    console.log(`Reply-To: ${payload.email}`);
    console.log(`Subject: New Submission: ${payload.type}`);
    console.log("-----------------------------------------");
    console.log(`Email: ${payload.email}`);
    console.log(`Type: ${payload.type}`);
    console.log(`Rating: ${payload.rating}/5`);
    console.log(`Message: \n${payload.message}`);
    console.log("-----------------------------------------");

    return `Successfully processed submission from ${payload.email}.`;
  }
);

export async function sendEmail(input: SendEmailInput): Promise<SendEmailOutput> {
  return sendEmailFlow(input);
}
