import {Container} from "inversify";
import {Jira} from "@/jira/jira";
import {Miro} from "@/miro";
import {TimelineRepository, TimelineService, TaskRepository, TaskService} from "@/modules/timeline";
import {
    VisualizationRepository,
    VisualizationService,
    TrackRepository,
    TrackService,
    AnchorRepository,
    AnchorService
} from "@/modules/visualization";

const container: Container = new Container();

container.bind(TaskRepository).toSelf();
container.bind(TrackRepository).toSelf();
container.bind(AnchorRepository).toSelf();
container.bind(TimelineRepository).toSelf();
container.bind(VisualizationRepository).toSelf();
container.bind(TaskService).toSelf();
container.bind(TrackService).toSelf();
container.bind(AnchorService).toSelf();
container.bind(TimelineService).toSelf();
container.bind(VisualizationService).toSelf();
container.bind(Jira).toDynamicValue(() => new Jira(
    process.env.JIRA_URL!,
    process.env.JIRA_USERNAME!,
    process.env.JIRA_PASSWORD!,
));
container.bind(Miro).toDynamicValue(() => new Miro(
    process.env.MIRO_URL!,
    process.env.MIRO_TOKEN!,
));

export {container}
