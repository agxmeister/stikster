import {Container} from "inversify";
import {Jira} from "@/jira/jira";
import {Miro} from "@/miro";
import {TaskRepository, TaskService} from "@/modules/task";
import {CardRepository, CardService} from "@/modules/card";
import {AnchorRepository, AnchorService} from "@/modules/anchor";
import {TimelineRepository, TimelineService} from "@/modules/timeline";
import {VisualizationRepository, VisualizationService} from "@/modules/visualization";

const container: Container = new Container();

container.bind(TaskRepository).toSelf();
container.bind(CardRepository).toSelf();
container.bind(AnchorRepository).toSelf();
container.bind(TimelineRepository).toSelf();
container.bind(VisualizationRepository).toSelf();
container.bind(TaskService).toSelf();
container.bind(CardService).toSelf();
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
    process.env.MIRO_BOARD!,
));

export {container}
