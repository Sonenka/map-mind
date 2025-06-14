import styles from './QuestionsTable.module.css';

export type Question = {
  id: string;
  type: string;
  question: string;
  options: string[];
  correct: string;
};

type Props = {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
};

export function QuestionsTable({ questions, onEdit, onDelete }: Props) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Тип</th>
          <th className={styles.th}>Вопрос</th>
          <th className={styles.th}>Варианты</th>
          <th className={styles.th}>Ответ</th>
          <th className={styles.th}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q: Question) => (
          <tr key={q.id}>
            <td className={styles.td}>{q.type}</td>
            <td className={styles.td}>{q.question}</td>
            <td className={`${styles.td} ${styles.options}`}> {/* <- белый текст */}
              {Array.isArray(q.options) ? q.options.join(', ') : String(q.options)}
            </td>
            <td className={styles.td}>{q.correct}</td>
            <td className={styles.td}>
              <button onClick={() => onEdit(q)} className={styles.editBtn}>
                Редактировать
              </button>
              <button onClick={() => onDelete(q.id)} className={styles.deleteBtn}>
                Удалить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

