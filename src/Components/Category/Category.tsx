import React, { useState } from 'react';
import "./Category.scss";

interface CategoryProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (index: number) => void;
}

export const Category: React.FC<CategoryProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      onAddCategory(newCategory);
      setNewCategory(''); // Očisti input nakon dodavanja
    }
  };

  const handleSelectCategory = (index: number) => {
    setSelectedCategoryIndex(index);
  };

  const handleDeleteCategory = (index: number) => {
    onDeleteCategory(index);
    setSelectedCategoryIndex(null); // Resetiraj odabranu kategoriju nakon brisanja
  };

  return (
    <div className="category-container">
      <h3>Kategorije zadataka</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index} onClick={() => handleSelectCategory(index)} style={{ cursor: 'pointer' }}>
            {category}
            {selectedCategoryIndex === index && (
              <button onClick={() => handleDeleteCategory(index)} style={{ marginLeft: '10px' }}>
                Izbriši
              </button>
            )}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Dodaj novu kategoriju"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={handleAddCategory}>Dodaj kategoriju</button>
    </div>
  );
};