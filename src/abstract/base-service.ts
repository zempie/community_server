import { Inject } from "@nestjs/common";
import { Model } from "sequelize-typescript";
import { FindAndCountOptions } from "sequelize/types";
import { CustomQueryGenerator, CustomQueryResult, ModelType } from "src/util/pagination-builder";

export interface BaseServiceInterface<T> {
    findOne(id: string): Promise<T>
    find(options?: FindAndCountOptions): Promise<CustomQueryResult<T>>
    create(data: Model<T> | any): Promise<T>
    update(id: string, data: Model<T>): Promise<T>
    delete(id: string): Promise<boolean>
}

export abstract class BaseService<T extends Model<T>> {
    #filterQuery: CustomQueryGenerator<T>;
    constructor(
        private readonly modelRepository: ModelType<T>
    ) {
        this.#filterQuery = new CustomQueryGenerator(modelRepository)
    }

    async find(options?: FindAndCountOptions) {
        return await this.#filterQuery.find(options);
    }

    async findOne(id: string) {
        return await this.modelRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async create(data: Model<T> | any) {
        return await this.modelRepository.create(data);
    }

    async delete(id: string) {
        await this.modelRepository.destroy({
            where: {
                id: id
            }
        });
        return true;
    }
}