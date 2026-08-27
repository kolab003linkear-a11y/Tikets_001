import React, { useEffect, useState } from 'react';

import {
    Building2,
    Plus,
    Trash2,
    Armchair,
    Loader2,
} from 'lucide-react';

import { Sector } from '../domain/sector.entity';
import { Seat } from '../domain/seat.entity';

import { SectorService } from '../application/sector.service';
import { SeatService } from '../application/seat.service';

interface SectorPageProps {
    stadiumId: string;
    stadiumName: string;
}

export const SectorPage: React.FC<SectorPageProps> = ({
    stadiumId,
    stadiumName,
}) => {

    const [sectors, setSectors] = useState<Sector[]>([]);
    const [seats, setSeats] = useState<Seat[]>([]);

    const [selectedSectorId, setSelectedSectorId] = useState('');

    const [loadingSectors, setLoadingSectors] = useState(true);
    const [loadingSeats, setLoadingSeats] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // =====================================================
    // FORMULARIO SECTOR
    // =====================================================

    const [sectorName, setSectorName] = useState('');
    const [sectorCapacity, setSectorCapacity] = useState('');

    // =====================================================
    // FORMULARIO ASIENTO
    // =====================================================

    const [seatRow, setSeatRow] = useState('');
    const [seatNumber, setSeatNumber] = useState('');

    // =====================================================
    // FORMULARIO ASIENTOS MASIVOS
    // =====================================================

    const [bulkRow, setBulkRow] = useState('');
    const [bulkStart, setBulkStart] = useState('1');
    const [bulkEnd, setBulkEnd] = useState('10');

    // =====================================================
    // CARGAR SECTORES
    // =====================================================

    const loadSectors = async () => {

        if (!stadiumId) {
            setSectors([]);
            setSelectedSectorId('');
            setSeats([]);
            return;
        }

        try {

            setLoadingSectors(true);
            setError(null);

            const data =
                await SectorService.getSectorsByStadium(
                    stadiumId
                );

            setSectors(data);

            if (data.length > 0) {

                setSelectedSectorId(data[0].id);

            } else {

                setSelectedSectorId('');
                setSeats([]);

            }

        } catch (err: any) {

            setError(
                err.message ||
                'Error al cargar los sectores'
            );

            setSectors([]);
            setSelectedSectorId('');
            setSeats([]);

        } finally {

            setLoadingSectors(false);

        }
    };

    // =====================================================
    // CARGAR ASIENTOS
    // =====================================================

    const loadSeats = async (
        sectorId: string
    ) => {

        if (!sectorId) {

            setSeats([]);

            return;
        }

        try {

            setLoadingSeats(true);
            setError(null);

            const data =
                await SeatService.getBySector(
                    sectorId
                );

            setSeats(data);

        } catch (err: any) {

            setError(
                err.message ||
                'Error al cargar los asientos'
            );

            setSeats([]);

        } finally {

            setLoadingSeats(false);

        }
    };

    // =====================================================
    // EFECTOS
    // =====================================================

    useEffect(() => {

        loadSectors();

    }, [stadiumId]);

    useEffect(() => {

        if (selectedSectorId) {

            loadSeats(selectedSectorId);

        } else {

            setSeats([]);

        }

    }, [selectedSectorId]);

    // =====================================================
    // CREAR SECTOR
    // =====================================================

    const handleCreateSector = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!stadiumId) {

            setError(
                'No se ha seleccionado un estadio'
            );

            return;
        }

        if (!sectorName.trim()) {

            setError(
                'El nombre del sector es obligatorio'
            );

            return;
        }

        const capacity =
            Number(sectorCapacity);

        if (!capacity || capacity <= 0) {

            setError(
                'La capacidad debe ser mayor que cero'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            await SectorService.createSector({

                name: sectorName.trim(),

                capacity,

                stadiumId,

            });

            setSectorName('');
            setSectorCapacity('');

            await loadSectors();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al crear el sector'
            );

        } finally {

            setSubmitting(false);

        }
    };

    // =====================================================
    // ELIMINAR SECTOR
    // =====================================================

    const handleDeleteSector = async (
        id: string
    ) => {

        const confirmed = confirm(
            '¿Estás seguro de eliminar este sector? Todos sus asientos también serán eliminados.'
        );

        if (!confirmed) {

            return;

        }

        try {

            setError(null);

            await SectorService.deleteSector(id);

            if (selectedSectorId === id) {

                setSelectedSectorId('');

                setSeats([]);

            }

            await loadSectors();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al eliminar el sector'
            );

        }
    };

    // =====================================================
    // CREAR ASIENTO
    // =====================================================

    const handleCreateSeat = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!selectedSectorId) {

            setError(
                'Selecciona un sector'
            );

            return;
        }

        if (!seatRow.trim()) {

            setError(
                'La fila es obligatoria'
            );

            return;
        }

        const number =
            Number(seatNumber);

        if (!number || number <= 0) {

            setError(
                'El número de asiento debe ser mayor que cero'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            await SeatService.create({

                row: seatRow
                    .trim()
                    .toUpperCase(),

                number,

                sectorId:
                    selectedSectorId,

            });

            setSeatRow('');
            setSeatNumber('');

            await loadSeats(
                selectedSectorId
            );

        } catch (err: any) {

            setError(
                err.message ||
                'Error al crear el asiento'
            );

        } finally {

            setSubmitting(false);

        }
    };

    // =====================================================
    // CREAR ASIENTOS MASIVOS
    // =====================================================

    const handleCreateBulkSeats = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!selectedSectorId) {

            setError(
                'Selecciona un sector'
            );

            return;
        }

        if (!bulkRow.trim()) {

            setError(
                'La fila es obligatoria'
            );

            return;
        }

        const start =
            Number(bulkStart);

        const end =
            Number(bulkEnd);

        if (
            !start ||
            !end ||
            start <= 0 ||
            end < start
        ) {

            setError(
                'Rango de asientos inválido'
            );

            return;
        }

        if (
            end - start + 1 > 500
        ) {

            setError(
                'No puedes generar más de 500 asientos a la vez'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            await SeatService.createBulk(

                selectedSectorId,

                {
                    row: bulkRow
                        .trim()
                        .toUpperCase(),

                    startNumber: start,

                    endNumber: end,
                }

            );

            setBulkRow('');

            await loadSeats(
                selectedSectorId
            );

        } catch (err: any) {

            setError(
                err.message ||
                'Error al generar los asientos'
            );

        } finally {

            setSubmitting(false);

        }
    };

    // =====================================================
    // ELIMINAR ASIENTO
    // =====================================================

    const handleDeleteSeat = async (
        id: string
    ) => {

        if (
            !confirm(
                '¿Eliminar este asiento?'
            )
        ) {

            return;

        }

        try {

            setError(null);

            await SeatService.delete(id);

            if (selectedSectorId) {

                await loadSeats(
                    selectedSectorId
                );

            }

        } catch (err: any) {

            setError(
                err.message ||
                'Error al eliminar el asiento'
            );

        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="space-y-8">

            {/* HEADER */}

            <header className="flex items-center space-x-3 border-b border-slate-800 pb-5">

                <Armchair className="w-8 h-8 text-indigo-400" />

                <div>

                    <h1 className="text-2xl font-bold">
                        Sectores y Asientos
                    </h1>

                    <p className="text-sm text-slate-400">
                        Administra la distribución de asientos de {stadiumName}
                    </p>

                </div>

            </header>

            {/* ESTADIO ACTUAL */}

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">

                <div className="flex items-center space-x-3">

                    <Building2 className="w-6 h-6 text-indigo-400" />

                    <div>

                        <p className="text-xs text-slate-500">
                            Estadio seleccionado
                        </p>

                        <h2 className="text-lg font-semibold text-white">
                            {stadiumName}
                        </h2>

                    </div>

                </div>

            </div>

            {/* ERROR */}

            {error && (

                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm">

                    {error}

                </div>

            )}

            {/* CONTENIDO */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* =================================================
                    SECTORES
                ================================================= */}

                <div className="lg:col-span-1 space-y-4">

                    <div className="flex items-center justify-between">

                        <h2 className="text-lg font-semibold">
                            Sectores
                        </h2>

                        <span className="text-xs text-slate-500">
                            {sectors.length} registrados
                        </span>

                    </div>

                    {/* CREAR SECTOR */}

                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">

                        <h3 className="font-semibold mb-4 flex items-center space-x-2">

                            <Plus className="w-4 h-4 text-indigo-400" />

                            <span>
                                Crear sector
                            </span>

                        </h3>

                        <form
                            onSubmit={
                                handleCreateSector
                            }
                            className="space-y-3"
                        >

                            <input
                                type="text"
                                placeholder="Nombre del sector"
                                value={sectorName}
                                onChange={(e) =>
                                    setSectorName(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                            />

                            <input
                                type="number"
                                min="1"
                                placeholder="Capacidad"
                                value={sectorCapacity}
                                onChange={(e) =>
                                    setSectorCapacity(
                                        e.target.value
                                    )
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm flex items-center justify-center space-x-2"
                            >

                                {submitting ? (

                                    <Loader2 className="w-4 h-4 animate-spin" />

                                ) : (

                                    <Plus className="w-4 h-4" />

                                )}

                                <span>
                                    Crear sector
                                </span>

                            </button>

                        </form>

                    </div>

                    {/* LISTA SECTORES */}

                    {loadingSectors ? (

                        <div className="flex justify-center p-8">

                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />

                        </div>

                    ) : (

                        <div className="space-y-2">

                            {sectors.map((sector) => (

                                <div
                                    key={sector.id}
                                    onClick={() =>
                                        setSelectedSectorId(
                                            sector.id
                                        )
                                    }
                                    className={`p-4 rounded-lg border cursor-pointer transition ${selectedSectorId ===
                                            sector.id

                                            ? 'bg-indigo-600/20 border-indigo-500'

                                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                        }`}
                                >

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <div className="font-semibold">
                                                {sector.name}
                                            </div>

                                            <div className="text-xs text-slate-400 mt-1">
                                                Capacidad: {sector.capacity}
                                            </div>

                                        </div>

                                        <button
                                            onClick={(e) => {

                                                e.stopPropagation();

                                                handleDeleteSector(
                                                    sector.id
                                                );

                                            }}
                                            className="text-slate-500 hover:text-red-400 p-1"
                                            title="Eliminar sector"
                                        >

                                            <Trash2 className="w-4 h-4" />

                                        </button>

                                    </div>

                                </div>

                            ))}

                            {sectors.length === 0 && (

                                <div className="text-center p-8 text-slate-500 text-sm">

                                    Este estadio todavía no tiene sectores.

                                </div>

                            )}

                        </div>

                    )}

                </div>

                {/* =================================================
                    ASIENTOS
                ================================================= */}

                <div className="lg:col-span-2 space-y-4">

                    <div className="flex items-center justify-between">

                        <h2 className="text-lg font-semibold">
                            Asientos
                        </h2>

                        {selectedSectorId && (

                            <span className="text-xs text-slate-500">
                                {seats.length} asientos
                            </span>

                        )}

                    </div>

                    {!selectedSectorId ? (

                        <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-12 text-center text-slate-500">

                            Selecciona un sector para administrar sus asientos.

                        </div>

                    ) : (

                        <>

                            {/* CREAR ASIENTO */}

                            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">

                                <h3 className="font-semibold mb-4">
                                    Crear asiento
                                </h3>

                                <form
                                    onSubmit={
                                        handleCreateSeat
                                    }
                                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                                >

                                    <input
                                        type="text"
                                        placeholder="Fila (A)"
                                        value={seatRow}
                                        onChange={(e) =>
                                            setSeatRow(
                                                e.target.value
                                            )
                                        }
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                                    />

                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Número"
                                        value={seatNumber}
                                        onChange={(e) =>
                                            setSeatNumber(
                                                e.target.value
                                            )
                                        }
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                                    />

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium"
                                    >
                                        Crear asiento
                                    </button>

                                </form>

                            </div>

                            {/* CREACIÓN MASIVA */}

                            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">

                                <h3 className="font-semibold mb-4">
                                    Generar asientos automáticamente
                                </h3>

                                <form
                                    onSubmit={
                                        handleCreateBulkSeats
                                    }
                                    className="grid grid-cols-1 md:grid-cols-4 gap-3"
                                >

                                    <input
                                        type="text"
                                        placeholder="Fila"
                                        value={bulkRow}
                                        onChange={(e) =>
                                            setBulkRow(
                                                e.target.value
                                            )
                                        }
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                                    />

                                    <input
                                        type="number"
                                        min="1"
                                        value={bulkStart}
                                        onChange={(e) =>
                                            setBulkStart(
                                                e.target.value
                                            )
                                        }
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                                    />

                                    <input
                                        type="number"
                                        min="1"
                                        value={bulkEnd}
                                        onChange={(e) =>
                                            setBulkEnd(
                                                e.target.value
                                            )
                                        }
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                                    />

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-sm font-medium"
                                    >
                                        Generar
                                    </button>

                                </form>

                                <p className="text-xs text-slate-500 mt-2">
                                    Ejemplo: fila A, desde 1 hasta 20.
                                </p>

                            </div>

                            {/* LISTA ASIENTOS */}

                            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">

                                {loadingSeats ? (

                                    <div className="flex justify-center p-10">

                                        <Loader2 className="w-7 h-7 animate-spin text-slate-400" />

                                    </div>

                                ) : seats.length === 0 ? (

                                    <div className="text-center p-10 text-slate-500">

                                        Este sector todavía no tiene asientos.

                                    </div>

                                ) : (

                                    <div className="flex flex-wrap gap-2">

                                        {seats.map((seat) => (

                                            <div
                                                key={seat.id}
                                                className="group flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
                                            >

                                                <Armchair className="w-4 h-4 text-indigo-400" />

                                                <span className="text-sm">
                                                    {seat.row}
                                                    {seat.number}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteSeat(
                                                            seat.id
                                                        )
                                                    }
                                                    className="hidden group-hover:block text-slate-500 hover:text-red-400 ml-1"
                                                    title="Eliminar asiento"
                                                >

                                                    <Trash2 className="w-3 h-3" />

                                                </button>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>
    );
};