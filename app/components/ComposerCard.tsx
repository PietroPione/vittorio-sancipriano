import React from 'react';
import ImageCard from './ImageCard';

interface SubItem {
  immagine_o_testo?: 'img' | 'txt' | '';
  immagine?: {
    url?: string;
    alt?: string;
  } | false;
  testo?: string;
}

interface ComposerItem {
  immagine_1?: SubItem;
  immagine_2?: SubItem;
  immagine_3?: SubItem;
  [key: string]: any;
}

interface ComposerCardProps {
  item: ComposerItem;
}

const ComposerCard: React.FC<ComposerCardProps> = ({ item }) => {
  if (!item) {
    return null;
  }

  const renderSubItem = (subItem: SubItem | undefined, index: number) => {
    if (!subItem) {
      return null;
    }

    if (subItem.immagine_o_testo === 'img' && subItem.immagine && subItem.immagine.url) {
      return <ImageCard key={index} src={subItem.immagine.url} alt={subItem.immagine.alt || 'Project image'} />;
    }

    if (subItem.immagine_o_testo === 'txt' && subItem.testo) {
      return <div key={index} dangerouslySetInnerHTML={{ __html: subItem.testo }} />;
    }

    return null;
  };

  const subItems = [item.immagine_1, item.immagine_2, item.immagine_3].filter(
    (sub) => sub && sub.immagine_o_testo
  );

  if (subItems.length === 0) {
    return (
        <div className="border p-4 rounded mb-4">
            <pre className="bg-gray-800 p-2 rounded text-xs">{JSON.stringify(item, null, 2)}</pre>
        </div>
    );
  }

  return (
    <div className="border p-4 rounded mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      {subItems.map((subItem, index) => (
        <div key={index} className="flex-1">
            {renderSubItem(subItem, index)}
        </div>
      ))}
    </div>
  );
};

export default ComposerCard;