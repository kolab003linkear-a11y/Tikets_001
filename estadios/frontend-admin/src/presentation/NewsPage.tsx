import React, { useEffect, useState } from 'react';

import {
    Plus,
    Trash2,
    Pencil,
    Newspaper,
    Loader2,
    Users,
    X,
    Save,
    Calendar,
    Image as ImageIcon,
} from 'lucide-react';

import { NewsService } from '../application/news.service';
import { TeamService } from '../application/team.service';

import {
    News,
    CreateNewsDto,
} from '../domain/news.entity';

import {
    Team,
} from '../domain/team.entity';

export const NewsPage: React.FC = () => {

    const [news, setNews] = useState<News[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // Formulario crear
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [teamId, setTeamId] = useState('');

    // Edición
    const [editingNews, setEditingNews] =
        useState<News | null>(null);

    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editImageUrl, setEditImageUrl] = useState('');
    const [editTeamId, setEditTeamId] = useState('');

    const fetchData = async () => {

        try {

            setLoading(true);
            setError(null);

            const [
                newsData,
                teamsData,
            ] = await Promise.all([
                NewsService.getNews(),
                TeamService.getTeams(),
            ]);

            setNews(newsData);
            setTeams(teamsData);

        } catch (err: any) {

            setError(
                err.message ||
                'Error al cargar las noticias'
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
            !title.trim() ||
            !content.trim()
        ) {

            setError(
                'El título y el contenido son obligatorios'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            const data: CreateNewsDto = {
                title: title.trim(),
                content: content.trim(),
                ...(imageUrl.trim()
                    ? {
                        imageUrl: imageUrl.trim()
                    }
                    : {}),
                ...(teamId
                    ? {
                        teamId
                    }
                    : {}),
            };

            await NewsService.createNews(data);

            setTitle('');
            setContent('');
            setImageUrl('');
            setTeamId('');

            await fetchData();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al crear la noticia'
            );

        } finally {

            setSubmitting(false);

        }
    };

    const openEditModal = (
        item: News
    ) => {

        setEditingNews(item);

        setEditTitle(item.title);
        setEditContent(item.content);
        setEditImageUrl(item.imageUrl || '');
        setEditTeamId(item.teamId || '');

        setError(null);
    };

    const closeEditModal = () => {

        setEditingNews(null);

        setEditTitle('');
        setEditContent('');
        setEditImageUrl('');
        setEditTeamId('');
    };

    const handleUpdate = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!editingNews) {
            return;
        }

        if (
            !editTitle.trim() ||
            !editContent.trim()
        ) {

            setError(
                'El título y el contenido son obligatorios'
            );

            return;
        }

        try {

            setSubmitting(true);
            setError(null);

            await NewsService.updateNews(
                editingNews.id,
                {
                    title: editTitle.trim(),
                    content: editContent.trim(),
                    imageUrl: editImageUrl.trim(),
                    teamId: editTeamId || undefined,
                }
            );

            closeEditModal();

            await fetchData();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al actualizar la noticia'
            );

        } finally {

            setSubmitting(false);

        }
    };

    const handleDelete = async (
        id: string
    ) => {

        const confirmed = window.confirm(
            '¿Estás seguro de eliminar esta noticia?'
        );

        if (!confirmed) {
            return;
        }

        try {

            setError(null);

            await NewsService.deleteNews(id);

            await fetchData();

        } catch (err: any) {

            setError(
                err.message ||
                'Error al eliminar la noticia'
            );

        }
    };

    const formatDate = (
        date?: string | null
    ) => {

        if (!date) {
            return 'Fecha no disponible';
        }

        return new Date(date).toLocaleString(
            'es-EC',
            {
                dateStyle: 'medium',
                timeStyle: 'short',
            }
        );
    };

    return (

        <div className="space-y-8">

            {/* HEADER */}

            <header className="flex items-center space-x-3 border-b border-slate-800 pb-5">

                <Newspaper className="w-8 h-8 text-indigo-400" />

                <div>

                    <h1 className="text-2xl font-bold text-white">
                        Gestión de Noticias
                    </h1>

                    <p className="text-sm text-slate-400">
                        Administra las noticias y publicaciones de los equipos
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
                            Crear Noticia
                        </span>

                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* TÍTULO */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Título
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="Título de la noticia"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            />

                        </div>

                        {/* CONTENIDO */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Contenido
                            </label>

                            <textarea
                                value={content}
                                onChange={(e) =>
                                    setContent(e.target.value)
                                }
                                placeholder="Escribe el contenido de la noticia..."
                                required
                                rows={6}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                            />

                        </div>

                        {/* EQUIPO */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                Equipo
                            </label>

                            <select
                                value={teamId}
                                onChange={(e) =>
                                    setTeamId(e.target.value)
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                            >

                                <option value="">
                                    Sin equipo asociado
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

                        {/* IMAGEN */}

                        <div>

                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                URL de imagen
                            </label>

                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) =>
                                    setImageUrl(e.target.value)
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
                                        Crear Noticia
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
                            Noticias Registradas
                        </h2>

                        <span className="text-xs text-slate-500">
                            {news.length} noticia{news.length !== 1 ? 's' : ''}
                        </span>

                    </div>

                    {loading ? (

                        <div className="flex items-center justify-center p-12 text-slate-400">

                            <Loader2 className="w-8 h-8 animate-spin mr-2" />

                            <span>
                                Cargando noticias...
                            </span>

                        </div>

                    ) : news.length === 0 ? (

                        <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-xl text-center text-slate-400">

                            No hay noticias registradas.

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {news.map((item) => (

                                <article
                                    key={item.id}
                                    className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden hover:border-slate-600 transition"
                                >

                                    {/* IMAGEN */}

                                    {item.imageUrl && (

                                        <div className="h-40 bg-slate-900 overflow-hidden">

                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />

                                        </div>

                                    )}

                                    <div className="p-5">

                                        {/* CABECERA */}

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex-1">

                                                <h3 className="text-lg font-bold text-white">
                                                    {item.title}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-3 mt-2">

                                                    {item.team && (

                                                        <div className="flex items-center space-x-1 text-xs text-indigo-400">

                                                            <Users className="w-3 h-3" />

                                                            <span>
                                                                {item.team.name}
                                                            </span>

                                                        </div>

                                                    )}

                                                    <div className="flex items-center space-x-1 text-xs text-slate-500">

                                                        <Calendar className="w-3 h-3" />

                                                        <span>
                                                            {formatDate(item.publishedAt)}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* ACCIONES */}

                                            <div className="flex items-center space-x-1">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(item)
                                                    }
                                                    className="text-slate-500 hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-700 transition"
                                                    title="Editar noticia"
                                                >

                                                    <Pencil className="w-4 h-4" />

                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-700 transition"
                                                    title="Eliminar noticia"
                                                >

                                                    <Trash2 className="w-4 h-4" />

                                                </button>

                                            </div>

                                        </div>

                                        {/* CONTENIDO */}

                                        <p className="text-sm text-slate-300 mt-4 whitespace-pre-line">
                                            {item.content}
                                        </p>

                                        {/* IMAGEN INDICADOR */}

                                        {item.imageUrl && (

                                            <div className="flex items-center space-x-1 mt-4 text-xs text-slate-500">

                                                <ImageIcon className="w-3 h-3" />

                                                <span>
                                                    Imagen adjunta
                                                </span>

                                            </div>

                                        )}

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </div>

            {/* MODAL EDITAR */}

            {editingNews && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">

                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

                        {/* HEADER MODAL */}

                        <div className="flex items-center justify-between p-5 border-b border-slate-700">

                            <div>

                                <h2 className="text-lg font-semibold text-white">
                                    Editar Noticia
                                </h2>

                                <p className="text-xs text-slate-400 mt-1">
                                    Modifica la información de la noticia
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

                            {/* TÍTULO */}

                            <div>

                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Título
                                </label>

                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                                />

                            </div>

                            {/* CONTENIDO */}

                            <div>

                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Contenido
                                </label>

                                <textarea
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                    required
                                    rows={8}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                                />

                            </div>

                            {/* EQUIPO */}

                            <div>

                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Equipo
                                </label>

                                <select
                                    value={editTeamId}
                                    onChange={(e) =>
                                        setEditTeamId(e.target.value)
                                    }
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                                >

                                    <option value="">
                                        Sin equipo asociado
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

                            {/* IMAGEN */}

                            <div>

                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    URL de imagen
                                </label>

                                <input
                                    type="url"
                                    value={editImageUrl}
                                    onChange={(e) =>
                                        setEditImageUrl(e.target.value)
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