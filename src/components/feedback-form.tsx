"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Gamepad2, Loader2, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitFeedback, feedbackSchema, type FeedbackSchema } from "@/app/actions";
import { StarRating } from "./star-rating";
import { Card, CardContent } from "@/components/ui/card";

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: "",
      type: "feedback",
      message: "",
      rating: 0,
    },
  });

  async function onSubmit(values: FeedbackSchema) {
    if (values.rating === 0) {
      form.setError("rating", { type: "manual", message: "Please select a rating." });
      return;
    }
    setIsSubmitting(true);
    const result = await submitFeedback(values);
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.message || "There was a problem with your submission.",
      });
    }
  }
  
  if (isSubmitted) {
    return (
      <Card className="animate-in fade-in-50 duration-500">
        <CardContent className="p-8 text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-2">Thank You!</h2>
            <p className="text-muted-foreground">Your feedback has been submitted successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-in fade-in-50 duration-500">
        <CardContent className="p-6 sm:p-8">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-lg font-semibold">1. Enter Your Email</FormLabel>
                    <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold">2. Which One?</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                        >
                        <FormItem className="flex-1">
                            <FormControl>
                                <RadioGroupItem value="feedback" id="feedback" className="sr-only peer" />
                            </FormControl>
                            <FormLabel htmlFor="feedback" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">
                                <MessageSquareText className="mb-3 h-6 w-6" />
                                Feedback
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex-1">
                            <FormControl>
                                <RadioGroupItem value="request" id="request" className="sr-only peer" />
                            </FormControl>
                            <FormLabel htmlFor="request" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">
                                <Gamepad2 className="mb-3 h-6 w-6" />
                                Request a Game
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-lg font-semibold">3. What's on your mind?</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Tell us what you think..."
                        className="resize-none"
                        rows={5}
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                        <FormLabel className="text-lg font-semibold mb-2">4. Rate this website</FormLabel>
                        <FormControl>
                            <div className="flex justify-center pt-2">
                              <StarRating value={field.value} onChange={field.onChange} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                
                <Button type="submit" disabled={isSubmitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6">
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                    </>
                ) : (
                    "Submit Feedback"
                )}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
