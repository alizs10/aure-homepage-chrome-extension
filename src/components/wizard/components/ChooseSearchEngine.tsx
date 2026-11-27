import { SearchEnginePicker } from "@/components/common/SearchEnginePicker";
import type { SearchEngineId } from "@/types";

export function ChooseSearchEngine({
  value,
  onChange,
}: {
  value?: SearchEngineId | string;
  onChange: (engineId: SearchEngineId) => void;
}) {
  return (
    <div className="flex flex-col gap-y-6 w-full p-5 sm:p-7">
      <SearchEnginePicker selectedId={value} onSelect={onChange} />
    </div>
  );
}
