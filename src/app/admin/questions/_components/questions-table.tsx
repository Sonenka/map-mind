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
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Тип</th>
          <th className="border px-2 py-1">Вопрос</th>
          <th className="border px-2 py-1">Варианты</th>
          <th className="border px-2 py-1">Ответ</th>
          <th className="border px-2 py-1">Действия</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q: Question) => (
          <tr key={q.id}>
            <td className="border px-2 py-1">{q.type}</td>
            <td className="border px-2 py-1">{q.question}</td>
            <td className="border px-2 py-1">
              {Array.isArray(q.options) ? q.options.join(', ') : String(q.options)}
            </td>
            <td className="border px-2 py-1">{q.correct}</td>
            <td className="border px-2 py-1 space-x-2">
              <button onClick={() => onEdit(q)} className="text-blue-600 underline">
                Редактировать
              </button>
              <button onClick={() => onDelete(q.id)} className="text-red-600 underline">
                Удалить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

