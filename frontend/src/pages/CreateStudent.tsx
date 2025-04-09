import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeftIcon, Loader2, Upload } from 'lucide-react';
import { studentsApi } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/lib/AuthContext';

const studentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  studentId: z.string().min(2, {
    message: "Student ID (Seat No.) is required.",
  }),
  image: z.instanceof(File).optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

const CreateStudent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check if user is admin
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      studentId: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const onSubmit = async (data: StudentFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all form fields to formData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined && key !== 'image') {
          formData.append(key, String(value));
        }
      });
      
      // Set active to true by default
      formData.append('active', 'true');
      
      const response = await studentsApi.createStudent(formData);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: "Student has been successfully created.",
        });
        navigate('/students');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create student.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/students')}
          className="flex items-center gap-1 mb-6"
        >
          <ArrowLeftIcon size={16} />
          Back to Students
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Student</h1>
          <p className="text-muted-foreground">Create a new student record with name and seat number</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="w-full aspect-square mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center p-6 text-center">
                      <Upload size={40} />
                      <p className="mt-2">Upload student photo (optional)</p>
                    </div>
                  )}
                </div>
                
                <div className="w-full">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, at least 300x300px
                  </p>
                </div>
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seat No.</FormLabel>
                      <FormControl>
                        <Input placeholder="S12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/students')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Student
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateStudent; 