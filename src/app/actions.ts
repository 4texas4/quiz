"use server";

import { z } from "zod";
import { sendEmail } from "@/ai/flows/send-email";

export const feedbackSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  type: z.enum(["feedback", "request"], {
    required_error: "You need to select a type.",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." })
    .max(500, { message: "Message must be less than 500 characters." }),
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;

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
