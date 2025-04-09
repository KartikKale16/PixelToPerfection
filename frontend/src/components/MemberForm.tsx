import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { membersApi } from '@/lib/api';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }).max(100),
  position: z.string().min(2, {
    message: 'Position must be at least 2 characters.',
  }).max(100),
  bio: z.string().max(1000, {
    message: 'Bio must not exceed 1000 characters.',
  }).optional(),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }).optional(),
  phoneNumber: z.string().optional(),
  priority: z.coerce.number().int().min(1, {
    message: 'Priority must be at least 1.',
  }).optional(),
  isActive: z.boolean().default(true),
  linkedin: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional().or(z.literal('')),
  twitter: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional().or(z.literal('')),
  github: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const MemberForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isEditMode = !!id;

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      position: '',
      bio: '',
      email: '',
      phoneNumber: '',
      priority: 999,
      isActive: true,
      linkedin: '',
      twitter: '',
      github: '',
    },
  });

  // Fetch member data if in edit mode
  useEffect(() => {
    const fetchMember = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await membersApi.getMember(id);
          
          if (response.success && response.data) {
            const member = response.data;
            
            // Set form values
            form.setValue('name', member.name);
            form.setValue('position', member.position);
            form.setValue('bio', member.bio || '');
            form.setValue('email', member.email || '');
            form.setValue('phoneNumber', member.phoneNumber || '');
            form.setValue('priority', member.priority || 999);
            form.setValue('isActive', member.isActive);
            
            // Set social links
            if (member.socialLinks) {
              form.setValue('linkedin', member.socialLinks.linkedin || '');
              form.setValue('twitter', member.socialLinks.twitter || '');
              form.setValue('github', member.socialLinks.github || '');
            }
            
            // Set image preview
            if (member.image) {
              setImagePreview(member.image);
            }
          } else {
            toast({
              title: 'Error',
              description: 'Failed to load member data',
              variant: 'destructive',
            });
            navigate('/members');
          }
        } catch (error) {
          console.error('Error fetching member:', error);
          toast({
            title: 'Error',
            description: 'Failed to load member data',
            variant: 'destructive',
          });
          navigate('/members');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchMember();
  }, [id, isEditMode, navigate, form]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('position', values.position);
      
      if (values.bio) formData.append('bio', values.bio);
      if (values.email) formData.append('email', values.email);
      if (values.phoneNumber) formData.append('phoneNumber', values.phoneNumber);
      if (values.priority !== undefined) formData.append('priority', values.priority.toString());
      formData.append('isActive', values.isActive.toString());
      
      // Social links
      const socialLinks = {
        linkedin: values.linkedin || '',
        twitter: values.twitter || '',
        github: values.github || '',
      };
      formData.append('socialLinks', JSON.stringify(socialLinks));
      
      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Submit form data
      let response;
      if (isEditMode) {
        response = await membersApi.updateMember(id, formData);
      } else {
        response = await membersApi.createMember(formData);
      }
      
      if (response.success) {
        toast({
          title: 'Success',
          description: isEditMode ? 'Member updated successfully' : 'Member created successfully',
        });
        navigate('/members');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: 'Error',
        description: 'Failed to save member data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Member' : 'Add New Member'}</CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Update the committee member information' 
            : 'Add a new member to the committee'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="w-24 h-24 rounded-md overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-xs"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended size: 400x400 pixels
              </p>
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position*</FormLabel>
                    <FormControl>
                      <Input placeholder="President" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description about the member" 
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Limit: 1000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Priority</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Lower numbers display first (e.g., 1 = highest priority)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Inactive members won't appear on the public page
                      </FormDescription>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/members')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Member' : 'Create Member'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MemberForm; 