import React, { useState } from 'react';
import "./DataPage.css"

interface ButtonProps {
  label: string;
  value: boolean;
  updateValue: (option: string) => void;
}

const ToggleButton: React.FC<ButtonProps> = ({ label, value, updateValue }) => {
  const [isOn, setIsOn] = useState(value);

  const toggleButton = () => {
    setIsOn(!isOn);
    updateValue(label)
  };

  return (
    <div className={`toggle-button ${isOn ? 'on' : 'off'}`} onClick={toggleButton}>
      <div className="slider">
        <div className={`slider-ball ${isOn ? 'on' : 'off'}`} />
      </div>
      <span className="label">{label}</span>
    </div>
  );
};


interface DataPageProps {
  updateValue: (option: string) => void;
  options: Record<string, boolean>
}

const DataPage: React.FC<DataPageProps> = ({ options, updateValue }) => {
  return (
    <div>
      {Object.entries(options).map(([key, value]) => (
        <ToggleButton label={key} key={key} value={value} updateValue={updateValue}/>
      ))}
    </div>
  );
};

export default DataPage;