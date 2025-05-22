import {Container} from "inversify";
import {Jira} from "@/jira/jira";
import {Miro} from "@/miro";
import {TaskRepository, TaskService} from "@/modules/task";
import {CardRepository, CardService} from "@/modules/card";
import {AnchorRepository} from "@/modules/anchor/AnchorRepository";
import {AnchorService} from "@/modules/anchor/AnchorService";

const container: Container = new Container();

container.bind(TaskRepository).toSelf();
container.bind(CardRepository).toSelf();
container.bind(AnchorRepository).toSelf();
container.bind(TaskService).toSelf();
container.bind(CardService).toSelf();
container.bind(AnchorService).toSelf();
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
