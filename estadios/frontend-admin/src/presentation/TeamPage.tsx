import React, { useEffect, useState } from 'react';

import {
    Plus,
    Trash2,
    Pencil,
    Shield,
    Loader2,
    MapPin,
    X,
    Save,
} from 'lucide-react';

import { TeamService } from '../application/team.service';

import {
    Team,
    CreateTeamDto,
} from '../domain/team.entity';

export const TeamPage: React.FC = () => {

    const [teams, setTeams] = useState<Team[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    const [editingTeam, setEditingTeam] =
        useState<Team | null>(null);

    const [editName, setEditName] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editLogoUrl, setEditLogoUrl] = useState('');

    const fetchTeams = async () => {

        try {

            setLoading(true);
            setError(null);

            const data =
                await TeamService.getTeams();

            setTeams(data);

        } catch (err: any) {

            setError(
                err.message ||
                'Error al cargar los equipos'
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchTeams();

    }, []);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!name.trim() || !city.trim()) {

            setError(
                'El nombre y la ciudad son obligatorios'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            const data: CreateTeamDto = {
                name: name.trim(),
                city: city.trim(),
                ...(logoUrl.trim()
                    ? { logoUrl: logoUrl.trim() }
                    : {}),
            };

            await TeamService.createTeam(data);

            setName('');
            setCity('');
            setLogoUrl('');

            await fetchTeams();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al crear el equipo'
            );

        } finally {

            setSubmitting(false);

        }
    };

    const openEditModal = (team: Team) => {

        setEditingTeam(team);

        setEditName(team.name);
        setEditCity(team.city);
        setEditLogoUrl(team.logoUrl || '');

        setError(null);
    };

    const closeEditModal = () => {

        setEditingTeam(null);

        setEditName('');
        setEditCity('');
        setEditLogoUrl('');
    };

    const handleUpdate = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!editingTeam) {
            return;
        }

        if (
            !editName.trim() ||
            !editCity.trim()
        ) {

            setError(
                'El nombre y la ciudad son obligatorios'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            await TeamService.updateTeam(
                editingTeam.id,
                {
                    name: editName.trim(),
                    city: editCity.trim(),
                    logoUrl: editLogoUrl.trim(),
                }
            );

            closeEditModal();

            await fetchTeams();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al actualizar el equipo'
            );

        } finally {

            setSubmitting(false);

        }
    };

    const handleDelete = async (
        id: string
    ) => {

        const confirmed = window.confirm(
            '¿Estás seguro de eliminar este equipo?'
        );

        if (!confirmed) {
            return;
        }

        try {

            setError(null);

            await TeamService.deleteTeam(id);

            await fetchTeams();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al eliminar el equipo'
            );

        }
    };

    return (

        <div className="space-y-8">

            {/* HEADER */}

            <header className="flex items-center space-x-3 border-b border-slate-800 pb-5">

                <Shield className="w-8 h-8 text-indigo-400" />

                <div>

                    <h1 className="text-2xl font-bold text-white">
                        Gestión de Equipos
                    </h1>

                    <p className="text-sm text-slate-400">
                        Administra los equipos participantes en los partidos
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

                <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl h-fit">

                    <h2 className="text-lg font-semibold flex items-center space-x-2 mb-5">

                        <Plus className="w-5 h-5 text-indigo-400" />

                        <span>
                            Crear Equipo
                        </span>

                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* NOMBRE */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Nombre del equipo
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Ej. Barcelona SC"
                                required
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
                                value={city}
                                onChange={(e) =>
                                    setCity(e.target.value)
                                }
                                placeholder="Ej. Guayaquil"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />

                        </div>

                        {/* LOGO */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                URL del logo
                            </label>

                            <input
                                type="url"
                                value={logoUrl}
                                onChange={(e) =>
                                    setLogoUrl(e.target.value)
                                }
                                placeholder="https://..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />

                            <p className="text-xs text-slate-500 mt-1">
                                Campo opcional
                            </p>

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
                                        Crear Equipo
                                    </span>
                                </>

                            )}

                        </button>

                    </form>

                </div>

                {/* LISTADO */}

                <div className="lg:col-span-2 space-y-4">

                    <div className="flex items-center justify-between">

                        <h2 className="text-lg font-semibold text-white">
                            Equipos Registrados
                        </h2>

                        <span className="text-xs text-slate-500">
                            {teams.length} equipo{teams.length !== 1 ? 's' : ''}
                        </span>

                    </div>

                    {loading ? (

                        <div className="flex items-center justify-center p-12 text-slate-400">

                            <Loader2 className="w-8 h-8 animate-spin mr-2" />

                            <span>
                                Cargando equipos...
                            </span>

                        </div>

                    ) : teams.length === 0 ? (

                        <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-xl text-center text-slate-400">

                            No hay equipos registrados.

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {teams.map((team) => (

                                <div
                                    key={team.id}
                                    className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl hover:border-slate-600 transition"
                                >

                                    {/* CABECERA */}

                                    <div className="flex items-start justify-between">

                                        <div className="flex items-center space-x-3">

                                            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">

                                                {team.logoUrl ? (

                                                    <img
                                                        src={team.logoUrl}
                                                        alt={`Logo de ${team.name}`}
                                                        className="w-full h-full object-contain"
                                                    />

                                                ) : (

                                                    <Shield className="w-6 h-6 text-indigo-400" />

                                                )}

                                            </div>

                                            <div>

                                                <h3 className="font-bold text-white">
                                                    {team.name}
                                                </h3>

                                                <div className="flex items-center space-x-1 text-xs text-slate-400">

                                                    <MapPin className="w-3 h-3" />

                                                    <span>
                                                        {team.city}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="flex items-center space-x-1">

                                            <button
                                                onClick={() =>
                                                    openEditModal(team)
                                                }
                                                className="text-slate-500 hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-700 transition"
                                                title="Editar equipo"
                                            >

                                                <Pencil className="w-4 h-4" />

                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(team.id)
                                                }
                                                className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-700 transition"
                                                title="Eliminar equipo"
                                            >

                                                <Trash2 className="w-4 h-4" />

                                            </button>

                                        </div>

                                    </div>

                                    {/* INFORMACIÓN */}

                                    <div className="mt-5 pt-4 border-t border-slate-700/50">

                                        <div className="text-xs text-slate-500">

                                            ID

                                        </div>

                                        <div className="text-xs text-slate-400 mt-1 break-all">

                                            {team.id}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

            {/* MODAL EDITAR */}

            {editingTeam && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">

                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between p-5 border-b border-slate-700">

                            <div>

                                <h2 className="text-lg font-semibold text-white">
                                    Editar Equipo
                                </h2>

                                <p className="text-xs text-slate-400 mt-1">
                                    Modifica la información del equipo
                                </p>

                            </div>

                            <button
                                onClick={closeEditModal}
                                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700"
                            >

                                <X className="w-5 h-5" />

                            </button>

                        </div>

                        {/* FORMULARIO */}

                        <form
                            onSubmit={handleUpdate}
                            className="p-5 space-y-4"
                        >

                            <div>

                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Nombre del equipo
                                </label>

                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                                />

                            </div>

                            <div>

                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Ciudad
                                </label>

                                <input
                                    type="text"
                                    value={editCity}
                                    onChange={(e) =>
                                        setEditCity(e.target.value)
                                    }
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                                />

                            </div>

                            <div>

                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    URL del logo
                                </label>

                                <input
                                    type="url"
                                    value={editLogoUrl}
                                    onChange={(e) =>
                                        setEditLogoUrl(e.target.value)
                                    }
                                    placeholder="https://..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                                />

                            </div>

                            {/* BOTONES */}

                            <div className="flex space-x-3 pt-2">

                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
                                >

                                    {submitting ? (

                                        <Loader2 className="w-4 h-4 animate-spin" />

                                    ) : (

                                        <>
                                            <Save className="w-4 h-4" />

                                            <span>
                                                Guardar
                                            </span>
                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};