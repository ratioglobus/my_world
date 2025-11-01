import { useState } from "react";
import "../style/FilterProjectsByStatus.css";

type FilterProjectsByStatusProps = {
  selectedStatus: string;
  onStatusChange: (type: string) => void;
  status?: { label: string; value: string }[];
  className?: string;
};

export default function FilterProjectsByStatus({
  selectedStatus,
  onStatusChange,
  status,
  className,
}: FilterProjectsByStatusProps) {
  const availableStatus = status ?? [
    { label: "Запланировано", value: "Запланировано" },
    { label: "В процессе", value: "В процессе" },
    { label: "Завершено", value: "Завершено" },
    { label: "Приостановлено", value: "Приостановлено" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={`filter-container ${className ?? ""}`}>
      <div className="filter-wrapper">
        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          onClick={() => setOpen(!open)}
        >
          <option value="Все статусы">Все статусы</option>
          {availableStatus.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
