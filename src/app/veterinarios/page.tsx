"use client";

import { useEffect, useState } from "react";
import { Button } from "app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "app/components/ui/card";
import { Layout } from "app/layout/Layout";
import { Input } from "app/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "app/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Trash2,
  Pencil,
  Plus,
  X,
  List,
  BriefcaseMedical,
  Phone,
  Mail,
  User,
  Search,
  Filter,
} from "lucide-react";

import { Skeleton } from 'app/components/ui/skeleton';

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string;
};

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [filteredVeterinarios, setFilteredVeterinarios] = useState<Veterinario[]>([]);
  const [isAddingVeterinario, setIsAddingVeterinario] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formVeterinario, setFormVeterinario] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
    email: "",
  });

  const [estado, setEstado] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: false,
    error: null,
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: 0,
    message: "",
  });

  // Filtra veterinarios según término de búsqueda
  useEffect(() => {
    const filtered = veterinarios.filter(
      (vet) =>
        vet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.telefono.includes(searchTerm) ||
        vet.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVeterinarios(filtered);
  }, [searchTerm, veterinarios]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      nombre: "",
      apellido: "",
      especialidad: "",
      telefono: "",
      email: "",
    };

    if (!formVeterinario.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
      valid = false;
    }

    if (!formVeterinario.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
      valid = false;
    }

    if (!formVeterinario.especialidad.trim()) {
      newErrors.especialidad = "La especialidad es requerida";
      valid = false;
    }

    if (!formVeterinario.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
      valid = false;
    } else if (!/^[\d\s+-]+$/.test(formVeterinario.telefono)) {
      newErrors.telefono = "Teléfono no válido";
      valid = false;
    }

    if (!formVeterinario.email.trim()) {
      newErrors.email = "El email es requerido";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formVeterinario.email)) {
      newErrors.email = "Email no válido";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const confirmDeleteVeterinario = (id: number, nombre: string, apellido: string) => {
    setDeleteDialog({
      open: true,
      id,
      message: `¿Estás seguro de que deseas eliminar al veterinario ${nombre} ${apellido}?`,
    });
  };

  const handleDeleteConfirmed = async () => {
    try {
      setEstado({ ...estado, loading: true });
      const res = await fetch(`/api/veterinarios/${deleteDialog.id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Error al eliminar veterinario");
      
      toast.success("Veterinario eliminado correctamente");
      await fetchVeterinarios();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar veterinario");
    } finally {
      setDeleteDialog({ open: false, id: 0, message: "" });
      setEstado({ ...estado, loading: false });
    }
  };

  const fetchVeterinarios = async () => {
    setEstado({ loading: true, error: null });
    try {
      const res = await fetch("/api/veterinarios");
      if (!res.ok) throw new Error("Error al obtener veterinarios");
      const data: Veterinario[] = await res.json();
      setVeterinarios(data);
      setFilteredVeterinarios(data);
      setEstado({ loading: false, error: null });
    } catch (error) {
      setEstado({ loading: false, error: "Hubo un problema al cargar los veterinarios." });
      console.error(error);
      toast.error("Error al cargar veterinarios");
    }
  };

  const handleSubmitVeterinario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setEstado({ ...estado, loading: true });
      const res = await fetch(
        editandoId ? `/api/veterinarios/${editandoId}` : "/api/veterinarios",
        {
          method: editandoId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formVeterinario),
        }
      );

      if (!res.ok) throw new Error("Error al guardar veterinario");

      toast.success(
        editandoId 
          ? "Veterinario actualizado correctamente" 
          : "Veterinario creado correctamente"
      );

      setFormVeterinario({
        nombre: "",
        apellido: "",
        especialidad: "",
        telefono: "",
        email: "",
      });
      setEditandoId(null);
      setIsAddingVeterinario(false);
      await fetchVeterinarios();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar veterinario");
    } finally {
      setEstado({ ...estado, loading: false });
    }
  };

  const handleEditVeterinario = (veterinario: Veterinario) => {
    setFormVeterinario(veterinario);
    setEditandoId(veterinario.id);
    setIsAddingVeterinario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchVeterinarios();
  }, []);

  return (
    <Layout>
     <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
  {/* Encabezado */}
  <div className="max-w-2xl mx-auto mt-10"> {/* Más separación */}
    <h1
      className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-12
      bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-lime-500 to-emerald-500
      dark:from-green-300 dark:via-lime-300 dark:to-emerald-300
      drop-shadow-xl dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]
      transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-1 hover:brightness-125
      animate__animated animate__fadeInDown hover:animate__pulse"
    >
      🏥 Gestión de Veterinarios
    </h1>
{/* Controles superiores */}
<div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
  {/* Botones */}
  <div className="flex gap-2">
    {/* Botón Agregar/Cancelar */}
    <Button
      onClick={() => setIsAddingVeterinario(!isAddingVeterinario)}
      className="relative overflow-hidden px-4 py-2 rounded-lg text-black font-semibold 
      bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 
      shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 
      flex items-center gap-2 group"
    >
      <span className="absolute inset-0 bg-white opacity-10 blur-lg group-hover:animate-pulse" />
      {isAddingVeterinario ? (
        <>
          <X className="w-5 h-5" /> Cancelar
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" /> Agregar Veterinario
        </>
      )}
    </Button>
  </div>

  {/* Buscador */}
  <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg border-2 border-lime-500">
    <Search className="w-5 h-5 text-lime-500" />
    <Input
      type="text"
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border-none outline-none focus:ring-0"
    />
  </div>
</div>

{/* Formulario de agregar/editar */}
{isAddingVeterinario && (
  <form onSubmit={handleSubmitVeterinario} className="bg-white p-4 rounded-lg shadow-lg space-y-4">
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="font-semibold text-gray-700">Nombre</label>
        <input
          type="text"
          value={formVeterinario.nombre}
          onChange={(e) => setFormVeterinario({ ...formVeterinario, nombre: e.target.value })}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <span className="text-red-600">{formErrors.nombre}</span>
      </div>
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="font-semibold text-gray-700">Apellido</label>
        <input
          type="text"
          value={formVeterinario.apellido}
          onChange={(e) => setFormVeterinario({ ...formVeterinario, apellido: e.target.value })}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <span className="text-red-600">{formErrors.apellido}</span>
      </div>
    </div>
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="font-semibold text-gray-700">Especialidad</label>
        <input
          type="text"
          value={formVeterinario.especialidad}
          onChange={(e) => setFormVeterinario({ ...formVeterinario, especialidad: e.target.value })}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <span className="text-red-600">{formErrors.especialidad}</span>
      </div>
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="font-semibold text-gray-700">Teléfono</label>
        <input
          type="text"
          value={formVeterinario.telefono}
          onChange={(e) => setFormVeterinario({ ...formVeterinario, telefono: e.target.value })}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <span className="text-red-600">{formErrors.telefono}</span>
      </div>
    </div>
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="font-semibold text-gray-700">Email</label>
        <input
          type="text"
          value={formVeterinario.email}
          onChange={(e) => setFormVeterinario({ ...formVeterinario, email: e.target.value })}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <span className="text-red-600">{formErrors.email}</span>
      </div>
    </div>

    <div className="flex justify-center gap-4">
      <Button type="submit" className="bg-lime-500 text-white hover:bg-lime-600 rounded-md">
        {editandoId ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  </form>
)}

{/* Tabla de veterinarios */}
{estado.loading ? (
  <Skeleton className="w-full h-12 rounded-md" />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredVeterinarios.map((veterinario) => (
      <Card key={veterinario.id}>
        <CardHeader>
          <CardTitle>
            {veterinario.nombre} {veterinario.apellido}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">Especialidad: {veterinario.especialidad}</p>
            <p className="text-sm">Teléfono: {veterinario.telefono}</p>
            <p className="text-sm">Email: {veterinario.email}</p>
          </div>
        </CardContent>
        <div className="p-2 flex justify-between gap-2">
          <Button
            onClick={() => handleEditVeterinario(veterinario)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          >
            <Pencil className="w-5 h-5" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                onClick={() => confirmDeleteVeterinario(veterinario.id, veterinario.nombre, veterinario.apellido)}
                className="flex items-center gap-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar Veterinario</AlertDialogTitle>
                <AlertDialogDescription>
                  {deleteDialog.message}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-gray-700">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={handleDeleteConfirmed}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    ))}
  </div>
)}

</div>
</div>
</Layout>
);
}
