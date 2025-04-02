"use client";

import { Layout } from "app/layout/Layout";
import React, { useState, useEffect } from "react";

interface Factura {
  id: number;
  fecha: string;
  cliente: string;
  total: number;
}

const Facturas: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/facturas")
      .then((res) => res.json())
      .then((data) => setFacturas(data));
  }, []);

  const handleVerFactura = (factura: Factura) => {
    alert(
      `Factura ID: ${factura.id}\nCliente: ${factura.cliente}\nFecha: ${
        factura.fecha
      }\nTotal: $${factura.total.toFixed(2)}`
    );
  };

  const handleEliminarFactura = async (id: number) => {
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar esta factura?"
    );
    if (!confirmDelete) return;

    const response = await fetch(`http://localhost:3000/api/facturas/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setFacturas(facturas.filter((factura) => factura.id !== id));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Facturas</h1>
        <p className="text-gray-700 mb-6">
          Aquí puedes ver y gestionar todas tus facturas de manera sencilla y
          organizada.
        </p>

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
                  <td className="p-3">{factura.cliente}</td>
                  <td className="p-3">{factura.fecha}</td>
                  <td className="p-3">${factura.total.toFixed(2)}</td>
                  <td className="p-3">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                      onClick={() => handleVerFactura(factura)}
                    >
                      Ver
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
