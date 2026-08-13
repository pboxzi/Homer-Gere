import React from 'react';
import { motion } from 'motion/react';
import { GALLERY_CATEGORIES, GalleryCategory } from '../../data/gallery';

interface GalleryCategoriesProps {
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
}

export const GalleryCategories: React.FC<GalleryCategoriesProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {GALLERY_CATEGORIES.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
            activeCategory === category
              ? 'bg-[#111827] text-white shadow-lg shadow-[#111827]/15'
              : 'bg-[#F3F1ED] text-[#52525B] hover:bg-[#E8E5DF] hover:text-[#111827]'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};
