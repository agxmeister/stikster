import {Container} from "inversify";
import {Jira} from "@/jira";
import {TaskRepository} from "@/modules/task/TaskRepository";

const container: Container = new Container();

container.bind(TaskRepository).toSelf();
container.bind(Jira).toDynamicValue(() => new Jira(
    process.env.JIRA_URL!,
    process.env.JIRA_USERNAME!,
    process.env.JIRA_PASSWORD!,
));

export {container}
