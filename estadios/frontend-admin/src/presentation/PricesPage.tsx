import React, { useEffect, useState } from 'react';

import {
    ArrowLeft,
    Building2,
    DollarSign,
    Loader2,
    Save,
    Armchair,
    CheckCircle2,
} from 'lucide-react';

import { Match } from '../domain/match.entity';

import { Sector } from '../domain/sector.entity';

import { SectorService } from '../application/sector.service';

import { PriceService } from '../application/price.service';


interface PricesPageProps {

    match: Match;

    onBack: () => void;
}


export const PricesPage: React.FC<PricesPageProps> = ({
    match,
    onBack,
}) => {

    const [sectors, setSectors] = useState<Sector[]>([]);

    const [prices, setPrices] = useState<Record<string, string>>({});

    const [loading, setLoading] = useState(true);

    const [savingSector, setSavingSector] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [success, setSuccess] = useState<string | null>(null);


    const loadData = async () => {

        try {

            setLoading(true);

            setError(null);

            setSuccess(null);


            /*
             * El partido ya tiene asociado un estadio.
             *
             * Usamos stadiumId del partido para obtener
             * los sectores que pertenecen a ese estadio.
             */
            const [
                sectorsData,
                pricesData,
            ] = await Promise.all([

                SectorService.getSectorsByStadium(
                    match.stadiumId
                ),

                PriceService.getPricesByMatch(
                    match.id
                ),

            ]);


            setSectors(sectorsData);


            /*
             * Convertimos los precios recibidos del backend
             * en un objeto:
             *
             * {
             *   "sector-id-1": "25",
             *   "sector-id-2": "40"
             * }
             */
            const priceMap: Record<string, string> = {};


            pricesData.forEach((item) => {

                priceMap[item.sectorId] =
                    String(item.price);

            });


            setPrices(priceMap);

        } catch (err: any) {

            setError(
                err.message ||
                'Error al cargar los sectores y precios'
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadData();

    }, [match.id]);


    const handlePriceChange = (
        sectorId: string,
        value: string
    ) => {

        setPrices((current) => ({

            ...current,

            [sectorId]: value,

        }));


        setSuccess(null);

        setError(null);
    };


    const handleSavePrice = async (
        sectorId: string
    ) => {

        const value = prices[sectorId];


        if (
            value === undefined ||
            value.trim() === ''
        ) {

            setError(
                'Debes ingresar un precio'
            );

            return;
        }


        const price = Number(value);


        if (
            !Number.isFinite(price) ||
            price < 0
        ) {

            setError(
                'El precio debe ser un número válido mayor o igual a 0'
            );

            return;
        }


        try {

            setSavingSector(sectorId);

            setError(null);

            setSuccess(null);


            await PriceService.setPrice(
                match.id,
                {
                    sectorId,
                    price,
                }
            );


            const sector = sectors.find(
                (item) => item.id === sectorId
            );


            setSuccess(
                `Precio del sector "${sector?.name || 'Sector'}" guardado correctamente`
            );

        } catch (err: any) {

            setError(
                err.message ||
                'Error al guardar el precio'
            );

        } finally {

            setSavingSector(null);

        }
    };


    return (

        <div className="space-y-8">

            {/* HEADER */}

            <header className="border-b border-slate-800 pb-5">

                <div className="flex items-center justify-between">

                    <div className="flex items-center space-x-3">

                        <DollarSign className="w-8 h-8 text-emerald-400" />

                        <div>

                            <h1 className="text-2xl font-bold">

                                Gestión de Precios

                            </h1>

                            <p className="text-sm text-slate-400">

                                Define el precio de cada sector para este partido

                            </p>

                        </div>

                    </div>


                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm transition"
                    >

                        <ArrowLeft className="w-4 h-4" />

                        <span>
                            Volver a Partidos
                        </span>

                    </button>

                </div>

            </header>


            {/* INFORMACIÓN DEL PARTIDO */}

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                            Partido
                        </p>

                        <h2 className="text-xl font-bold text-white mt-1">

                            {match.homeTeam?.name ||
                                'Equipo local'}

                            <span className="text-slate-500 mx-3">
                                VS
                            </span>

                            {match.awayTeam?.name ||
                                'Equipo visitante'}

                        </h2>

                    </div>


                    <div className="flex items-center space-x-2 text-sm text-slate-300">

                        <Building2 className="w-5 h-5 text-indigo-400" />

                        <div>

                            <p className="font-medium">

                                {match.stadium?.name ||
                                    'Estadio no disponible'}

                            </p>

                            {match.stadium?.city && (

                                <p className="text-xs text-slate-500">

                                    {match.stadium.city}

                                </p>

                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-lg text-sm">

                    {error}

                </div>

            )}


            {/* ÉXITO */}

            {success && (

                <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-4 rounded-lg text-sm flex items-center space-x-2">

                    <CheckCircle2 className="w-5 h-5" />

                    <span>
                        {success}
                    </span>

                </div>

            )}


            {/* SECTORES */}

            <div>

                <div className="flex items-center justify-between mb-4">

                    <div>

                        <h2 className="text-lg font-semibold">

                            Sectores del Estadio

                        </h2>

                        <p className="text-sm text-slate-500">

                            Configura el precio de cada sector para este partido.

                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="flex items-center justify-center p-12 text-slate-400">

                        <Loader2 className="w-8 h-8 animate-spin mr-2" />

                        <span>
                            Cargando sectores...
                        </span>

                    </div>

                ) : sectors.length === 0 ? (

                    <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-xl text-center">

                        <Armchair className="w-10 h-10 text-slate-600 mx-auto mb-3" />

                        <p className="text-slate-400">

                            Este estadio no tiene sectores registrados.

                        </p>

                        <p className="text-xs text-slate-500 mt-1">

                            Primero debes crear los sectores desde la gestión del estadio.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {sectors.map((sector) => {

                            const saving =
                                savingSector === sector.id;


                            const currentPrice =
                                prices[sector.id] ?? '';


                            return (

                                <div
                                    key={sector.id}
                                    className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5"
                                >

                                    {/* SECTOR */}

                                    <div className="flex items-start justify-between mb-5">

                                        <div className="flex items-center space-x-3">

                                            <div className="bg-indigo-500/10 p-3 rounded-lg">

                                                <Armchair className="w-6 h-6 text-indigo-400" />

                                            </div>

                                            <div>

                                                <h3 className="font-semibold text-white">

                                                    {sector.name}

                                                </h3>

                                                <p className="text-xs text-slate-500">

                                                    Capacidad: {sector.capacity} asientos

                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* PRECIO */}

                                    <div>

                                        <label className="block text-xs font-medium text-slate-300 mb-2">

                                            Precio del sector

                                        </label>


                                        <div className="flex gap-2">

                                            <div className="relative flex-1">

                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={currentPrice}
                                                    onChange={(e) =>
                                                        handlePriceChange(
                                                            sector.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="0.00"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                                                />

                                            </div>


                                            <button
                                                onClick={() =>
                                                    handleSavePrice(
                                                        sector.id
                                                    )
                                                }
                                                disabled={saving}
                                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition"
                                            >

                                                {saving ? (

                                                    <Loader2 className="w-4 h-4 animate-spin" />

                                                ) : (

                                                    <>

                                                        <Save className="w-4 h-4" />

                                                        <span className="hidden sm:inline">
                                                            Guardar
                                                        </span>

                                                    </>

                                                )}

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>
    );
};