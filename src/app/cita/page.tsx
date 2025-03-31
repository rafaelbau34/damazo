"use client";

import { Layout } from "app/layout/Layout";
import { useState, useEffect } from "react";

interface Cita {
  id: number;
  fecha: string;
  mascotaId: number;
  veterinarioId: number;
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [nuevaCita, setNuevaCita] = useState({
    fecha: "",
    mascotaId: "",
    veterinarioId: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/cita")
      .then((res) => res.json())
      .then((data) => setCitas(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevaCita({ ...nuevaCita, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/cita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: nuevaCita.fecha,
        mascotaId: Number(nuevaCita.mascotaId),
        veterinarioId: Number(nuevaCita.veterinarioId),
      }),
    });
    if (response.ok) {
      const citaCreada = await response.json();
      setCitas([...citas, citaCreada]);
      setNuevaCita({ fecha: "", mascotaId: "", veterinarioId: "" });
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gestión de Citas</h1>
        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <input
            type="date"
            name="fecha"
            value={nuevaCita.fecha}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="mascotaId"
            value={nuevaCita.mascotaId}
            onChange={handleChange}
            placeholder="ID de la mascota"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="veterinarioId"
            value={nuevaCita.veterinarioId}
            onChange={handleChange}
            placeholder="ID del veterinario"
            className="w-full p-2 border rounded"
            required
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Agendar Cita
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6">Lista de Citas</h2>
        <ul className="mt-3 space-y-2">
          {citas.map((cita) => (
            <li key={cita.id} className="border p-3 rounded shadow">
              <p>Fecha: {cita.fecha}</p>
              <p>Mascota ID: {cita.mascotaId}</p>
              <p>Veterinario ID: {cita.veterinarioId}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
