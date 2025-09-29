"use client";

import { Button } from "@/components/ui/button";
import { DatetimePickerField } from "@/components/ui/datetime-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "@/hooks/mutations/use-create-task";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ListTodo, LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().trim().min(1, { error: "Title cannot be empty" }).max(64, {
    error: "Title is too long. Keep it short",
  }),
  notes: z.coerce.string().trim(),
  expires_at: z.date({ error: "Setting deadline is required" }),
  completed_at: z.union([z.date(), z.null()]),
});

const createSchemaResolver = zodResolver(createSchema);

export function CreateTaskButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    mode: "all",
    resolver: createSchemaResolver,
    defaultValues: {
      title: "",
      notes: "",
      completed_at: null,
    },
  });

  const { mutation } = useCreateTask();

  useEffect(
    function resetFormOnClose() {
      const isClosing = !isDialogOpen;
      if (isClosing) form.reset();
    },
    [form, isDialogOpen],
  );

  const isCreateButtonDisabled =
    !form.formState.isValid ||
    form.formState.isLoading ||
    form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit(async (data) => {
    mutation.mutateAsync(data, {
      onSuccess() {
        form.reset();

        queryClient.refetchQueries({
          queryKey: ["tasks"],
        });
      },
      onError(err) {
        toast.error(err.message);
      },
    });
  });

  function handleDialogOpenChange(isOpen: boolean) {
    const isClosing = !isOpen;
    if (isClosing && (form.formState.isValid || mutation.isPending)) return;
    setIsDialogOpen(isOpen);
  }

  function handleCancel() {
    if (mutation.isPending) {
      mutation.reset();
    }

    setIsDialogOpen(false);
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="lg" className="cursor-pointer">
            <Plus size={16} />
            New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] pt-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ListTodo size={24} />
              <DialogTitle>Create a new task</DialogTitle>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your task title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          {/* @ts-expect-error ... */}
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Complete Before</FormLabel>
                        <FormControl>
                          <DatetimePickerField {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the task deadline.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button type="submit" disabled={isCreateButtonDisabled}>
                  {mutation.isPending && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {mutation.isPending ? "Creating" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
