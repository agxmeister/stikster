import {inject, injectable} from "inversify";
import {Timeline} from "@/modules/timeline";
import {TrackService} from "@/modules/visualization/service/TrackService";
import {Visualization, Track, Cursor} from "@/modules/visualization";

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

        const [newTracks, newCursor] = await this.trackService.createTrackByRange({
            begin: timeline.begin,
            end: timeline.end,
        }, currentCursor);
        tracks.push(newTracks);
        currentCursor = newCursor;

        for (const branch of timeline.branches) {
            const [newTracks, newCursor] = await this.trackService.createTracksByTasks(branch.tasks, currentCursor, {
                begin: timeline.begin,
                end: timeline.end,
            });
            tracks.push(newTracks);
            currentCursor = newCursor;
        }
        return {
            tracks: tracks,
        };
    }
}
