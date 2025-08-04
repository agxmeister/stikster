import {inject, injectable} from "inversify";
import {Timeline} from "@/modules/timeline";
import {TrackService} from "@/modules/visualization/service/TrackService";
import {Visualization, Track, Cursor} from "@/modules/visualization";
import fs from "node:fs";
import {v4 as uuid} from "uuid";

@injectable()
export class VisualizationRepository
{
    constructor(@inject(TrackService) readonly trackService: TrackService)
    {
    }

    async create(timeline: Timeline, cursor: Cursor): Promise<Visualization>
    {
        const tracks = [] as Track[];

        let currentCursor = cursor;
        let topRangeTrack, bottomRangeTrack;

        [topRangeTrack, currentCursor] = await this.trackService.createTrackByRange(currentCursor, {
            begin: timeline.begin,
            end: timeline.end,
        });
        tracks.push(topRangeTrack);

        const branches = [...timeline.branches]
            .sort((a, b) => a.begin.localeCompare(b.begin));
        for (const branch of branches) {
            const [branchTracks, newCursor] = await this.trackService.createTracksByTasks(currentCursor, branch.tasks, branch.footprint, {
                begin: timeline.begin,
                end: timeline.end,
            });
            tracks.push(...branchTracks);
            currentCursor = newCursor;
        }

        [bottomRangeTrack] = await this.trackService.createTrackByRange(currentCursor, {
            begin: timeline.begin,
            end: timeline.end,
        });
        tracks.push(bottomRangeTrack);

        const visualization = {
            id: uuid(),
            tracks: tracks,
        }

        await fs.promises.writeFile(`${process.env.DATA_PATH}/visualizations/${visualization.id}.json`, JSON.stringify(visualization, null, 4));

        return visualization;
    }

    async get(id: string): Promise<Visualization | null>
    {
        try {
            const data = await fs.promises.readFile(`${process.env.DATA_PATH}/visualizations/${id}.json`, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading visualizations with id ${id}:`, error);
            return null;
        }
    }
}
