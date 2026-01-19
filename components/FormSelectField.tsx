import React from "react";
import { Form, Col } from "react-bootstrap";
import { Field, FieldProps } from "formik";

type IProps = {
    as?: typeof Col;
    md?: number;
    controlId?: string;
    label?: string;
    name: string;
    children: React.JSX.Element;
    handleChange?: (e: React.ChangeEvent<any>) => void
}

const FormSelectField = ({
    as,
    md,
    controlId,
    label,
    name,
    children,
    handleChange
}: IProps) => {
    return (
        <Field name={name}>
            {({ field, form }: FieldProps) => {
                const isInvalid = !!(form.touched[field.name] && form.errors[field.name]);
                const errorMessage = form.errors[field.name] as string | undefined;
                return (
                    <Form.Group as={as} md={md} controlId={controlId} className={`mb-3`}>
                        {label && <Form.Label>{label}</Form.Label>}
                        {handleChange &&
                            <Form.Select
                                {...field}
                                isInvalid={isInvalid}
                                onChange={handleChange}
                            >
                                {children}
                            </Form.Select>}
                        {!handleChange &&
                            <Form.Select
                                {...field}
                                isInvalid={isInvalid}
                            >
                                {children}
                            </Form.Select>}
                        <Form.Control.Feedback type="invalid">
                            {errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                );
            }}
        </Field >
    );
};

export default FormSelectField;