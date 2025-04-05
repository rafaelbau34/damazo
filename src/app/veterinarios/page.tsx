"use client";
import { useState, useEffect } from "react";
import { Layout } from "app/layout/Layout";
import { Button } from "app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "app/components/ui/card";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";
import { Separator } from "app/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "app/components/ui/table";
import {
  PlusCircle,
  UserCog,
  Stethoscope,
  Mail,
  Phone,
  Trash2,
  Edit2,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { Badge } from "app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";
import { useToast } from "app/components/ui/use-toast";

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  telefono?: string;
  email?: string;
  especialidades: Especialidad[];
  citas?: Cita[];
};

type Especialidad = {
  id: number;
  nombre: string;
  descripcion?: string;
};

type Cita = {
  id: number;
  fecha: Date;
  mascota?: Mascota; // Cambiado a opcional con ?
};

type Mascota = {
  id: number;
  nombre: string;
};

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVet, setCurrentVet] = useState<Veterinario | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    matricula: "",
    telefono: "",
    email: "",
    especialidades: [] as number[],
  });

  useEffect(() => {
    fetchVeterinarios();
    fetchEspecialidades();
  }, []);

  const fetchVeterinarios = async () => {
    try {
      const res = await fetch("/api/veterinarios");
      if (!res.ok) throw new Error("Error al obtener veterinarios");
      const data = await res.json();
      setVeterinarios(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los veterinarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEspecialidades = async () => {
    try {
      const res = await fetch("/api/especialidades");
      if (!res.ok) throw new Error("Error al obtener especialidades");
      const data = await res.json();
      setEspecialidades(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las especialidades",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEspecialidadesChange = (values: string[]) => {
    setFormData({ 
      ...formData, 
      especialidades: values.map(Number) 
    });
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      matricula: "",
      telefono: "",
      email: "",
      especialidades: [],
    });
    setIsEditing(false);
    setCurrentVet(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.matricula) {
      toast({
        title: "Campos requeridos",
        description: "Nombre, apellido y matrícula son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = isEditing && currentVet 
        ? `/api/veterinarios/${currentVet.id}`
        : "/api/veterinarios";
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar veterinario");

      toast({
        title: "Éxito",
        description: isEditing 
          ? "Veterinario actualizado correctamente"
          : "Veterinario agregado correctamente",
      });

      fetchVeterinarios();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el veterinario",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (veterinario: Veterinario) => {
    setCurrentVet(veterinario);
    setFormData({
      nombre: veterinario.nombre,
      apellido: veterinario.apellido,
      matricula: veterinario.matricula,
      telefono: veterinario.telefono || "",
      email: veterinario.email || "",
      especialidades: veterinario.especialidades.map(e => e.id),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este veterinario?")) return;
    
    try {
      const response = await fetch(`/api/veterinarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar veterinario");

      toast({
        title: "Éxito",
        description: "Veterinario eliminado correctamente",
      });

      fetchVeterinarios();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el veterinario",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="text-primary" size={24} />
              Gestión de Veterinarios
            </h1>
            <p className="text-muted-foreground">
              Administra el personal veterinario de la clínica
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2" size={16} />
                Nuevo Veterinario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Veterinario" : "Agregar Nuevo Veterinario"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre*</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: María"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido*</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Ej: González"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="matricula">Matrícula*</Label>
                    <Input
                      id="matricula"
                      name="matricula"
                      value={formData.matricula}
                      onChange={handleInputChange}
                      placeholder="Ej: MV-12345"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Ej: +54 11 1234-5678"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ej: veterinario@clinica.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Especialidades</Label>
                    <Select
                      value={formData.especialidades.map(String)}
                      onValueChange={handleEspecialidadesChange}
                      multiple
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione especialidades">
                          {formData.especialidades.length > 0
                            ? `${formData.especialidades.length} seleccionadas`
                            : "Ninguna seleccionada"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((especialidad) => (
                          <SelectItem 
                            key={especialidad.id} 
                            value={especialidad.id.toString()}
                          >
                            {especialidad.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Actualizar" : "Guardar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-6" />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : veterinarios.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No hay veterinarios registrados</CardTitle>
              <CardDescription>
                Comienza agregando tu primer veterinario
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {veterinarios.map((veterinario) => (
              <Card key={veterinario.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserCog className="text-primary" size={18} />
                        {veterinario.nombre} {veterinario.apellido}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <BadgeCheck size={14} className="text-green-500" />
                        {veterinario.matricula}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(veterinario)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(veterinario.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  {veterinario.telefono && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-muted-foreground" />
                      <span>{veterinario.telefono}</span>
                    </div>
                  )}
                  
                  {veterinario.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-muted-foreground" />
                      <span>{veterinario.email}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Especialidades</h4>
                    <div className="flex flex-wrap gap-1">
                      {veterinario.especialidades.length > 0 ? (
                        veterinario.especialidades.map((especialidad) => (
                          <Badge 
                            key={especialidad.id} 
                            variant="outline"
                            className="text-xs"
                          >
                            {especialidad.nombre}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Sin especialidades asignadas
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {veterinario.citas && veterinario.citas.length > 0 && (
                    <>
                      <Separator className="my-2" />
                      <div>
                        <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Calendar size={14} />
                          Próximas citas ({veterinario.citas.length})
                        </h4>
                        <ul className="space-y-1">
                          {veterinario.citas.slice(0, 3).map((cita) => (
                            <li key={cita.id} className="text-xs">
                              {new Date(cita.fecha).toLocaleDateString()} - {cita.mascota?.nombre || 'Mascota no especificada'}
                            </li>
                          ))}
                          {veterinario.citas.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{veterinario.citas.length - 3} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                  <Button variant="secondary" size="sm">
                    Agendar cita
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}