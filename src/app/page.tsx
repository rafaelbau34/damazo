"use client";

import { Button } from "app/components/ui/button";
import { Layout } from "app/layout/Layout";
import { useState } from "react";

export default function DashboardPage() {
  const [showContactNumber, setShowContactNumber] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col items-center pt-20 min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 pb-12">
        {/* Main Header */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-red-600 mb-3 font-gravitas drop-shadow-md">
            CAN GALÁN
          </h1>
          <p className="text-xl text-amber-800 font-medium">
            Panel de Administración
          </p>
        </div>

        {/* Content Cards */}
        <div className="w-full max-w-3xl space-y-6">
          {/* Navigation Card */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200">
            <div className="flex items-center justify-center mb-5">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
              ¿Cómo navegar?
            </h2>
            <p className="text-gray-600 text-center text-lg">
              Utiliza el menú de navegación superior para acceder a todas las
              secciones de gestión.
            </p>
          </div>

          {/* Support Card */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200">
            <div className="flex items-center justify-center mb-5">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
              ¿Necesitas ayuda?
            </h2>
            <p className="text-gray-600 text-center text-lg mb-6">
              Estamos aquí para ayudarte con cualquier problema o sugerencia.
            </p>

            <div className="flex justify-center">
              <Button
                onClick={() => setShowContactNumber(!showContactNumber)}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
              >
                {showContactNumber ? "Ocultar contacto" : "Mostrar contacto"}
              </Button>
            </div>

            {showContactNumber && (
              <div className="mt-6 space-y-3 animate-fade-in">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    744 297 7268
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    dontoñosalinasperalta@cangalan.com
                  </p>
                </div>
                <p className="text-sm text-amber-700 text-center mt-2">
                  Horario de atención: Lunes a Viernes, 9:00 - 18:00
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
