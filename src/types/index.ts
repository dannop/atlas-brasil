export interface IUF {
    id: number;
    sigla: string;
    nome: string;
    regiao: {
        id: number;
        sigla: string;
        nome: string;
    };
}

export interface IMunicipio {
    id: number;
    nome: string;
    microrregiao: {
        id: number;
        nome: string;
        mesorregiao: {
            id: number;
            nome: string;
            UF: IUF;
        };
    };
}

export interface IListResponse<T> {
    data: T[];
    total?: number;
}

export interface IPaginationParams {
    page?: number;
    per_page?: number;
}

export interface IMunicipioFeatureProperties {
    id: number;
    codarea: string;
    name?: string;
    nome?: string;
}
