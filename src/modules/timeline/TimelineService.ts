import {inject, injectable} from "inversify";
import {Timeline, TimelineRepository} from "@/modules/timeline";

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
}
