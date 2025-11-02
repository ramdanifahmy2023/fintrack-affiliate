import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  employee: any | null;
  groups: any[];
}

export const EmployeeDialog = ({ open, onClose, employee, groups }: EmployeeDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    role: "staff",
    job_position: "",
    start_work_date: "",
    group_id: "",
    status: "active",
    password: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name || "",
        email: employee.email || "",
        phone_number: employee.phone_number || "",
        date_of_birth: employee.date_of_birth || "",
        address: employee.address || "",
        role: employee.role || "staff",
        job_position: employee.job_position || "",
        start_work_date: employee.start_work_date || "",
        group_id: employee.group_id || "",
        status: employee.status || "active",
        password: "",
      });
    } else {
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        address: "",
        role: "staff",
        job_position: "",
        start_work_date: "",
        group_id: "",
        status: "active",
        password: "",
      });
    }
  }, [employee, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (employee) {
        // Update existing employee
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            date_of_birth: formData.date_of_birth || null,
            address: formData.address,
            role: formData.role,
            job_position: formData.job_position,
            start_work_date: formData.start_work_date || null,
            group_id: formData.group_id || null,
            status: formData.status,
          })
          .eq("id", employee.id);

        if (error) throw error;
        toast.success("Data karyawan berhasil diupdate");
      } else {
        // Create new employee
        // First create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile
          const { error: profileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            date_of_birth: formData.date_of_birth || null,
            address: formData.address,
            role: formData.role,
            job_position: formData.job_position,
            start_work_date: formData.start_work_date || null,
            group_id: formData.group_id || null,
            status: formData.status,
          });

          if (profileError) throw profileError;
        }

        toast.success("Karyawan berhasil ditambahkan");
      }

      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Karyawan" : "Tambah Karyawan Baru"}
          </DialogTitle>
          <DialogDescription>
            {employee
              ? "Ubah data karyawan yang sudah ada"
              : "Tambahkan karyawan baru ke sistem"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={!!employee}
              />
            </div>

            {!employee && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={8}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone_number">No HP</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_position">Jabatan</Label>
              <Input
                id="job_position"
                value={formData.job_position}
                onChange={(e) =>
                  setFormData({ ...formData, job_position: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_work_date">Tanggal Mulai Kerja</Label>
              <Input
                id="start_work_date"
                type="date"
                value={formData.start_work_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_work_date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group_id">Group</Label>
              <Select
                value={formData.group_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, group_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tidak ada group</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                  <SelectItem value="resign">Resign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : employee ? "Update" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
