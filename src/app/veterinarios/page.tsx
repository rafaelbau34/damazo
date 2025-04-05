'use client';

import { useState, useEffect } from 'react';
import { Input } from 'app/components/ui/input';
import { Button } from 'app/components/ui/button';
import { useToast } from 'app/components/ui/use-toast';

interface Veterinario {
  id: number;
  nombre: string;
  especialidad: string;
}

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVeterinarios();
  }, []);

  const fetchVeterinarios = async () => {
    try {
      const response = await fetch('/api/veterinarios');
      const data = await response.json();
      setVeterinarios(data);
    } catch (error) {
      console.error('Error al cargar veterinarios', error);
    }
  };

  const handleAgregar = async () => {
    if (!nombre || !especialidad) return;

    try {
      const response = await fetch('/api/veterinarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, especialidad }),
      });

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Veterinario agregado correctamente',
        });
        setNombre('');
        setEspecialidad('');
        fetchVeterinarios();
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo agregar el veterinario',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al agregar veterinario', error);
    }
  };

  const handleEditar = (veterinario: Veterinario) => {
    setEditandoId(veterinario.id);
    setNombre(veterinario.nombre);
    setEspecialidad(veterinario.especialidad);
  };

  const handleGuardar = async () => {
    if (editandoId === null) return;

    try {
      const response = await fetch(`/api/veterinarios/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, especialidad }),
      });

      if (response.ok) {
        toast({
          title: 'Actualizado',
          description: 'Veterinario actualizado correctamente',
        });
        setEditandoId(null);
        setNombre('');
        setEspecialidad('');
        fetchVeterinarios();
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo actualizar el veterinario',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al actualizar veterinario', error);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      const response = await fetch(`/api/veterinarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Eliminado',
          description: 'Veterinario eliminado correctamente',
        });
        fetchVeterinarios();
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el veterinario',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error al eliminar veterinario', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Veterinarios</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Input
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
        />
        {editandoId ? (
          <Button onClick={handleGuardar}>Guardar</Button>
        ) : (
          <Button onClick={handleAgregar}>Agregar</Button>
        )}
      </div>

      <ul>
        {veterinarios.map((veterinario) => (
          <li
          key={veterinario.id}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            <span>
              {veterinario.nombre} - {veterinario.especialidad}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEditar(veterinario)}>
                Editar
              </Button>
              <Button variant="destructive" onClick={() => handleEliminar(veterinario.id)}>
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
