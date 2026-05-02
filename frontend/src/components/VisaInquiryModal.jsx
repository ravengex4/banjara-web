import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm as useFormspree } from '@formspree/react';
import { submitVisaInquiry } from '../services/formspreeService';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15).regex(/^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]*$/, 'Invalid phone format'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
  visaType: z.string().min(1, 'Visa type is required'),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
  agree: z.boolean().refine(val => val === true, 'You must agree to be contacted'),
});

const VisaInquiryModal = ({ isOpen, onOpenChange, visaData }) => {
  const [state, handleSubmit] = useFormspree('xeenoajz');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      country: visaData?.name || '',
      visaType: visaData?.visa_type || '',
      message: '',
      agree: false,
    },
  });

  // Update form when visaData changes
  React.useEffect(() => {
    if (visaData) {
      form.reset({
        ...form.getValues(),
        country: visaData.name,
        visaType: visaData.visa_type,
      });
    }
  }, [visaData, form]);

  const onSubmit = async (values) => {
    const now = Date.now();
    if (now - lastSubmitTime < 60000) {
      setErrorMessage('Please wait a minute before submitting another inquiry.');
      return;
    }

    try {
      // Map form values to match Formspree's expected payload
      const payload = {
        ...values,
        visa_record_id: visaData?.id,
        submission_timestamp: new Date().toISOString(),
      };
      
      const response = await handleSubmit(payload);
      
      if (response.body?.ok || response.response?.ok) {
        setLastSubmitTime(now);
        setTimeout(() => {
          onOpenChange(false);
          form.reset();
        }, 3000);
      }
    } catch (error) {
      setErrorMessage('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#003D52]">Visa Inquiry</DialogTitle>
          <DialogDescription>
            Applying for {visaData?.name} {visaData?.visa_type}. Please fill in your details and our expert will contact you.
          </DialogDescription>
        </DialogHeader>

        {state.succeeded ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#003D52] mb-2">Inquiry Submitted!</h3>
            <p className="text-sm text-slate-600">Your inquiry has been submitted successfully. Admin will contact you soon.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Country</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-slate-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visa Type</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-slate-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us more about your travel plans..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs text-slate-600">
                        I agree to be contacted by the admin regarding my visa inquiry.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {(state.errors || errorMessage) && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage || "Submission failed. Please try again."}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#FF2A2A] hover:bg-[#E01F1F] text-white font-bold h-12"
                disabled={state.submitting}
              >
                {state.submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit Inquiry'}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VisaInquiryModal;
