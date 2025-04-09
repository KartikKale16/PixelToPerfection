import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Users, LinkedinIcon, TwitterIcon, GithubIcon } from "lucide-react";
import { useAuth } from '@/lib/AuthContext';
import { membersApi } from '@/lib/api';
import { Badge } from "@/components/ui/badge";
import { toast } from '@/components/ui/use-toast';

interface Member {
  _id: string;
  name: string;
  position: string;
  bio: string;
  email: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  active: boolean;
  joinDate: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await membersApi.getMembers();
        if (response.success && response.data) {
          setMembers(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load committee members",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to load committee members",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleAddMember = () => {
    navigate('/members/create');
  };
  
  const handleEditMember = (id: string) => {
    navigate(`/members/edit/${id}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Committee Members</h1>
          <p className="text-muted-foreground">Meet the team behind ACES events</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={handleAddMember}>
            Add Member
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No members found</h3>
          <p className="text-muted-foreground">Committee members will appear here once added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{member.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {member.position}
                      </Badge>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditMember(member._id)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {member.email}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 border-t">
                <div className="flex gap-2">
                  {member.socialLinks?.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <LinkedinIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <TwitterIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {member.socialLinks?.github && (
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(member.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short'
                  })}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Members; 