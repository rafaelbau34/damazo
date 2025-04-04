"use client";

import { Layout } from "app/layout/Layout";
import React, { useState, useEffect } from "react";
import {
  getFacturas,
  createFactura,
  updateFactura,
  deleteFactura,
} from "app/services/facturaService";
import { getClientes } from "app/services/clienteService";
import { getTratamientos } from "app/services/tratamientoService";

interface Detalle {
  tratamientoId: number;
  cantidad: number;
  subtotal: number;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
}

interface Factura {
  id: number;
  fecha: string;
  cliente: Cliente;
  total: string | number;
  detalles?: Detalle[];
}

interface Tratamiento {
  id: number;
  descripcion?: string;
  costo: string | number;
}

const Facturas: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    clienteId: "",
    fecha: "",
    total: "",
    tratamientoId: "",
    cantidad: "",
    costo: "",
  });

  useEffect(() => {
    fetchFacturas();
    fetchClientes();
    fetchTratamientos();
  }, []);

  const fetchFacturas = () => {
    getFacturas()
      .then((data) => setFacturas(data))
      .catch((err) => console.error("Error al obtener facturas", err));
  };

  const fetchClientes = () => {
    getClientes()
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error al obtener clientes", err));
  };

  const fetchTratamientos = () => {
    getTratamientos()
      .then((data) => setTratamientos(data))
      .catch((err) => console.error("Error al obtener tratamientos", err));
  };

  // Permite manejar cambios tanto de inputs como de selects
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cuando se selecciona un tratamiento, se actualiza el campo costo automáticamente
  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setFormData({ ...formData, tratamientoId: selectedId });
    const treatment = tratamientos.find((t) => t.id.toString() === selectedId);
    if (treatment) {
      setFormData((prev) => ({ ...prev, costo: treatment.costo.toString() }));
    }
  };

  // Calcula el subtotal automáticamente: (costo * cantidad) + 16% de IVA
  const computeSubtotal = () => {
    const costo = parseFloat(formData.costo) || 0;
    const cantidad = parseInt(formData.cantidad) || 0;
    const subtotal = costo * cantidad * 1.16;
    return parseFloat(subtotal.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEditing && !formData.clienteId) {
      alert("El campo Cliente es requerido para crear una factura");
      return;
    }
    if (
      !formData.fecha ||
      !formData.total ||
      !formData.tratamientoId ||
      !formData.cantidad ||
      !formData.costo
    ) {
      alert("Todos los campos son requeridos");
      return;
    }

    const detalle = {
      tratamientoId: parseInt(formData.tratamientoId, 10),
      cantidad: parseInt(formData.cantidad, 10),
      subtotal: computeSubtotal(),
    };

    try {
      if (isEditing && editingId !== null) {
        const updated = await updateFactura(editingId, {
          fecha: formData.fecha,
          total: parseFloat(formData.total),
          detalles: [detalle],
        });
        setFacturas(facturas.map((f) => (f.id === editingId ? updated : f)));
        setIsEditing(false);
        setEditingId(null);
      } else {
        const created = await createFactura({
          clienteId: parseInt(formData.clienteId, 10),
          fecha: formData.fecha,
          total: parseFloat(formData.total),
          detalles: [detalle],
        });
        setFacturas([...facturas, created]);
      }
      // Reiniciar formulario
      setFormData({
        clienteId: "",
        fecha: "",
        total: "",
        tratamientoId: "",
        cantidad: "",
        costo: "",
      });
    } catch (error) {
      console.error("Error al guardar la factura", error);
    }
  };

  // Prepara el formulario para edición
  const handleEditarFactura = (factura: Factura) => {
    setIsEditing(true);
    setEditingId(factura.id);
    let cantidad = "";
    let costo = "";
    if (factura.detalles && factura.detalles[0]) {
      cantidad = factura.detalles[0].cantidad.toString();
      const computedCosto =
        factura.detalles[0].subtotal / (factura.detalles[0].cantidad * 1.16);
      costo = computedCosto.toFixed(2);
    }
    setFormData({
      clienteId: factura.cliente.id.toString(), // Se guarda para referencia, aunque no se edita
      fecha: factura.fecha.split("T")[0] || factura.fecha,
      total: factura.total.toString(),
      tratamientoId:
        factura.detalles && factura.detalles[0]
          ? factura.detalles[0].tratamientoId.toString()
          : "",
      cantidad: cantidad,
      costo: costo,
    });
  };

  const handleVerFactura = (factura: Factura) => {
    alert(
      `Factura ID: ${factura.id}\nCliente: ${factura.cliente.nombre} ${
        factura.cliente.apellido
      }\nFecha: ${factura.fecha}\nTotal: $${Number(factura.total).toFixed(2)}`
    );
  };

  const handleEliminarFactura = async (id: number) => {
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar esta factura?"
    );
    if (!confirmDelete) return;

    try {
      await deleteFactura(id);
      setFacturas(facturas.filter((factura) => factura.id !== id));
    } catch (error) {
      console.error("Error al eliminar factura", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      clienteId: "",
      fecha: "",
      total: "",
      tratamientoId: "",
      cantidad: "",
      costo: "",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Facturas</h1>
        <p className="text-gray-700 mb-6">
          Aquí puedes ver y gestionar todas tus facturas de manera sencilla y
          organizada.
        </p>

        {/* Formulario para crear o actualizar factura */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Editar Factura" : "Crear Factura"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEditing ? (
              <div>
                <label className="block mb-1 font-medium">Cliente</label>
                <select
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block mb-1 font-medium">Cliente</label>
                <input
                  type="text"
                  value={`${
                    facturas.find((f) => f.id === editingId)?.cliente.nombre
                  } ${
                    facturas.find((f) => f.id === editingId)?.cliente.apellido
                  }`}
                  readOnly
                  className="w-full border rounded p-2 bg-gray-100"
                />
              </div>
            )}
            <div>
              <label className="block mb-1 font-medium">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Total</label>
              <input
                type="number"
                step="0.01"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Tratamiento</label>
              <select
                name="tratamientoId"
                value={formData.tratamientoId}
                onChange={handleTreatmentChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Seleccione un tratamiento</option>
                {tratamientos.map((tratamiento) => (
                  <option key={tratamiento.id} value={tratamiento.id}>
                    {tratamiento.descripcion
                      ? tratamiento.descripcion
                      : `Tratamiento ${tratamiento.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Costo</label>
              <input
                type="number"
                step="0.01"
                name="costo"
                value={formData.costo}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Subtotal (calculado automáticamente con IVA 16%)
              </label>
              <input
                type="text"
                value={computeSubtotal()}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isEditing ? "Actualizar Factura" : "Crear Factura"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listado de facturas */}
        <div className="border rounded-lg overflow-hidden shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="p-3">#</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Total</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{factura.id}</td>
                  <td className="p-3">
                    {factura.cliente.nombre} {factura.cliente.apellido}
                  </td>
                  <td className="p-3">{factura.fecha.split("T")[0]}</td>
                  <td className="p-3">${Number(factura.total).toFixed(2)}</td>
                  <td className="p-3">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                      onClick={() => handleVerFactura(factura)}
                    >
                      Ver
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      onClick={() => handleEditarFactura(factura)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleEliminarFactura(factura.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Facturas;
