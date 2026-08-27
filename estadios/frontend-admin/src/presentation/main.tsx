import React, { useState } from 'react';

import ReactDOM from 'react-dom/client';

import { StadiumsPage } from './StadiumsPage';

import { MatchPage } from './MatchPage';

import { TeamPage } from './TeamPage';

import { NewsPage } from './NewsPage';


import {
    Building2,
    Trophy,
    Shield,
    Newspaper,
} from 'lucide-react';


import '../index.css';


const App = () => {

    const [tab, setTab] = useState<
        'stadiums' |
        'matches' |
        'teams' |
        'news'
    >('stadiums');


    return (

        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">

            {/* BARRA DE NAVEGACIÓN */}

            <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">

                {/* LOGO */}

                <div className="flex items-center space-x-3">

                    <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold">

                        🎟️

                    </div>

                    <span className="font-bold text-lg tracking-wide text-white">

                        Estadios Admin

                    </span>

                </div>


                {/* NAVEGACIÓN */}

                <nav className="flex space-x-2">

                    {/* ESTADIOS */}

                    <button
                        onClick={() =>
                            setTab('stadiums')
                        }
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            tab === 'stadiums'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >

                        <Building2 className="w-4 h-4" />

                        <span>
                            Estadios
                        </span>

                    </button>


                    {/* PARTIDOS */}

                    <button
                        onClick={() =>
                            setTab('matches')
                        }
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            tab === 'matches'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >

                        <Trophy className="w-4 h-4" />

                        <span>
                            Partidos
                        </span>

                    </button>


                    {/* EQUIPOS */}

                    <button
                        onClick={() =>
                            setTab('teams')
                        }
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            tab === 'teams'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >

                        <Shield className="w-4 h-4" />

                        <span>
                            Equipos
                        </span>

                    </button>


                    {/* NOTICIAS */}

                    <button
                        onClick={() =>
                            setTab('news')
                        }
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            tab === 'news'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >

                        <Newspaper className="w-4 h-4" />

                        <span>
                            Noticias
                        </span>

                    </button>

                </nav>

            </header>


            {/* CONTENIDO */}

            <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">

                {tab === 'stadiums' && (
                    <StadiumsPage />
                )}


                {tab === 'matches' && (
                    <MatchPage />
                )}


                {tab === 'teams' && (
                    <TeamPage />
                )}


                {tab === 'news' && (
                    <NewsPage />
                )}

            </main>

        </div>
    );
};


ReactDOM.createRoot(
    document.getElementById('root')!
).render(

    <React.StrictMode>

        <App />

    </React.StrictMode>

);