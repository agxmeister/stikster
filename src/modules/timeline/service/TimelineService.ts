import {inject, injectable} from "inversify";
import {TimelineRepository} from "@/modules/timeline/repository/TimelineRepository";
import type {Timeline} from "@/modules/timeline/types";

@injectable()
export class TimelineService
{
    constructor(@inject(TimelineRepository) readonly timelineRepository: TimelineRepository)
    {
    }

    async create(taskIds: string[]): Promise<Timeline>
    {
        return await this.timelineRepository.create(taskIds);
    }

    async get(id: string): Promise<Timeline | null>
    {
        return await this.timelineRepository.get(id);
    }
}
