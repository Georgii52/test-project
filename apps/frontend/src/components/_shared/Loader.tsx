import { Empty, EmptyHeader, EmptyTitle, EmptyMedia } from "../ui/empty";
import { Spinner } from "../ui/spinner";

export default function Loader() {
  return (
    <Empty className="w-full h-full px-0">
      <EmptyHeader className="max-w-none w-full gap-0">
        <EmptyMedia variant="icon" className="rounded-lg">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Загружаем записи</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
