import React from "react";
import {
  FormControl,
  FormField as HookFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, ChevronDown, InfoIcon, Loader } from "lucide-react";

export interface FormInputProp {
  multiple?: boolean;
  label?: string;
  setFileLink: (e: any) => void;
  fileLink: string[];
  fileType: "image" | "document";
  showLabel?: boolean;
}

export type FieldType =
  | "command"
  | "switch"
  | "select"
  | "combobox"
  | "input"
  | "date";

export interface FormProps {
  form: UseFormReturn<any, any, undefined>;
  name: any;
  secondname?: any;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  cols?: number;
  rows?: number;
  step?: string;
  fieldType?: FieldType;
  data?: Item[];
  url?: string;
  hasLabel?: boolean;
  isLoading?: boolean;
  setSearch?: (e: string) => void;
  search?: string;
  required?: boolean;
  more?: string;
}

export interface Item {
  value: string;
  label: string;
  acc?: string;
  price?: number;
  quantity?: number;
}

export function FormWrapper({
  form,
  name,
  label,
  isLoading,
  hasLabel = true,
  search,
  data,
  setSearch,
  required = true,
  more,
  ...rest
}: FormProps) {
  const { fieldType, ...props } = rest;

  if (!form) {
    throw new Error("Form is required");
  }

  const [open, setOpen] = React.useState(false);

  return (
    <HookFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            {hasLabel && (
              <FormLabel className="font-light">
                {label}
                {label && required && (
                  <span className="text-red-500 pl-1">*</span>
                )}
              </FormLabel>
            )}

            {/* {more && (
              <TooltipWrapper
                children={<InfoIcon className="w-4 h-4" />}
                content={<span className="text-xs text-gray-500">{more}</span>}
              />
            )} */}
          </div>

          {fieldType === "command" ? (
            <Popover open={open} onOpenChange={setOpen} {...props}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? data?.find((item) => item.value == field.value)?.label
                      : "Select item"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-xl p-0">
                <Command shouldFilter={true}>
                  <CommandInput
                    onValueChange={
                      setSearch ? (value) => setSearch(value) : undefined
                    }
                    value={search}
                    placeholder="Search item..."
                    className="h-9"
                  />
                  <CommandEmpty>
                    {isLoading ? (
                      <div className="flex justify-center">
                        <Loader className="w-8 h-8 animate-spin" />
                      </div>
                    ) : (
                      "No item found."
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {data?.map((item, index) => (
                        <CommandItem
                          value={item.label}
                          key={index}
                          onSelect={() => {
                            form.setValue(name, item.value);
                            if (props.secondname) {
                              form.setValue(props.secondname, item.acc);
                            }
                            setOpen(false);
                          }}
                        >
                          {item.label}

                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              item.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          ) : fieldType === "switch" ? (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          ) : fieldType === "select" ? (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.map((item) => (
                  <SelectItem key={item.value} value={item?.value}>
                    {item?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <FormControl>
              {props.cols && props.rows ? (
                <Textarea {...field} {...props} />
              ) : fieldType === "date" ? (
                <Input type="date" {...field} />
              ) : (
                <Input {...field} {...props} />
              )}
            </FormControl>
          )}

          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
