import type { MediaItemProps } from "../types/MediaItem";
import ItemCard from "./ItemCard";

type ItemListProps = {
  items: MediaItemProps[];
  onDelete: (id: string) => void;
};

export default function ItemList({ items, onDelete }: ItemListProps) {
  if (!items || items.length === 0) {
    return <p>Список пуст — добавь первый элемент!</p>;
  }

  return (
    <section aria-label="Список медиа">
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
         <ItemCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  );

}

