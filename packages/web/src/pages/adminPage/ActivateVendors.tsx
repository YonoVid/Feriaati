import { useEffect, useState } from "react";
import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import { httpsCallable } from "firebase/functions";
const AdminStatePage = () => {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    getVendors();
  }, []);

  const getVendors = async () => {
    try {
      const vendors = httpsCallable(functions, "vendorList");
      const response = await vendors();
      const vendorsData = response.data as any;
      setVendors(vendorsData);
    } catch (error) {
      console.error("Error al obtener los vendedores:", error);
    }
  };
  const updateState = async (userId: string, state: string) => {
    try {
      const updState = httpsCallable(functions, "vendorStateUpdate");
      const response = await updState({ userId, state });
      console.log(response.data);
    } catch (error) {
      console.error("Error al actualizar el estado del vendedor:", error);
    }
  };

  return (
    <div>
      <h1>Lista de Vendedores</h1>
      <ul>
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            Nombre de Usuario: {vendor.username}, Email: {vendor.email}, Estado:
            {vendor.state}
            <button onClick={() => updateState(vendor.id, vendor.state)}>
              Actualizar Estado
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminStatePage;
