/**
 * Labor Logging Component
 * Core form for recording culturally-rooted labor and earning COW tokens.
 *
 * How it works:
 *   1. User selects a labor type from the LABOR_INDEX (e.g. "Care Work", "Teaching")
 *   2. User enters hours worked (0.1–24, in 0.5-hour increments)
 *   3. Optionally uploads an attestation file (photo/PDF proof of work)
 *   4. A live earnings preview updates as the user types
 *   5. On submit, the form posts to POST /api/labor-logs
 *   6. On success, the token balances and stats caches are invalidated
 *      so the dashboard reflects the newly earned COW tokens immediately
 *
 * Rendered in two layouts via the isMobile prop:
 *   - Mobile:  single-column stacked form inside a Card
 *   - Desktop: two-column grid form spanning a wider Card
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

/**
 * Zod schema for the labor logging form.
 * - laborType must be a non-empty string (validated against LABOR_INDEX keys on the server)
 * - hoursWorked must parse to a number between 0.1 and 24
 * - attestationUrl is optional; it gets populated by the file upload handler
 */
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
  // Tracks the file object selected by the user for display purposes
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

  /**
   * Mutation for submitting the labor log to the API.
   * On success:
   *   - Shows a confirmation toast
   *   - Resets the form back to empty defaults
   *   - Invalidates /api/balances and /api/stats so token totals refresh
   * On error:
   *   - Shows a destructive toast with a retry prompt
   */
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
      // Invalidate and refetch balance and stats data so the dashboard updates
      queryClient.invalidateQueries({ queryKey: ["/api/balances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
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

  /**
   * Opens a native file picker and stores the selected file.
   * In this version the filename is stored in the form field as a placeholder.
   * TODO: Wire this up to an actual file upload endpoint (e.g. S3 or Cloudinary)
   *       so the attestation URL points to a real hosted file.
   */
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        // Placeholder — replace with real upload URL once file storage is wired up
        form.setValue('attestationUrl', `uploaded_${file.name}`);
      }
    };
    input.click();
  };

  /**
   * Live earnings preview — recalculates whenever the user changes the labor
   * type or hours worked. Uses the same formula the server applies so the
   * displayed estimate exactly matches what will be recorded.
   * Returns 0 if either field is empty, hiding the preview panel entirely.
   */
  const selectedLaborType = form.watch("laborType");
  const hoursWorked = form.watch("hoursWorked");
  const previewEarnings = selectedLaborType && hoursWorked 
    ? calculateCOWTokens(parseFloat(hoursWorked), getLaborMultiplier(selectedLaborType))
    : 0;

  // ── Mobile layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Card className="p-6 border border-ocean-teal/20">
        <h3 className="text-lg font-semibold text-deep-navy mb-4">Log New Labor</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Labor type dropdown — populated from the LABOR_INDEX multiplier map */}
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
                      {/* Show each labor type with its COW multiplier in the label */}
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

            {/* Hours worked — step 0.5 so users can log half-hour increments */}
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

            {/* Optional attestation file upload */}
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

            {/* Live earnings preview — only visible once both fields are filled */}
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

  // ── Desktop layout (two-column grid) ────────────────────────────────────
  return (
    <Card className="col-span-2 p-6 border border-ocean-teal/20">
      <h3 className="text-lg font-semibold text-deep-navy mb-4">Log New Labor</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* Labor type dropdown */}
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

          {/* Hours worked */}
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

          {/* Attestation upload — spans both columns on desktop */}
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

          {/* Earnings preview — spans both columns, hidden until fields are valid */}
          {previewEarnings > 0 && (
            <div className="col-span-2 bg-seafoam/20 rounded-xl p-4 text-center">
              <p className="text-sm text-ocean-blue mb-1">Estimated Earnings</p>
              <p className="text-2xl font-bold text-ocean-blue">{previewEarnings.toFixed(1)} COW</p>
            </div>
          )}

          {/* Submit button — spans both columns */}
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
