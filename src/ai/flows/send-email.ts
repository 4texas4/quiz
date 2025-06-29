'use server';

import {z} from 'zod';
import {ai} from '../genkit';

const SendFeedbackInputSchema = z.object({
  email: z.string(),
  type: z.string(),
  message: z.string(),
  rating: z.number(),
});
export type SendFeedbackInput = z.infer<typeof SendFeedbackInputSchema>;

const SendFeedbackOutputSchema = z.string();
export type SendFeedbackOutput = z.infer<typeof SendFeedbackOutputSchema>;

const sendFeedbackFlow = ai.defineFlow(
  {
    name: 'sendFeedbackFlow',
    inputSchema: SendFeedbackInputSchema,
    outputSchema: SendFeedbackOutputSchema,
  },
  async (payload) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      const errorMessage = "DISCORD_WEBHOOK_URL is not set in the .env file.";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const ratingStars = '★'.repeat(payload.rating) + '☆'.repeat(5 - payload.rating);

    const embedColor =
      payload.rating < 3
        ? 0xe74c3c // Red
        : payload.rating < 5
        ? 0xf1c40f // Yellow
        : 0x2ecc71; // Green

    const embed = {
      title: `New ${payload.type.charAt(0).toUpperCase() + payload.type.slice(1)} Submission`,
      color: embedColor,
      fields: [
        { name: 'Email', value: `||${payload.email}||`, inline: true },
        { name: 'Type', value: payload.type, inline: true },
        { name: 'Rating', value: `${ratingStars} (${payload.rating}/5)`, inline: true },
        { name: 'Message', value: payload.message.substring(0, 1024) },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Feedback via Rat App"
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Discord webhook error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Error sending to Discord. Status: ${response.status}`);
      }
      
      return `Successfully sent feedback to Discord for ${payload.email}.`;

    } catch (error) {
      console.error("Failed to send feedback to Discord:", error);
      throw error;
    }
  }
);

export async function sendFeedback(input: SendFeedbackInput): Promise<SendFeedbackOutput> {
  return sendFeedbackFlow(input);
}
