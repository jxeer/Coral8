/**
 * Labor Logging Component
 * Core functionality for recording culturally-rooted labor and earning COW tokens
 * Implements culturally-aware multipliers for different types of work
 * Features form validation, token calculation preview, and attestation upload
 * Central to Coral8's mission of valuing traditionally undercompensated labor
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Upload } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { LABOR_INDEX, calculateCOWTokens, getLaborMultiplier } from "../lib/labor-index";

const laborFormSchema = z.object({
  laborType: z.string().min(1, "Please select a labor type"),
  hoursWorked: z.string().min(1, "Please enter hours worked")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 24;
    }, "Hours must be between 0.1 and 24"),
  attestationUrl: z.string().optional(),
});

type LaborFormValues = z.infer<typeof laborFormSchema>;

export function LaborLogging({ isMobile = false }: { isMobile?: boolean }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LaborFormValues>({
    resolver: zodResolver(laborFormSchema),
    defaultValues: {
      laborType: "",
      hoursWorked: "",
      attestationUrl: "",
    },
  });

  const laborMutation = useMutation({
    mutationFn: async (data: LaborFormValues) => {
      return apiRequest("POST", "/api/labor-logs", data);
    },
    onSuccess: () => {
      toast({
        title: "Labor Log Submitted",
        description: "Your labor has been recorded and COW tokens calculated.",
      });
      form.reset();
      setSelectedFile(null);
      // Invalidate and refetch balance data
      queryClient.invalidateQueries({ queryKey: ["/api/balances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit labor log. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LaborFormValues) => {
    laborMutation.mutate(data);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        // In a real app, you would upload this file and get a URL
        form.setValue('attestationUrl', `uploaded_${file.name}`);
      }
    };
    input.click();
  };

  // Calculate preview COW earnings
  const selectedLaborType = form.watch("laborType");
  const hoursWorked = form.watch("hoursWorked");
  const previewEarnings = selectedLaborType && hoursWorked 
    ? calculateCOWTokens(parseFloat(hoursWorked), getLaborMultiplier(selectedLaborType))
    : 0;

  if (isMobile) {
    return (
      <Card className="p-6 border border-ocean-teal/20">
        <h3 className="text-lg font-semibold text-deep-navy mb-4">Log New Labor</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="laborType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-deep-navy">Labor Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-shell-cream border-ocean-teal/30 focus:ring-ocean-blue">
                        <SelectValue placeholder="Select labor type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(LABOR_INDEX).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type} (×{LABOR_INDEX[type]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hoursWorked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-deep-navy">Hours Worked</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      placeholder="0.0"
                      {...field}
                      className="bg-shell-cream border-ocean-teal/30 focus:ring-ocean-blue"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Community Attestation (Optional)
              </label>
              <div
                onClick={handleFileUpload}
                className="border-2 border-dashed border-ocean-teal/30 rounded-xl p-6 text-center hover:border-ocean-blue transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-ocean-teal mx-auto mb-2" />
                <p className="text-sm text-moon-gray">
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload proof of work'}
                </p>
              </div>
            </div>

            {previewEarnings > 0 && (
              <div className="bg-seafoam/20 rounded-xl p-4 text-center">
                <p className="text-sm text-ocean-blue mb-1">Estimated Earnings</p>
                <p className="text-2xl font-bold text-ocean-blue">{previewEarnings.toFixed(1)} COW</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={laborMutation.isPending}
              className="w-full bg-gradient-to-r from-ocean-blue to-ocean-teal text-pearl-white hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              {laborMutation.isPending ? "Submitting..." : "Submit Labor Log"}
            </Button>
          </form>
        </Form>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 p-6 border border-ocean-teal/20">
      <h3 className="text-lg font-semibold text-deep-navy mb-4">Log New Labor</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="laborType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-deep-navy">Labor Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-shell-cream border-ocean-teal/30 focus:ring-ocean-blue">
                      <SelectValue placeholder="Select labor type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(LABOR_INDEX).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type} (×{LABOR_INDEX[type]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hoursWorked"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-deep-navy">Hours Worked</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    placeholder="0.0"
                    {...field}
                    className="bg-shell-cream border-ocean-teal/30 focus:ring-ocean-blue"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <label className="block text-sm font-medium text-deep-navy mb-2">
              Community Attestation (Optional)
            </label>
            <div
              onClick={handleFileUpload}
              className="border-2 border-dashed border-ocean-teal/30 rounded-xl p-4 text-center hover:border-ocean-blue transition-colors cursor-pointer"
            >
              <Upload className="w-6 h-6 text-ocean-teal mx-auto mb-2" />
              <p className="text-sm text-moon-gray">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload proof of work'}
              </p>
            </div>
          </div>

          {previewEarnings > 0 && (
            <div className="col-span-2 bg-seafoam/20 rounded-xl p-4 text-center">
              <p className="text-sm text-ocean-blue mb-1">Estimated Earnings</p>
              <p className="text-2xl font-bold text-ocean-blue">{previewEarnings.toFixed(1)} COW</p>
            </div>
          )}

          <div className="col-span-2">
            <Button
              type="submit"
              disabled={laborMutation.isPending}
              className="w-full bg-gradient-to-r from-ocean-blue to-ocean-teal text-pearl-white hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              {laborMutation.isPending ? "Submitting..." : "Submit Labor Log"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
