"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { get } from "lodash";
import { FormWrapper } from "./widgets/form-wrapper";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import axiosInstance from "@/commons/axios";
import { MemberData } from "@/types/member";

const editProfileSchema = z.object({
  member_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
});

export type EditProfileType = z.infer<typeof editProfileSchema>;

export function EditProfilePage({
  open,
  data,
  onClose,
}: {
  open: boolean;
  data: MemberData;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<EditProfileType>({
    defaultValues: {
      member_id: data?.member_id.toString() || "",
      first_name: data?.first_name ?? "",
      middle_name: data?.middle_name ?? "",
      last_name: data?.last_name ?? "",
      email: data?.email ?? "",
      mobile: data?.mobile ?? "",
    },
  });

  const onSubmit = async (values: EditProfileType) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/members/${values.member_id}`,
        values
      );
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogDescription>
            Are you sure you want to update the data of your profile? if not
            please close this modal.
          </DialogDescription>

          <Form {...form}>
            <form
              className="space-y-4 pt-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormWrapper
                form={form}
                name="first_name"
                fieldType="input"
                label="First Name"
                required={false}
              />
              <FormWrapper
                form={form}
                name="middle_name"
                fieldType="input"
                label="Middle Name"
                required={false}
              />
              <FormWrapper
                form={form}
                name="last_name"
                fieldType="input"
                label="Last Name"
                required={false}
              />

              <FormWrapper
                form={form}
                name="email"
                fieldType="input"
                label="Email"
                required={false}
              />

              <div className="flex justify-end space-x-4">
                <Button variant={"destructive"} onClick={onClose}>
                  Close
                </Button>
                <Button type="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
