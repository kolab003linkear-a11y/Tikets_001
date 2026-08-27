import React, { useEffect, useState } from 'react';

import {
    Calendar,
    Plus,
    Trash2,
    Building2,
    Shield,
    Loader2,
    Trophy,
    DollarSign,
} from 'lucide-react';

import { MatchService } from '../application/match.service';

import {
    Match,
    Team,
    MatchStatus,
} from '../domain/match.entity';

import { Stadium } from '../domain/stadium.entity';

import { StadiumService } from '../application/stadium.service';

import { PricesPage } from './PricesPage';


export const MatchPage: React.FC = () => {

    const [matches, setMatches] = useState<Match[]>([]);

    const [teams, setTeams] = useState<Team[]>([]);

    const [stadiums, setStadiums] = useState<Stadium[]>([]);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);


    /*
     * Partido seleccionado para gestionar sus precios.
     *
     * Si es null, mostramos la lista de partidos.
     * Si contiene un partido, mostramos PricesPage.
     */
    const [selectedMatch, setSelectedMatch] =
        useState<Match | null>(null);


    const [homeTeamId, setHomeTeamId] = useState('');

    const [awayTeamId, setAwayTeamId] = useState('');

    const [stadiumId, setStadiumId] = useState('');

    const [date, setDate] = useState('');


    const fetchData = async () => {

        try {

            setLoading(true);

            setError(null);


            const [
                matchesData,
                teamsData,
                stadiumsData,
            ] = await Promise.all([

                MatchService.getMatches(),

                MatchService.getTeams(),

                StadiumService.getStadiums(),

            ]);


            setMatches(matchesData);

            setTeams(teamsData);

            setStadiums(stadiumsData);

        } catch (err: any) {

            setError(
                err.message ||
                'Error al cargar partidos'
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchData();

    }, []);


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        if (
            !homeTeamId ||
            !awayTeamId ||
            !stadiumId ||
            !date
        ) {

            setError(
                'Todos los campos son obligatorios'
            );

            return;
        }


        if (homeTeamId === awayTeamId) {

            setError(
                'El equipo local y visitante no pueden ser el mismo'
            );

            return;
        }


        try {

            setSubmitting(true);

            setError(null);


            await MatchService.createMatch({

                homeTeamId,

                awayTeamId,

                stadiumId,

                date,

            });


            setHomeTeamId('');

            setAwayTeamId('');

            setStadiumId('');

            setDate('');


            await fetchData();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al crear el partido'
            );

        } finally {

            setSubmitting(false);

        }
    };


    const handleStatusChange = async (
        id: string,
        status: MatchStatus
    ) => {

        try {

            setError(null);


            await MatchService.updateStatus(
                id,
                { status }
            );


            await fetchData();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al actualizar el estado'
            );

        }
    };


    const handleDelete = async (
        id: string
    ) => {

        if (
            !confirm(
                '¿Estás seguro de eliminar este partido?'
            )
        ) {

            return;
        }


        try {

            setError(null);


            await MatchService.deleteMatch(id);


            await fetchData();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al eliminar el partido'
            );

        }
    };


    const getStatusLabel = (
        status: MatchStatus
    ) => {

        switch (status) {

            case 'SCHEDULED':
                return 'Programado';

            case 'LIVE':
                return 'En vivo';

            case 'FINISHED':
                return 'Finalizado';

            case 'CANCELED':
                return 'Cancelado';

            case 'POSTPONED':
                return 'Aplazado';

            default:
                return status;

        }
    };


    /*
     * =====================================================
     * PANTALLA DE PRECIOS
     * =====================================================
     */

    if (selectedMatch) {

        return (

            <PricesPage

                match={selectedMatch}

                onBack={() =>
                    setSelectedMatch(null)
                }

            />

        );
    }


    /*
     * =====================================================
     * PANTALLA DE PARTIDOS
     * =====================================================
     */

    return (

        <div className="space-y-8">

            {/* HEADER */}

            <header className="flex items-center space-x-3 border-b border-slate-800 pb-5">

                <Trophy className="w-8 h-8 text-indigo-400" />

                <div>

                    <h1 className="text-2xl font-bold">

                        Gestión de Partidos

                    </h1>

                    <p className="text-sm text-slate-400">

                        Administra partidos, equipos, estadios y horarios

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
                            Crear Partido
                        </span>

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* EQUIPO LOCAL */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">

                                Equipo Local

                            </label>


                            <select
                                required
                                value={homeTeamId}
                                onChange={(e) =>
                                    setHomeTeamId(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            >

                                <option value="">
                                    Selecciona equipo local...
                                </option>


                                {teams.map((team) => (

                                    <option
                                        key={team.id}
                                        value={team.id}
                                    >

                                        {team.name}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* EQUIPO VISITANTE */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">

                                Equipo Visitante

                            </label>


                            <select
                                required
                                value={awayTeamId}
                                onChange={(e) =>
                                    setAwayTeamId(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            >

                                <option value="">
                                    Selecciona equipo visitante...
                                </option>


                                {teams.map((team) => (

                                    <option
                                        key={team.id}
                                        value={team.id}
                                    >

                                        {team.name}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* ESTADIO */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">

                                Estadio

                            </label>


                            <select
                                required
                                value={stadiumId}
                                onChange={(e) =>
                                    setStadiumId(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            >

                                <option value="">
                                    Selecciona estadio...
                                </option>


                                {stadiums.map((stadium) => (

                                    <option
                                        key={stadium.id}
                                        value={stadium.id}
                                    >

                                        {stadium.name} ({stadium.city})

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* FECHA */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">

                                Fecha y hora

                            </label>


                            <input
                                type="datetime-local"
                                required
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
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
                                        Crear Partido
                                    </span>

                                </>

                            )}

                        </button>

                    </form>

                </div>


                {/* LISTADO */}

                <div className="lg:col-span-2 space-y-4">

                    <h2 className="text-lg font-semibold">

                        Partidos Registrados

                    </h2>


                    {loading ? (

                        <div className="flex items-center justify-center p-12 text-slate-400">

                            <Loader2 className="w-8 h-8 animate-spin mr-2" />

                            <span>
                                Cargando partidos...
                            </span>

                        </div>

                    ) : matches.length === 0 ? (

                        <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-xl text-center text-slate-400">

                            No hay partidos registrados.

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {matches.map((match) => (

                                <div
                                    key={match.id}
                                    className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl hover:border-slate-600 transition"
                                >

                                    {/* CABECERA */}

                                    <div className="flex justify-between items-start">

                                        <div className="flex items-center space-x-2">

                                            <Shield className="w-5 h-5 text-indigo-400" />

                                            <span className="text-xs text-slate-400">

                                                Partido

                                            </span>

                                        </div>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    match.id
                                                )
                                            }
                                            className="text-slate-500 hover:text-red-400 p-1"
                                            title="Eliminar partido"
                                        >

                                            <Trash2 className="w-4 h-4" />

                                        </button>

                                    </div>


                                    {/* EQUIPOS */}

                                    <div className="mt-4 text-center">

                                        <div className="text-lg font-bold text-white">

                                            {match.homeTeam?.name ||
                                                'Equipo local'}

                                        </div>


                                        <div className="text-xs text-slate-500 my-1">

                                            VS

                                        </div>


                                        <div className="text-lg font-bold text-white">

                                            {match.awayTeam?.name ||
                                                'Equipo visitante'}

                                        </div>

                                    </div>


                                    {/* INFORMACIÓN */}

                                    <div className="mt-5 space-y-2 text-xs text-slate-300">

                                        <div className="flex items-center space-x-2">

                                            <Calendar className="w-4 h-4 text-indigo-400" />

                                            <span>

                                                {new Date(
                                                    match.date
                                                ).toLocaleString()}

                                            </span>

                                        </div>


                                        <div className="flex items-center space-x-2">

                                            <Building2 className="w-4 h-4 text-indigo-400" />

                                            <span>

                                                {match.stadium?.name ||
                                                    'Estadio no disponible'}

                                            </span>

                                        </div>


                                        {match.stadium?.city && (

                                            <div className="flex items-center space-x-2">

                                                <Building2 className="w-4 h-4 text-slate-500" />

                                                <span>

                                                    {match.stadium.city}

                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    {/* ESTADO */}

                                    <div className="mt-4 pt-3 border-t border-slate-700/50">

                                        <label className="block text-xs text-slate-400 mb-1">

                                            Estado

                                        </label>


                                        <select
                                            value={match.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    match.id,
                                                    e.target.value as MatchStatus
                                                )
                                            }
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                                        >

                                            <option value="SCHEDULED">
                                                Programado
                                            </option>

                                            <option value="LIVE">
                                                En vivo
                                            </option>

                                            <option value="FINISHED">
                                                Finalizado
                                            </option>

                                            <option value="CANCELED">
                                                Cancelado
                                            </option>

                                            <option value="POSTPONED">
                                                Aplazado
                                            </option>

                                        </select>


                                        <p className="text-xs text-slate-500 mt-1">

                                            Estado actual:{' '}

                                            {getStatusLabel(
                                                match.status
                                            )}

                                        </p>

                                    </div>


                                    {/* GESTIONAR PRECIOS */}

                                    <div className="mt-4 pt-3 border-t border-slate-700/50">

                                        <button
                                            onClick={() =>
                                                setSelectedMatch(
                                                    match
                                                )
                                            }
                                            className="w-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
                                        >

                                            <DollarSign className="w-4 h-4" />

                                            <span>
                                                Gestionar precios
                                            </span>

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};