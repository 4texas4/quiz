"use server";

import { feedbackSchema, type FeedbackSchema } from "./schemas";

export async function submitFeedback(data: FeedbackSchema) {
  const parsedData = feedbackSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: false,
      message: "Invalid data provided.",
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  const { email, type, message, rating } = parsedData.data;

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    const errorMessage = "DISCORD_WEBHOOK_URL is not set in the .env file.";
    console.error(errorMessage);
    return {
      success: false,
      message: "Server configuration error: Discord webhook URL is not set.",
    };
  }

  const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const embedColor =
    rating < 3
      ? 0xe74c3c // Red
      : rating < 5
      ? 0xf1c40f // Yellow
      : 0x2ecc71; // Green
  
  const fields = [
    { name: 'Email', value: `||${email}||`, inline: true },
    { name: 'Type', value: type, inline: true },
    { name: 'Rating', value: `${ratingStars} (${rating}/5)`, inline: true },
  ];

  if (message) {
    fields.push({ name: 'Message', value: message.substring(0, 1024) });
  }

  const embed = {
    title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Submission`,
    color: embedColor,
    fields: fields,
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
      return {
        success: false,
        message: `Error sending to Discord. Status: ${response.status}`,
      };
    }
    
    return {
      success: true,
      message: "Thank you for your feedback!",
    };

  } catch (error) {
    console.error("Failed to send feedback to Discord:", error);
    return {
      success: false,
      message: "An error occurred while submitting your feedback. Please try again.",
    };
  }
}
