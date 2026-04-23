import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext'; // Contexto real de usuario
import { useHome } from '../contexts/HomeContext';
import { crearHogar } from '../services/hogarService'; // Servicio que creamos
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Home, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function HomeSetup() {
  const [createData, setCreateData] = useState({ name: '', address: '' });
  const [] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [invitationCode, setInvitationCode] = useState<string | null>(null);

  const { user } = useAuth(); // Importa useAuth desde '../contexts/AuthContext'
  const { createHome } = useHome();
  const navigate = useNavigate();

  const handleCreateHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- ESCENARIO 2: Validar si ya pertenece a un hogar ---
    if (user?.familiaId !== null && user?.familiaId !== undefined && Number(user?.familiaId) > 0) {
    const msg = 'Ya perteneces a un hogar y no puedes crear otro.';
    setError(msg);
    toast.error(msg);
    return;
  }

    if (!createData.name.trim()) {
      setError('El nombre del hogar es obligatorio');
      return;
    }

    setIsLoading(true);

    try {
      if (user?.id) {
        // --- LLAMADA REAL AL BACKEND (HU-03) ---
        const res = await crearHogar(Number(user.id), createData.name.trim());
        
        // --- ESCENARIO 1: Éxito y muestra de código ---
        setInvitationCode(res.codigoInvitacion);
        
        // Actualizamos estado local si es necesario
        createHome(res.nombre, createData.address.trim(), user.id.toString());
        
        toast.success('¡Hogar creado exitosamente!');
      } else {
        throw new Error("No se detectó sesión de usuario.");
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Error al crear el hogar';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode);
      toast.success('Código copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Configura tu Hogar</CardTitle>
          <CardDescription>
            Crea un nuevo hogar o únete a uno existente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Si ya tenemos el código de éxito, mostramos la pantalla de confirmación */}
          {invitationCode ? (
            <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <h3 className="text-xl font-bold text-gray-900">¡Hogar Configurado!</h3>
                <p className="text-sm text-gray-500">
                  Comparte este código con los miembros que deseas invitar.
                </p>
              </div>

              <div className="relative group">
                <div className="bg-gray-50 border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center">
                  <span className="text-3xl font-mono font-bold tracking-widest text-indigo-700">
                    {invitationCode}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleCopyCode}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <Button className="w-full bg-indigo-600" onClick={() => navigate('/dashboard')}>
                Ir al Panel de Gestión
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Crear Hogar</TabsTrigger>
                <TabsTrigger value="join">Unirse</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <form onSubmit={handleCreateHome} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="homeName">Nombre del hogar <span className="text-red-500">*</span></Label>
                    <Input
                      id="homeName"
                      placeholder="Ej: Casa Familia García"
                      value={createData.name}
                      onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección (Opcional)</Label>
                    <Input
                      id="address"
                      placeholder="Ej: Av. Principal 123"
                      value={createData.address}
                      onChange={(e) => setCreateData({ ...createData, address: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                    {isLoading ? 'Procesando...' : 'Crear Hogar y ser Admin'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="join">
                {/* ... Aquí puedes dejar tu lógica actual de JoinHome ... */}
                <div className="text-center py-4 text-sm text-gray-500">
                  Usa el código compartido por tu administrador para unirte.
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-indigo-600 hover:underline">
              Volver al inicio
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}