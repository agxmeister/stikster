import {inject, injectable} from "inversify";
import {AnchorRepository} from "@/modules/visualization/repository/AnchorRepository";
import {Anchor} from "@/modules/visualization";

@injectable()
export class AnchorService
{
    constructor(@inject(AnchorRepository) readonly anchorRepository: AnchorRepository)
    {
    }

    async create(label: string): Promise<Anchor | null>
    {
        return await this.anchorRepository.create(label);
    }

    async get(id: string): Promise<Anchor | null>
    {
        return await this.anchorRepository.get(id);
    }

    async getList(): Promise<Anchor[]>
    {
        return await this.anchorRepository.getList();
    }

    async delete(id: string): Promise<void>
    {
        await this.anchorRepository.delete(id);
    }
}
