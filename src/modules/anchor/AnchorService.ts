import {inject, injectable} from "inversify";
import {AnchorRepository} from "@/modules/anchor/AnchorRepository";
import {Anchor} from "@/modules/anchor/types";

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
}