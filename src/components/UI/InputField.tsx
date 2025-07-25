import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  type = 'text',
  large = false,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    placeholder-gray-700 text-gray-400
    ${large ? 'min-h-[100px] resize-vertical' : ''}
  `;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      {large ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={inputClasses}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={inputClasses}
        />
      )}
    </div>
  );
};

export default InputField;
