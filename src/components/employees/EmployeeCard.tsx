import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmployeeCardProps {
  employee: any;
  onEdit: (employee: any) => void;
  canManage: boolean;
}

export const EmployeeCard = ({ employee, onEdit, canManage }: EmployeeCardProps) => {
  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, any> = {
      superadmin: "default",
      leader: "secondary",
      admin: "outline",
      staff: "outline",
      viewer: "outline",
    };
    return variants[role] || "outline";
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, any> = {
      active: "default",
      inactive: "secondary",
      resign: "destructive",
    };
    return variants[status] || "outline";
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      superadmin: "Superadmin",
      leader: "Leader",
      admin: "Admin",
      staff: "Staff",
      viewer: "Viewer",
    };
    return roleMap[role] || role;
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      active: "Aktif",
      inactive: "Nonaktif",
      resign: "Resign",
    };
    return statusMap[status] || status;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-elegant transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(employee.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{employee.full_name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant={getRoleBadgeVariant(employee.role)}>
                  {getRoleDisplay(employee.role)}
                </Badge>
                <Badge variant={getStatusBadgeVariant(employee.status)}>
                  {getStatusDisplay(employee.status)}
                </Badge>
              </div>
            </div>
          </div>
          {canManage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(employee)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {employee.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{employee.email}</span>
            </div>
          )}
          {employee.phone_number && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{employee.phone_number}</span>
            </div>
          )}
          {employee.job_position && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{employee.job_position}</span>
            </div>
          )}
          {employee.start_work_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Bergabung:{" "}
                {new Date(employee.start_work_date).toLocaleDateString("id-ID")}
              </span>
            </div>
          )}
          {employee.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{employee.address}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
