import { FC } from 'react';

interface FieldConfig {
  key: string;
  label: string;
  variant?: string;
}

interface AnalyticsCardProps {
  title: string;
  items: any[];
  fields: FieldConfig[];
  type?: 'user' | 'post';
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({ title, items, fields, type = 'post' }) => (
  <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
    <h2 className="text-3xl font-bold mb-6 text-blue-600 flex items-center gap-2">
      {type === 'user' ? '👥 ' : '📌 '}
      {title}
    </h2>
    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {items.map((item) => (
        <li 
          key={item.id} 
          className={`p-6 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] ${
            type === 'user' 
              ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
              : 'bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200'
          }`}
        >
          {fields.map((field) => (
            <p 
              key={field.key} 
              className={`text-lg ${
                field.variant === 'h6' 
                  ? 'font-semibold text-gray-800' 
                  : 'text-gray-600'
              }`}
            >
              <span className="font-bold text-gray-700">
                {field.label}:{' '}
              </span>
              {item[field.key]}
            </p>
          ))}
          {type === 'post' && (
            <div className="mt-3 flex gap-2 text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                ✨ {item.commentCount} comments
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                📌 {item.likes || 0} likes
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default AnalyticsCard;