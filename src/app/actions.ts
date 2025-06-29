"use server";

import { sendEmail } from "@/ai/flows/send-email";
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

  try {
    console.log("Submitting feedback:", parsedData.data);
    await sendEmail({
      email: parsedData.data.email,
      type: parsedData.data.type,
      message: parsedData.data.message,
      rating: parsedData.data.rating,
    });
    
    return {
      success: true,
      message: "Thank you for your feedback!",
    };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return {
      success: false,
      message: "An error occurred while submitting your feedback. Please try again.",
    };
  }
}
