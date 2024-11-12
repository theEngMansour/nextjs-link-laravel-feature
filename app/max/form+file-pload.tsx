"use client";
import Image from "next/image";
import { BasicDataForm, BasicDataFormSchema } from "@/lib/validations";
import { useState } from "react";
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
import { ACCEPTED_FILE_TYPES } from "@/constants";

export default function ProfileForm() {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const form = useForm<BasicDataForm>({
    resolver: zodResolver(BasicDataFormSchema),
    defaultValues: {
      username: "",
      file: undefined,
    },
  });

  const onSubmit = async (data: BasicDataForm) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("file", data.file);
    try {
      // await basic_data(formData);
      form.reset();
      setFilePreview(null);
    } catch (error) {
      console.error("Form submission failed", error);
    }
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
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFilePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Upload an image or PDF file (max 5MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {filePreview && (
          <div className="mt-4">
            {filePreview.startsWith("data:image") ? (
              <Image
                src={filePreview}
                alt="File preview"
                width={20}
                height={20}
                className="h-48 w-full rounded-md"
              />
            ) : (
              <div className="rounded-md bg-gray-100 p-4">
                <p className="text-sm text-gray-600">PDF file selected</p>
              </div>
            )}
          </div>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
