import React, { useEffect, useState } from 'react';

import { StadiumService } from '../application/stadium.service';
import { Stadium } from '../domain/stadium.entity';

import {
    Building2,
    Plus,
    Trash2,
    MapPin,
    Users,
    Loader2,
    Layers,
    ArrowLeft,
} from 'lucide-react';

import { SectorPage } from './SectorPage';

export const StadiumsPage: React.FC = () => {

    const [stadiums, setStadiums] = useState<Stadium[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    // Estadio seleccionado para administrar sus sectores
    const [selectedStadium, setSelectedStadium] =
        useState<Stadium | null>(null);

    // Formulario
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [capacity, setCapacity] = useState('');

    const fetchStadiums = async () => {

        try {

            setLoading(true);
            setError(null);

            const data =
                await StadiumService.getStadiums();

            setStadiums(data);

        } catch (err: any) {

            setError(
                err.message ||
                'Error al cargar los estadios'
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchStadiums();
    }, []);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!name || !city || !capacity) {

            setError(
                'Todos los campos son obligatorios'
            );

            return;
        }

        if (Number(capacity) <= 0) {

            setError(
                'La capacidad debe ser mayor que 0'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            await StadiumService.createStadium({
                name,
                city,
                capacity: Number(capacity),
            });

            // Limpiar formulario
            setName('');
            setCity('');
            setCapacity('');

            await fetchStadiums();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al guardar el estadio'
            );

        } finally {

            setSubmitting(false);

        }
    };

    const handleDelete = async (
        id: string
    ) => {

        if (
            !confirm(
                '¿Estás seguro de que deseas eliminar este estadio?'
            )
        ) {
            return;
        }

        try {

            setError(null);

            await StadiumService.deleteStadium(id);

            // Si estábamos administrando este estadio,
            // regresamos a la lista.
            if (
                selectedStadium?.id === id
            ) {
                setSelectedStadium(null);
            }

            await fetchStadiums();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al eliminar'
            );

        }
    };

    /*
     * Si existe un estadio seleccionado,
     * mostramos la administración de sectores.
     */
    if (selectedStadium) {

        return (

            <div className="space-y-6">

                {/* BOTÓN VOLVER */}

                <button
                    onClick={() =>
                        setSelectedStadium(null)
                    }
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition text-sm"
                >

                    <ArrowLeft className="w-4 h-4" />

                    <span>
                        Volver a Estadios
                    </span>

                </button>

                {/* INFORMACIÓN DEL ESTADIO */}

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">

                    <div className="flex items-center space-x-3">

                        <div className="bg-indigo-600/20 p-3 rounded-lg">

                            <Building2 className="w-6 h-6 text-indigo-400" />

                        </div>

                        <div>

                            <h1 className="text-xl font-bold text-white">

                                {selectedStadium.name}

                            </h1>

                            <p className="text-sm text-slate-400">

                                {selectedStadium.city}

                                {' · '}

                                {selectedStadium.capacity.toLocaleString()}
                                {' personas'}

                            </p>

                        </div>

                    </div>

                </div>

                {/* SECTORES */}

                <SectorPage
                    stadiumId={selectedStadium.id}
                    stadiumName={selectedStadium.name}
                />

            </div>

        );
    }

    /*
     * Vista principal de estadios
     */

    return (

        <div className="space-y-8">

            {/* ENCABEZADO */}

            <header className="flex items-center space-x-3 border-b border-slate-800 pb-5">

                <Building2 className="w-8 h-8 text-indigo-400" />

                <div>

                    <h1 className="text-2xl font-bold">

                        Gestión de Estadios

                    </h1>

                    <p className="text-sm text-slate-400">

                        Panel de administración para dar de alta
                        y controlar estadios

                    </p>

                </div>

            </header>

            {/* ERROR */}

            {error && (

                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm">

                    {error}

                </div>

            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* FORMULARIO */}

                <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl space-y-4">

                    <h2 className="text-lg font-semibold flex items-center space-x-2">

                        <Plus className="w-5 h-5 text-indigo-400" />

                        <span>
                            Registrar Estadio
                        </span>

                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* NOMBRE */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">

                                Nombre del Estadio

                            </label>

                            <input
                                type="text"
                                required
                                placeholder="Ej. Estadio Monumental"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />

                        </div>

                        {/* CIUDAD */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">

                                Ciudad

                            </label>

                            <input
                                type="text"
                                required
                                placeholder="Ej. Guayaquil"
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />

                        </div>

                        {/* CAPACIDAD */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">

                                Capacidad Máxima

                            </label>

                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="Ej. 59283"
                                value={capacity}
                                onChange={(e) =>
                                    setCapacity(e.target.value)
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />

                        </div>

                        {/* BOTÓN */}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
                        >

                            {submitting ? (

                                <Loader2 className="w-5 h-5 animate-spin" />

                            ) : (

                                <>

                                    <Plus className="w-4 h-4" />

                                    <span>
                                        Guardar Estadio
                                    </span>

                                </>

                            )}

                        </button>

                    </form>

                </div>

                {/* LISTADO */}

                <div className="lg:col-span-2 space-y-4">

                    <h2 className="text-lg font-semibold">

                        Estadios Registrados

                    </h2>

                    {loading ? (

                        <div className="flex items-center justify-center p-12 text-slate-400">

                            <Loader2 className="w-8 h-8 animate-spin mr-2" />

                            <span>
                                Cargando estadios...
                            </span>

                        </div>

                    ) : stadiums.length === 0 ? (

                        <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-xl text-center text-slate-400">

                            No hay estadios registrados aún.

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {stadiums.map((stadium) => (

                                <div
                                    key={stadium.id}
                                    className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex flex-col justify-between hover:border-slate-600 transition"
                                >

                                    {/* INFORMACIÓN */}

                                    <div className="space-y-2">

                                        <div className="flex justify-between items-start">

                                            <h3 className="font-bold text-slate-100 text-base">

                                                {stadium.name}

                                            </h3>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        stadium.id
                                                    )
                                                }
                                                className="text-slate-500 hover:text-red-400 p-1 transition"
                                                title="Eliminar estadio"
                                            >

                                                <Trash2 className="w-4 h-4" />

                                            </button>

                                        </div>

                                        <div className="flex items-center text-xs text-slate-400 space-x-1">

                                            <MapPin className="w-3.5 h-3.5 text-indigo-400" />

                                            <span>
                                                {stadium.city}
                                            </span>

                                        </div>

                                    </div>

                                    {/* AFORO */}

                                    <div className="mt-4 pt-3 border-t border-slate-700/50">

                                        <div className="flex items-center justify-between text-xs">

                                            <span className="text-slate-400">
                                                Aforo:
                                            </span>

                                            <span className="flex items-center font-semibold text-indigo-300">

                                                <Users className="w-3.5 h-3.5 mr-1" />

                                                {stadium.capacity.toLocaleString()}
                                                {' personas'}

                                            </span>

                                        </div>

                                    </div>

                                    {/* BOTÓN SECTORES */}

                                    <button
                                        onClick={() =>
                                            setSelectedStadium(
                                                stadium
                                            )
                                        }
                                        className="mt-4 w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg px-3 py-2 text-sm font-medium flex items-center justify-center space-x-2 transition"
                                    >

                                        <Layers className="w-4 h-4" />

                                        <span>
                                            Gestionar sectores
                                        </span>

                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
};