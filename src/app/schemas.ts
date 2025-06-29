import { z } from "zod";

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
