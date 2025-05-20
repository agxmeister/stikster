import { match } from 'ts-pattern';
import {Task} from "@/modules/task";

export type color =
    'gray' | 'light_yellow' | 'yellow' | 'orange' | 'light_green' | 'green' | 'dark_green' | 'cyan' | 'light_pink' |
    'pink' | 'violet' | 'red' | 'light_blue' | 'blue' | 'dark_blue' | 'black';

export const getColor = (task: Task): color => {
    return match(task)
        .with({type: 'Story'}, (): color => 'yellow')
        .with({type: 'Dev Sub-task'}, (): color => 'violet')
        .with({type: 'Dev MetaCloud Sub-task'}, (): color => 'violet')
        .with({type: 'QA Sub-task'}, (): color => 'light_pink')
        .with({type: 'Bug'}, (): color => 'red')
        .otherwise((): color => 'light_yellow');
}
