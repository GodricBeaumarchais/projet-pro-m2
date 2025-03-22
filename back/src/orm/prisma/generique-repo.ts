import { PrismaClient } from '@prisma/client';
import { IGenericRepository } from '../../core';

export class PrismaGenericRepository<T> implements IGenericRepository<T> {
    protected _client: PrismaClient;
    private _model: keyof PrismaClient;

    constructor(client: PrismaClient, model: keyof PrismaClient) {
        this._client = client;
        this._model = model;
    }

    async getAll(): Promise<T[]> {
        return await (this._client[this._model] as any).findMany();
    }

    async get(id: string): Promise<T | null> {
        return await (this._client[this._model] as any).findUnique({
            where: { id },
        });
    }

    async create(item: T): Promise<T> {
        return await (this._client[this._model] as any).create({
            data: item,
        });
    }

    async update(id: string, item: T): Promise<T> {
        return await (this._client[this._model] as any).update({
            where: { id },
            data: item,
        });
    }

    async delete(id: string): Promise<T> {
        return await (this._client[this._model] as any).delete({
            where: { id },
        });
    }
}
