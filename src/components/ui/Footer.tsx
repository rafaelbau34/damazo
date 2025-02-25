import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Mi Proyecto. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
