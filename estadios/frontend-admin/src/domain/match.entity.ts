export type MatchStatus =
    | 'SCHEDULED'
    | 'LIVE'
    | 'FINISHED'
    | 'CANCELED'
    | 'POSTPONED';

export interface Team {
    id: string;
    name: string;
}

export interface Stadium {
    id: string;
    name: string;
    city: string;
    capacity: number;
}

export interface Match {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    stadiumId: string;
    date: string;
    status: MatchStatus;

    homeTeam?: Team;
    awayTeam?: Team;
    stadium?: Stadium;

    createdAt?: string;
}

export interface CreateMatchDto {
    homeTeamId: string;
    awayTeamId: string;
    stadiumId: string;
    date: string;
}

export interface UpdateMatchStatusDto {
    status: MatchStatus;
}