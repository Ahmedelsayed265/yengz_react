import { Form } from "react-bootstrap";

export default function SelectField({ options, disabledOption, ...props }) {
  return (
    <div className="input-field">
      {props.label && <label>{props.label}</label>}
      <Form.Select {...props}>
        <option selected value={""} disabled>
          {disabledOption}
        </option>
        {options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}
