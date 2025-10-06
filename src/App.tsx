import './App.css'
import { useState } from "react";
import type { MediaItemProps } from "./types/MediaItem";
import ItemList from "./components/ItemList";
import { initialItems } from './List';
import AddItemForm from "./components/AddItemForm";


function App() {
  const [items, setItems] = useState<MediaItemProps[]>(initialItems);

  function handleDelete(id: string) {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  }

  function handleAdd(newItem: MediaItemProps) {
    setItems(prevItems => [...prevItems, newItem]);
  }

  return (
    <div className="App">
      <h1>Мои исследования:</h1>
      <AddItemForm onAdd={handleAdd} />
      <ItemList items={items} onDelete={handleDelete} />
    </div>
  )
}

export default App;
