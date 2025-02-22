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

interface MemberData {
  first_name: string;
  last_name: string;
  email: string;
  middle_name: string;
  mobile: string;
  gender: string;
  profile_photo_url: string | null;
  role_name: string;
}

const editProfileSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
});

export type EditProfileType = z.infer<typeof editProfileSchema>;

export function EditProfilePage({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<EditProfileType>({
    defaultValues: {
      id: "",
      first_name: get(memberData?.first_name, ""),
      middle_name: get(memberData?.middle_name, ""),
      last_name: get(memberData?.last_name, ""),
      email: get(memberData?.email, ""),
      mobile: get(memberData?.mobile, ""),
    },
  });

  useEffect(() => {
    const data = localStorage.getItem("memberData");
    if (data) {
      setMemberData(JSON.parse(data));

      const member = JSON.parse(data) as EditProfileType;
      if (member) {
        form.setValue("id", member.id);
        form.setValue("first_name", member.first_name);
        form.setValue("middle_name", member.middle_name);
        form.setValue("last_name", member.last_name);
        form.setValue("email", member.email);
        form.setValue("mobile", member.mobile);
      }
    }
  }, []);

  if (!memberData) return <div>Loading...</div>;

  const onSubmit = async (values: EditProfileType) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/members/${values.id}`, values);
      console.log(response);
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
