import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "../ui/empty";

export default function EmptyState() {
  return (
    <Empty className="w-full h-full px-0">
      <EmptyHeader className="max-w-none w-full gap-1">
        <EmptyTitle>По заданному фильтру не найдено ни одной записи</EmptyTitle>
        <EmptyDescription>
          Если вы считаете, что это ошибка - обратитесь в отдел разработки
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
