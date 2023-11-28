import React, { useState } from 'react';
import './styles/custom-lead.css';
import AdminLayout from '../Components/AdminLayout.jsx';





const CustomLeadForm = () => {
  const [formFields, setFormFields] = useState([]);

  const addField = (fieldType) => {
    const newField = { type: fieldType, label: '', required: false, value: '', options: [] };
    setFormFields([...formFields, newField]);
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const handleFieldChange = (index, property, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][property] = value;
    setFormFields(updatedFields);
  };


  const handleOptionChange = (index, optionIndex, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].options[optionIndex].selected = value;
    setFormFields(updatedFields);
  };

  const addOption = (index) => {
    const updatedFields = [...formFields];
    updatedFields[index].options.push({ label: '', selected: false });
    setFormFields(updatedFields);
  };


  const renderFormFields = () => {
    return formFields.map((field, index) => (
      <div key={index}>
        <label>Field Type: {field.type}</label>
        <input
          type="text"
          placeholder="Label"
          value={field.label}
          onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
        />
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
        />
        {field.type === 'date' && (
          <input
            type="date"
            value={field.value}
            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
          />
        )}
        {field.type === 'select-multiple' && (
          <div>
            {field.options.map((option, optionIndex) => (
              <label key={optionIndex}>
                <input
                  type="checkbox"
                  checked={option.selected}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.checked)}
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
        <button onClick={() => removeField(index)}>Remove</button>
      </div>
    ));
  };
  



  return (
    <div>
      <div>
        <button onClick={() => addField('text')}>Add Text Field</button>
        <button onClick={() => addField('number')}>Add Number Field</button>
        <button onClick={() => addField('textarea')}>Add Multi Line Text Field</button>
        <button onClick={() => addField('date')}>Add Date Field</button>
        <button onClick={() => addField('time')}>Add Time Field</button>
        <button onClick={() => addField('select-one')}>Add Select One Option Field</button>
        <button onClick={() => addField('select-multiple')}>Add Select Multiple Options Field</button>
        <button onClick={() => addField('dropdown')}>Add Dropdown (Select One) Field</button>
        <button onClick={() => addField('file')}>Add Attach File Field</button>
        {/* Add more buttons for other field types */}
      </div>
      <form>
        {formFields.map((field, index) => (
          <div key={index}>
            <label>Field Type: {field.type}</label>
            <input
              type="text"
              placeholder="Label"
              value={field.label}
              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
            />
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
            />
            <button onClick={() => removeField(index)}>Remove</button>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};












export default function () {
    return (
      <AdminLayout>
        <CustomLeadForm />
      </AdminLayout>
    );
  };
