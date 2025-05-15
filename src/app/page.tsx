import styles from './page.module.css';
import {container} from "@/container";
import {TaskRepository} from "@/modules/task/TaskRepository";

export default async function Home() {
    const repository = container.get(TaskRepository);
    await repository.getByKeys(["EXTWPTOOLK-13211"]);

    return (
        <div className={styles.page}>Hello, world!</div>
    );
}
