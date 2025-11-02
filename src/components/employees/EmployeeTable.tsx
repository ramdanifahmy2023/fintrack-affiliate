import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmployeeTableProps {
  employees: any[];
  onEdit: (employee: any) => void;
  canManage: boolean;
}

export const EmployeeTable = ({ employees, onEdit, canManage }: EmployeeTableProps) => {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Karyawan</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>No HP</TableHead>
            <TableHead>Status</TableHead>
            {canManage && <TableHead className="text-right">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={employee.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {getInitials(employee.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{employee.full_name}</span>
                </div>
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{getRoleDisplay(employee.role)}</Badge>
              </TableCell>
              <TableCell>{employee.job_position || "-"}</TableCell>
              <TableCell>{employee.phone_number || "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    employee.status === "active"
                      ? "default"
                      : employee.status === "resign"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {getStatusDisplay(employee.status)}
                </Badge>
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
