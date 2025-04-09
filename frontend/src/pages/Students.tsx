import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Users, ArrowLeftIcon, GraduationCapIcon, SearchIcon, FileUp, Upload, AlertTriangle } from "lucide-react";
import { useAuth } from '@/lib/AuthContext';
import { studentsApi } from '@/lib/api';
import { Badge } from "@/components/ui/badge";
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Student {
  _id: string;
  name: string;
  studentId: string;
  program: string;
  year: string;
  email: string;
  phone?: string;
  image: string;
  active: boolean;
  joinDate: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getStudents();
      
      if (response.success) {
        if (response.data && Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          console.error('Unexpected response format:', response);
          toast({
            title: "Error",
            description: "Received an unexpected data format from server",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load students",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleAddStudent = () => {
    navigate('/students/create');
  };
  
  const handleEditStudent = (id: string) => {
    navigate(`/students/edit/${id}`);
  };

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a CSV
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setCsvError('Please upload a valid CSV file');
        setCsvFile(null);
        return;
      }
      
      setCsvFile(file);
      setCsvError(null);
    }
  };

  const handleImportCsv = async () => {
    if (!csvFile) {
      setCsvError('Please select a CSV file first');
      return;
    }

    try {
      setIsImporting(true);
      const response = await studentsApi.importStudentsCSV(csvFile);
      
      if (response.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${response.count || 'multiple'} students.`,
        });
        
        // Close dialog and refresh students list
        setImportDialogOpen(false);
        setCsvFile(null);
        fetchStudents();
      } else {
        toast({
          title: "Import Failed",
          description: response.message || "Failed to import students from CSV",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error importing students:', error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const filteredStudents = searchQuery
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.program.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1"
          >
            <ArrowLeftIcon size={16} />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Directory</h1>
            <p className="text-muted-foreground">Manage and view all student information</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2"
              />
              <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {user?.role === 'admin' && (
              <>
                <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileUp size={16} />
                      Import CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Students from CSV</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file with student data. Only student names and seat numbers (student IDs) will be imported.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="csvUpload"
                          accept=".csv"
                          onChange={handleCsvChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="csvUpload"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm font-medium">
                            {csvFile ? csvFile.name : 'Click to upload CSV file'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            CSV with Name and Seat No. columns
                          </span>
                        </label>
                      </div>

                      {csvError && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{csvError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">Required CSV Format</h4>
                        <p className="text-xs text-gray-500">
                          Your CSV file should have two columns: "Name" and "Seat No."
                        </p>
                        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                          Name,Seat No.<br />
                          John Doe,S12345<br />
                          Jane Smith,S67890
                        </pre>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleImportCsv} 
                        disabled={!csvFile || isImporting}
                      >
                        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import Students
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button onClick={handleAddStudent}>
                  Add Student
                </Button>
              </>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCapIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {searchQuery ? "No matching students found" : "No students found"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Try adjusting your search criteria" 
                : "Students will appear here once added."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border">
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{student.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {student.program ? `${student.program} - Year ${student.year}` : 'Seat No: ' + student.studentId}
                        </Badge>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditStudent(student._id)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Student ID:</span> {student.studentId}</p>
                    {student.email && <p><span className="font-medium">Email:</span> {student.email}</p>}
                    {student.phone && (
                      <p><span className="font-medium">Phone:</span> {student.phone}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2 border-t">
                  <Badge variant={student.active ? "default" : "secondary"}>
                    {student.active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {student.joinDate ? new Date(student.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short'
                    }) : 'N/A'}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Students; 