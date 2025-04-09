import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeftIcon, Loader2, Upload, Trash2 } from 'lucide-react';
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
  active: z.boolean().default(true),
  image: z.instanceof(File).optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface Student {
  _id: string;
  name: string;
  studentId: string;
  program?: string;
  year?: string;
  email?: string;
  phone?: string;
  image: string;
  active: boolean;
  joinDate: string;
}

const EditStudent = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      studentId: '',
      active: true,
    },
  });
  
  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await studentsApi.getStudent(id);
        
        if (response.success && response.data) {
          setStudent(response.data);
          const studentData = response.data;
          
          // Set form values
          form.reset({
            name: studentData.name,
            studentId: studentData.studentId,
            active: studentData.active,
          });
          
          // Set preview image if available
          if (studentData.image) {
            setPreviewImage(studentData.image);
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load student information.",
            variant: "destructive",
          });
          navigate('/students');
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading student data.",
          variant: "destructive",
        });
        navigate('/students');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudent();
  }, [id, navigate, toast, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const onSubmit = async (data: StudentFormValues) => {
    if (!id) return;
    
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
      
      const response = await studentsApi.updateStudent(id, formData);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: "Student information has been updated.",
        });
        navigate('/students');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update student information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const response = await studentsApi.deleteStudent(id);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: "Student has been deleted.",
        });
        navigate('/students');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete student.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto py-10 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-lg">Loading student information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Student</h1>
            <p className="text-muted-foreground">Update student information</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-1">
                <Trash2 size={16} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this student from the system. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Mark student as currently active
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default EditStudent; 