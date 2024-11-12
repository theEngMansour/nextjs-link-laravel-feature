"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { basicDataFormSchema } from "@/lib/validations";
import { basic_data } from "@/lib/student/student.actions";

const extendedSchema = basicDataFormSchema.extend({
  files: z.array(z.instanceof(File)).max(4, "You can upload up to 4 files"),
});

export default function ProfileForm() {
  const form = useForm<z.infer<typeof extendedSchema>>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      username: "",
      files: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof extendedSchema>) => {
    const formData = new FormData();
    formData.append("username", data.username);
    data.files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    await basic_data(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Files</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    field.onChange(files.slice(0, 4));
                  }}
                  accept="image/*,application/pdf"
                />
              </FormControl>
              <FormDescription>
                You can upload up to 4 files (images or PDFs).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          {form.watch("files").map((file, index) => (
            <div key={index} className="text-sm text-gray-500">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          ))}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}