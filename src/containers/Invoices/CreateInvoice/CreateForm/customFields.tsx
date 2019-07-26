import React from 'react';
import TextField from '@material-ui/core/TextField';

export const customSelect = ({
                               input,
                               className,
                               iterableObj,
                               meta: { touched, error }
                             }: any) => {
  return (
    <>
      <select {...input} className={className}>
        {iterableObj.map((item: any) => {
          return (
            <option
              key={item.id}
              value={item.id}>{item.name}</option>
          );
        })}
      </select>
      {touched &&
      ((error && <span>{error}</span>))}
    </>
  );
};

export const customInputNumber = ({
                                    input,
                                    label,
                                    type,
                                    className,
                                    min,
                                    max,
                                    meta: { touched, error }
                                  }: any) => {
  return (<div>
    <label>{label}</label>
    <div>
      <TextField {...input} placeholder={label} type={type} className={className} min={min} max={max}/>
      <br/>
      {touched &&
      ((error && <span>{error}</span>))}
    </div>
  </div>);
};